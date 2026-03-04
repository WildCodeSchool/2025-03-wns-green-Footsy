# Scripts E2E Docker - Documentation Détaillée

## Configuration de test

### Fichiers utilisés
- **`compose.dev.yaml`** : Configuration Docker pour le développement (services, volumes, healthchecks)
- **`compose.e2e.yaml`** : Configuration Docker complète et isolée pour les tests E2E (ports différents : 3001, 5051, 5434)
- **`.env.test`** : Variables d'environnement spécifiques aux tests

### Pourquoi deux fichiers séparés ?
- ✅ **Isolation complète** : Dev et tests peuvent tourner en parallèle sans conflit
- ✅ **Ports différents** : 
  - Dev : frontend=8080, backend=5050, db=5432
  - E2E : frontend=3001, backend=5051, db=5434
- ✅ **DB séparée** : Les tests n'utilisent pas le volume de dev (données éphémères)
- ✅ **Pas de merge complexe** : Évite les problèmes de fusion de configuration Docker Compose
- ⚠️ **Note** : Avec `synchronize: true` dans TypeORM, les tables sont recréées à chaque démarrage du backend

---

## `test:create-db`
**Objectif** : Créer la base `db_footsy_test` uniquement si elle n'existe pas déjà.

**Détail de chaque partie** :

