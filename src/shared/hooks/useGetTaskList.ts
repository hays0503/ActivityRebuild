import getInitTasks from "@/entities/Task/api/getInitTask";
import getTaskCount from "@/entities/Task/api/getTaskCount";
import LoadPages from "@/entities/Task/api/loadPage";
import { TaskType } from "@/entities/Task/model/Task";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import SubscribeBitrixFunc from "./useSubscribeBitrixFunc";

const useGetTaskList = (): [
  Map<string, TaskType>,
  Dispatch<SetStateAction<Map<string, TaskType>>>
] => {
  const [deals, setDeals] = useState<Map<string, TaskType>>(new Map());

  useEffect(() => {
    console.log("useGetTaskList - start");
    const BX = window.BX;
    if (!BX?.CrmActivityEditor) return;

    if ((BX.CrmActivityEditor as any).__subscribed) return;
    (BX.CrmActivityEditor as any).__subscribed = true;

    getInitTasks().then((tasks) => {
      const newDeals = new Map<string, TaskType>(
        tasks.map((task) => [task.ID, task])
      );
      setDeals(newDeals);
    });

    getTaskCount().then((count) => {
      if (count > 100) {
        const pages = Math.ceil(count / 100);
        console.log("Pages:", pages);
        LoadPages(pages);
        return;
      }
    });

    SubscribeBitrixFunc(
      BX.CrmActivityEditor,
      "create",
      function (
        originalResult: any,
        id: string,
        settings: any,
        items: TaskType[]
      ) {
        setDeals((prevDeals) => {
          const newDeals = new Map<string, TaskType>(prevDeals);
          items.forEach((item: TaskType) => {
            newDeals.set(item.ID, item);
          });
          return newDeals;
        });
        return originalResult;
      }
    );
  }, []);

  return [deals, setDeals];
};

export default useGetTaskList;
