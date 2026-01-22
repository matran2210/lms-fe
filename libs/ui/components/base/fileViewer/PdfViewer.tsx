'use client';

import { LoadingIcon } from '@lms/assets';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface IProps {
    url: string;
}

export default function PdfViewer({ url }: IProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageWidth, setPageWidth] = useState<number>();
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages);
    }

    const pages = useMemo(
        () => (numPages ? Array.from({ length: numPages }, (_, i) => i + 1) : []),
        [numPages],
      )

      useResizeObserver(containerRef.current, {}, (entry) => {
        const { width } = entry[0].contentRect;
        setPageWidth(width);
      });

    return (
        <div ref={containerRef} className="w-full">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<LoadingIcon stroke="#404041" />}
            >
              {pages.map((pageNumber) => (
                <Page
                  key={pageNumber}
                  pageNumber={pageNumber}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer
                />
              ))}
            </Document>
        </div>
    );
}