1. `docker compose -p footsy-test -f compose.e2e.yaml exec -T database`
   - Execute une commande dans le conteneur `database` du projet `footsy-test`
   - `-p footsy-test` : nom du projet Docker (permet d'isoler des autres instances)
   - `-T` : désactive l'allocation de pseudo-TTY (nécessaire pour les pipes dans les scripts)
   - `-f compose.e2e.yaml` : utilise le fichier de configuration E2E

2. `bash -c "..."`
   - Lance un shell bash avec la commande entre guillemets
   - Permet d'exécuter plusieurs commandes avec des pipes et de la logique conditionnelle

3. `psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='db_footsy_test'"`
   - `psql` : client PostgreSQL en ligne de commande
   - `-U postgres` : se connecte avec l'utilisateur `postgres`
   - `-t` : affiche uniquement les tuples (lignes de résultats), sans en-tête ni footer
   - `-A` : mode non-aligné (pas d'espaces ou de formatage)
   - `-c` : exécute la commande SQL fournie
   - `SELECT 1 FROM pg_database WHERE datname='db_footsy_test'` : requête qui retourne `1` si la base existe

4. `| grep -q 1`
   - `|` : pipe qui envoie la sortie de psql vers grep
   - `grep -q 1` : cherche silencieusement le chiffre `1` dans la sortie
   - `-q` : mode silencieux, ne produit aucune sortie, retourne juste un code de sortie (0 si trouvé, 1 sinon)

5. `|| psql -U postgres -c "CREATE DATABASE db_footsy_test"`
   - `||` : opérateur logique OR - s'exécute SEULEMENT si la commande précédente échoue (code de sortie ≠ 0)
   - Si grep ne trouve pas `1` (base inexistante), alors on crée la base
   - `CREATE DATABASE db_footsy_test` : commande SQL de création de base de données

**Flux logique** :
- ✅ Si la base existe → `SELECT` retourne 1 → grep trouve 1 (exit 0) → on s'arrête là
- ❌ Si la base n'existe pas → `SELECT` ne retourne rien → grep ne trouve pas 1 (exit 1) → on exécute le CREATE

---

## `test:e2e`
**Objectif** : Pipeline complet pour lancer tous les tests E2E dans un environnement Docker isolé.

**Commande** :
```bash
docker compose -p footsy-test -f compose.e2e.yaml up -d && 
npm run test:create-db && 
npm run test:seeder && 
npx wait-on tcp:5051 http://localhost:3001 && 
set "E2E_GRAPHQL_URL=http://localhost:5051" && 
npx playwright test __tests__ --reporter=html && 
docker compose -p footsy-test -f compose.e2e.yaml down
```

**Détail étape par étape** :

### 1. `docker compose -p footsy-test -f compose.e2e.yaml up -d`
   - `docker compose` : outil d'orchestration multi-conteneurs
   - `-p footsy-test` : nom du projet (permet d'isoler de l'environnement dev)
   - `-f compose.e2e.yaml` : fichier de configuration pour les tests E2E
   - `up` : crée et démarre les conteneurs
   - `-d` : mode détaché (détached), les conteneurs tournent en arrière-plan
   - **Résultat** : Démarre 3 services sur des ports dédiés : `database` (5434), `backend` (5051), `frontend` (3001)

### 2. `npm run test:create-db`
   - Exécute le script `test:create-db` (voir section ci-dessus)
   - **Résultat** : S'assure que la base `db_footsy_test` existe pour les tests

### 3. `npm run test:seeder`
   - Exécute : `docker compose -p footsy-test -f compose.e2e.yaml exec backend npm run seed`
   - Entre dans le conteneur `backend` et lance les seeders TypeORM
   - **Résultat** : Insère les données de test dans la base (utilisateurs, avatars, activités, etc.)

### 4. `npx wait-on tcp:5051 http://localhost:3001`
   - `npx` : exécute le package npm `wait-on` sans installation globale
   - `wait-on` : utilitaire qui attend que des ressources soient disponibles
   - `tcp:5051` : attend que le port TCP 5051 soit ouvert (backend GraphQL E2E)
   - `http://localhost:3001` : attend que l'URL HTTP réponde avec un code 200 (frontend E2E)
   - **Résultat** : Le script se met en pause jusqu'à ce que backend ET frontend soient prêts
   - Évite les erreurs de connexion si les tests démarrent trop tôt

### 5. `set "E2E_GRAPHQL_URL=http://localhost:5051"`
   - `set` : commande Windows pour définir une variable d'environnement dans le processus courant
   - `E2E_GRAPHQL_URL` : variable utilisée par les tests Playwright pour savoir où contacter l'API
   - `http://localhost:5051` : URL du backend GraphQL E2E
   - **Note** : Sur Linux/Mac, on utiliserait `export E2E_GRAPHQL_URL=...`
   - **Résultat** : Les tests Playwright peuvent maintenant interroger l'API GraphQL

### 6. `npx playwright test __tests__ --reporter=html`
   - `playwright test` : lance l'exécuteur de tests Playwright
   - `__tests__` : répertoire contenant les fichiers de tests E2E (`.spec.ts`)
   - `--reporter=html` : génère un rapport HTML interactif des résultats de tests
   - **Résultat** : Exécute tous les tests E2E dans les navigateurs configurés
   - Le rapport est généré dans `playwright-report/index.html`

### 7. `docker compose -p footsy-test -f compose.e2e.yaml down`
   - `down` : arrête et supprime les conteneurs, réseaux créés par `up`
   - `-p footsy-test` : spécifie le projet à arrêter
   - **Résultat** : Nettoie complètement l'environnement Docker E2E
   - **Important** : La DB de test n'a pas de volume, les données sont détruites automatiquement

**Note importante** : Toutes les commandes sont chaînées avec `&&`, ce qui signifie :
- Si une étape échoue (code de sortie ≠ 0), les suivantes ne s'exécutent pas
- Le `docker compose down` final ne s'exécute que si tous les tests passent
- En cas d'échec, les conteneurs restent actifs pour debugging

---

## Conventions Windows
La variable d'environnement est définie avec `set "VAR=..."` car les scripts npm sont exécutés dans un contexte Windows (cmd.exe).

**Sur Linux/Mac**, il faudrait modifier :
```bash
set "E2E_GRAPHQL_URL=http://localhost:5050"
# devient
export E2E_GRAPHQL_URL=http://localhost:5050
```