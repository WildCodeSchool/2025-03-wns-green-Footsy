import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ModeProvider from "../../context/modeContext";

// Custom fetch: omit signal to avoid Node/undici "AbortSignal not an instance" error with Apollo
const testFetch: typeof fetch = (input, init) => {
  const { signal: _signal, ...rest } = init ?? {};
  return globalThis.fetch(input, rest);
};

// Apollo Client pointing to /graphql so MSW can intercept
const testClient = new ApolloClient({
  link: new HttpLink({
    uri: "/graphql",
    fetch: testFetch,
  }),
  cache: new InMemoryCache(),
});

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={["/login"]}>
      <ApolloProvider client={testClient}>
        <ModeProvider>
          {children}
          <ToastContainer position="bottom-right" />
        </ModeProvider>
      </ApolloProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: AllProviders,
    ...options,
  });
}
