# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


# Tests de Integración - Frontend

## Overview

Les tests d'intégration vérifient que les composants fonctionnent correctement avec le serveur (simulé avec MSW).

## Structure

- **`mocks/handlers.ts`**: Requêtes GraphQL simulées utilisant MSW
- **`helpers.tsx`**: Fonctions auxiliaires (`renderWithProviders`)
- **`*.integration.test.tsx`**: tests d'intégration des composants

## Rédiger un nouveau test d'intégration

### 1. Créer le fichier de test

```
tsx
// filepath: src/__tests__/integration/myFeature.integration.test.tsx
import { screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import MyComponent from "../../pages/myFeature/MyComponent";
import { renderWithProviders } from "./helpers";
import { myFeatureHandlers } from "./mocks/handlers";

const server = setupServer(...myFeatureHandlers);

describe("MyComponent (integration)", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "warn" });
  });

  afterAll(() => {
    server.close();
  });

  it("should render and fetch data", async () => {
    renderWithProviders(<MyComponent />);
    
    await waitFor(() => {
      expect(screen.getByText(/expected text/i)).toBeInTheDocument();
    });
  });
});
```

### 2. Ajouter les mocks dans `mocks/handlers.ts`

```typescript
// Ajouter dans handlers.ts
export const myFeatureHandlers = [
  http.post("/graphql", async ({ request }) => {
    const body = await request.json();
    const { operationName, query } = body as {
      operationName?: string;
      query?: string;
    };

    const isMyQuery =
      operationName === "GetMyData" || query?.includes("getMyData");

    if (isMyQuery) {
      return HttpResponse.json({
        data: {
          getMyData: {
            id: 1,
            title: "Test Data",
          },
        },
      });
    }

    return HttpResponse.json(
      { errors: [{ message: "Unhandled operation" }] },
      { status: 500 },
    );
  }),
];
```

### 3. Exécuter le test

```bash
npm test --myFeature.integration.test.tsx
```

## Tips & Tricks

- **Utiliser `renderWithProviders`**: Cela encapsule le composant avec tous les providers nécessaires
- **MSW doit être configuré avant le test**: `beforeAll(() => server.listen())`
- **Nettoyer l’état entre les tests** : beforeEach(() => localStorage.clear())
- **Utiliser waitFor pour les opérations asynchrones** : le composant peut prendre du temps à rendre les données

## Debugging

```bash
# Voir les logs detaillé
npm test -- --reporter=verbose

# Mode watch
npm test -- --watch

# Un seur test
npm test -- login.integration.test.tsx
```
