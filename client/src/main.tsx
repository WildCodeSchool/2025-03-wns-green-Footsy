import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

import App from "./App";

import AdminRoute from "./components/protectedRoutes/AdminRoute";
import GuestRoute from "./components/protectedRoutes/GuestRoute";
import ProtectedRoutes from "./components/protectedRoutes/ProtectedRoutes";
import ModeProvider from "./context/modeContext";
import UserProvider from "./context/userContext";
import { getToken } from "./services/authService";

import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/dashboard/Dashboard";
import History from "./pages/history/History";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";
import TestCharte from "./pages/testsCharte/TestsCharte";

import "./reset.css";
import "./index.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Public routes (only accessible when NOT logged in)
      {
        element: <GuestRoute />,
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
        ],
      },

      // Public information routes (accessible to all)
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

      // Protected Routes (require authentication)
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

      // Admin Routes (require admin privileges)
      {
        element: <AdminRoute />,
        children: [{ path: "admin", element: <Admin /> }],
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

const graphqlUri = import.meta.env.VITE_URL_GRAPHQL || "/graphql";

const httpLink = new HttpLink({
  uri: graphqlUri,
  fetchOptions: {
    mode: "cors",
  },
  headers: {
    Accept: "application/json",
  },
});

const authLink = new SetContextLink((prevContext) => {
  const token = getToken();
  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = ApolloLink.from([authLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

createRoot(rootElement).render(
  <StrictMode>
    <ModeProvider>
      <ApolloProvider client={client}>
        <UserProvider>
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
        </UserProvider>
      </ApolloProvider>
    </ModeProvider>
  </StrictMode>
);
