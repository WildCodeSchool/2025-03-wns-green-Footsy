# Footsy 🌱
Équipe : Claire Cellier, Veronica Cussi, Antoine Foubert, Aude Nectoux

------

## Table des matières
Présentation
Structure du monorepo
Prérequis
Installation
Commandes utiles
Architecture & Stack Technique
Workflow Git
Contribuer
Licence

-----

## Présentation
Footsy est une application web responsive et mobile-first pour suivre et analyser son empreinte carbone individuelle. Organisé en monorepo, le projet regroupe frontend, backend et infrastructure pour faciliter le développement et la maintenance.

## Structure du monorepo
/ (racine)
├── apps/
│   ├── frontend/      # React + Vite + TypeScript
│   └── backend/       # Node.js + Apollo Server + TypeGraphQL
├── libs/              # Packages partagés (types, utilitaires)
├── infra/             # Docker, migrations, scripts CI/CD
├── package.json       # Workspaces, scripts globaux
├── tsconfig.json      # Configuration TypeScript racine
└── .github/           # Actions, templates d’issues et PR
Nous utilisons les workspaces (npm) pour gérer les dépendances.

## Prérequis
Node.js ≥ 18.x
npm ≥ 9.x
Docker & Docker Compose
PostgreSQL (local ou conteneurisé)

## Installation
Cloner le dépôt
git clone https://github.com/votre-org/footsy.git
cd footsy
Installer les dépendances
npm install
Configurer les variables d’environnement
Copier .env.example en .env et renseigner :
DATABASE_HOST
DATABASE_PORT
DATABASE_USER
DATABASE_PASS
DATABASE_NAME

PORT_GRAPHQL
JWT_SECRET

ADEME_API_KEY
PAYMENT_PROVIDER
STRIPE_SECRET_KEY

Initialiser la base de données
docker-compose up -d db
npm run migrate:up

## Tests

### Tests unitaires (backend)
Depuis `server/` : `npm test`. Aucune base de données requise.

### Tests d’intégration (backend)
Les tests d’intégration utilisent une base PostgreSQL dédiée (`db_footsy_test`) pour ne pas toucher à la base de dev. **Aucune installation locale de Postgres n’est nécessaire** : on utilise la même image Docker que pour le développement (`compose.dev.yaml`, service `database`). Les tests d’intégration couvrent notamment la mutation **login** et la query **activités par utilisateur** (`getActivitiesByUserIdAndFilters`).

1. **Démarrer Postgres avec Docker** (à la racine du repo, même conteneur que en dev) :
   ```bash
   docker compose -f compose.dev.yaml up -d database
   ```
2. **Créer la base de test** (une fois par machine, dans ce conteneur) :
   `docker compose -f compose.dev.yaml exec database psql -U postgres -d postgres -c "CREATE DATABASE db_footsy_test;"`
3. **Configurer l’environnement de test** : copier `server/.env.test.example` vers `server/.env.test` et ajuster si besoin (même utilisateur/mot de passe que Postgres Docker).
4. **Lancer les tests d’intégration** :
   ```bash
   cd server && npm run test:integration
   ```

## Commandes utiles
### Frontend
npm --workspace=apps/frontend run dev       # mode dev
npm --workspace=apps/frontend run build     # production
npm --workspace=apps/frontend run lint      # lint
npm --workspace=apps/frontend run type-check# type-check
### Backend
npm --workspace=apps/backend run dev        # mode dev
npm --workspace=apps/backend run build      # production
npm --workspace=apps/backend run lint       # lint
npm --workspace=apps/backend run type-check # type-check
### Base de données & Migrations
npm run migrate:generate -- -n NomMigration   # générer
npm run migrate:up                          # appliquer
npm run migrate:down                        # rollback

## Architecture & Stack Technique
Frontend : React.js, Vite, TypeScript, Tailwind CSS
Backend : Node.js, Apollo Server, TypeGraphQL, JWT
Base de données : PostgreSQL, TypeORM
Déploiement : Docker, Docker Compose
CI/CD : GitHub Actions

## Gestion des dates
**PostgreSQL** stocke les dates au format `date` (YYYY-MM-DD) sans heure.  
**GraphQL** utilise le scalar `Date` natif qui gère automatiquement la sérialisation en ISO 8601.

**Côté backend** : Un transformer TypeORM convertit automatiquement les dates PostgreSQL en objets `Date` JavaScript :
```typescript
@Column({ 
  type: "date", 
  transformer: { 
    to: (value: Date) => value,
    from: (value: string) => new Date(value) 
  } 
})
date: Date;
```
GraphQL sérialise ensuite automatiquement les `Date` en strings ISO (`"2026-01-12T00:00:00.000Z"`).

**Côté frontend** :
- **Envoyer** : Convertir en ISO complet → `new Date(dateString).toISOString()` → `"2026-01-12T00:00:00.000Z"`
- **Recevoir** : GraphQL retourne une string ISO (`"2026-01-12T00:00:00.000Z"`)
  - Pour les inputs HTML : utiliser `toISODateString()` → `"2026-01-12"`
  - Pour l'affichage : utiliser `formatDateForDisplay()` → adapté au locale (ex: `"12/01/2026"` en français)

## Workflow Git
Branche principale : main (protégée)
Branche d’intégration : dev
Branches de fonctionnalités : feature/xxx
Pull requests avec revue et tests CI/CD obligatoires

## Contribuer
Ouvrir une issue pour discuter d’un bug ou d’une nouvelle fonctionnalité.
Créer une branche feature/ ou fix/ depuis dev.
Committer avec des messages clairs (Conventional Commits).
Ouvrir une Pull Request et demander une review.
Après validation et tests passés, merger dans dev ou main.

## Licence
Ce projet est distribué sous licence MIT.
Bon coding et réduisons ensemble notre empreinte carbone !