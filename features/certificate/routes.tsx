import { CERTIFICATE_ROUTES } from "./src/constants/routes";
import CertificateDetail from "./src/pages/detail";

export const certificateRoutes = [
  {
    path: CERTIFICATE_ROUTES.CERTIFICATE_DETAIL,
    element: <CertificateDetail />
  }
]
