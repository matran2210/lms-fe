import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Input, List, Modal, Popover } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PointerIcon, ShowCommentIcon } from '@assets/icons'
import clsx from 'clsx'

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
  isSaveLocalStorage?: boolean
  className?: string
}

export const HighlightableHTML: React.FC<Props> = ({
  initialHTML,
  storageKey,
  isShowNote = false,
  isSaveLocalStorage = false,
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
  // Giữ rect position tối ưu cho tooltip
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  // Memoize initialHTML để tránh infinite loop
  const memoizedInitialHTML = useRef<string>(initialHTML)
  const isInitialized = useRef<boolean>(false)

  // Debounce setSelectionRect để tránh scroll nháy
  const updateSelectionRect = (rect: DOMRect | null) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    setDebounceTimeout(
      setTimeout(() => {
        setSelectionRect(rect)
        if (rect) {
          // Đẩy tooltip lên trên selection một chút
          setTooltipPosition({
            top: rect.top - 40,
            left: rect.left + rect.width / 2,
          })
        } else {
          setTooltipPosition(null)
        }
      }, DEBOUNCE_DELAY),
    )
  }

  // Load highlights from localStorage only once when component mounts
  useEffect(() => {
    if (!isSaveLocalStorage) return
    // Prevent loading if we're already in a loading state
    if (isInitialized.current) return

    memoizedInitialHTML.current = initialHTML
    isInitialized.current = true

    const raw = localStorage.getItem(storageKey)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const restoredHTML = restoreHighlightsFromOffsetsPreserveHTML(
          parsed.htmlContent || initialHTML,
          parsed.highlights || [],
        )
        setHtml(restoredHTML)
        setHighlights(parsed.highlights || [])
      } catch (err) {
        // console.error('Error loading highlights:', err)
      }
    }
  }, [storageKey])

  // Save highlights to localStorage only when highlights change
  useEffect(() => {
    if (!isSaveLocalStorage) return
    if (!isInitialized.current) return

    localStorage.setItem(
      storageKey,
      JSON.stringify({ htmlContent: memoizedInitialHTML.current, highlights }),
    )
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

    // So sánh rect mới với rect cũ để tránh set lại nhiều lần khi rect không thay đổi
    if (
      lastRect &&
      Math.abs(rect.top - lastRect.top) < 1 &&
      Math.abs(rect.left - lastRect.left) < 1 &&
      Math.abs(rect.width - lastRect.width) < 1 &&
      Math.abs(rect.height - lastRect.height) < 1
    ) {
      // Rect không thay đổi đáng kể, không set state nữa
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

  const handleConfirmHighlight = () => {
    if (!selection) return

    const newHighlight: HighlightItem = {
      id: Date.now().toString(),
      text: selection.text,
      note: noteInput,
      startOffset: selection.startOffset,
      endOffset: selection.endOffset,
    }

    const updatedHighlights = [...highlights, newHighlight]
    const newHTML = restoreHighlightsFromOffsetsPreserveHTML(
      initialHTML,
      updatedHighlights,
    )

    setHighlights(updatedHighlights)
    setHtml(newHTML)
    setSelection(null)
    setSelectionRect(null)
    setNoteInput('')
    setShowNoteEditor(false)
  }

  // Thêm useEffect để handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      // Nếu không có highlight được select thì không cần xử lý
      if (!selectedHighlightId) return

      // Kiểm tra xem click có nằm trong popover không
      const popoverElement = document.querySelector(
        '.ant-popover.highlight-popover',
      )
      if (popoverElement && popoverElement.contains(target)) return

      // Kiểm tra xem click có nằm trong highlight element không
      const highlightElement = target.closest('mark[data-id]')
      if (
        highlightElement &&
        highlightElement.getAttribute('data-id') === selectedHighlightId
      )
        return

      // Đóng popover
      setSelectedHighlightId(null)
      setHighlightRect(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedHighlightId])

  // Cập nhật handleHighlightClick
  const handleHighlightClick = (e: React.MouseEvent) => {
    const mark = (e.target as HTMLElement).closest('mark[data-id]')
    if (!mark) {
      // Click không phải là highlight, đóng popover
      setSelectedHighlightId(null)
      setHighlightRect(null)
      return
    }

    const rect = mark.getBoundingClientRect()
    const id = mark.getAttribute('data-id')

    if (!id) return

    setSelectedHighlightId(id)
    setHighlightRect(rect)
  }
  // const handleHighlightClick = (e: React.MouseEvent) => {
  //   const mark = (e.target as HTMLElement).closest('mark[data-id]')
  //   if (!mark) return
  //   const rect = mark.getBoundingClientRect()
  //   setSelectedHighlightId(mark.getAttribute('data-id'))
  //   setHighlightRect(rect)
  // }

  const handleRemoveHighlight = () => {
    if (!selectedHighlightId) return
    const updatedHighlights = highlights.filter(
      (hl) => hl.id !== selectedHighlightId,
    )
    const newHTML = restoreHighlightsFromOffsetsPreserveHTML(
      initialHTML,
      updatedHighlights,
    )
    setHighlights(updatedHighlights)
    setHtml(newHTML)
    setSelectedHighlightId(null)
    setHighlightRect(null)
  }
  // Scroll tới highlight trong danh sách
  // Replace the empty scrollToHighlight function with this implementation:

  // Replace the empty scrollToHighlight function with this implementation:

  const scrollToHighlight = (id: string) => {
    const container = containerRef.current
    if (!container) return

    // Find the highlight element by data-id
    const highlightElement = container.querySelector(
      `mark[data-id="${id}"]`,
    ) as HTMLElement
    if (!highlightElement) return

    // Get the position of the highlight element
    const elementRect = highlightElement.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // Calculate scroll position
    // We want to center the highlight in the viewport with some offset
    const offset = 100 // pixels from top of viewport
    const targetScrollTop = window.scrollY + elementRect.top - offset

    // Smooth scroll to the highlight
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    })

    // Optional: Add a temporary visual effect to make the highlight more noticeable
    highlightElement.style.transition = 'all 0.3s ease'
    highlightElement.style.boxShadow = '0 0 10px #60A5FA'
    highlightElement.style.transform = 'scale(1.02)'

    // Remove the effect after animation
    setTimeout(() => {
      highlightElement.style.boxShadow = ''
      highlightElement.style.transform = ''
    }, 1500)

    // Close the drawer after scrolling (optional)
    setOpen(false)
  }
  // Lưu note
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
  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ position: 'relative' }}
      onClick={handleHighlightClick}
    >
      {selection && selectionRect && (
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
          destroyOnHidden
          overlayStyle={{
            position: 'absolute',
            top: selectionRect.top + window.scrollY + 20,
            left:
              selectionRect.left +
              window.scrollX +
              selectionRect.width / 2 -
              60,
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
          destroyOnHidden
          overlayStyle={{
            position: 'absolute',
            top: highlightRect.top + window.scrollY + 20,
            left:
              highlightRect.left +
              window.scrollX +
              highlightRect.width / 2 -
              80,
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

// Trả về HTML mới với các đoạn text từ startOffset đến endOffset được bọc bởi <mark> chứa data-id.
// Giữ nguyên cấu trúc HTML (thẻ <p>, <img>, <div>,...).
// Hỗ trợ nested highlight nếu các vùng bôi trùng nhau.
function restoreHighlightsFromOffsetsPreserveHTML(
  html: string, // đoạn nội dung HTML gốc
  highlights: HighlightItem[],
): string {
  if (!highlights || highlights.length === 0) return html

  // Dùng div để làm vùng DOM ảo giúp xử lý DOM mà không ảnh hưởng đến nội dung gốc.
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  // Collect tất cả text nodes với global positions
  const textNodeInfos: {
    node: Text
    globalStart: number
    globalEnd: number
  }[] = []
  let globalOffset = 0
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, null)
  let currentNode: Text | null

  while ((currentNode = walker.nextNode() as Text | null)) {
    const length = currentNode.nodeValue?.length || 0
    textNodeInfos.push({
      node: currentNode,
      globalStart: globalOffset,
      globalEnd: globalOffset + length,
    })
    globalOffset += length
  }

  // Sort highlights theo thứ tự startOffset → Đảm bảo xử lý highlight theo thứ tự xuất hiện.
  const sortedHighlights = [...highlights].sort(
    (a, b) => a.startOffset - b.startOffset,
  )

  // Xử lý từng highlight
  sortedHighlights.forEach((highlight) => {
    const { startOffset, endOffset, id } = highlight

    // Tìm tất cả text nodes mà highlight này overlap
    const affectedTextNodes = textNodeInfos.filter(
      (info) =>
        !(endOffset <= info.globalStart || startOffset >= info.globalEnd),
    )

    if (affectedTextNodes.length === 0) return

    // Xử lý từng text node bị ảnh hưởng
    affectedTextNodes.forEach((info) => {
      const { node, globalStart, globalEnd } = info
      const nodeText = node.nodeValue || ''

      // Tính toán phần nào của text node này cần được highlight
      const highlightStart = Math.max(0, startOffset - globalStart)
      const highlightEnd = Math.min(nodeText.length, endOffset - globalStart)

      // Nếu highlight không cover bất kỳ phần nào của node này
      if (
        highlightStart >= highlightEnd ||
        highlightStart >= nodeText.length ||
        highlightEnd <= 0
      ) {
        return
      }

      const parent = node.parentNode
      if (!parent) return

      // Kiểm tra xem node này đã được wrap bởi mark element chưa
      const existingMark =
        node.parentElement?.tagName === 'MARK' ? node.parentElement : null

      if (existingMark && existingMark.getAttribute('data-id')) {
        // Node đã được highlight, cần xử lý nested highlighting
        // Tạo nested mark
        const nestedMark = document.createElement('mark')
        nestedMark.setAttribute('data-id', id)
        nestedMark.style.backgroundColor = '#FFE399'
        nestedMark.style.outline = '1px solid #FFA500'

        // Extract phần text cần highlight
        const beforeText = nodeText.slice(0, highlightStart)
        const highlightText = nodeText.slice(highlightStart, highlightEnd)
        const afterText = nodeText.slice(highlightEnd)

        // Clear node content
        node.nodeValue = ''

        if (beforeText) {
          existingMark.appendChild(document.createTextNode(beforeText))
        }

        nestedMark.appendChild(document.createTextNode(highlightText))
        existingMark.appendChild(nestedMark)

        if (afterText) {
          existingMark.appendChild(document.createTextNode(afterText))
        }
      } else {
        // Normal highlighting
        const beforeText = nodeText.slice(0, highlightStart)
        const highlightText = nodeText.slice(highlightStart, highlightEnd)
        const afterText = nodeText.slice(highlightEnd)

        // Create fragments
        const fragments: Node[] = []

        if (beforeText) {
          fragments.push(document.createTextNode(beforeText))
        }

        if (highlightText) {
          const mark = document.createElement('mark')
          mark.setAttribute('data-id', id)
          mark.style.backgroundColor = '#FFE399'
          mark.appendChild(document.createTextNode(highlightText))
          fragments.push(mark)
        }

        if (afterText) {
          fragments.push(document.createTextNode(afterText))
        }

        // Replace original node
        fragments.forEach((fragment) => {
          parent.insertBefore(fragment, node)
        })
        parent.removeChild(node)

        // Update textNodeInfos for remaining processing
        if (afterText) {
          const newTextNode = fragments[fragments.length - 1] as Text
          const originalInfo = textNodeInfos.find((info) => info.node === node)
          if (originalInfo) {
            const newGlobalStart =
              originalInfo.globalStart + highlightStart + highlightText.length
            textNodeInfos.push({
              node: newTextNode,
              globalStart: newGlobalStart,
              globalEnd: originalInfo.globalEnd,
            })
          }
        }
      }
    })

    // Refresh textNodeInfos sau mỗi highlight để có thông tin chính xác cho highlight tiếp theo
    textNodeInfos.length = 0
    globalOffset = 0
    const newWalker = document.createTreeWalker(
      wrapper,
      NodeFilter.SHOW_TEXT,
      null,
    )
    let newCurrentNode: Text | null

    while ((newCurrentNode = newWalker.nextNode() as Text | null)) {
      const length = newCurrentNode.nodeValue?.length || 0
      textNodeInfos.push({
        node: newCurrentNode,
        globalStart: globalOffset,
        globalEnd: globalOffset + length,
      })
      globalOffset += length
    }
  })

  return wrapper.innerHTML
}
