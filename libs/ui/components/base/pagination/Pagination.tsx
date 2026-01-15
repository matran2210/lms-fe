"use client";
import { getPaginationItems } from "./pagination-fn";
import PageLinkPagination from "./PageLink";
import { Dispatch, ReactNode, SetStateAction, useRef } from "react";
import ArrowIcon from "./ArrowIcon";
import { useState, useEffect } from "react";

interface Props {
  currentPage: number;
  pageSize: number;
  maxLength: any;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  totalItems: number;
  type: any;
  optionShowAll?: ReactNode;
}

const Pagination = ({
  currentPage,
  pageSize,
  maxLength,
  setCurrentPage,
  totalItems,
  type,
  optionShowAll,
}: Props) => {
  const elementRef = useRef(null);

  const [pageNums, setPageNums] = useState<any>([]);
  const [activeShowAll, setActiveShowAll] = useState<boolean>(true);
  const getPagination = getPaginationItems(currentPage, pageSize, maxLength);
  const arrPage: any[] = [];
  for (let i = 1; i <= totalItems; i++) {
    arrPage.push(i);
  }
  const handleHorizantalScroll = (
    element: any,
    speed: any,
    distance: any,
    step: any,
  ) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
      // if (element.scrollLeft === 0) {
      //   setArrowDisable(true);
      // } else {
      //   setArrowDisable(false);
      // }
    }, speed);
  };
  useEffect(() => {
    setPageNums(getPaginationItems(currentPage, pageSize, maxLength));
  }, [pageSize, currentPage, maxLength]);

  return (
    <ul
      className={`pagination flex flex-wrap items-center ${
        type === "row" && "w-full"
      } ${type === "table" ? "gap-5" : "gap-3"}`}
      aria-label="Pagination"
    >
      <div
        className={`${
          type === "row" && activeShowAll
            ? "relative mx-7"
            : "flex items-center gap-6"
        }`}
      >
        <div
          className={`${
            type === "row" &&
            activeShowAll &&
            "absolute -left-3 top-0.5 -translate-x-full"
          }`}
        >
          <PageLinkPagination
            disabled={type !== "row" && currentPage === 1}
            arrow={true}
            onClick={() => {
              if (type === "row") {
                handleHorizantalScroll(elementRef.current, 25, 200, -20);
              } else if (setCurrentPage !== undefined) {
                setCurrentPage(currentPage - 1);
              }
            }}
            type={type}
          >
            <ArrowIcon
              iconType={`${type === "table" ? "chervon" : "teeny"}`}
            ></ArrowIcon>
          </PageLinkPagination>
        </div>
        <div
          className={`${
            type === "row" && activeShowAll
              ? "flex w-full gap-2 overflow-hidden"
              : "flex flex-wrap items-center gap-2"
          }`}
          ref={elementRef}
        >
          {pageNums.map((pageNum: number, idx: any) => (
            <PageLinkPagination
              key={idx}
              active={currentPage === pageNum}
              disabled={isNaN(pageNum)}
              onClick={() => {
                if (setCurrentPage !== undefined) {
                  setCurrentPage(pageNum);
                }
              }}
              type={type}
            >
              {!isNaN(pageNum) ? pageNum : type === "table" ? "..." : "|"}
            </PageLinkPagination>
          ))}
        </div>
        <div
          className={`${
            type === "row" &&
            activeShowAll &&
            "absolute -right-3 top-0.5 translate-x-full"
          }`}
        >
          <PageLinkPagination
            disabled={type !== "row" && currentPage === pageSize}
            arrow={true}
            onClick={() => {
              if (type === "row") {
                handleHorizantalScroll(elementRef.current, 25, 200, 20);
              } else if (setCurrentPage !== undefined) {
                setCurrentPage(currentPage + 1);
              }
            }}
            type={type}
          >
            <ArrowIcon
              iconType={`${type === "table" ? "chervon" : "teeny"}`}
              right={true}
            ></ArrowIcon>
          </PageLinkPagination>
        </div>
        {type === "row" && (
          <div className="flex items-center">
            {!activeShowAll && optionShowAll}
            <div
              className={`ml-6 w-max cursor-pointer text-sm font-semibold leading-[17px] text-gray-800 underline ${
                activeShowAll && "absolute -right-28 top-0 translate-y-1/2"
              }`}
              onClick={() => {
                setPageNums(activeShowAll ? arrPage : getPagination);
                setActiveShowAll(!activeShowAll);
              }}
            >
              {activeShowAll ? "Show All" : "Show Less"}
            </div>
          </div>
        )}
      </div>
    </ul>
  );
};

export default Pagination;
