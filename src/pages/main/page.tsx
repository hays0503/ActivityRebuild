import useGetTaskList from "@/shared/hooks/useGetTaskList";
import { SubscribeBitrixUI } from "@/shared/hooks/useSubscribeBitrixUI";
import CalendarGrid from "@/widgets/CalendarGrid/ui/CalendarGrid";
import { useEffect } from "react";

function MainPage() {
  const [deals] = useGetTaskList();

  useEffect(() => {
    const BX = window.BX;
    if (!BX?.CrmActivityEditor) return;

    if ((BX.CrmActivityEditor as any).__SubscribeBitrixUIMainUiFilterFind) return;
    (BX.CrmActivityEditor as any).__SubscribeBitrixUIMainUiFilterFind = true;

    const unsubscribe = SubscribeBitrixUI(
      ["main-ui-filter-find", "ui-btn-primary"],
      (btn: HTMLElement, event: MouseEvent) => {
        window.location.reload();
      }
    );

    return () => unsubscribe();
  }, []);


  return <CalendarGrid deals={deals} />;
}

export default MainPage;
