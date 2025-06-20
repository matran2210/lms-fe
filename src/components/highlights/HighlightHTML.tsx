import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Input, List, Modal, Popover } from 'antd'
import { PointerIcon, ShowCommentIcon } from '@assets/icons'
import clsx from 'clsx'
import { doHighlight, optionsImpl } from '@funktechno/texthighlighter/lib'

const { TextArea } = Input
const DEBOUNCE_DELAY = 100

export interface HighlightItem {
  id: string
  text: string
  note: string
  startOffset: number
  endOffset: number
}

interface Props {
  initialHTML: string
  storageKey: string
  isShowNote?: boolean
  className?: string
}

export const HighlightableHTML: React.FC<Props> = ({
  initialHTML,
  storageKey,
  isShowNote = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState<string>(initialHTML)
  const [highlights, setHighlights] = useState<HighlightItem[]>([])
  const [selection, setSelection] = useState<{
    text: string
    startOffset: number
    endOffset: number
  } | null>(null)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [open, setOpen] = useState(false)

  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)
  const [noteInput, setNoteInput] = useState<string>('')
  const [showNoteEditor, setShowNoteEditor] = useState<boolean>(false)
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(
    null,
  )
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const [lastRect, setLastRect] = useState<DOMRect | null>(null)

  // Debounce setSelectionRect để tránh scroll nháy
  const updateSelectionRect = (rect: DOMRect | null) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    setDebounceTimeout(
      setTimeout(() => {
        setSelectionRect(rect)
      }, DEBOUNCE_DELAY),
    )
  }

  // Load highlights from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setHtml(parsed.htmlContent || initialHTML)
        setHighlights(parsed.highlights || [])
      } catch (err) {
        // console.error('Error loading highlights:', err)
      }
    } else {
      setHtml(initialHTML)
    }
  }, [initialHTML, storageKey])

  // Save highlights to sessionStorage
  useEffect(() => {
    if (containerRef.current) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          htmlContent: containerRef.current.innerHTML,
          highlights,
        }),
      )
    }
  }, [highlights, storageKey])

  const handleMouseUp = () => {
    const selectionObj = window.getSelection()
    if (!selectionObj || selectionObj.isCollapsed) {
      if (selection) setSelection(null)
      if (selectionRect) setSelectionRect(null)
      return
    }

    const range = selectionObj.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    const container = containerRef.current
    if (!container || !container.contains(selectionObj.anchorNode)) return

    // So sánh rect mới với rect cũ
    if (
      lastRect &&
      Math.abs(rect.top - lastRect.top) < 1 &&
      Math.abs(rect.left - lastRect.left) < 1 &&
      Math.abs(rect.width - lastRect.width) < 1 &&
      Math.abs(rect.height - lastRect.height) < 1
    ) {
      return
    }

    setLastRect(rect)
    setSelectionRect(rect)

    const startOffset = getGlobalOffset(
      container,
      range.startContainer,
      range.startOffset,
    )
    const endOffset = getGlobalOffset(
      container,
      range.endContainer,
      range.endOffset,
    )

    setSelection({
      text: selectionObj.toString(),
      startOffset,
      endOffset,
    })

    setNoteInput('')
    setShowNoteEditor(false)
    updateSelectionRect(rect)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      if (!selectedHighlightId) return

      const popoverElement = document.querySelector(
        '.ant-popover.highlight-popover',
      )
      if (popoverElement && popoverElement.contains(target)) return

      const highlightElement = target.closest('mark[data-id]')
      if (
        highlightElement &&
        highlightElement.getAttribute('data-id') === selectedHighlightId
      )
        return

      setSelectedHighlightId(null)
      setHighlightRect(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedHighlightId])
  // Handle click outside for text selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      if (!selection) return

      // Check if clicked inside the highlight popover
      const popoverElement = document.querySelector(
        '.ant-popover.highlight-popover',
      )
      if (popoverElement && popoverElement.contains(target)) return

      // Check if clicked inside the container
      const container = containerRef.current
      if (container && container.contains(target)) {
        // If clicking inside container, let the normal mouseUp handler deal with it
        return
      }

      // Clicked outside container, clear selection
      setSelection(null)
      setSelectionRect(null)

      // Clear browser selection as well
      const browserSelection = window.getSelection()
      if (browserSelection) {
        browserSelection.removeAllRanges()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selection])

  // Handle highlight click - Updated to work with both custom and package highlights
  // Updated handleHighlightClick to work with span.highlighted elements instead of mark elements
  const handleHighlightClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    // Look for span elements with class 'highlighted' instead of mark elements
    let highlightSpan = null

    // Method 1: Check if clicked element is the highlight span
    if (target.classList.contains('highlighted')) {
      highlightSpan = target
    }

    // Method 2: Look for highlighted span in parent chain
    if (!highlightSpan) {
      highlightSpan = target.closest('span.highlighted')
    }

    if (!highlightSpan) {
      setSelectedHighlightId(null)
      setHighlightRect(null)
      return
    }

    // Prevent event from bubbling
    e.stopPropagation()

    const rect = highlightSpan.getBoundingClientRect()

    // Use timestamp as ID or create new one
    let id =
      highlightSpan.getAttribute('data-timestamp') ||
      highlightSpan.getAttribute('data-id')

    if (!id) {
      id = `highlight-${Date.now()}`
      highlightSpan.setAttribute('data-id', id)
    }

    setSelectedHighlightId(id)
    setHighlightRect(rect)
  }

  // Updated handleRemoveHighlight to work with span elements
  const handleRemoveHighlight = () => {
    if (!selectedHighlightId) return

    const container = containerRef.current
    if (!container) return

    // Look for span with matching data-id or data-timestamp
    let highlightElement =
      container.querySelector(
        `span.highlighted[data-id="${selectedHighlightId}"]`,
      ) ||
      container.querySelector(
        `span.highlighted[data-timestamp="${selectedHighlightId}"]`,
      )

    if (highlightElement) {
      const parent = highlightElement.parentNode
      if (parent) {
        const textContent = highlightElement.textContent || ''
        parent.replaceChild(
          document.createTextNode(textContent),
          highlightElement,
        )
        // Normalize text nodes
        parent.normalize()
      }
    }

    // Remove from state (match by ID or timestamp)
    const updatedHighlights = highlights.filter(
      (hl) =>
        hl.id !== selectedHighlightId &&
        hl.id !== selectedHighlightId.replace('highlight-', ''), // Handle ID variations
    )
    setHighlights(updatedHighlights)
    setSelectedHighlightId(null)
    setHighlightRect(null)
  }

  // Updated scrollToHighlight to work with span elements
  const scrollToHighlight = (id: string) => {
    const container = containerRef.current
    if (!container) return

    // Try multiple selectors to find the highlight
    let highlightElement = container.querySelector(
      `span.highlighted[data-id="${id}"]`,
    ) as HTMLElement

    if (!highlightElement) {
      highlightElement = container.querySelector(
        `span.highlighted[data-timestamp="${id}"]`,
      ) as HTMLElement
    }

    // If still not found, try to match by text content
    if (!highlightElement) {
      const highlight = highlights.find((h) => h.id === id)
      if (highlight) {
        const allHighlights = container.querySelectorAll('span.highlighted')
        highlightElement = Array.from(allHighlights).find(
          (el) => el.textContent?.trim() === highlight.text.trim(),
        ) as HTMLElement
      }
    }

    if (!highlightElement) return

    const elementRect = highlightElement.getBoundingClientRect()
    const offset = 100
    const targetScrollTop = window.scrollY + elementRect.top - offset

    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    })

    // Visual effect
    highlightElement.style.transition = 'all 0.3s ease'
    highlightElement.style.boxShadow = '0 0 10px #60A5FA'
    highlightElement.style.transform = 'scale(1.02)'

    setTimeout(() => {
      highlightElement.style.boxShadow = ''
      highlightElement.style.transform = ''
    }, 1500)

    setOpen(false)
  }

  // Updated handleConfirmHighlight to properly track the created highlights
  const handleConfirmHighlight = () => {
    if (!selection) return

    const domEle = containerRef.current
    if (!domEle) return

    // Use doHighlight from package
    const options: optionsImpl = {}
    const highlightMade = doHighlight(domEle, false, options)

    if (highlightMade) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Find the newly created highlight spans
        const newHighlightSpans = domEle.querySelectorAll(
          'span.highlighted:not([data-tracked])',
        )

        newHighlightSpans.forEach((span) => {
          // Mark as tracked to avoid duplicate processing
          span.setAttribute('data-tracked', 'true')

          // Get or create ID
          let id =
            span.getAttribute('data-timestamp') || span.getAttribute('data-id')

          if (!id) {
            id = `highlight-${Date.now()}`
            span.setAttribute('data-id', id)
          }

          // Create highlight item to track
          const newHighlight: HighlightItem = {
            id: id,
            text: span.textContent || selection.text,
            note: noteInput,
            startOffset: selection.startOffset,
            endOffset: selection.endOffset,
          }

          setHighlights((prev) => [...prev, newHighlight])
        })
      }, 10)
    }

    setSelection(null)
    setSelectionRect(null)
    setNoteInput('')
    setShowNoteEditor(false)
  }

  // Add CSS to make highlight spans clickable
  useEffect(() => {
    if (!containerRef.current) return

    const style = document.createElement('style')
    style.textContent = `
    span.highlighted {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    span.highlighted:hover {
      opacity: 0.8;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const saveNote = () => {
    if (!selectedHighlightId) return
    setHighlights((prev) =>
      prev.map((h) =>
        h.id === selectedHighlightId ? { ...h, note: noteInput } : h,
      ),
    )
    setHighlightRect(null)
    setSelectedHighlightId(null)
    setNoteInput('')
    setShowNoteEditor(false)
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const calcdimensions = (width: number) => {
    if (width > 900) {
      return width / 2 + 330
    }
    return width / 2 - 65
  }
  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ position: 'relative' }}
      onClick={handleHighlightClick}
    >
      {!selectedHighlightId && selection && selectionRect && (
        <Popover
          classNames={{
            root: 'highlight-popover',
          }}
          content={
            <Button
              onClick={handleConfirmHighlight}
              type="text"
              className="!px-2 py-1 text-white hover:!text-white"
              icon={<PointerIcon />}
            >
              Highlight this
            </Button>
          }
          open={true}
          trigger={[]}
          placement="bottom"
          overlayStyle={{
            position: 'absolute',
            top: selectionRect.top + window.scrollY + 28,
            left:
              selectionRect.left +
              window.scrollX +
              calcdimensions(selectionRect.width),
            zIndex: 9999,
          }}
        >
          <span />
        </Popover>
      )}

      {showNoteEditor && isShowNote && (
        <Modal
          open={showNoteEditor && isShowNote}
          onCancel={() => setShowNoteEditor(false)}
          footer={null}
        >
          <div>
            <TextArea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              rows={3}
              placeholder="Enter note"
              ref={(textarea) => {
                if (textarea && selectedHighlightId) {
                  setTimeout(() => textarea.focus(), 100)
                }
              }}
            />
            <Button
              size="small"
              onClick={saveNote}
              onMouseDown={(e) => e.stopPropagation()}
              type="primary"
            >
              Save Note
            </Button>
          </div>
        </Modal>
      )}

      {selectedHighlightId && highlightRect && (
        <Popover
          classNames={{
            root: 'highlight-popover',
          }}
          content={
            <>
              {isShowNote ? (
                <div
                  className="flex justify-end space-x-2"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Button
                    className="!px-2 py-1 text-white hover:!text-white"
                    onClick={() => setShowNoteEditor(true)}
                    onMouseDown={(e) => e.stopPropagation()}
                    type="text"
                  >
                    <ShowCommentIcon />
                  </Button>
                  <Button
                    onClick={handleRemoveHighlight}
                    type="text"
                    className="!m-0 !px-2 py-1 text-white hover:!text-white"
                    icon={<PointerIcon />}
                  >
                    Unhighlight this
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleRemoveHighlight}
                  type="text"
                  className="!px-2 py-1 text-white hover:!text-white"
                  icon={<PointerIcon />}
                >
                  Unhighlight this
                </Button>
              )}
            </>
          }
          overlayStyle={{
            position: 'absolute',
            top: highlightRect.top + window.scrollY + 28,
            left:
              highlightRect.left +
              window.scrollX +
              calcdimensions(highlightRect.width),
            zIndex: 9999,
          }}
          open={true}
          trigger={[]}
          placement="bottom"
        >
          <span />
        </Popover>
      )}

      <div
        className={clsx(
          'fixed bottom-5 right-4 flex h-14 w-10 items-center justify-center rounded-full bg-white shadow-learning-activity',
          {
            hidden: !isShowNote,
          },
        )}
      >
        <span onClick={showDrawer}>
          <ShowCommentIcon className="h-8 w-8" />
        </span>
      </div>

      <Drawer
        title="Highlights"
        onClose={onClose}
        open={open}
        classNames={{
          header: 'highlight-drawer-header',
        }}
      >
        <List
          className="px-6 py-4"
          dataSource={highlights}
          renderItem={(item) => (
            <List.Item
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => scrollToHighlight(item.id)}
            >
              <div>
                <div className="font-medium">{item.text}</div>
                {isShowNote && item.note && (
                  <div className="text-gray-500 text-xs">Note: {item.note}</div>
                )}
              </div>
            </List.Item>
          )}
        />
      </Drawer>

      <div
        id={storageKey}
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

function getGlobalOffset(
  root: HTMLElement,
  node: Node,
  offsetInNode: number,
): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  let offset = 0
  let current: Node | null
  while ((current = walker.nextNode())) {
    if (current === node) {
      return offset + offsetInNode
    }
    offset += current.textContent?.length || 0
  }
  return offset
}
