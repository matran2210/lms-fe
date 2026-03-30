import { CERTIFICATE_ROUTES } from "./constants/routes";
import CertificateDetail from "./pages/detail";

export const certificateRoutes = [
  {
    path: CERTIFICATE_ROUTES.CERTIFICATE_DETAIL,
    element: <CertificateDetail />
  }
]
