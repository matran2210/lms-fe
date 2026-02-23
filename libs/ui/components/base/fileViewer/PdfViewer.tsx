'use client';

import { DecreaseIcon, IncreaseIcon, LoadingIcon } from '@lms/assets';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface IProps {
  url: string;
}

const PdfViewer = ({ url }: IProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>();
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  }

  const handleItemClick = ({ pageNumber }: { pageNumber: number }) => {
    const container = containerRef.current;
    if (!container) return;

    const pageEl = container.querySelector(
      `[data-page-number="${pageNumber}"]`,
    ) as HTMLElement | null;

    if (pageEl) {
      container.scrollTo({ top: pageEl.offsetTop, behavior: 'auto' });
      setCurrentPageNumber(pageNumber);
    }
  };

  const updateCurrentPageOnScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (scrollRafRef.current) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;

      const containerTop = container.getBoundingClientRect().top;
      const pageElements = Array.from(
        container.querySelectorAll('[data-page-number]'),
      ) as HTMLElement[];

      let closestPage = currentPageNumber;
      let smallestOffset = Number.POSITIVE_INFINITY;

      pageElements.forEach((el) => {
        const { top } = el.getBoundingClientRect();
        const offsetToTop = Math.abs(top - containerTop);

        if (offsetToTop < smallestOffset) {
          const pageNumber = Number(el.dataset.pageNumber);
          if (!Number.isNaN(pageNumber)) {
            closestPage = pageNumber;
            smallestOffset = offsetToTop;
          }
        }
      });

      if (closestPage !== currentPageNumber) {
        setCurrentPageNumber(closestPage);
      }
    });
  }, [currentPageNumber]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateCurrentPageOnScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', updateCurrentPageOnScroll);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [updateCurrentPageOnScroll]);

  const pages = useMemo(
    () => (numPages ? Array.from({ length: numPages }, (_, i) => i + 1) : []),
    [numPages],
  )

  useResizeObserver(containerRef.current, {}, (entry: ResizeObserverEntry[]) => {
    const { width } = entry[0].contentRect;
    setPageWidth(width);
  });

  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => {
    setZoom(zoom + 0.1);
  }
  const handleZoomOut = () => {
    setZoom(zoom - 0.1);
  }

  const percentZoom = useMemo(() => {
    return Math.round(zoom * 100);
  }, [zoom]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-scroll">
      <div className='rounded-lg font-medium text-sm text-white w-[293px] h-[40px] bg-[#272727]/85 flex items-center justify-center absolute bottom-4 left-1/2 -translate-x-1/2 z-[99999]'>
        <div className='flex gap-3'>
          <span>{currentPageNumber}</span>
          <span>/</span>
          <span>{numPages}</span>
        </div>
        <div className='h-6 w-[1px] bg-[#BDBDC7] mx-5'></div>
        <div className='flex gap-5 items-center'>
          <div className='cursor-pointer' onClick={handleZoomOut}>
            <DecreaseIcon />
          </div>
          <div>{percentZoom}%</div>
          <div className='cursor-pointer' onClick={handleZoomIn}>
            <IncreaseIcon />
          </div>
        </div>
      </div>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onItemClick={handleItemClick}
        loading={<LoadingIcon stroke="#404041" />}
      >
        {pages.map((pageNumber: number) => (
          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer
            scale={zoom}
          />
        ))}
      </Document>
    </div>
  );
}

export default PdfViewer;
