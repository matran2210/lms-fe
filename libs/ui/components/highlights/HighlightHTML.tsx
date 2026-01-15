"use client";
import { doHighlight, optionsImpl } from "@funktechno/texthighlighter/lib";
import { PointerIcon, ShowCommentIcon } from "@lms/assets";
import { useCourseNoteContext, useFeature } from "@lms/contexts";
import {
  replaceTextAlignCenterToWebKitCenter,
  replaceWhiteSpacePreWrapToNormal,
} from "@lms/utils";
import { Button, Divider, Input, Modal, Popover } from "antd";
import dayjs from "dayjs";
import parseHTML, { Element } from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ButtonPrimary,
  ButtonSecondary,
  SappModalImage,
  SAPPVideo,
} from "../base";
import { AvatarCard } from "../card";
declare var com: any;
const { TextArea } = Input;
const DEBOUNCE_DELAY = 100;

interface HighlightItem {
  id: string;
  text: string;
  note: string;
  noteTime: string;
  startOffset: number;
  endOffset: number;
}

interface Props {
  initialHTML: string;
  storageKey: string;
  isShowNote?: boolean;
  className?: string;
}

export const HighlightableHTML: React.FC<Props> = ({
  initialHTML,
  storageKey,
  isShowNote = false,
  className,
}) => {
  const { courseApi, videoUrl, query } = useFeature();
  const activityId = query.activityId;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>(
    {},
  );
  const [src, setSrc] = useState<string>();
  const [type, setType] = useState<"VIDEO" | "IMG">("VIDEO");
  const highlightTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const isRestoringRef = useRef(false);
  const [selection, setSelection] = useState<{
    text: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const {
    openNote,
    setOpenNote,
    setNoteData,
    noteData,
    modalPosition,
    setModalPosition,
    noteInput,
    setNoteInput,
    notesListData,
    refetchNotesList,
    isViewOnly,
    setIsViewOnly,
  } = useCourseNoteContext();

  const prevStorageKeyRef = useRef<string>(storageKey);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(
    null,
  );
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(
    null,
  );
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [lastRect, setLastRect] = useState<DOMRect | null>(null);
  const [isProtectingSelection, setIsProtectingSelection] = useState(false);

  // Debounce setSelectionRect để tránh scroll nháy
  const updateSelectionRect = (rect: DOMRect | null) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(
      setTimeout(() => {
        setSelectionRect(rect);
      }, DEBOUNCE_DELAY),
    );
  };

  // Helper function to clear all highlights from DOM
  const clearHighlightsFromDOM = (container: HTMLElement) => {
    if (!container) return;

    const allHighlightSpans = container.querySelectorAll(
      'span.highlighted[data-tracked="true"]',
    );

    allHighlightSpans.forEach((span) => {
      const parent = span.parentNode;
      if (parent && parent.contains(span)) {
        try {
          const textContent = span.textContent || "";
          const textNode = document.createTextNode(textContent);
          parent.replaceChild(textNode, span);
        } catch (e) {
          // Ignore errors if node already removed
        }
      }
    });

    // Normalize to merge text nodes
    if (container.normalize) {
      container.normalize();
    }
  };

  // Helper function to restore highlights from positions
  const restoreHighlightsToDOM = (
    container: HTMLElement,
    highlightItems: HighlightItem[],
  ) => {
    if (!container || highlightItems.length === 0) return;

    // Sort highlights by startOffset DESC to apply from end to start (avoid offset shift)
    const sortedHighlights = [...highlightItems].sort(
      (a, b) => b.startOffset - a.startOffset,
    );

    sortedHighlights.forEach((highlight) => {
      try {
        const { startOffset, endOffset, id } = highlight;

        // Create tree walker to find text nodes
        const walker = document.createTreeWalker(
          container,
          NodeFilter.SHOW_TEXT,
          null,
        );

        let currentOffset = 0;
        let startNode: Node | null = null;
        let startNodeOffset = 0;
        let endNode: Node | null = null;
        let endNodeOffset = 0;

        // Find start and end nodes
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const nodeLength = node.textContent?.length || 0;

          if (!startNode && currentOffset + nodeLength > startOffset) {
            startNode = node;
            startNodeOffset = startOffset - currentOffset;
          }

          if (currentOffset + nodeLength >= endOffset) {
            endNode = node;
            endNodeOffset = endOffset - currentOffset;
            break;
          }

          currentOffset += nodeLength;
        }

        if (!startNode || !endNode) return;

        // Check if start and end are in the same text node
        if (startNode === endNode) {
          // Simple case: same text node
          const range = document.createRange();
          range.setStart(startNode, startNodeOffset);
          range.setEnd(endNode, endNodeOffset);

          const span = document.createElement("span");
          span.className = "highlighted";
          span.style.backgroundColor = "yellow";
          span.setAttribute("data-id", id);
          span.setAttribute("data-tracked", "true");

          try {
            range.surroundContents(span);
          } catch (e) {
            // console.error('Error surrounding contents:', e)
          }
        } else {
          // Complex case: spans multiple text nodes
          // We need to wrap each text node segment separately to avoid wrapping block elements

          const range = document.createRange();
          range.setStart(startNode, startNodeOffset);
          range.setEnd(endNode, endNodeOffset);

          // Get all text nodes in the range
          const textNodesInRange: Array<{
            node: Node;
            start: number;
            end: number;
          }> = [];
          const rangeWalker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                return range.intersectsNode(node)
                  ? NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_REJECT;
              },
            },
          );

          let textNode: Node | null;
          while ((textNode = rangeWalker.nextNode())) {
            const nodeLength = textNode.textContent?.length || 0;

            if (textNode === startNode && textNode === endNode) {
              textNodesInRange.push({
                node: textNode,
                start: startNodeOffset,
                end: endNodeOffset,
              });
            } else if (textNode === startNode) {
              textNodesInRange.push({
                node: textNode,
                start: startNodeOffset,
                end: nodeLength,
              });
            } else if (textNode === endNode) {
              textNodesInRange.push({
                node: textNode,
                start: 0,
                end: endNodeOffset,
              });
            } else {
              textNodesInRange.push({
                node: textNode,
                start: 0,
                end: nodeLength,
              });
            }
          }

          // Apply highlight to each text node segment (in reverse to maintain positions)
          textNodesInRange.reverse().forEach((item) => {
            try {
              // Check if node is still in document
              if (!document.contains(item.node)) return;

              const nodeRange = document.createRange();
              nodeRange.setStart(item.node, item.start);
              nodeRange.setEnd(item.node, item.end);

              const span = document.createElement("span");
              span.className = "highlighted";
              span.style.backgroundColor = "yellow";
              span.setAttribute("data-id", id);
              span.setAttribute("data-tracked", "true");

              nodeRange.surroundContents(span);
            } catch (e) {
              // console.warn('Failed to wrap text node:', e)
            }
          });
        }
      } catch (error) {
        // console.error('Error restoring highlight:', error)
      }
    });

    // Final cleanup: normalize all text nodes in container
    container.normalize();
  };

  // Load highlights from sessionStorage - chỉ lưu positions
  useEffect(() => {
    isRestoringRef.current = true;

    // Clear old highlights trước khi load mới

    if (containerRef.current) {
      clearHighlightsFromDOM(containerRef.current);
    }
    const raw = sessionStorage.getItem(storageKey);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const loadedHighlights = parsed.highlights || [];
        setHighlights(loadedHighlights);
        // Chỉ restore khi có highlights được load từ storage
        if (loadedHighlights.length > 0 && containerRef.current) {
          setTimeout(() => {
            if (containerRef.current) {
              restoreHighlightsToDOM(containerRef.current!, loadedHighlights);
              isRestoringRef.current = false;
            }
          }, 200);
        } else {
          isRestoringRef.current = false;
        }
      } catch (err) {
        setHighlights([]);
        isRestoringRef.current = false;
      }
    } else {
      setHighlights([]);
      isRestoringRef.current = false;
    }

    // Reset các state khi chuyển câu hỏi
    setSelection(null);
    setSelectionRect(null);
    setSelectedHighlightId(null);
    setHighlightRect(null);
    setOpenNote(false);
    setNoteInput("");

    prevStorageKeyRef.current = storageKey;
  }, [storageKey]);
  // Cleanup effect riêng biệt
  useEffect(() => {
    return () => {
      if (containerRef.current && !isRestoringRef.current) {
        clearHighlightsFromDOM(containerRef.current);
      }
    };
  }, [storageKey]);
  // Restore highlights khi DOM ready
  // useEffect(() => {
  //   if (containerRef.current && highlights.length > 0) {
  //     // Đợi một chút để đảm bảo DOM đã render xong
  //     const timer = setTimeout(() => {
  //       restoreHighlightsToDOM(containerRef.current!, highlights)
  //     }, 100)

  //     return () => clearTimeout(timer)
  //   }
  // }, [highlights.length]) // Chỉ chạy khi số lượng highlights thay đổi

  // Save highlights to sessionStorage - CHỈ LƯU POSITIONS
  useEffect(() => {
    if (highlights.length >= 0) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          highlights, // Chỉ lưu mảng highlights với positions
        }),
      );
    }
  }, [highlights, storageKey]);

  const handleMouseUp = () => {
    const selectionObj = window.getSelection();
    if (!selectionObj || selectionObj.isCollapsed) {
      if (selection) setSelection(null);
      if (selectionRect) setSelectionRect(null);
      return;
    }

    const range = selectionObj.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const container = containerRef.current;
    if (!container || !container.contains(selectionObj.anchorNode)) return;

    // So sánh rect mới với rect cũ
    if (
      lastRect &&
      Math.abs(rect.top - lastRect.top) < 1 &&
      Math.abs(rect.left - lastRect.left) < 1 &&
      Math.abs(rect.width - lastRect.width) < 1 &&
      Math.abs(rect.height - lastRect.height) < 1
    ) {
      return;
    }

    setLastRect(rect);
    setSelectionRect(rect);

    const startOffset = getGlobalOffset(
      container,
      range.startContainer,
      range.startOffset,
    );
    const endOffset = getGlobalOffset(
      container,
      range.endContainer,
      range.endOffset,
    );

    setSelection({
      text: selectionObj.toString(),
      startOffset,
      endOffset,
    });

    setNoteInput("");
    setOpenNote(false);
    updateSelectionRect(rect);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as any;

      if (!selectedHighlightId || isProtectingSelection) return;

      // Kiểm tra nếu click vào modal note editor - KHÔNG clear selectedHighlightId
      const modalElements = document.querySelectorAll(
        ".ant-modal, .ant-modal-content, .ant-modal-body",
      );
      for (let modal of modalElements) {
        if (modal.contains(target)) return;
      }

      // Kiểm tra các element con của modal
      const isInModal =
        target.closest(".ant-modal") ||
        target.closest(".ant-modal-content") ||
        target.closest(".ant-modal-body");
      if (isInModal) return;

      const popoverElements = document.querySelectorAll(
        ".ant-popover.highlight-popover",
      );

      for (let popover of popoverElements) {
        if (popover.contains(target)) return;
      }
      // Kiểm tra nếu click vào button hoặc icon trong popover
      const isButtonOrIcon =
        target.closest("button") ||
        target.closest("svg") ||
        target.closest('[role="button"]');
      if (isButtonOrIcon) {
        const parentPopover = isButtonOrIcon.closest(".ant-popover");
        if (
          parentPopover &&
          parentPopover.classList.contains("highlight-popover")
        ) {
          return; // Không clear nếu click vào button/icon trong highlight popover
        }
      }

      const highlightElement = target.closest(
        "mark[data-id], span.highlighted[data-id]",
      );
      if (
        highlightElement &&
        (highlightElement.getAttribute("data-id") === selectedHighlightId ||
          highlightElement.getAttribute("data-timestamp") ===
            selectedHighlightId)
      )
        return;

      // CHỈ clear selectedHighlightId nếu KHÔNG phải đang trong quá trình edit note
      // if (!openNote) {
      //   setSelectedHighlightId(null)
      //   setHighlightRect(null)
      // }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [selectedHighlightId, openNote, isProtectingSelection]);

  // Handle click outside for text selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as any;

      if (!selection) return;

      // Check if clicked inside the highlight popover
      const popoverElement = document.querySelector(
        ".ant-popover.highlight-popover",
      );
      if (popoverElement && popoverElement.contains(target)) return;

      // Check if clicked inside the container
      const container = containerRef.current;
      if (container && container.contains(target)) {
        // If clicking inside container, let the normal mouseUp handler deal with it
        return;
      }

      // Clicked outside container, clear selection
      setSelection(null);
      setSelectionRect(null);

      // Clear browser selection as well
      const browserSelection = window.getSelection();
      if (browserSelection) {
        browserSelection.removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selection]);

  // Handle highlight click - Updated to work with both custom and package highlights
  // Updated handleHighlightClick to work with span.highlighted elements instead of mark elements
  const handleHighlightClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Look for span elements with class 'highlighted' instead of mark elements
    let highlightSpan = null;

    // Method 1: Check if clicked element is the highlight span
    if (target.classList.contains("highlighted")) {
      highlightSpan = target;
    }

    // Method 2: Look for highlighted span in parent chain
    if (!highlightSpan) {
      highlightSpan = target.closest("span.highlighted");
    }

    if (!highlightSpan) {
      setSelectedHighlightId(null);
      setHighlightRect(null);
      return;
    }

    // Prevent event from bubbling
    e.stopPropagation();

    //Lấy rect của từ đầu tiên (ở dòng đầu tiên)
    const rects = highlightSpan.getClientRects();
    const firstRect = rects[0] ?? highlightSpan.getBoundingClientRect();
    setHighlightRect(firstRect);

    // Use timestamp as ID or create new one
    let id =
      highlightSpan.getAttribute("data-timestamp") ||
      highlightSpan.getAttribute("data-id");

    if (!id) {
      id = `highlight-${Date.now()}`;
      highlightSpan.setAttribute("data-id", id);
    }

    setSelectedHighlightId(id);
  };

  // Updated handleRemoveHighlight to work with span elements
  const handleRemoveHighlight = () => {
    if (!selectedHighlightId) return;

    const container = containerRef.current;
    if (!container) return;

    // Tìm TẤT CẢ các span có cùng ID (vì có thể có nhiều span khi highlight span qua nhiều text nodes)
    const highlightElements = container.querySelectorAll(
      `span.highlighted[data-id="${selectedHighlightId}"], span.highlighted[data-timestamp="${selectedHighlightId}"]`,
    );

    // Xóa tất cả các span highlights
    highlightElements.forEach((highlightElement) => {
      const parent = highlightElement.parentNode;
      if (parent) {
        const textContent = highlightElement.textContent || "";
        parent.replaceChild(
          document.createTextNode(textContent),
          highlightElement,
        );
        parent.normalize();
      }
    });

    // Remove from state (match by ID or timestamp)
    const updatedHighlights = highlights.filter(
      (hl) =>
        hl.id !== selectedHighlightId &&
        hl.id !== selectedHighlightId.replace("highlight-", ""), // Handle ID variations
    );
    setHighlights(updatedHighlights);
    setSelectedHighlightId(null);
    setHighlightRect(null);
  };

  // Updated handleConfirmHighlight to properly track the created highlights
  const handleConfirmHighlight = () => {
    if (!selection) return;

    const domEle = containerRef.current;
    if (!domEle) return;

    // Use doHighlight from package
    const options: optionsImpl = {};
    const highlightMade = doHighlight(domEle, false, options);

    if (highlightMade) {
      setTimeout(() => {
        const newHighlightSpans = domEle.querySelectorAll(
          "span.highlighted:not([data-tracked])",
        );

        // Chỉ tạo MỘT highlight item duy nhất cho toàn bộ selection
        if (newHighlightSpans.length > 0) {
          const id = `highlight-${Date.now()}`;

          // Đánh dấu TẤT CẢ các span với cùng ID
          newHighlightSpans.forEach((span) => {
            span.setAttribute("data-tracked", "true");
            span.setAttribute("data-id", id);
          });

          // Chỉ tạo MỘT highlight item duy nhất
          const newHighlight: HighlightItem = {
            id: id,
            text: selection.text,
            note: noteInput,
            noteTime: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
            startOffset: selection.startOffset,
            endOffset: selection.endOffset,
          };

          setHighlights((prev) => [...prev, newHighlight]);
        }
      }, 10);
    }

    setSelection(null);
    setSelectionRect(null);
    setNoteInput("");
    setOpenNote(false);
  };

  // Add CSS to make highlight spans clickable
  useEffect(() => {
    if (!containerRef.current) return;

    const style = document.createElement("style");
    style.textContent = `
    span.highlighted {
      cursor: pointer !important;
      pointer-events: auto !important;
      background-color: yellow !important;
    }
    span.highlighted:hover {
      opacity: 0.8;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const timers = highlightTimers.current; // copy current ref

    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const closeCourseNote = () => {
    setLoading(false);
    refetchNotesList();
    setHighlightRect(null);
    setSelectedHighlightId(null);
    setNoteInput("");
    setOpenNote(false);
    setModalPosition(null);
    setNoteData(undefined);
    setEditingHighlightId(null);
  };

  const createNewNote = async (data: string, highlightId: string) => {
    try {
      setLoading(true);
      const params = {
        course_section_id: activityId,
        name: `Note-${highlightId}`,
        description: data,
      };
      const res = await courseApi.createNote(params);
      toast.success("Tạo thành công!");
    } catch (error) {
      toast.error("Tạo không thành công!");
    } finally {
      closeCourseNote();
    }
  };

  const updateNote = async (data: string, noteId: string) => {
    try {
      setLoading(true);
      const params = {
        name: noteData?.name,
        description: data,
      };
      await courseApi.updateCourseNotesList(noteId, params);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật không thành công!");
    } finally {
      closeCourseNote();
    }
  };

  const saveNote = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (noteData?.id) updateNote(noteInput, noteData.id);
    else {
      const currentHighlightId = editingHighlightId;
      setHighlights((prev) =>
        prev.map((h) =>
          h.id === currentHighlightId
            ? {
                ...h,
                note: noteInput,
                noteTime: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
              }
            : h,
        ),
      );

      if (currentHighlightId) {
        createNewNote(noteInput, currentHighlightId);
      }
    }
  };

  // Function để mở note editor và load existing note
  const openNoteEditor = (e?: React.MouseEvent) => {
    // Prevent event bubbling để tránh trigger handleClickOutside
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!selectedHighlightId) return;

    // Bảo vệ selection trong một khoảng thời gian ngắn
    setIsProtectingSelection(true);
    setTimeout(() => setIsProtectingSelection(false), 100);

    if (selectedHighlightId) {
      setEditingHighlightId(selectedHighlightId);
    }
    // Load existing note nếu có
    const existingHighlight = notesListData?.find((h) => {
      const highlightId = h.name.split("-")[1];
      if (highlightId) return highlightId === selectedHighlightId;
      else return false;
    });

    if (existingHighlight && existingHighlight.description) {
      setNoteInput(existingHighlight.description);
    }
    // Tính toán vị trí modal dựa trên highlightRect
    if (highlightRect) {
      const modalWidth = 400;
      const modalHeight = 200;
      const padding = 20;

      // KHÔNG cộng window.scrollY (vì fixed theo viewport)
      let top = highlightRect.top + highlightRect.height + padding;
      let left = highlightRect.left;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Nếu modal tràn xuống dưới màn hình
      if (top + modalHeight > viewportHeight - padding) {
        top = highlightRect.top - modalHeight - padding;
      }

      // Nếu modal tràn lên trên
      if (top < padding) {
        top = padding;
      }

      // Nếu modal tràn phải
      if (left + modalWidth > viewportWidth - padding) {
        left = viewportWidth - modalWidth - padding;
      }

      // Nếu modal tràn trái
      if (left < padding) {
        left = padding;
      }

      setModalPosition({ top, left });
    }

    setOpenNote(true);
    setHighlightRect(null);
  };

  const onCancelAddNote = () => {
    setOpenNote(false);
    setNoteInput("");
    setModalPosition(null);
    setIsViewOnly(false);
    // Không clear selectedHighlightId khi cancel
  };

  // Function để tính vị trí popover selection
  const getPopoverPositionFromStart = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rects = Array.from(range.getClientRects());

    if (rects.length === 0) return null;

    const startRect = rects[0]; // từ đầu tiên được chọn

    return {
      top: startRect.bottom + window.scrollY,
      left: startRect.left + startRect.width / 2 + window.scrollX - 65, // canh giữa từ đầu tiên
    };
  };
  const popoverPosition = getPopoverPositionFromStart();

  // Function để tính vị trí popover highlighted bên trái
  const calcPopoverLeft = (rect: DOMRect, popoverWidth = 130) => {
    const centerOffset = rect.width / 2 - popoverWidth / 2;
    return Math.max(0, rect.left + window.scrollX + centerOffset);
  };

  const convertMathToImage = async (element: any) => {
    // TODO: check lỗi này
    if (typeof com === "undefined") return;

    const viewer = com?.wiris?.js?.JsPluginViewer;

    if (element && viewer) {
      try {
        await viewer.parseElement(element, true, function () {});
      } catch (error) {}
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const editor = containerRef?.current;
      if (editor) {
        const mfencedElements = editor?.querySelectorAll("mfenced");
        mfencedElements.forEach((el: any) => {
          const openAttr = el?.getAttribute("open");
          const closeAttr = el?.getAttribute("close");
          if (openAttr !== null && closeAttr) {
            const replacements: { [key: string]: string } = {
              "|": "|",
              "||": "||",
              ">": "<",
              "}": "{",
              "]": "[",
              "&#62;": "&#60;",
            };
            if (replacements[closeAttr]) {
              el?.setAttribute("open", replacements[closeAttr]);
            }
          }
        });

        // Replace quote in font family
        const mathElement = editor?.querySelectorAll("math");
        if (mathElement) {
          mathElement?.forEach((el: any) => {
            if (el?.hasAttribute("style")) {
              let styleValue = el?.getAttribute("style");
              styleValue = styleValue?.replaceAll('"', "");
              el?.setAttribute("style", styleValue);
            }
          });
          convertMathToImage(editor);
        }
      }
    }, 100);
  });

  const handleOnclick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e?.target as HTMLElement;
    if (target.className === "sapp_overlay_video") {
      const video = target?.previousSibling as any;
      const src = video?.querySelector("source")?.getAttribute("token");
      if (src && src !== "null" && video.tagName === "VIDEO") {
        var iframe = document.createElement("iframe");
        iframe.src = `${videoUrl}${src}/iframe?autoplay=true`;
        iframe.id = video?.id;
        iframe.className = video?.className;
        iframe.style.cssText = video?.style.cssText;
        iframe.allow =
          "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;";
        iframe.allowFullscreen = true;
        video?.parentNode?.replaceChild(iframe, video);
        target?.classList.add("hidden");
      }
    } else if (target?.tagName === "IMG") {
      const imageSrc = target?.getAttribute("src");
      if (imageSrc) {
        setSrc(() => {
          setType("IMG");
          return imageSrc;
        });
      }
    }
  };

  return (
    <div
      className="text-base"
      onMouseUp={handleMouseUp}
      style={{ position: "relative" }}
      onClick={handleHighlightClick}
    >
      {!selectedHighlightId && selection && selectionRect && (
        <Popover
          classNames={{
            root: "highlight-popover",
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
            position: "absolute",
            top: popoverPosition?.top,
            left: popoverPosition?.left,
            zIndex: 9999,
          }}
        >
          <span />
        </Popover>
      )}

      {selectedHighlightId && highlightRect && (
        <Popover
          classNames={{
            root: "highlight-popover",
          }}
          content={
            <>
              {isShowNote ? (
                <div
                  className="flex items-center justify-end gap-2"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Button
                    className=" !px-2 py-1 text-white hover:!text-white"
                    onClick={openNoteEditor}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    type="text"
                  >
                    <ShowCommentIcon /> Comment
                  </Button>
                  <div>
                    <Divider type="vertical" className="bg-white" />
                  </div>
                  <Button
                    onClick={handleRemoveHighlight}
                    type="text"
                    className=" !px-2 py-1 text-white hover:!text-white"
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
            position: "absolute",
            top: highlightRect.top + window.scrollY + 28,
            left: calcPopoverLeft(highlightRect, isShowNote ? 283 : 130),
            zIndex: 9999,
          }}
          open={true}
          trigger={[]}
          placement="bottom"
        >
          <span />
        </Popover>
      )}

      {openNote && isShowNote && modalPosition && (
        <Modal
          open={openNote && isShowNote}
          onCancel={onCancelAddNote}
          footer={null}
          // Thêm các props này để tránh auto close
          maskClosable={false}
          keyboard={false}
          mask={false}
          style={{
            position: "fixed",
            top: modalPosition?.top || "auto",
            right: 50,
            margin: 0, // Remove default margin
            transform: "none", // Remove default transform
          }}
          width={300}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <AvatarCard className="mb-3" />
            <TextArea
              disabled={loading || isViewOnly}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              rows={4}
              placeholder="Enter note"
            />
            <div className="mt-3 flex justify-end space-x-2">
              <ButtonSecondary
                onClick={onCancelAddNote}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Cancel
              </ButtonSecondary>
              <ButtonPrimary
                loading={loading}
                disabled={!noteInput || isViewOnly}
                onClick={saveNote}
                onMouseDown={(e) => e.stopPropagation()}
                type="primary"
              >
                Save
              </ButtonPrimary>
            </div>
          </div>
        </Modal>
      )}

      <div
        key={`${storageKey}-content`}
        id={storageKey}
        ref={containerRef}
        className={`${className} editor-wrap`}
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleOnclick}
        translate="no"
        suppressHydrationWarning // Tắt warning khi DOM được manipulate bởi vanilla JS
      >
        {parseHTML(
          replaceTextAlignCenterToWebKitCenter(
            replaceWhiteSpacePreWrapToNormal(initialHTML || ""),
          ),
          {
            replace: (domNode) => {
              if (domNode.type === "tag" && domNode.name === "video") {
                const sourceChild = (domNode.children as Element[]).find(
                  (child) => child.name === "source",
                );
                const videoToken = sourceChild?.attribs?.token;
                if (videoToken) {
                  if (!videoRefs.current[videoToken]) {
                    videoRefs.current[videoToken] =
                      React.createRef<HTMLVideoElement>();
                  }
                  return (
                    <SAPPVideo
                      key={videoToken}
                      options={{
                        onTimeUpdate: () => {},
                        src: videoToken,
                      }}
                      streamRef={videoRefs.current[videoToken]}
                      pauseOnSeek={true}
                      thumbnail={{
                        "311x175": `${videoUrl}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=175`,
                        "656x369": `${videoUrl}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=369`,
                        "1270x716": `${videoUrl}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=716`,
                      }}
                      videoAttribs={domNode.attribs}
                    />
                  );
                }
              }
            },
          },
        )}
      </div>
      {type === "IMG" && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </div>
  );
};

function getGlobalOffset(
  root: HTMLElement,
  node: Node,
  offsetInNode: number,
): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let offset = 0;
  let current: Node | null;
  while ((current = walker.nextNode())) {
    if (current === node) {
      return offset + offsetInNode;
    }
    offset += current.textContent?.length || 0;
  }
  return offset;
}
