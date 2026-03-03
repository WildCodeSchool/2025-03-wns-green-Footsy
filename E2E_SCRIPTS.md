# Scripts E2E Docker - Documentation Détaillée

## Configuration de test

### Fichiers utilisés
- **`compose.dev.yaml`** : Configuration Docker de base (services, volumes, healthchecks)
- **`compose.test.yaml`** : Override pour les tests - change `DB_DATABASE` vers `db_footsy_test` et utilise `.env.test`
- **`.env.test`** : Variables d'environnement spécifiques aux tests

Docker Compose supporte la composition de fichiers avec `-f` multiples. Les fichiers sont fusionnés dans l'ordre, le dernier override les précédents.

### Pourquoi cette approche ?
- ✅ `compose.dev.yaml` reste intact pour le développement normal
- ✅ `compose.test.yaml` override uniquement ce qui change pour les tests (base de données test)
- ✅ Pas de duplication de configuration
- ✅ Isolation des environnements dev et test
- ⚠️ Note : Actuellement `synchronize: true` dans TypeORM, donc les tables sont recréées à chaque démarrage du backend

---

## `test:create-db`
**Objectif** : Créer la base `db_footsy_test` uniquement si elle n'existe pas déjà.

**Détail de chaque partie** :

1. `docker compose -f compose.dev.yaml exec -T database`
   - Execute une commande dans le conteneur `database`
   - `-T` : désactive l'allocation de pseudo-TTY (nécessaire pour les pipes dans les scripts)
   - `-f compose.dev.yaml` : utilise le fichier de configuration Docker Compose de développement

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

## `test:e2e:docker`
**Objectif** : Pipeline complet pour lancer tous les tests E2E dans un environnement Docker isolé.

**Commande** :
```bash
docker compose -f compose.dev.yaml -f compose.test.yaml up -d && 
npm run test:create-db && 
npm run test:seeder && 
npx wait-on tcp:5050 http://localhost:8080 && 
set "E2E_GRAPHQL_URL=http://localhost:5050" && 
npx playwright test __tests__ --reporter=html && 
docker compose -f compose.dev.yaml -f compose.test.yaml down
```

**Détail étape par étape** :

### 1. `docker compose -f compose.dev.yaml -f compose.test.yaml up -d`
   - `docker compose` : outil d'orchestration multi-conteneurs
   - `-f compose.dev.yaml` : fichier de configuration de base
   - `-f compose.test.yaml` : fichier qui override les variables pour les tests (DB_DATABASE=db_footsy_test, utilise .env.test)
   - `up` : crée et démarre les conteneurs
   - `-d` : mode détaché (détached), les conteneurs tournent en arrière-plan
   - **Résultat** : Démarre 3 services : `database` (PostgreSQL), `backend` (GraphQL API connecté à db_footsy_test), `frontend` (React/Vite)

### 2. `npm run test:create-db`
   - Exécute le script `test:create-db` (voir section ci-dessus)
   - **Résultat** : S'assure que la base `db_footsy_test` existe pour les tests
   - Conserve les données si elles existent déjà

### 3. `npm run test:seeder`
   - Exécute : `docker compose -f compose.dev.yaml -f compose.test.yaml exec backend npm run seed`
   - Entre dans le conteneur `backend` et lance les seeders TypeORM
   - **Résultat** : Insère les données de test dans la base (utilisateurs, avatars, activités, etc.)

### 4. `npx wait-on tcp:5050 http://localhost:8080`
   - `npx` : exécute le package npm `wait-on` sans installation globale
   - `wait-on` : utilitaire qui attend que des ressources soient disponibles
   - `tcp:5050` : attend que le port TCP 5050 soit ouvert (backend GraphQL)
   - `http://localhost:8080` : attend que l'URL HTTP réponde avec un code 200 (frontend Vite)
   - **Résultat** : Le script se met en pause jusqu'à ce que backend ET frontend soient prêts
   - Évite les erreurs de connexion si les tests démarrent trop tôt

### 5. `set "E2E_GRAPHQL_URL=http://localhost:5050"`
   - `set` : commande Windows pour définir une variable d'environnement dans le processus courant
   - `E2E_GRAPHQL_URL` : variable utilisée par les tests Playwright pour savoir où contacter l'API
   - `http://localhost:5050` : URL du backend GraphQL dans Docker
   - **Note** : Sur Linux/Mac, on utiliserait `export E2E_GRAPHQL_URL=...`
   - **Résultat** : Les tests Playwright peuvent maintenant interroger l'API GraphQL

### 6. `npx playwright test __tests__ --reporter=html`
   - `playwright test` : lance l'exécuteur de tests Playwright
   - `__tests__` : répertoire contenant les fichiers de tests E2E (`.spec.ts`)
   - `--reporter=html` : génère un rapport HTML interactif des résultats de tests
   - **Résultat** : Exécute tous les tests E2E dans les navigateurs configurés
   - Le rapport est généré dans `playwright-report/index.html`

### 7. `docker compose -f compose.dev.yaml -f compose.test.yaml down`
   - `down` : arrête et supprime les conteneurs, réseaux créés par `up`
   - **Important** : On doit spécifier les mêmes fichiers `-f` que pour `up` pour arrêter correctement
   - **Résultat** : Nettoie l'environnement Docker
   - **Note** : Les volumes (dont la base de données) sont conservés, mais avec `synchronize: true` les tables sont recréées au prochain démarrage du backend

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