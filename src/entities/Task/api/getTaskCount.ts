const getTaskCount = async (): Promise<number> => {
  const urlBase = "/bitrix/components/bitrix/crm.activity.list/list.ajax.php";
  const siteID = window.BX.message("SITE_ID");
  const sessionId = window.BX.bitrix_sessid();
  const fullUrl = `${urlBase}?siteID=${siteID}&sessid=${sessionId}`;

  const result = new Promise<number>((resolve, reject) => {
    window.BX.ajax({
      url: fullUrl,
      method: "POST",
      dataType: "json",
      data: {
        ACTION: "GET_ROW_COUNT",
        PARAMS: { GRID_ID: "CRM_ACTIVITY_LIST_MY_ACTIVITIES" },
      },
      onsuccess: (result:{DATA:{ TEXT: string }}) => {
        // DATA: Object { TEXT: "Всего: 2" }
        resolve(result.DATA.TEXT.match(/\d+/) ? parseInt(result.DATA.TEXT.match(/\d+/)![0], 10) : 0);
      },
      onfailure: (result) => {
        reject(result)
      },
    });
  });

  return result;
};

export default getTaskCount;
