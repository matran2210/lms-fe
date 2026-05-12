import { AppModule } from "@lms/core";
import { ExtensionRegistry } from "@lms/ui";
import { testRoutes } from "./routes";
import EntranceTestPage from "./pages/entrance-test";
import EntranceTestResultPage from "./pages/entrance-test/test-result/[id]";
import TableEntranceResult from "./pages/entrance-test/table-result/[id]";
import EventTestPage from "./pages/event-test";

ExtensionRegistry.register("ENTRANCE_TEST_PAGE", EntranceTestPage);
ExtensionRegistry.register("ENTRANCE_TEST_RESULT_PAGE", EntranceTestResultPage);
ExtensionRegistry.register("ENTRANCE_TABLE_RESULT_PAGE", TableEntranceResult);
ExtensionRegistry.register("EVENT_TEST_PAGE", EventTestPage);

export const testModule: AppModule = {
  name: "test",
  routes: testRoutes,
};
export * from "./utils";
export * from "./hooks";
export * from './components'