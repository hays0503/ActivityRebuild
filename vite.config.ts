import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              logger: {
                logEvent(
                  filename: any,
                  event: {
                    kind: string;
                    detail: {
                      reason: any;
                      description: any;
                      loc: { start: { line: any; column: any } };
                      suggestions: any;
                    };
                  }
                ) {
                  switch (event.kind) {
                    case "CompileSuccess": {
                      console.log(`✅ Compiled: ${filename}`);
                      break;
                    }
                    case "CompileError": {
                      console.log(`❌ Skipped: ${filename}`);
                      break;
                    }
                    default: {
                    }
                  }
                  if (event.kind === "CompileError") {
                    console.error(`\nCompilation failed: ${filename}`);
                    console.error(`Reason: ${event.detail.reason}`);

                    if (event.detail.description) {
                      console.error(`Details: ${event.detail.description}`);
                    }

                    if (event.detail.loc) {
                      const { line, column } = event.detail.loc.start;
                      console.error(`Location: Line ${line}, Column ${column}`);
                    }

                    if (event.detail.suggestions) {
                      console.error("Suggestions:", event.detail.suggestions);
                    }
                  }
                },
              },
            },
          ],
        ],
      },
    }),
    monkey({
      entry: "src/app/main.tsx",
      userscript: {
        icon: "https://vitejs.dev/logo.svg",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://bitrix.triline.kz/crm/activity/*"],
        grant: [
          "GM.addElement",
          "GM.addStyle",
          "GM.addValueChangeListener",
          "GM.audio",
          "GM.cookie",
          "GM.deleteValue",
          "GM.deleteValues",
          "GM.download",
          "GM.getResourceText",
          "GM.getResourceUrl",
          "GM.getTab",
          "GM.getTabs",
          "GM.getValue",
          "GM.getValues",
          "GM.info",
          "GM.listValues",
          "GM.log",
          "GM.notification",
          "GM.openInTab",
          "GM.registerMenuCommand",
          "GM.removeValueChangeListener",
          "GM.saveTab",
          "GM.setClipboard",
          "GM.setValue",
          "GM.setValues",
          "GM.unregisterMenuCommand",
          "GM.webRequest",
          "GM.xmlHttpRequest",
          "GM_addElement",
          "GM_addStyle",
          "GM_addValueChangeListener",
          "GM_audio",
          "GM_cookie",
          "GM_deleteValue",
          "GM_deleteValues",
          "GM_download",
          "GM_getResourceText",
          "GM_getResourceURL",
          "GM_getTab",
          "GM_getTabs",
          "GM_getValue",
          "GM_getValues",
          "GM_info",
          "GM_listValues",
          "GM_log",
          "GM_notification",
          "GM_openInTab",
          "GM_registerMenuCommand",
          "GM_removeValueChangeListener",
          "GM_saveTab",
          "GM_setClipboard",
          "GM_setValue",
          "GM_setValues",
          "GM_unregisterMenuCommand",
          "GM_webRequest",
          "GM_xmlhttpRequest",
          "unsafeWindow",
          "window.close",
          "window.focus",
          "window.onurlchange",
        ],
      },
    }),
    tsconfigPaths(),
  ],
});
