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
      } catch (err) {}
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

    // Kiểm tra highlight như đã nói trước đó...

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

function restoreHighlightsFromOffsetsPreserveHTML(
  html: string,
  highlights: HighlightItem[],
): string {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  const textNodes: { node: Text; start: number; end: number }[] = []
  let offset = 0
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, null)
  let currentNode: Text | null
  while ((currentNode = walker.nextNode() as Text | null)) {
    const length = currentNode.nodeValue?.length || 0
    textNodes.push({ node: currentNode, start: offset, end: offset + length })
    offset += length
  }

  const sortedHighlights = [...highlights].sort(
    (a, b) => b.startOffset - a.startOffset,
  )

  for (const hl of sortedHighlights) {
    const { startOffset, endOffset, id } = hl
    const mark = document.createElement('mark')
    mark.setAttribute('data-id', id)
    mark.style.backgroundColor = 'yellow'

    let startNodeIndex = -1
    let endNodeIndex = -1
    for (let i = 0; i < textNodes.length; i++) {
      const { start, end } = textNodes[i]
      if (start <= startOffset && startOffset < end) startNodeIndex = i
      if (start < endOffset && endOffset <= end) endNodeIndex = i
    }
    if (startNodeIndex === -1 || endNodeIndex === -1) continue

    const startNode = textNodes[startNodeIndex]
    const endNode = textNodes[endNodeIndex]

    const startText = startNode.node
    const endText = endNode.node

    const startPosInNode = startOffset - startNode.start
    const endPosInNode = endOffset - endNode.start

    if (startNode === endNode) {
      const originalText = startText.nodeValue!
      const before = originalText.slice(0, startPosInNode)
      const selected = originalText.slice(startPosInNode, endPosInNode)
      const after = originalText.slice(endPosInNode)

      const newNode = document.createTextNode(after)
      const markedNode = mark.cloneNode() as HTMLElement
      markedNode.textContent = selected

      const parent = startText.parentNode!
      if (!parent) continue
      parent.insertBefore(document.createTextNode(before), startText)
      parent.insertBefore(markedNode, startText)
      parent.insertBefore(newNode, startText)
      parent.removeChild(startText)
    } else {
      const startOriginal = startText.nodeValue!
      const startBefore = startOriginal.slice(0, startPosInNode)
      const startSelected = startOriginal.slice(startPosInNode)

      const endOriginal = endText.nodeValue!
      const endSelected = endOriginal.slice(0, endPosInNode)
      const endAfter = endOriginal.slice(endPosInNode)

      const startParent = startText.parentNode!
      const endParent = endText.parentNode!
      if (!startParent || !endParent) continue

      const newStartNode = document.createTextNode(startBefore)
      const newEndNode = document.createTextNode(endAfter)

      const markedNode = mark.cloneNode() as HTMLElement
      markedNode.textContent =
        startSelected +
        getTextBetween(textNodes, startNodeIndex + 1, endNodeIndex - 1) +
        endSelected

      startParent.insertBefore(newStartNode, startText)
      startParent.removeChild(startText)

      endParent.insertBefore(newEndNode, endText)
      endParent.removeChild(endText)

      endParent.insertBefore(markedNode, newEndNode)
    }
  }

  return wrapper.innerHTML
}

function getTextBetween(
  nodes: { node: Text; start: number; end: number }[],
  from: number,
  to: number,
): string {
  let text = ''
  for (let i = from; i <= to; i++) {
    text += nodes[i]?.node.nodeValue || ''
  }
  return text
}
