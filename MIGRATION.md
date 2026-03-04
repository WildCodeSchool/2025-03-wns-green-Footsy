# Migration API ADEME - Janvier 2026

## 🎯 Résumé des changements

Cette mise à jour remplace les données en dur par les données officielles de l'API ImpactCO2 de l'ADEME.

**Données chargées automatiquement :**
- ✅ **10 catégories** d'activités (Numérique, Alimentation, Boisson, Transport, etc.)
- ✅ **243 types** d'activités avec leurs valeurs d'empreinte carbone officielles
- ✅ **Unités de mesure** par catégorie (kg, km, L, m², unité)

---

## ⚠️ BREAKING CHANGES

### Modifications de la base de données

#### Entité `Category`
- ✅ **Ajout** du champ `quantity_unit` (string) : unité de mesure de la catégorie
  - Exemples : "kg" (Alimentation), "km" (Transport), "L" (Boisson), "m²" (Chauffage), "unité" (Numérique)
- ✅ **Ajout** du champ `ademe_id` (int, nullable, unique) : ID d'origine de l'API ADEME pour mapping

#### Entité `Type`
- ❌ **SUPPRESSION** du champ `quantity_unit` → **Déplacé vers `Category`**
- ✅ **Ajout** du champ `ecv` (float) : valeur d'empreinte carbone par unité
  - Exemple : Voiture thermique = 0.2176 kg CO₂/km

### Modifications backend (GraphQL)

Les queries `getAllTypes` et `getAllCategories` retournent maintenant de nouveaux champs.

**Nouvelle structure des données :**
```graphql
type Category {
  id: Int!
  title: String!
  quantity_unit: String!  # NOUVEAU - ex: "km", "kg", "L", "m²", "unité"
  ademe_id: Int          # NOUVEAU - ID API ADEME
  types: [Type!]!
}

type Type {
  id: Int!
  title: String!
  ecv: Float!            # NOUVEAU - empreinte carbone par unité
  category: Category!
}
```

### Modifications frontend

#### Types TypeScript mis à jour

**Fichier `src/types/Activity.types.ts` :**
```typescript
export interface Category {
  id: number;
  title: string;
  quantity_unit: string;  // NOUVEAU
}

export interface Type {
  id: number;
  title: string;
  ecv: number;           // NOUVEAU
  category: Category;
  // ❌ Plus de category_id en accès direct
  // ❌ Plus de quantity_unit dans Type
}
```

#### Queries GraphQL mises à jour

**Fichier `src/graphql/operations.ts` :**
```typescript
// ✅ Ajouter ecv et category.quantity_unit
export const GET_ALL_TYPES = gql`
  query GetAllTypes {
    getAllTypes {
      id
      title
      ecv                    # NOUVEAU
      category {
        id
        title
        quantity_unit        # NOUVEAU
      }
    }
  }
`;

export const GET_ACTIVITIES_BY_USER_ID = gql`
  query GetActivitiesByUserId($userId: Int!) {
    getActivitiesByUserId(userId: $userId) {
      id
      title
      date
      quantity
      co2_equivalent
      type {
        id
        title
        ecv                  # NOUVEAU
        category {
          id
          title
          quantity_unit      # NOUVEAU
        }
      }
    }
  }
`;
```

#### Modifications dans le code frontend

**Accès aux champs :**
```typescript
// ❌ ANCIEN CODE
type.category_id
type.quantity_unit

// ✅ NOUVEAU CODE
type.category.id
type.category.quantity_unit
```

**Calcul automatique du CO2 :**

Le champ `co2_equivalent` est maintenant calculé automatiquement :
```typescript
// Formule : ecv × quantity
const co2 = selectedType.ecv * formData.quantity;
```

---

## 🔑 Variables d'environnement requises

### **`.env` (racine du projet)**
```env
# API ADEME (obligatoire)
ADEME_API_KEY=votre_cle_ici
ADEME_API_URL=https://impactco2.fr/api/v1
```

### **`server/.env`**
```env
# API ADEME (obligatoire)
ADEME_API_KEY=votre_cle_ici
ADEME_API_URL=https://impactco2.fr/api/v1
```

### **Comment obtenir une clé API ADEME**

1. Aller sur https://impactco2.fr/
2. Créer un compte développeur
3. Générer une clé API
4. Ajouter la clé dans les deux fichiers `.env`

**Ou** demander la clé à un membre de l'équipe qui l'a déjà.

---

## 🚀 Instructions de migration pour les développeurs

### **Étape 1 : Récupérer les modifications**
```bash
git checkout dev
git pull origin dev
```

### **Étape 2 : Ajouter la clé API ADEME**

Copier les fichiers `.env.example` et ajouter votre clé API :
```bash
# Racine
cp .env.example .env

# Server
cp server/.env.example server/.env
```

Puis éditer les deux fichiers `.env` pour ajouter `ADEME_API_KEY`.

### **Étape 3 : Reset complet de la base de données**

⚠️ **IMPORTANT** : Cette mise à jour nécessite un reset complet de la DB car la structure a changé.
```bash
# Arrêter tous les containers
docker compose -f compose.dev.yaml down -v --remove-orphans

# Supprimer les données de la base
rm -rf database/

# Sur Windows PowerShell :
# Remove-Item -Recurse -Force database/

# Optionnel : Nettoyer les volumes orphelins
docker volume prune -f

# Redémarrer (la DB sera recréée et les seeders se lanceront automatiquement)
docker compose -f compose.dev.yaml up -d
```

### **Étape 4 : Vérifier que tout fonctionne**

#### **Backend GraphQL** : http://localhost:5050/graphql

