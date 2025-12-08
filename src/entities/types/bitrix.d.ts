interface AjaxBase {
  method?: string;
  dataType?: string;
  timeout?: number;
  async?: boolean;
  processData?: boolean;
  scriptsRunFirst?: boolean;
  emulateOnload?: boolean;
  skipAuthCheck?: boolean;
  start?: boolean;
  cache?: boolean;
  preparePost?: boolean;
  headers?: Array<{ name: string; value: string }> | boolean;
  lsTimeout?: number;
  lsForce?: boolean;
  url: string;
  data?: object;
  onsuccess?: (result: any) => void;
  onfailure?: (result: any) => void;
  onprogress?: (result: any) => void;
}

interface CrmActivityEditor {
  initialize: (id: string, settings: any, items: any) => string;
  _settings?: any;
  [key: string]: any;
  items: Record<string, any>;
}

declare global {
  interface Window {
    BX: {
      CrmActivityEditor: CrmActivityEditor;
      Main: {
        Filter: {
          prototype: {
            init: () => void;
          };
        };
      };
      ajax: {
        // Основной метод
        (options: AjaxBase): boolean;

        // Дополнительные методы в ajax
        insertToNode: (url: string, node?: string) => void;
      };
      Filter: {
        Search: {
          prototype: {
          _onSearchClick: () => void;
          reset: () => void;
          };
        };
      };
      bitrix_sessid: () => string;
      message: (key: string) => string;

      CrmActivityEditor: {
        prototype: CrmActivityEditor;
        new (): CrmActivityEditor;

        create: (id: string, settings: any, items: any) => CrmActivityEditor;
        items: Record<string, CrmActivityEditor>;
        _default?: CrmActivityEditor;
        __patchedHays?: boolean;
      };
    };
  }
}

export {};
