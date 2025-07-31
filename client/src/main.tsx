import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { StrictMode } from "react";

import App from "./App";

import "./index.css";
import TestCharte from "./pages/testsCharte/TestsCharte";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <h1>Welcome to the Home Page</h1>,
      },
      {
        path: "/charte",
        element: <TestCharte />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