Tester ces queries :
```graphql
# Doit retourner 10 catégories
query {
  getAllCategories {
    id
    title
    quantity_unit
    ademe_id
  }
}

# Doit retourner 243 types
query {
  getAllTypes {
    id
    title
    ecv
    category {
      title
      quantity_unit
    }
  }
}
```

#### **Frontend** : http://localhost:8080

- Aller sur le formulaire d'ajout d'activité
- Vérifier que les catégories s'affichent dans la liste déroulante
- Sélectionner une catégorie et vérifier que les types se chargent
- Entrer une quantité et vérifier que le CO2 se calcule automatiquement
- Créer une activité et vérifier qu'elle s'enregistre

---

## 🔄 Mode de fonctionnement des seeders

### **Automatique (au démarrage du serveur)**

Les seeders s'exécutent automatiquement lors du démarrage :
```bash
docker compose -f compose.dev.yaml up -d
```

**Comportement :**
- **1er lancement** : Les données sont chargées depuis l'API ADEME (10 catégories + 243 types)
- **Redémarrages suivants** : Les seeders détectent que les données existent (via `COUNT`) et skip

**Logs typiques au 1er lancement :**
```
Fetching categories from ADEME API...
✓ 11 categories retrieved
✓ 10 categories kept (ID 1-10)
✅ Categories seeded successfully

Fetching types from ADEME API...
✓ 243 types prepared for saving
✅ Types seeded successfully
```

**Logs typiques aux redémarrages suivants :**
```
Avatars already exist, skipping
Users already exist, skipping
Categories already exist, skipping
Types already exist, skipping
```

### **Manuel (script dédié)**

Pour forcer un rechargement des données :
```bash
docker compose -f compose.dev.yaml exec backend npm run seed
```

---

## 🐛 Résolution des problèmes courants

### **Erreur : Missing API_KEY in env**

**Cause :** La clé API ADEME n'est pas configurée.

**Solution :**
1. Vérifier que `ADEME_API_KEY` est bien dans **les deux** `.env` (racine + server)
2. Redémarrer Docker :
```bash
docker compose -f compose.dev.yaml down
docker compose -f compose.dev.yaml up -d
```

---

### **Erreur : Cannot return null for non-nullable field Type.category**

**Cause :** Les resolvers ne chargent pas les relations TypeORM.

**Solution :** Vérifier que les resolvers utilisent `relations` :
```typescript
// TypeResolver
Type.find({ relations: ['category'] })

// CategoryResolver
Category.find({ relations: ['types'] })
```

---

### **Les types ne s'affichent pas dans le formulaire**

**Cause :** Filtrage basé sur l'ancien `category_id`.

**Solution :** Utiliser `type.category.id` au lieu de `type.category_id` :
```typescript
// ❌ Ancien
types.filter(type => type.category_id === selectedCategoryId)

// ✅ Nouveau
types.filter(type => type.category.id === selectedCategoryId)
```

---

### **Le calcul CO2 ne fonctionne pas**

**Cause :** Le champ `ecv` n'est pas dans l'interface TypeScript frontend.

**Solution :** Ajouter `ecv` dans `src/types/Activity.types.ts` :
```typescript
export interface Type {
  id: number;
  title: string;
  ecv: number;  // ← Ajouter
  category: Category;
}
```

---

### **Erreur : duplicate key value violates unique constraint "pg_type_typname_nsp_index"**

**Cause :** Base de données PostgreSQL corrompue.

**Solution :** Reset complet avec nettoyage des volumes :
```bash
docker compose -f compose.dev.yaml down -v --remove-orphans
rm -rf database/
docker volume prune -f
docker compose -f compose.dev.yaml up -d
```

---

### **L'API ADEME est indisponible**

**Cause :** L'API externe est temporairement down.

**Solution :**
1. Le serveur démarre quand même avec un warning
2. Relancer manuellement plus tard :
```bash
docker compose -f compose.dev.yaml exec backend npm run seed
```

---

## 📋 Checklist de vérification

Après migration, vérifier que :

- [ ] Clé API ADEME ajoutée dans les deux `.env`
- [ ] Base de données reset et redémarrée avec succès
- [ ] Query `getAllCategories` retourne 10 catégories avec `quantity_unit`
- [ ] Query `getAllTypes` retourne 243 types avec `ecv`
- [ ] Le formulaire d'activité affiche les catégories
- [ ] Les types se chargent quand on sélectionne une catégorie
- [ ] L'unité s'affiche correctement (km, kg, L, m², unité)
- [ ] Le calcul du CO2 se fait automatiquement (ecv × quantity)
- [ ] Création d'une activité fonctionne et sauvegarde correctement

---

## 📝 Pour les développeurs avec des branches en cours

Si vous avez des branches feature avec du code touchant aux activités :

### **Backend (Resolvers)**
```typescript
// Ajouter les relations dans les queries
Type.find({ relations: ['category'] })
Category.find({ relations: ['types'] })
```

### **Frontend (Code TypeScript)**
```typescript
// ❌ ANCIEN
type.category_id
type.quantity_unit

// ✅ NOUVEAU
type.category.id
type.category.quantity_unit
```

### **Frontend (Queries GraphQL)**

Ajouter `ecv` et `category { quantity_unit }` dans toutes les queries utilisant `Type`.

---

## 🆘 Besoin d'aide ?

En cas de problème :

1. **Vérifier les logs Docker :**
```bash
docker compose -f compose.dev.yaml logs backend -f
```

2. **Vérifier que l'API ADEME est accessible :**
```bash
curl https://impactco2.fr/api/v1/thematiques
```

3. **Contacter l'équipe :**
   - Slack : #channel-dev
   - Créateur de la MR : [Ton nom]

---

## 📚 Documentation technique

Pour plus de détails sur l'implémentation technique, voir :
- `server/src/services/apiAdeme/README.md` - Documentation du service API
- Code source : `server/src/services/apiAdeme/`