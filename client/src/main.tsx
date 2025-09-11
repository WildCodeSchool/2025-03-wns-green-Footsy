import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";

import ModeProvider from "./context/modeContext";

import SignUp from "./pages/auth/signUp/SignUp";
import TestCharte from "./pages/testsCharte/TestsCharte";

import "./reset.css";
import "./index.css";

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
        path: "login",
        element: <h1>Login Page - To be implemented</h1>,
      },
      {
        path: "credits",
        element: <h1>Credits Page - To be implemented</h1>,
      },
      {
        path: "CGU",
        element: <h1>CGU Page - To be implemented</h1>,
      },
      {
        path: "charte",
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
