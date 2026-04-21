import { AppModule } from "@lms/core";
import { ExtensionRegistry } from "@lms/ui";
import CertificateDetail from "./pages/detail";
import { Certificate } from "./components";
import { certificateRoutes } from "./routes";

ExtensionRegistry.register("CERTIFICATE_DETAIL_PAGE", CertificateDetail);
ExtensionRegistry.register("CERTIFICATE_PROFILE_TAB", Certificate);

export const certificateModule: AppModule = {
  name: "certificate",
  routes: certificateRoutes,
};
