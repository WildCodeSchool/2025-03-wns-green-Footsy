import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { StrictMode } from "react";

import App from "./App";
import TestCharte from "./pages/testsCharte/TestsCharte";

import "./index.css";

import ModeProvider from "./context/modeContext";
import SignUp from "./pages/signUp/SignUp";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <h1>Welcome to the Home Page</h1>,
      },
      {
        path: "signup",
        element: <SignUp />,
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
    <ModeProvider>
      <RouterProvider router={router} />
    </ModeProvider>
  </StrictMode>
);
