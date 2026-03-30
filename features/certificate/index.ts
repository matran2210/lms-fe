import { AppModule } from "@lms/core";
import { ExtensionRegistry } from "@lms/ui";
import CertificateDetail from "./src/pages/detail";
import { Certificate } from "./src/components";
import { certificateRoutes } from "./routes";

ExtensionRegistry.register("CERTIFICATE_DETAIL_PAGE", CertificateDetail);
ExtensionRegistry.register("CERTIFICATE_PROFILE_TAB", Certificate);

export const certificateModule: AppModule = {
  name: "certificate",
  routes: certificateRoutes,
};
