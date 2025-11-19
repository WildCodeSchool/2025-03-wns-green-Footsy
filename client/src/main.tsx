import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

import App from "./App";

import ModeProvider from "./context/modeContext";

import Dashboard from "./pages/dashboard/Dashboard";
import History from "./pages/history/History";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";
import TestCharte from "./pages/testsCharte/TestsCharte";

import "./reset.css";
import "./index.css";
import ProtectedRoutes from "./components/protectedRoutes/ProtectedRoutes";

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
        path: "information",
        element: <h1>Informations Page - To be implemented</h1>,
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

      // Protected Routes
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "history", element: <History /> },
          {
            path: "add-activity",
            element: <h1>Activity Page - To be implemented</h1>,
          },
          {
            path: "community",
            element: <h1>Community Page - To be implemented</h1>,
          },
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

const graphqlUri = import.meta.env.VITE_URL_GRAPHQL || "/graphql";

const client = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUri,
    fetchOptions: {
      mode: "cors",
    },
    headers: {
      Accept: "application/json",
    },
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
