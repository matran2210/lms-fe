import { TEST_ROUTES } from "./constants/routes";
import EntranceTestPage from "./pages/entrance-test";
import EntranceTestResultPage from "./pages/entrance-test/test-result/[id]";
import TableEntranceResult from "./pages/entrance-test/table-result/[id]";
import EventTestPage from "./pages/event-test";

export const testRoutes = [
  {
    path: TEST_ROUTES.ENTRANCE_TEST,
    element: <EntranceTestPage />
  },
  {
    path: TEST_ROUTES.ENTRANCE_TEST_RESULT,
    element: <EntranceTestResultPage />
  },
  {
    path: TEST_ROUTES.ENTRANCE_TEST_TABLE_RESULT,
    element: <TableEntranceResult />
  },
  {
    path: TEST_ROUTES.EVENT_TEST,
    element: <EventTestPage />
  }
]
