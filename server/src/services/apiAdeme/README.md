# Service API ADEME - Documentation technique

## 📁 Architecture
```
services/apiAdeme/
├── ApiAdeme.config.ts      # Configuration Axios avec clé API
├── ApiAdeme.types.ts       # Types TypeScript des réponses API
├── ApiAdeme.service.ts     # Service avec méthodes d'appel
└── README.md              # Ce fichier
```

## 🔧 Configuration

### Variables d'environnement
```env
ADEME_API_KEY=your_api_key_here
ADEME_API_URL=https://impactco2.fr/api/v1
```

### Instance Axios

Configurée dans `ApiAdeme.config.ts` avec :
- Base URL : `https://impactco2.fr/api/v1`
- Header Authorization : `Bearer ${API_KEY}`
- Timeout : 10 secondes

## 📡 Endpoints utilisés

### `GET /thematiques`

Retourne toutes les thématiques disponibles.

**Réponse :**
```json
{
  "data": [
    { "id": 1, "name": "Numérique", "slug": "numerique" },
    { "id": 2, "name": "Alimentation", "slug": "alimentation" },
    ...
  ]
}
```

### `GET /thematiques/ecv/{id}`

Retourne les données d'empreinte carbone pour une thématique.

**Exemple : `/thematiques/ecv/4` (Transport)**

**Réponse :**
```json
{
  "data": [
    { "name": "Avion trajet court", "slug": "avion-courtcourrier", "ecv": 0.224572 },
    { "name": "TGV", "slug": "tgv", "ecv": 0.00293 },
    ...
  ]
}
```

## 🛠️ Service API

### Méthodes disponibles

#### `getCategories(): Promise<Categorie[]>`

Récupère toutes les thématiques (catégories 1 à 10).
```typescript
const categories = await ApiAdemeService.getCategories();
// Returns: [{ id: 1, name: "Numérique", slug: "numerique" }, ...]
```

#### `getTypes(categoryId: number): Promise<Type[]>`

Récupère les types d'une catégorie.
```typescript
const types = await ApiAdemeService.getTypes(4); // Transport
// Returns: [{ name: "Avion", slug: "...", ecv: 0.224 }, ...]
```

#### `getQuantityUnit(categoryId: number): QuantityUnit | undefined`

Retourne l'unité de mesure d'une catégorie.
```typescript
const unit = ApiAdemeService.getQuantityUnit(4); // "km"
const unit = ApiAdemeService.getQuantityUnit(2); // "kg"
```

## 📊 Mapping des unités
```typescript
const THEMATIQUE_UNITS: Record<number, QuantityUnit> = {
  1: "unité",   // Numérique
  2: "kg",      // Alimentation
  3: "L",       // Boisson
  4: "km",      // Transport
  5: "unité",   // Habillement
  6: "unité",   // Électroménager
  7: "unité",   // Mobilier
  8: "m²",      // Chauffage
  9: "kg",      // Fruits et légumes
  10: "unité",  // Usage numérique
};
```

## 🔄 Utilisation dans les seeders
```typescript
// Charger les catégories
const categories = await ApiAdemeService.getCategories();

// Filtrer les IDs 1-10
const filtered = categories.filter(cat => cat.id >= 1 && cat.id <= 10);

// Pour chaque catégorie, charger ses types
for (const cat of filtered) {
  const types = await ApiAdemeService.getTypes(cat.id);
  const unit = ApiAdemeService.getQuantityUnit(cat.id);
  
  // Sauvegarder en BDD...
}
```

## ⚠️ Gestion d'erreurs

Toutes les méthodes utilisent try/catch et throwent des erreurs claires :
```typescript
try {
  const types = await ApiAdemeService.getTypes(4);
} catch (error) {
  console.error('Impossible de récupérer les types:', error);
}
```

## 📈 Données chargées

- **10 catégories** (IDs 1 à 10)
- **243 types** au total
- Valeurs `ecv` officielles de l'ADEME

## 🔗 Ressources

- API ImpactCO2 : https://impactco2.fr/
- Documentation officielle : https://impactco2.fr/doc