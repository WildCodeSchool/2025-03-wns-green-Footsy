# Tests de Integration - Backend

## Overview

Les tests d'intégration vérifient que les resolvers GraphQL fonctionnent correctement avec la base de données.

## Structure

```
src/__tests__/
├── integration/
│   ├── user.test.ts
│   └── activity.test.ts
└── unit/
    └── resolver.test.ts
```

## Créer BDD de test

Démarrer Postgres depuis la racine du dépôt :

``` docker compose -f compose.dev.yaml up -d database ```


Cela démarre le conteneur Postgres avec la base de données de développement (par exemple db_footsy depuis le .env.test). La base de données de test sera créée dans le même conteneur.

### Créer la base de données de test

Crée la base de données db_footsy_test dans le même conteneur. Depuis la racine du dépôt, en utilisant le même utilisateur que dans .env (voir .env.test.sample )

``` docker compose -f compose.dev.yaml exec database psql -U postgres -d postgres -c "CREATE DATABASE db_footsy_test;" ```

## Ecrire un test de integration

### 1. Setup du test

```typescript
// filepath: src/__tests__/integration/myFeature.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { executeOperation } from "@apollo/server/testing";
import { server } from "../../server";

describe("MyResolver (integration)", () => {
  beforeAll(async () => {
    // Setup: connexion à la base de données de test
  });

  afterAll(async () => {
    // Cleanup BDD
  });

  it("should execute mutation successfully", async () => {
    const result = await executeOperation(server, {
      query: `mutation MyMutation { myMutation { id } }`,
      variables: {},
      contextValue: { 
        res: { setHeader: () => {} } 
      },
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.data).toBeDefined();
    }
  });
});
```

### 2. Mock du contexte

Pour les opérations qui nécessitent `res` (cookies):

```typescript
const mockRes = {
  setHeader: (name: string, value: string) => {
    // Mock implementation
  },
};

const contextValue = { res: mockRes };
```

### 3. Ejecutar tests

```bash
npm test                          # Touts
npm test -- user.test.ts          # Un fichier
npm test -- --reporter=verbose    # Avec logs
```

## Tips

- **Cookie HttpOnly** : Passer `res` dans le contexte pour tester les cookies
- **Utiliser une base de données séparée** : docker compose -f compose.dev.yaml exec database psql -U postgres -d postgres -c "CREATE DATABASE db_footsy_test;"
- **Nettoyage** : Nettoyer les données entre les tests pour éviter les interférences