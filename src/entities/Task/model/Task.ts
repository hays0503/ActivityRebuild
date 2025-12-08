// Тип задачи
// описывает предстаящую или уже совершенную задачу пользователя

export enum TypeTask {
  "Встреча",
  "Звонок (входящий)",
  "Звонок (исходящий)",
  "Задача",
  "Письмо (полученное)",
  "Письмо (отправленное)",
  "Дело",
  "Обратный звонок",
  "Обзвон",
  "СМС-сообщение",
  "Сообщение (ЕЦУ)",
  "Входящий чат",
  "Исходящий чат",
  "CRM-форма",
  "Задание",
  "Дело приложения (старая версия)",
  "Дело приложения",
  "Сообщение в WhatsApp",
  "Визит"
}

export type TaskCountByType = Record<TypeTask, number>;

export type TaskType = {
  "ID": string,// "973175",
  "typeID":string, //"6",
  "providerID":string, //"CRM_TODO",
  "subject": string,// "Связаться с клиентом",
  "description": string,// "Позвонить и обсудить детали заказа",
  "descriptionBBCode":string,// "",
  "descriptionHtml": string,// "",
  "direction": string,//""
  "location": string,// "",
  "start": string,//"01.12.2025 11:00:00",
  "end": string,//"01.12.2025 11:00:00",
  "deadline": string,//"01.12.2025 11:00:00",
  "completed": boolean//false,
  "notifyType": string,//"0",
  "notifyValue": string,//"0",
  "priority": string,//"1",
  "responsibleID": string,//"1179",
  "responsibleName": string,//"Красноженов Сергей Александрович",
  "responsibleUrl": string,//"/company/personal/user/1179/",
  "storageTypeID": string,//"0",
  "files": Array<any> //[],
  "webdavelements": Array<any>,// [],
  "diskfiles": Array<any>,// [],
  "associatedEntityID": string,//"0",
  "customViewLink": string,// "",
  "communicationsLoaded": boolean,// false,
  "ownerType": string,//"lead",
  "ownerID": string,// "132965",
  "ownerTitle": string,// "Иванов Иван Иванович",
  "ownerUrl": string,// "/crm/lead/details/132965/",
  "enableUI": boolean// false
}
