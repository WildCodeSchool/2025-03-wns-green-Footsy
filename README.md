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
**GraphQL** utilise le scalar `DateTime` qui nécessite le format ISO 8601 complet (avec heure).

**Côté backend** : Un transformer TypeORM convertit automatiquement les dates PostgreSQL en objets `Date` JavaScript :
```typescript
@Column({ type: "date", transformer: { from: (value) => new Date(value) } })
```

**Côté frontend** :
- **Envoyer** : Convertir en ISO complet → `new Date(dateString).toISOString()` → `"1999-01-01T00:00:00.000Z"`
- **Recevoir** : GraphQL retourne automatiquement une string ISO → utiliser telle quelle ou `new Date(isoString)` si besoin

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

