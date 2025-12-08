import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "../pages/main/page";
import { Provider } from "./provider";
import { LightMode } from "@/shared/ui/color-mode";
import { ClientOnly } from "@chakra-ui/react";

if (document.getElementById("ActivityRebuild")) {
  throw new Error("ActivityRebuild already mounted");
}

const app = document.createElement("div");
app.id = "ActivityRebuild";
document.body.append(app);

const root = ReactDOM.createRoot(app);

function destroyApp() {
  window.removeEventListener("keydown", onKeyDown);
  root.unmount();
  app.remove();
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    destroyApp();
  }
}

window.addEventListener("keydown", onKeyDown);

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
