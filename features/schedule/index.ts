import { AppModule } from "@lms/core";
import { scheduleRoutes } from "./routes";
import { ExtensionRegistry } from "@lms/ui";
import CalendarPage from "./src/pages";

ExtensionRegistry.register("CALENDAR_PAGE", CalendarPage);
export const scheduleModule: AppModule = {
  name: "schedule",
  routes: scheduleRoutes,
};
