/**
 * PDFViewerDynamic — lazy wrapper cho PDFViewer (@cyntler/react-doc-viewer)
 *
 * @cyntler/react-doc-viewer ~150KB gzipped — chỉ load khi thật sự render file PDF
 * (PDFViewer được render có điều kiện trong trang explanation), tránh nhồi vào
 * chunk route khi activity không phải PDF.
 */
"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import SappLoading from "../../common/SappLoading";
import type PDFViewerType from "./pdf-viewer";

const PDFViewerLazy = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => <SappLoading />,
});

type PDFViewerProps = ComponentProps<typeof PDFViewerType>;

const PDFViewer = (props: PDFViewerProps) => <PDFViewerLazy {...props} />;

export default PDFViewer;
