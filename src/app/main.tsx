import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "../pages/main/page";
import { Provider } from "./provider";
import { LightMode } from "@/shared/ui/color-mode";
import { ClientOnly } from "@chakra-ui/react";

const app = document.createElement("div");
app.id = "ActivityRebuild";
document.body.append(app);

const root = ReactDOM.createRoot(app);

// Закрываем приложение корректно
function destroyApp() {
  root.unmount();
  app.remove();
}

addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    destroyApp();
  }
});

root.render(
  <React.StrictMode>
    <Provider>
      <ClientOnly fallback={<div>Loading...</div>}>
        <LightMode>
          <MainPage />
        </LightMode>
      </ClientOnly>
    </Provider>
  </React.StrictMode>
);
