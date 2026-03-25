import { AppModule } from "@lms/core";
import { calendarRoutes } from "./routes";
import { ExtensionRegistry } from "@lms/ui";
import CalendarPage from "./src/pages";

ExtensionRegistry.register("CALENDAR_PAGE", CalendarPage);
export const calendarModule: AppModule = {
  name: "calendar",
  routes: calendarRoutes,
};
