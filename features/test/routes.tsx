import { TEST_ROUTES } from "./src/constants/routes";
import EntranceTestPage from "./src/pages/entrance-test/page";
import EntranceTestResultPage from "./src/pages/entrance-test/page";
import TableEntranceResult from "./src/pages/entrance-test/table-result/[id]/page";
import EventTestPage from "./src/pages/event-test/page";

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
