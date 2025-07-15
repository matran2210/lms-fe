import { useEffect, useRef, useState } from 'react'
import { Popover, Input, Button, List, Drawer } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { PointerIcon, ShowCommentIcon } from '@assets/icons'
import clsx from 'clsx'

interface HighlightItem {
  id: string
  text: string
  note: string
  start: number
  end: number
}

interface Props {
  text: string
  isShowNote?: boolean
}

export default function HighlightText({ text, isShowNote = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [highlights, setHighlights] = useState<HighlightItem[]>([])
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [selectionRange, setSelectionRange] = useState<Range | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [isInteractingWithTooltip, setIsInteractingWithTooltip] =
    useState(false)
  const [open, setOpen] = useState(false)

  // Load highlight từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('highlights')
    if (saved) setHighlights(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('highlights', JSON.stringify(highlights))
  }, [highlights])

  // Khi mouseup, kiểm tra selection, nếu có text thì hiện tooltip "Highlight"
  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setTooltipVisible(false)
      return
    }
    const range = selection.getRangeAt(0)
    const selected = selection.toString()
    if (!selected.trim()) {
      setTooltipVisible(false)
      return
    }

    // Tính vị trí tooltip
    const rect = range.getBoundingClientRect()
    setTooltipPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })

    setSelectedText(selected)
    setSelectionRange(range.cloneRange())
    setEditingId(null)
    setNote('')
    setTooltipVisible(true)
  }

  // Highlight đoạn đã chọn
  const handleHighlight = () => {
    if (!selectionRange || !containerRef.current) return

    const fullText = containerRef.current.innerText
    const selected = selectedText
    const start = fullText.indexOf(selected, selectionRange.startOffset)
    const end = start + selected.length
    const id = uuidv4()

    if (start === -1) return

    const newHighlight: HighlightItem = {
      id,
      text: selected,
      note: '',
      start,
      end,
    }
    setHighlights((prev) => [...prev, newHighlight])

    setTooltipVisible(false)
    setSelectionRange(null)
    setSelectedText('')
  }

  // Click vào highlight để hiện tooltip chỉnh sửa hoặc unhighlight
  const handleSpanClick = (e: MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    const container = containerRef.current
    if (!container) return

    const span = container.querySelector(`span[data-id="${id}"]`)
    if (!span) return

    const rect = span.getBoundingClientRect()
    setTooltipPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })

    const highlight = highlights.find((h) => h.id === id)
    if (highlight) {
      setNote(highlight.note)
      setEditingId(id)
      setTooltipVisible(true)
      setSelectedText(highlight.text)
    }
  }

  // Lưu note
  const saveNote = () => {
    if (!editingId) return
    setHighlights((prev) =>
      prev.map((h) => (h.id === editingId ? { ...h, note } : h)),
    )
    setTooltipVisible(false)
    setEditingId(null)
    setNote('')
    setIsInteractingWithTooltip(false)
  }

  // Unhighlight (bỏ span, trả về text thường)
  const unhighlight = () => {
    if (!editingId) return
    setHighlights((prev) => prev.filter((h) => h.id !== editingId))
    setTooltipVisible(false)
    setEditingId(null)
    setNote('')
  }

  // Scroll tới highlight trong danh sách
  const scrollToHighlight = (id: string) => {
    const container = containerRef.current
    if (!container) return

    const span = container.querySelector(`span[data-id="${id}"]`)
    if (span) {
      span.scrollIntoView({ behavior: 'smooth', block: 'center' })
      span.classList.add('ring', 'ring-blue-400')
      setTimeout(() => span.classList.remove('ring', 'ring-blue-400'), 1500)
    }
  }

  //   Render text biến mẫu
  const renderHighlightedText = () => {
    const parts = []
    let lastIndex = 0

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)

    for (const h of sortedHighlights) {
      if (h.start > lastIndex) {
        parts.push(text.slice(lastIndex, h.start))
      }

      parts.push(
        <span
          key={h.id}
          data-id={h.id}
          data-highlight="true"
          className="cursor-pointer rounded bg-[#FFE399] px-1"
        >
          {text.slice(h.start, h.end)}
        </span>,
      )

      lastIndex = h.end
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts
  }
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  // Click ngoài để ẩn tooltip - Only close when not editing
  useEffect(() => {
    if (!tooltipVisible || editingId) return // Không đóng tooltip khi đang edit

    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const container = containerRef.current

      // Kiểm tra nếu click vào container
      if (container && container.contains(target)) {
        return
      }

      // Kiểm tra nếu click vào tooltip
      const isClickInsideTooltip = target.closest('.ant-tooltip')
      if (isClickInsideTooltip) {
        return
      }

      // Đóng tooltip chỉ khi không đang edit
      if (!editingId) {
        setTooltipVisible(false)
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', onClickOutside, true)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', onClickOutside, true)
    }
  }, [tooltipVisible, editingId])

  return (
    <div className="">
      <div
        ref={containerRef}
        className="relative p-4 leading-relaxed"
        onMouseUp={handleMouseUp}
        onClickCapture={(e) => {
          const target = e.target as HTMLElement
          const id = target?.dataset?.id
          if (target?.dataset?.highlight && id) {
            e.stopPropagation()
            handleSpanClick(e as unknown as MouseEvent, id)
          }
        }}
      >
        <div>{renderHighlightedText()}</div>

        <Popover
          open={tooltipVisible}
          placement="top"
          getPopupContainer={() => containerRef.current || document.body}
          overlayInnerStyle={{ maxWidth: 260 }}
          overlayStyle={{
            position: 'absolute',
            top: tooltipPos.top,
            left: tooltipPos.left - 30,
            zIndex: 9999,
          }}
          onOpenChange={(visible) => {
            if (!visible && editingId) return
            if (!visible) setTooltipVisible(false)
          }}
          trigger={[]}
          classNames={{
            root: 'highlight-popover',
            body: '!bg-[#404041] !px-2 !py-1 !m-0',
          }}
          content={
            <div
              className="max-w-[260px] space-y-2"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {editingId ? (
                <>
                  {isShowNote && (
                    <Input.TextArea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onMouseDown={(e) => e.stopPropagation()}
                      rows={3}
                      placeholder="Enter note"
                      ref={(textarea) => {
                        if (textarea && editingId) {
                          setTimeout(() => textarea.focus(), 100)
                        }
                      }}
                    />
                  )}
                  <div className="flex justify-end space-x-2">
                    {isShowNote && (
                      <Button
                        size="small"
                        onClick={saveNote}
                        onMouseDown={(e) => e.stopPropagation()}
                        type="primary"
                      >
                        Save Note
                      </Button>
                    )}
                    <div className="flex cursor-pointer items-center space-x-2 text-base text-white">
                      <PointerIcon />
                      <div
                        onClick={unhighlight}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        Unhighlight this
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex cursor-pointer items-center space-x-2 text-base text-white">
                  <PointerIcon />
                  <div
                    onClick={handleHighlight}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Highlight this
                  </div>
                </div>
              )}
            </div>
          }
        >
          <span />
        </Popover>
      </div>
      <div
        className={clsx(
          'fixed bottom-5 right-4 flex h-14 w-10 items-center justify-center rounded-full bg-white shadow-small',
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
    </div>
  )
}
