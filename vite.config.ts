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
        grant: "none",
        version: "1.1.0",
        name: "ActivityRebuild",
        description: "ActivityRebuild",
      },
    }),
    tsconfigPaths(),
  ],
});
