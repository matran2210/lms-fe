import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Popover } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PointerIcon } from '@assets/icons'

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
}

export const HighlightableHTML: React.FC<Props> = ({
  initialHTML,
  storageKey,
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
  const HIGHLIGHT_KEY = 'highlight_items'

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

  useEffect(() => {
    const raw = localStorage.getItem(HIGHLIGHT_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const restoredHTML = restoreHighlightsFromOffsetsPreserveHTML(
          parsed.htmlContent || initialHTML,
          parsed.highlights || [],
        )
        setHtml(restoredHTML)
        setHighlights(parsed.highlights)
      } catch (err) {
        // console.error('Error loading highlights:', err)
      }
    }
  }, [initialHTML])

  useEffect(() => {
    localStorage.setItem(
      HIGHLIGHT_KEY,
      JSON.stringify({ htmlContent: initialHTML, highlights }),
    )
  }, [highlights, initialHTML])

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

  const handleHighlightClick = (e: React.MouseEvent) => {
    const mark = (e.target as HTMLElement).closest('mark[data-id]')
    if (!mark) return
    const rect = mark.getBoundingClientRect()
    setSelectedHighlightId(mark.getAttribute('data-id'))
    setHighlightRect(rect)
  }

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

  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ position: 'relative' }}
      onClick={handleHighlightClick}
    >
      {selection && selectionRect && !showNoteEditor && (
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
          open
          trigger="hover"
          placement="top"
          overlayStyle={{
            position: 'absolute',
            top: selectionRect.top + window.scrollY + 25,
            left: selectionRect.left + window.scrollX - 25,
            zIndex: 9999,
          }}
        >
          <span />
        </Popover>
      )}

      {showNoteEditor && selectionRect && (
        <Popover
          content={
            <TextArea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onPressEnter={handleConfirmHighlight}
              placeholder="Nhập ghi chú"
              autoSize
              autoFocus
            />
          }
          open
          placement="top"
        >
          <div
            style={{
              position: 'absolute',
              top: selectionRect.top + window.scrollY - 80,
              left: selectionRect.left + window.scrollX - 25,
              zIndex: 9999,
            }}
          />
        </Popover>
      )}

      {selectedHighlightId && highlightRect && (
        <Popover
          classNames={{
            root: 'highlight-popover',
          }}
          content={
            <Button
              onClick={handleRemoveHighlight}
              type="text"
              className="!px-2 py-1 text-white hover:!text-white"
              icon={<PointerIcon />}
            >
              Unhighlight this
            </Button>
          }
          overlayStyle={{
            position: 'absolute',
            top: highlightRect.top + window.scrollY + 25,
            left: highlightRect.left + window.scrollX - 25,
            zIndex: 9999,
          }}
          open
          trigger="click"
          placement="top"
        >
          <span />
        </Popover>
      )}

      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ padding: 16, background: '#fff', border: '1px solid #ccc' }}
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

// Cải tiến function này để xử lý multiple highlights trong cùng câu
function restoreHighlightsFromOffsetsPreserveHTML(
  html: string,
  highlights: HighlightItem[],
): string {
  if (!highlights || highlights.length === 0) return html

  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  // Tạo một mảng chứa tất cả các điểm cần split text (start và end của mỗi highlight)
  const splitPoints: Array<{
    offset: number
    type: 'start' | 'end'
    highlightId: string
  }> = []

  highlights.forEach((hl) => {
    splitPoints.push({
      offset: hl.startOffset,
      type: 'start',
      highlightId: hl.id,
    })
    splitPoints.push({ offset: hl.endOffset, type: 'end', highlightId: hl.id })
  })

  // Sort theo offset để xử lý từ đầu đến cuối
  splitPoints.sort((a, b) => a.offset - b.offset)

  // Tạo map từ highlightId đến highlight object
  const highlightMap = new Map<string, HighlightItem>()
  highlights.forEach((hl) => highlightMap.set(hl.id, hl))

  // Collect tất cả text nodes với positions
  const textNodes: { node: Text; start: number; end: number }[] = []
  let offset = 0
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, null)
  let currentNode: Text | null

  while ((currentNode = walker.nextNode() as Text | null)) {
    const length = currentNode.nodeValue?.length || 0
    textNodes.push({ node: currentNode, start: offset, end: offset + length })
    offset += length
  }

  // Xử lý từng text node
  textNodes.forEach(({ node, start, end }) => {
    const relevantSplitPoints = splitPoints.filter(
      (sp) => sp.offset >= start && sp.offset <= end,
    )

    if (relevantSplitPoints.length === 0) return

    const parent = node.parentNode
    if (!parent) return

    const originalText = node.nodeValue || ''
    const fragments: Array<{ text: string; highlightIds: Set<string> }> = []

    let currentPos = 0
    let activeHighlights = new Set<string>()

    // Xử lý từng split point
    relevantSplitPoints.forEach((sp) => {
      const localOffset = sp.offset - start

      // Thêm text từ currentPos đến split point
      if (localOffset > currentPos) {
        fragments.push({
          text: originalText.slice(currentPos, localOffset),
          highlightIds: new Set(activeHighlights),
        })
      }

      // Cập nhật active highlights
      if (sp.type === 'start') {
        activeHighlights.add(sp.highlightId)
      } else {
        activeHighlights.delete(sp.highlightId)
      }

      currentPos = localOffset
    })

    // Thêm phần text còn lại
    if (currentPos < originalText.length) {
      fragments.push({
        text: originalText.slice(currentPos),
        highlightIds: new Set(activeHighlights),
      })
    }

    // Tạo các DOM nodes từ fragments
    const newNodes: Node[] = []
    fragments.forEach((fragment) => {
      if (fragment.text.length === 0) return

      if (fragment.highlightIds.size === 0) {
        // Plain text
        newNodes.push(document.createTextNode(fragment.text))
      } else {
        // Highlighted text - có thể có nested highlights
        let container: HTMLElement | Text = document.createTextNode(
          fragment.text,
        )

        // Wrap với mark elements cho mỗi highlight (từ ngoài vào trong)
        const sortedHighlightIds = Array.from(fragment.highlightIds).sort()
        sortedHighlightIds.forEach((hlId) => {
          const mark = document.createElement('mark')
          mark.setAttribute('data-id', hlId)
          mark.style.backgroundColor = 'yellow'
          mark.appendChild(container)
          container = mark
        })

        newNodes.push(container)
      }
    })

    // Replace original node với new nodes
    newNodes.forEach((newNode) => {
      parent.insertBefore(newNode, node)
    })
    parent.removeChild(node)
  })

  return wrapper.innerHTML
}
