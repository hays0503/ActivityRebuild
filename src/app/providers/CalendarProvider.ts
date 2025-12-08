import { createContext } from "react";

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const nav = useCalendarNavigator();
  const anim = useCalendarAnimation(nav);
  const controls = useCalendarControls(nav);
  const expand = useExpandedDay();

  return (
    <CalendarContext.Provider value={{ nav, anim, controls, expand }}>
      {children}
    </CalendarContext.Provider>
  );
}
