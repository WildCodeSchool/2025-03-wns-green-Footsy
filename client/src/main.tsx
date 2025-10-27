import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";

import ModeProvider from "./context/modeContext";

import SignUp from "./pages/signUp/SignUp";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import TestCharte from "./pages/testsCharte/TestsCharte";
import Home from "./pages/home/Home";

import "./reset.css";
import "./index.css";
import { HttpLink } from "@apollo/client";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
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

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_URL_GRAPHQL || "http://localhost:5050/",
  }),
  cache: new InMemoryCache(),
});

createRoot(rootElement).render(
  <StrictMode>
    <ModeProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          limit={5}
          closeOnClick
          pauseOnHover
          theme="colored"
          transition={Flip}
        />
      </ApolloProvider>
    </ModeProvider>
  </StrictMode>
);
