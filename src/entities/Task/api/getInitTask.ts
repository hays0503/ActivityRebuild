import { TaskType } from "../model/Task";


const getInitTasks = (): Promise<TaskType[]> => {
    return new Promise((resolve, reject) => {
        const BX = window.BX;
        if (!BX?.CrmActivityEditor) {
            reject("BX.CrmActivityEditor is not available");
            return;
        }

        if ((BX.CrmActivityEditor as any).__subscribed) {
            const existingItems = BX.CrmActivityEditor.items;
            const tasksArray: TaskType[] = Object.values(existingItems).flatMap((editor: any) =>
                editor._items.map((item: any) => item["_settings"] as TaskType)
            );
            resolve(tasksArray);
            return;
        }
    });
};

export default getInitTasks;