import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { QUESTION_TYPES } from "@lms/core";
import { ArrowIconV2, PageLinkPagination } from "@lms/ui";
import { useTailwindBreakpoint } from "@lms/hooks";

interface IProps {
  data: Array<any>;
  setCurrentTab?: any;
  currentTab: string;
  handleChangeTab?: any;
  activeShowAll: boolean;
  isScrollCenter?: boolean;
  setHasScrollBar: any;
}

const TabSlide = ({
  data,
  setCurrentTab,
  currentTab,
  handleChangeTab,
  activeShowAll,
  isScrollCenter = true,
  setHasScrollBar,
}: IProps) => {
  const { isMobileView } = useTailwindBreakpoint();
  const MAX_ITEMS_PER_ROW = 25;
  const MIN_ITEMS_PER_ROW = 14;
  const ITEM_WIDTH = 38; // Ước tính chiều rộng mỗi item (bao gồm gap)
  const GAP_WIDTH = 8; // Gap giữa các item

  const [windowWidth, setWindowWidth] = useState(0);
  const elementRef = useRef(null) as any;

  // Tính toán số câu trên mỗi dòng dựa trên chiều rộng màn hình
  const numberDisplayData = useMemo(() => {
    if (windowWidth === 0) return MIN_ITEMS_PER_ROW;

    // Tính toán số câu có thể hiển thị trên 1 dòng
    const extraWidth = 430; // Chiều rộng của các btn 2 bên
    const availableWidth = windowWidth - 200 - extraWidth;
    const itemsPerRow = Math.floor(availableWidth / (ITEM_WIDTH + GAP_WIDTH));

    // Giới hạn trong khoảng MIN_ITEMS_PER_ROW đến MAX_ITEMS_PER_ROW
    return Math.max(
      MIN_ITEMS_PER_ROW,
      Math.min(MAX_ITEMS_PER_ROW, itemsPerRow),
    );
  }, [windowWidth]);

  // Theo dõi chiều rộng màn hình
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Cập nhật ngay lập tức
    updateWindowWidth();

    // Thêm window resize listener
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  // Cập nhật windowWidth khi activeShowAll thay đổi
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Sử dụng setTimeout để đảm bảo DOM đã render sau khi activeShowAll thay đổi
    const timeoutId = setTimeout(updateWindowWidth, 100);

    return () => clearTimeout(timeoutId);
  }, [activeShowAll]);

  useEffect(() => {
    const container = elementRef?.current as HTMLElement | null;
    if (!container || activeShowAll) return;

    const activeItem = container.querySelector(
      `[data-tab-id="${currentTab}"]`,
    ) as HTMLElement | null;
    if (!activeItem) return;

    const containerWidth = container.clientWidth;
    const itemWidth = activeItem.clientWidth;
    const itemLeft = activeItem.offsetLeft;

    let targetLeft = isScrollCenter
      ? itemLeft - (containerWidth - itemWidth) / 2
      : itemLeft - (containerWidth - itemWidth);

    const maxScrollLeft = container.scrollWidth - containerWidth;
    if (targetLeft < 0) targetLeft = 0;
    if (targetLeft > maxScrollLeft) targetLeft = maxScrollLeft;

    container.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [currentTab, activeShowAll, isScrollCenter, data?.length]);

  // Loại bỏ trùng id, sau đó sắp xếp theo index tăng dần để tránh trùng item active
  const uniqueData = useMemo(() => {
    const seenIds = new Set<string>();
    const result: any[] = [];
    for (const item of data || []) {
      const id = item?.id;
      if (id == null) continue;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        result.push(item);
      }
    }
    return result;
  }, [data]);

  const sortedData = useMemo(() => {
    return [...uniqueData].sort((a, b) => a.index - b.index);
  }, [uniqueData]);

  useEffect(() => {
    if (elementRef?.current && sortedData.length > 0) {
      const el = elementRef.current;
      el &&
        setHasScrollBar?.(
          el.scrollWidth > el.getBoundingClientRect().width &&
            sortedData?.length > 0,
        );
    }
  }, [sortedData.length, setHasScrollBar]);

  // Chia sortedData thành các dòng liên tiếp theo chiều ngang
  const rows = useMemo(() => {
    if (!activeShowAll || sortedData.length <= numberDisplayData) return [];
    const result = [];
    for (let i = 0; i < sortedData.length; i += numberDisplayData) {
      result.push(sortedData.slice(i, i + numberDisplayData));
    }
    return result;
  }, [sortedData, activeShowAll, numberDisplayData]);

  const firstEssayPosition = useMemo(() => {
    for (const e of sortedData) {
      if (e.qType === QUESTION_TYPES.ESSAY) {
        return e.index;
      }
    }
    return undefined;
  }, [sortedData]);

  // const [arrowDisable, setArrowDisable] = useState(true);

  // const handleHorizantalScroll = (
  //   element: HTMLElement,
  //   speed: number,
  //   distance: number,
  //   step: number,
  // ) => {
  //   let scrollAmount = 0;
  //   const slideTimer = setInterval(() => {
  //     element.scrollLeft += step;
  //     scrollAmount += Math.abs(step);
  //     if (scrollAmount >= distance) {
  //       clearInterval(slideTimer);
  //     }
  //     // if (element.scrollLeft === 0) {
  //     //   setArrowDisable(true);
  //     // } else {
  //     //   setArrowDisable(false);
  //     // }
  //   }, speed);
  // };

  /**
   * @description Sử dụng state để theo dõi trạng thái của việc kéo
   */
  const [isDragging, setIsDragging] = useState(false);
  /**
   * @description Lưu trữ vị trí x của chuột khi bắt đầu kéo
   */
  const [startX, setStartX] = useState(0);
  /**
   * @description Lưu trữ giá trị scrollLeft của menu container khi bắt đầu kéo
   */
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true); // Đánh dấu rằng việc kéo đã bắt đầu
    setStartX(event.pageX - elementRef?.current?.offsetLeft); // Lưu trữ vị trí x của chuột khi bắt đầu kéo
    setScrollLeft(elementRef?.current?.scrollLeft); // Lưu trữ giá trị scrollLeft hiện tại của menu container
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return; // Nếu không đang kéo, không thực hiện gì cả
    const x = event?.pageX - elementRef?.current?.offsetLeft; // Tính toán vị trí x mới của chuột
    const distance = (x - startX) * 2; // Tính khoảng cách di chuyển của chuột từ vị trí bắt đầu kéo
    elementRef.current.scrollLeft = scrollLeft - distance; // Cuộn menu container dựa trên khoảng cách di chuyển của chuột
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event?.touches[0];
    setIsDragging(true);
    setStartX(touch?.pageX - elementRef?.current?.offsetLeft);
    setScrollLeft(elementRef?.current?.scrollLeft);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = event?.touches[0];
    const x = touch?.pageX - elementRef?.current?.offsetLeft;
    const distance = (x - startX) * 2;
    elementRef.current.scrollLeft = scrollLeft - distance;
  };

  return (
    <ul
      className={`pagination flex min-h-[40px] w-full flex-wrap items-center gap-3 ${activeShowAll ? "lg:max-w-[1222px]" : "h-[44px] lg:max-w-[calc(100vw-88px-32px)]"}`}
      aria-label="Pagination"
    >
      <div className={`flex w-full items-center justify-center gap-4`}>
        {/* Nút mũi tên trái */}
        {data?.length > 0 && (
          <div className="flex items-center">
            <PageLinkPagination
              disabled={sortedData.findIndex((e) => e.id === currentTab) === 0}
              arrow={true}
              onClick={() => {
                const index = sortedData.findIndex((e) => e.id === currentTab);
                if (index > 0 && setCurrentTab) {
                  handleChangeTab(sortedData[index - 1].id);
                }
              }}
              className={clsx(
                sortedData.findIndex((e) => e.id === currentTab) === 0
                  ? "pointer-events-none opacity-50"
                  : "",
                "cursor-pointer",
              )}
            >
              <ArrowIconV2 />
            </PageLinkPagination>
          </div>
        )}
        {/* Phần render các số */}
        <div
          className={clsx(
            "relative flex w-fit select-none justify-start gap-2 pt-1 px-1 duration-300 ease-in-out will-change-auto",
            {
              "!w-fit": activeShowAll,
              "h-[44px] overflow-hidden": !activeShowAll,
              "overflow-visible": activeShowAll,
              "overflow-x-auto": activeShowAll && isMobileView,
            },
          )}
          ref={elementRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          {sortedData.length > 0 ? (
            !activeShowAll || sortedData?.length <= numberDisplayData ? (
              sortedData.map((pageNum: any, idx: any) =>
                firstEssayPosition !== undefined &&
                pageNum.index === firstEssayPosition ? (
                  <div
                    className="flex"
                    key={pageNum.id}
                    data-tab-id={pageNum.id}
                  >
                    {idx !== 0 && <div className="me-2 h-full border"></div>}
                    <PageLinkPagination
                      key={pageNum.id}
                      active={currentTab === pageNum.id}
                      onClick={() => {
                        if (setCurrentTab !== undefined) {
                          handleChangeTab(pageNum.id);
                        }
                      }}
                      isViewedProp={
                        pageNum.attempted || pageNum.is_viewed_answer
                      }
                      isFlagedProp={pageNum.flag}
                    >
                      {pageNum.index + 1}
                    </PageLinkPagination>
                  </div>
                ) : (
                  <div
                    className="flex"
                    key={pageNum.id}
                    data-tab-id={pageNum.id}
                  >
                    <PageLinkPagination
                      key={pageNum.id}
                      active={currentTab === pageNum.id}
                      onClick={() => {
                        if (setCurrentTab !== undefined) {
                          handleChangeTab(pageNum.id);
                        }
                      }}
                      isViewedProp={pageNum.attempted}
                      isFlagedProp={pageNum.flag}
                    >
                      {pageNum.index + 1}
                    </PageLinkPagination>
                  </div>
                ),
              )
            ) : (
              // Show-all: multi-rows by numberPerRow (responsive: max 25, min 14)
              <div className="flex flex-col gap-2">
                {rows.map((row, rowIdx) => (
                  <div className="flex flex-row gap-2" key={rowIdx}>
                    {row.map((pageNum: any) => (
                      <div
                        className="flex"
                        key={pageNum.id}
                        data-tab-id={pageNum.id}
                      >
                        <PageLinkPagination
                          key={pageNum.id}
                          active={currentTab === pageNum.id}
                          onClick={() => {
                            if (setCurrentTab !== undefined) {
                              handleChangeTab(pageNum.id);
                            }
                          }}
                          isViewedProp={pageNum.attempted}
                          isFlagedProp={pageNum.flag}
                        >
                          {pageNum.index + 1}
                        </PageLinkPagination>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex w-full items-center justify-center">
              Your search did not match any questions
            </div>
          )}
        </div>
        {/* Nút mũi tên phải */}
        {data?.length > 0 && (
          <div className="flex items-center">
            <PageLinkPagination
              disabled={
                sortedData.findIndex((e) => e.id === currentTab) ===
                sortedData.length - 1
              }
              arrow={true}
              onClick={() => {
                const index = sortedData.findIndex((e) => e.id === currentTab);
                if (index < sortedData.length - 1 && setCurrentTab) {
                  handleChangeTab(sortedData[index + 1].id);
                }
              }}
              className={clsx(
                sortedData.findIndex((e) => e.id === currentTab) ===
                  sortedData.length - 1
                  ? "pointer-events-none opacity-50"
                  : "",
                "cursor-pointer",
              )}
            >
              <ArrowIconV2 right={true} />
            </PageLinkPagination>
          </div>
        )}
      </div>
    </ul>
  );
};
export default TabSlide;
