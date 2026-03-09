# WorkoutNow v2.0 — Cahier de Charge

> **Projet :** WorkoutNow — AI-Powered Workout Generator  
> **Version :** 2.0.0  
> **Date :** Février 2026  
> **Type :** Application Web Full-Stack (Monorepo)

---

## Table des Matières

1. [Présentation Générale](#1-présentation-générale)
2. [Architecture Technique](#2-architecture-technique)
3. [Stack Technique](#3-stack-technique)
4. [Schéma de la Base de Données](#4-schéma-de-la-base-de-données)
5. [API REST — Référence Complète](#5-api-rest--référence-complète)
6. [Pages & Routes Frontend](#6-pages--routes-frontend)
7. [Authentification & Sécurité](#7-authentification--sécurité)
8. [Gestion d'État (State Management)](#8-gestion-détat-state-management)
9. [Design System & UI/UX](#9-design-system--uiux)
10. [Intégrations Tierces](#10-intégrations-tierces)
11. [Logique Métier](#11-logique-métier)
12. [Variables d'Environnement](#12-variables-denvironnement)
13. [Arborescence du Projet](#13-arborescence-du-projet)
14. [Déploiement & Scripts](#14-déploiement--scripts)

---

## 1. Présentation Générale

### 1.1 Objectif

WorkoutNow est une application web qui génère des programmes d'entraînement personnalisés en se basant sur l'équipement disponible et les groupes musculaires ciblés par l'utilisateur. L'application exploite une base de données de **800+ exercices** avec vidéos et images via l'API ExerciseDB.

### 1.2 Fonctionnalités Principales

| # | Fonctionnalité | Description |
|---|---|---|
| F1 | **Inscription / Connexion** | Email/mot de passe + Google OAuth via Supabase Auth |
| F2 | **Tableau de Bord** | Statistiques (total séances, cette semaine, heures mensuelles), série en cours, activité récente |
| F3 | **Générateur d'Entraînement** | Assistant 3 étapes : Équipement → Muscles → Aperçu des exercices générés |
| F4 | **Lecteur d'Entraînement** | Timer en temps réel, progression, détails exercice (GIF/vidéo, séries, reps, repos), navigation prev/next |
| F5 | **Système de Favoris** | Ajout/suppression d'exercices favoris, page dédiée avec grille de cartes |
| F6 | **Historique** | Liste paginée des séances terminées, groupées par date |
| F7 | **Profil Utilisateur** | Nom, poids, taille, objectif fitness — édition et sauvegarde |
| F8 | **Système de Séries (Streak)** | Compteur de jours consécutifs d'entraînement, record personnel |
| F9 | **Remplacement d'Exercice** | Remplacement d'un exercice par un autre similaire pendant l'entraînement |
| F10 | **Recherche d'Exercices** | Recherche textuelle dans la base ExerciseDB |

### 1.3 Utilisateurs Cibles

- Pratiquants de musculation (débutants à intermédiaires)
- Personnes cherchant à structurer leurs séances
- Utilisateurs disposant d'équipement limité (domicile / salle)

---

## 2. Architecture Technique

### 2.1 Vue d'Ensemble

```
┌──────────────────────────────────────────────────────────────┐
│                        MONOREPO                              │
│                                                              │
│  ┌─────────────────────┐      ┌────────────────────────┐     │
│  │   Frontend (Next.js)│      │  Backend (Express.js)  │     │
│  │   Port 3000         │─────▶│  Port 4000             │     │
│  │                     │ HTTP │                        │     │
│  │  • MUI v5 Dark      │      │  • REST API /api/v1    │     │
│  │  • Supabase SSR     │      │  • JWT Verification    │     │
│  │  • Zustand          │      │  • Prisma ORM          │     │
│  │  • Framer Motion    │      │  • Rate Limiting       │     │
│  └─────────┬───────────┘      └──────────┬─────────────┘     │
│            │                             │                   │
│            │                             │                   │
│            ▼                             ▼                   │
│  ┌─────────────────────┐      ┌────────────────────────┐     │
│  │   Supabase Auth     │      │  Supabase PostgreSQL   │     │
│  │   (Cookies/JWT)     │      │  (via Prisma)          │     │
│  └─────────────────────┘      └────────────────────────┘     │
│                                          │                   │
│                               ┌──────────┴─────────────┐     │
│                               │  ExerciseDB (RapidAPI) │     │
│                               │  800+ exercices        │     │
│                               └────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Communication

| Composant | Direction | Protocole | Détails |
|---|---|---|---|
| Frontend → Backend | HTTP | REST JSON | Axios avec JWT interceptor, base URL `/api/v1` |
| Frontend → Supabase | HTTPS | Supabase SDK | Auth (cookies SSR), gestion de session |
| Backend → Supabase DB | TCP | PostgreSQL | Via Prisma ORM, connection string directe |
| Backend → ExerciseDB | HTTPS | RapidAPI | Clé API dans header `X-RapidAPI-Key` |

### 2.3 Proxy (Next.js Rewrites)

Les requêtes `/api/v1/*` du frontend sont proxifiées vers le backend Express, permettant d'éviter les problèmes CORS en production.

---

## 3. Stack Technique

### 3.1 Backend

| Technologie | Version | Rôle |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.21 | Framework HTTP |
| TypeScript | 5.3 | Langage |
| Prisma | 5.22 | ORM |
| PostgreSQL | 15+ | Base de données (Supabase) |
| Zod | 3.23 | Validation de schémas |
| jsonwebtoken | 9.0 | Vérification JWT |
| Helmet | 7.1 | Headers de sécurité |
| express-rate-limit | 7.4 | Limitation de débit |
| Morgan | 1.10 | Journalisation HTTP |
| tsx | 4.21 | Exécution TypeScript (dev) |

### 3.2 Frontend

| Technologie | Version | Rôle |
|---|---|---|
| Next.js | 14.2.18 | Framework React (App Router) |
| React | 18.3 | Librairie UI |
| TypeScript | 5.x | Langage |
| MUI (Material UI) | 5.16 | Composants UI |
| Emotion | 11.x | CSS-in-JS |
| Framer Motion | 11.5 | Animations |
| Zustand | 5.0 | Gestion d'état |
| Axios | 1.7 | Client HTTP |
| @supabase/ssr | 0.5 | Auth SSR |
| react-hot-toast | 2.4 | Notifications toast |

---

## 4. Schéma de la Base de Données

### 4.1 Diagramme Entité-Relation

```
┌──────────────────────┐
│        User           │
├──────────────────────┤
│ id (PK, Supabase UID)│
│ email (unique)        │
│ displayName?          │
│ avatarUrl?            │
│ weightKg?             │
│ heightCm?             │
│ fitnessGoal?          │
│ currentStreak         │
│ longestStreak         │
│ lastWorkoutAt?        │
│ createdAt             │
│ updatedAt             │
├──────────────────────┤
│ 1 ──── N WorkoutSession
│ 1 ──── N FavoriteExercise
└──────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐
│    WorkoutSession        │     │   FavoriteExercise       │
├─────────────────────────┤     ├─────────────────────────┤
│ id (PK, UUID)            │     │ id (PK, UUID)            │
│ userId (FK → User)       │     │ userId (FK → User)       │
│ exercisesCount            │     │ exerciseId               │
│ exerciseNames (String[]) │     │ exerciseName             │
│ durationMinutes           │     │ imageUrl?                │
│ notes?                    │     │ bodyPart?                │
│ completedAt               │     │ createdAt                │
│ createdAt                 │     ├─────────────────────────┤
├─────────────────────────┤     │ UNIQUE(userId, exerciseId)│
│ INDEX(userId, completedAt)│     │ INDEX(userId)            │
└─────────────────────────┘     └─────────────────────────┘

┌───────────────┐    M:N    ┌───────────────┐    M:N    ┌───────────────┐
│  Equipment     │◄────────▶│   Exercise     │◄────────▶│    Muscle      │
├───────────────┤           ├───────────────┤           ├───────────────┤
│ id (PK, UUID) │           │ id (PK, UUID) │           │ id (PK, UUID) │
│ name (unique) │           │ name           │           │ name (unique) │
│ iconUrl?      │           │ instructions?  │           │ group          │
└───────────────┘           │ videoUrl?      │           └───────────────┘
                            │ imageUrl?      │
                            │ difficulty     │
                            └───────────────┘
```

### 4.2 Énumérations

```
Difficulty      : BEGINNER | INTERMEDIATE | ADVANCED
FitnessGoal     : LOSE_WEIGHT | BUILD_MUSCLE | STAY_FIT | INCREASE_STRENGTH | IMPROVE_ENDURANCE
```

### 4.3 Tables Détaillées

#### User (`users`)

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `id` | String | PK | UID Supabase Auth |
| `email` | String | UNIQUE | Adresse email |
| `displayName` | String? | — | Nom d'affichage |
| `avatarUrl` | String? | — | URL de l'avatar |
| `weightKg` | Float? | — | Poids en kg |
| `heightCm` | Float? | — | Taille en cm |
| `fitnessGoal` | FitnessGoal? | — | Objectif fitness |
| `currentStreak` | Int | DEFAULT 0 | Série en cours (jours) |
| `longestStreak` | Int | DEFAULT 0 | Meilleure série |
| `lastWorkoutAt` | DateTime? | — | Date dernière séance |
| `createdAt` | DateTime | AUTO | Date de création |
| `updatedAt` | DateTime | AUTO | Date de mise à jour |

#### WorkoutSession (`workout_sessions`)

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `id` | String | PK (UUID) | Identifiant unique |
| `userId` | String | FK → User | Propriétaire |
| `exercisesCount` | Int | DEFAULT 0 | Nombre d'exercices |
| `exerciseNames` | String[] | — | Noms des exercices (array PostgreSQL) |
| `durationMinutes` | Int | DEFAULT 0 | Durée en minutes |
| `notes` | String? | TEXT | Notes libres |
| `completedAt` | DateTime | DEFAULT now() | Date d'achèvement |
| `createdAt` | DateTime | DEFAULT now() | Date de création |

#### FavoriteExercise (`favorite_exercises`)

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `id` | String | PK (UUID) | Identifiant unique |
| `userId` | String | FK → User | Propriétaire |
| `exerciseId` | String | — | ID ExerciseDB |
| `exerciseName` | String | — | Nom de l'exercice |
| `imageUrl` | String? | — | URL de l'image |
| `bodyPart` | String? | — | Partie du corps ciblée |
| `createdAt` | DateTime | DEFAULT now() | Date d'ajout |

#### Equipment (`equipment`) — Données de référence

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `id` | String | PK (UUID) | Identifiant |
| `name` | String | UNIQUE | Nom de l'équipement |
| `iconUrl` | String? | — | URL de l'icône |

#### Muscle (`muscles`) — Données de référence

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `id` | String | PK (UUID) | Identifiant |
| `name` | String | UNIQUE | Nom du muscle |
| `group` | String | — | Groupe musculaire (ex: "Upper Body") |

#### Exercise (`exercises`) — Données de référence

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `id` | String | PK (UUID) | Identifiant |
| `name` | String | — | Nom de l'exercice |
| `instructions` | String? | TEXT | Instructions détaillées |
| `videoUrl` | String? | — | URL de la vidéo |
| `imageUrl` | String? | — | URL de l'image |
| `difficulty` | Difficulty | DEFAULT BEGINNER | Niveau de difficulté |

---

## 5. API REST — Référence Complète

**Base URL :** `http://localhost:4000/api/v1`

### 5.1 Santé du Serveur

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Non | Vérification de santé |

**Réponse :**
```json
{ "status": "ok", "timestamp": "2026-02-10T12:00:00.000Z" }
```

### 5.2 Exercices (Public)

#### `GET /api/v1/exercises/equipment`

Retourne la liste des équipements disponibles.

**Auth :** Non requise  
**Rate Limit :** 100 req/15min

**Réponse :**
```json
{
  "data": [
    { "id": "barbell", "name": "Barbell", "iconUrl": null },
    { "id": "dumbbell", "name": "Dumbbell", "iconUrl": null }
  ]
}
```

**Logique de fallback :** Base de données Prisma → API ExerciseDB → Liste codée en dur (10 équipements).

---

#### `GET /api/v1/exercises/muscles`

Retourne la liste des groupes musculaires.

**Auth :** Non requise

**Réponse :**
```json
{
  "data": [
    { "id": "chest", "name": "Chest", "bodyPart": "Upper Body" },
    { "id": "biceps", "name": "Biceps", "bodyPart": "Arms" }
  ]
}
```

**Logique de fallback :** Base de données Prisma → API ExerciseDB → Liste codée en dur (13 muscles).

---

### 5.3 Utilisateur (Authentifié)

#### `POST /api/v1/user/ensure`

Crée ou met à jour l'entrée utilisateur en base. Appelé automatiquement à chaque connexion.

**Body :** Aucun (utilise le JWT pour l'identité)

---

#### `GET /api/v1/user/profile`

**Réponse :**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John",
    "avatarUrl": null,
    "weightKg": 80,
    "heightCm": 180,
    "fitnessGoal": "BUILD_MUSCLE",
    "currentStreak": 5,
    "longestStreak": 12
  }
}
```

---

#### `PUT /api/v1/user/profile`

**Body :**
```json
{
  "displayName": "John Doe",
  "weightKg": 82,
  "heightCm": 180,
  "fitnessGoal": "BUILD_MUSCLE"
}
```

---

#### `GET /api/v1/user/stats`

**Réponse :**
```json
{
  "data": {
    "totalWorkouts": 42,
    "weeklyWorkouts": 3,
    "monthlyDuration": 720,
    "currentStreak": 5,
    "longestStreak": 12
  }
}
```

- `totalWorkouts` : Nombre total de séances (tout temps)
- `weeklyWorkouts` : Séances des 7 derniers jours
- `monthlyDuration` : Minutes totales des 30 derniers jours
- `currentStreak` / `longestStreak` : Séries de jours consécutifs

---

### 5.4 Entraînements (Authentifié)

#### `POST /api/v1/workouts/generate`

Génère un programme de 8 exercices personnalisés.

**Rate Limit :** 20 req/15min (protection quota ExerciseDB)

**Body :**
```json
{
  "equipmentIds": ["barbell", "dumbbell", "cable"],
  "muscleIds": ["chest", "biceps", "shoulders"]
}
```

**Réponse — Structure d'un exercice transformé :**
```json
{
  "data": [
    {
      "id": "ex123",
      "name": "Barbell Bench Press",
      "videoUrl": "https://...",
      "imageUrl": "https://...",
      "difficultyLevel": "INTERMEDIATE",
      "instructions": "Lie on a flat bench...\n\nGrip the barbell...",
      "instructionsList": ["Lie on a flat bench", "Grip the barbell..."],
      "exerciseTips": ["Keep your feet flat", "Arch your back slightly"],
      "overview": "The bench press is a compound exercise...",
      "equipment": [{ "id": "eq-0", "name": "barbell", "iconUrl": null }],
      "muscles": [{ "id": "muscle-0", "name": "chest", "bodyPart": "chest" }],
      "targetMuscles": ["pectoralis major"],
      "secondaryMuscles": ["anterior deltoid", "triceps"],
      "sets": 3,
      "repRange": "8-12",
      "restSeconds": 60
    }
  ]
}
```

**Logique :**
1. Mapper les IDs équipement/muscles vers le format ExerciseDB
2. Récupérer 30 exercices correspondants
3. Mélanger aléatoirement (Fisher-Yates)
4. Sélectionner les 8 premiers
5. Transformer le format de réponse

---

#### `POST /api/v1/workouts/replace-exercise`

Remplace un exercice par un autre similaire.

**Body :**
```json
{
  "bodyPart": "chest",
  "equipmentIds": ["barbell", "dumbbell"],
  "excludeIds": ["ex123", "ex456"]
}
```

**Réponse :** Un seul exercice transformé ou `null`.

---

#### `POST /api/v1/workouts/complete`

Enregistre une séance terminée.

**Body :**
```json
{
  "exercises": [{ "name": "Bench Press" }, { "name": "Bicep Curl" }],
  "durationMinutes": 45,
  "notes": "Great session!"
}
```

**Effets :**
1. Création d'un enregistrement `WorkoutSession`
2. Mise à jour du streak utilisateur (voir §11.3)

---

#### `GET /api/v1/workouts/history?limit=20&offset=0`

**Réponse :**
```json
{
  "data": [
    {
      "id": "uuid",
      "exercisesCount": 8,
      "exerciseNames": ["Bench Press", "Squat", "..."],
      "durationMinutes": 45,
      "notes": null,
      "completedAt": "2026-02-10T14:30:00.000Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

---

#### `GET /api/v1/workouts/favorites`

**Réponse :**
```json
{
  "data": [
    {
      "id": "uuid",
      "exerciseId": "ex123",
      "exerciseName": "Bench Press",
      "imageUrl": "https://...",
      "bodyPart": "chest",
      "createdAt": "2026-02-09T10:00:00.000Z"
    }
  ]
}
```

---

#### `POST /api/v1/workouts/favorites/toggle`

Ajoute ou retire un exercice des favoris (toggle).

**Body :**
```json
{
  "exerciseId": "ex123",
  "exerciseName": "Bench Press",
  "imageUrl": "https://...",
  "bodyPart": "chest"
}
```

**Réponse :**
```json
{ "data": { "isFavorite": true } }
```

---

#### `GET /api/v1/workouts/search?q=bench`

Recherche textuelle dans ExerciseDB.

**Réponse :** Tableau d'exercices transformés (même format que `generate`).

---

### 5.5 Résumé des Endpoints

| # | Méthode | Chemin | Auth | Rate Limit | Description |
|---|---|---|---|---|---|
| 1 | `GET` | `/health` | Non | — | Santé serveur |
| 2 | `GET` | `/api/v1/exercises/equipment` | Non | 100/15min | Liste équipements |
| 3 | `GET` | `/api/v1/exercises/muscles` | Non | 100/15min | Liste muscles |
| 4 | `POST` | `/api/v1/user/ensure` | Oui | 100/15min | Provisionnement utilisateur |
| 5 | `GET` | `/api/v1/user/profile` | Oui | 100/15min | Profil utilisateur |
| 6 | `PUT` | `/api/v1/user/profile` | Oui | 100/15min | Mise à jour profil |
| 7 | `GET` | `/api/v1/user/stats` | Oui | 100/15min | Statistiques |
| 8 | `POST` | `/api/v1/workouts/generate` | Oui | **20/15min** | Générer entraînement |
| 9 | `POST` | `/api/v1/workouts/replace-exercise` | Oui | 100/15min | Remplacer un exercice |
| 10 | `POST` | `/api/v1/workouts/complete` | Oui | 100/15min | Terminer une séance |
| 11 | `GET` | `/api/v1/workouts/history` | Oui | 100/15min | Historique paginé |
| 12 | `GET` | `/api/v1/workouts/favorites` | Oui | 100/15min | Liste favoris |
| 13 | `POST` | `/api/v1/workouts/favorites/toggle` | Oui | 100/15min | Toggle favori |
| 14 | `GET` | `/api/v1/workouts/search` | Oui | 100/15min | Recherche exercices |

---

## 6. Pages & Routes Frontend

### 6.1 Arbre des Routes

```
/                          → Landing Page (publique)
/login                     → Connexion (auth uniquement)
/signup                    → Inscription (auth uniquement)
/auth/callback             → Callback OAuth (Route Handler)
/dashboard                 → Tableau de bord (protégée)
/workout-generator         → Générateur 3 étapes (protégée)
/workout/active            → Lecteur d'entraînement (protégée)
/history                   → Historique des séances (protégée)
/favorites                 → Exercices favoris (protégée)
/profile                   → Paramètres du profil (protégée)
```

### 6.2 Détail des Pages

#### `/` — Page d'Accueil (Landing)

- Hero avec titre animé « Transform Your Fitness Journey »
- Texte en dégradé, effets d'orbes ambiants
- Boutons CTA : « Get Started Free » → `/signup`, « Sign In » → `/login`
- Ligne de stats : « 800+ Exercises », « AI Powered », « ∞ Workouts »
- Animations Framer Motion en cascade

#### `/login` — Connexion

- Formulaire email / mot de passe avec toggle visibilité
- Bouton Google OAuth (« Continue with Google »)
- Lien vers inscription
- Effets de luminosité ambiants
- Redirection → `/dashboard` en cas de succès

#### `/signup` — Inscription

- Champs : Nom d'affichage (optionnel), Email, Mot de passe (min. 6 caractères), Confirmation
- Bouton Google OAuth
- Message de succès : « Check your email for confirmation link »
- Redirection automatique → `/dashboard` après 2 secondes

#### `/dashboard` — Tableau de Bord

- Grille bento responsive
- 3 cartes de statistiques : Total Séances, Cette Semaine, Heures Mensuelles
- Compteur de série (badge « On Fire! » à partir de 3 jours)
- Liste d'activité récente (5 dernières séances)
- Bouton CTA « Generate Workout »
- Sources : `userAPI.getStats()` + `workoutAPI.getHistory(5)`

#### `/workout-generator` — Générateur d'Entraînement

- Assistant 3 étapes avec MUI Stepper :
  - **Étape 0 — Équipement** : Grille de Chips, sélection multiple
  - **Étape 1 — Muscles** : Grille de Chips, sélection multiple
  - **Étape 2 — Aperçu** : Cartes d'exercices générés (nom, muscle, équipement)
- Transitions AnimatePresence entre les étapes
- Bouton « Start Workout » → navigation vers `/workout/active`

#### `/workout/active` — Entraînement Actif

- Timer temps réel (format MM:SS)
- Barre de progression (exercices terminés / total)
- Carte de l'exercice en cours : GIF/image, nom, muscle, équipement
- Affichage : séries × reps × repos (ex: « 3 Sets × 10-12 Reps, 60s rest »)
- Contrôles : Précédent, Terminer/Complet, Suivant
- Toggle favori par exercice
- Dialog de confirmation d'abandon
- À la fin → `workoutAPI.complete()`, toast, reset store, redirection `/dashboard`
- Garde : redirige vers `/workout-generator` si aucun exercice en store

#### `/history` — Historique

- Pagination (20 par page, offset-based)
- Groupement par date (ex: « Monday, January 15 »)
- Chaque entrée : nombre d'exercices, aperçu des noms, durée, heure
- Bouton « Load More » pour la pagination
- État vide avec CTA

#### `/favorites` — Favoris

- Grille de cartes (3 colonnes desktop, 2 tablette, 1 mobile)
- Chaque carte : image, nom, badge partie du corps, bouton supprimer
- Suppression via `workoutAPI.toggleFavorite()`
- État vide avec instructions

#### `/profile` — Profil

- Avatar avec initiale
- Champs : Nom d'affichage, Poids (kg), Taille (cm), Objectif Fitness (dropdown)
- Options d'objectif : Build Muscle, Lose Weight, General Fitness, Increase Strength, Improve Endurance
- Bouton Sauvegarder → `userAPI.updateProfile()`
- Bouton Déconnexion

### 6.3 Layouts

| Layout | Composants | Visible sur |
|---|---|---|
| **Root** | `ThemeRegistry` (MUI + Emotion SSR) | Toutes les pages |
| **Auth** | Fond minimaliste, pas de navigation | `/login`, `/signup` |
| **AppShell** | Sidebar (desktop) + Header (mobile) + MobileNav (mobile) | Pages protégées |

---

## 7. Authentification & Sécurité

### 7.1 Flux d'Authentification

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend   │────▶│ Supabase Auth │────▶│ JWT (Cookie/SSR)│
│              │◀────│              │     │                 │
└──────┬───────┘     └──────────────┘     └────────┬────────┘
       │                                          │
       │  Authorization: Bearer <token>           │
       ▼                                          ▼
┌─────────────┐     ┌──────────────────────────────┐
│   Backend    │────▶│ Vérification JWT             │
│  (Express)   │     │ Secret: SUPABASE_JWT_SECRET  │
│              │     │ Audience: "authenticated"    │
└─────────────┘     └──────────────────────────────┘
```

### 7.2 Étapes Détaillées

1. **Inscription** : Email/mot de passe via `supabase.auth.signUp()` → email de confirmation → `userAPI.ensure()` crée la ligne en BD → redirection `/dashboard`
2. **Connexion** : `supabase.auth.signInWithPassword()` → session stockée dans les cookies → `userAPI.ensure()` → redirection
3. **Google OAuth** : `supabase.auth.signInWithOAuth({ provider: "google" })` → redirect Google → retour sur `/auth/callback` → `exchangeCodeForSession()` → redirection
4. **Gestion de session** : SSR via cookies (`@supabase/ssr`). Le middleware Next.js rafraîchit les tokens à chaque requête.
5. **Autorisation API** : Chaque requête Axios injecte automatiquement `Authorization: Bearer <access_token>` via intercepteur
6. **Vérification backend** : Le middleware `requireAuth` vérifie le JWT avec `jsonwebtoken`, extrait `sub` (user ID) et `email`
7. **Protection des routes** : Le middleware Next.js vérifie la session sur les routes protégées
8. **Déconnexion** : `supabase.auth.signOut()`, nettoyage du state Zustand

### 7.3 Middlewares de Sécurité (Backend)

| Middleware | Fonction |
|---|---|
| **Helmet** | Headers de sécurité HTTP (CSP, HSTS, etc.) |
| **CORS** | Origine autorisée : `CLIENT_URL` uniquement, avec credentials |
| **Rate Limiting** | Général : 100/15min, Auth : 10/15min, Génération : 20/15min |
| **Validation Zod** | Validation des corps de requête et paramètres de query |
| **JWT Auth** | `requireAuth` (bloquant) et `optionalAuth` (non-bloquant) |

### 7.4 Réponses d'Erreur

| Code | Situation |
|---|---|
| 400 | Erreur de validation (corps de requête invalide) |
| 401 | Token manquant, expiré ou invalide |
| 404 | Ressource non trouvée |
| 429 | Limite de débit dépassée |
| 500 | Erreur serveur interne |

---

## 8. Gestion d'État (State Management)

### 8.1 Auth Store (`useAuthStore`)

**Librairie :** Zustand (non persisté)

| Propriété | Type | Description |
|---|---|---|
| `user` | `User \| null` | Utilisateur Supabase |
| `session` | `Session \| null` | Session Supabase |
| `loading` | `boolean` | Opération auth en cours |
| `initialized` | `boolean` | Vérification initiale terminée |

| Action | Description |
|---|---|
| `initialize()` | Vérifie la session, écoute `onAuthStateChange`, appelle `userAPI.ensure()` |
| `signUp(email, password, displayName?)` | Inscription email/mot de passe |
| `signIn(email, password)` | Connexion |
| `signInWithGoogle()` | OAuth Google |
| `signOut()` | Déconnexion |
| `setSession(session)` | Setter manuel |

### 8.2 Workout Store (`useWorkoutStore`)

**Librairie :** Zustand (persisté dans `localStorage` sous la clé `workout-wizard-v2`)

| Propriété | Type | Description |
|---|---|---|
| `selectedEquipment` | `string[]` | IDs d'équipements sélectionnés |
| `selectedMuscles` | `string[]` | IDs de muscles sélectionnés |
| `generatedExercises` | `Exercise[]` | Exercices générés |
| `currentStep` | `number` | Étape actuelle (0, 1, ou 2) |

| Action | Description |
|---|---|
| `toggleEquipment(id)` | Ajouter/retirer un équipement |
| `toggleMuscle(id)` | Ajouter/retirer un muscle |
| `setGeneratedExercises(exercises)` | Définir les exercices générés |
| `addExercise(exercise)` | Ajouter un exercice |
| `removeExercise(id)` | Retirer un exercice |
| `replaceExercise(id, newExercise)` | Remplacer un exercice |
| `shuffleExercises()` | Mélanger l'ordre |
| `nextStep()` / `prevStep()` | Navigation entre étapes |
| `reset()` | Réinitialiser tout le state |

### 8.3 Interface Exercise

```typescript
interface Exercise {
  id: string;
  name: string;
  videoUrl: string | null;
  imageUrl: string | null;
  difficultyLevel: string;
  instructions: string | null;
  instructionsList: string[];
  exerciseTips: string[];
  overview: string;
  equipment: { id: string; name: string; iconUrl: string | null }[];
  muscles: { id: string; name: string; bodyPart: string }[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  sets: number;
  repRange: string;
  restSeconds: number;
}
```

---

## 9. Design System & UI/UX

### 9.1 Palette de Couleurs

| Token | Hex | Usage |
|---|---|---|
| Electric Blue | `#00D4FF` | Couleur primaire, CTAs, liens actifs |
| Neon Purple | `#A855F7` | Couleur secondaire, accents, badges |
| Deep Black | `#050510` | Fond principal |
| Surface Dark | `#0A0A1A` | Surfaces élevées |
| Card Dark | `#111127` | Fond des cartes |
| Border Glow | `#1A1A3E` | Bordures et séparateurs |
| Text Primary | `#E8E8F0` | Texte principal |
| Text Secondary | `#8888A8` | Texte secondaire/muet |
| Success Green | `#00E676` | États de succès |
| Warning Amber | `#FFAB00` | Avertissements, streaks |
| Error Red | `#FF5252` | Erreurs, suppression |

### 9.2 Typographie

| Usage | Police | Graisses |
|---|---|---|
| Corps de texte | Inter | 400 – 900 |
| Titres (h1-h6) | Outfit | 400 – 800 |

### 9.3 Principes de Design

- **Thème :** Dark mode exclusif, esthétique cyber/néon
- **Glassmorphism :** `backdrop-filter: blur(20px)`, fonds translucides `rgba()`, bordures lumineuses au survol
- **Boutons :** Remplissage en dégradé (bleu→violet), ombre néon, effet `translateY` au hover
- **Inputs :** Bords arrondis (12px), anneau lumineux au focus
- **Barres de progression :** Dégradé bleu→violet
- **Border Radius :** Global 16px, Boutons/Inputs 12px, Cartes 20px, Dialogs 24px
- **Buttons :** `textTransform: "none"` (pas de majuscules automatiques)

### 9.4 Animations (Framer Motion)

| Animation | Composant | Détail |
|---|---|---|
| Cascade décalée (stagger) | Listes, grilles | Délai incrémental par élément |
| Échelle au survol | Cartes, boutons | `scale: 1.02` avec spring |
| Transition de page | AnimatedPage | Fondu + glissement (haut, gauche, droite) |
| AnimatePresence | Wizard steps | Entrée/sortie avec fondu et slide |
| Glow pulse | Streak counter | Pulsation quand série ≥ 3 |

### 9.5 Responsive Design

| Breakpoint | Layout |
|---|---|
| `< 900px` (mobile) | Header sticky en haut + barre de navigation fixe en bas |
| `≥ 900px` (desktop) | Sidebar permanente (260px) + zone de contenu |

### 9.6 Composants Réutilisables

| Composant | Props Principales | Description |
|---|---|---|
| `GlassCard` | `glowColor`, `hoverScale` | Carte glassmorphism animée |
| `NeonButton` | `color` (blue/purple/green) | Bouton avec ombre néon |
| `AnimatedPage` | `direction` (up/left/right) | Wrapper de transition de page |
| `StatCard` | `title`, `value`, `icon`, `gradient` | Carte de statistique avec glow |
| `StreakCounter` | `currentStreak`, `longestStreak` | Compteur de série avec badge |

---

## 10. Intégrations Tierces

### 10.1 Supabase

| Service | Usage |
|---|---|
| **Auth** | Inscription/connexion email + Google OAuth |
| **PostgreSQL** | Base de données (accès via Prisma, pas le client Supabase) |
| **JWT** | Tokens vérifiés côté backend avec le JWT secret |
| **SSR** | Gestion de session par cookies via `@supabase/ssr` |

### 10.2 ExerciseDB (RapidAPI)

| Propriété | Valeur |
|---|---|
| **Fournisseur** | AscendAPI via RapidAPI Marketplace |
| **Hôte** | `edb-with-videos-and-images-by-ascendapi.p.rapidapi.com` |
| **Authentification** | Clé API dans `X-RapidAPI-Key` header |
| **Catalogue** | 800+ exercices avec vidéos et images |

**Endpoints utilisés :**

| Endpoint | Usage |
|---|---|
| `GET /api/v1/exercises` | Recherche avec filtres (bodyParts, equipments, limit) |
| `GET /api/v1/exercises/:id` | Détail d'un exercice |
| `GET /api/v1/exercises/search` | Recherche textuelle |
| `GET /api/v1/bodyparts` | Liste des parties du corps |
| `GET /api/v1/equipments` | Liste des équipements |

**Données retournées par exercice :**

| Champ | Type | Description |
|---|---|---|
| `exerciseId` | string | Identifiant unique |
| `name` | string | Nom de l'exercice |
| `videoUrl` | string | URL de la vidéo |
| `imageUrl` | string | URL de l'image |
| `bodyParts` | string[] | Parties du corps |
| `equipments` | string[] | Équipements nécessaires |
| `targetMuscles` | string[] | Muscles principaux ciblés |
| `secondaryMuscles` | string[] | Muscles secondaires |
| `instructions` | string[] | Étapes d'exécution |
| `exerciseTips` | string[] | Conseils |
| `overview` | string | Description générale |
| `gender` | string | "male" / "female" |

### 10.3 Prisma ORM

- **Provider :** PostgreSQL
- **Connexion :** Chaîne directe vers Supabase PostgreSQL
- **Singleton :** Pattern `globalThis` pour éviter les instances multiples en dev
- **Logging :** `["error", "warn"]` en dev, `["error"]` en prod

---

## 11. Logique Métier

### 11.1 Génération d'Entraînement

```
Sélection équipement + muscles
        │
        ▼
Mapping vers format ExerciseDB
  (mapEquipmentToExerciseDB, mapBodyPartToExerciseDB)
        │
        ▼
Requête ExerciseDB (limit: 30)
        │
        ▼
Mélange aléatoire (Fisher-Yates)
        │
        ▼
Sélection des 8 premiers
        │
        ▼
Transformation format interne
  (ajout sets/repRange/restSeconds)
        │
        ▼
Réponse au client
```

### 11.2 Remplacement d'Exercice

1. Recevoir le `bodyPart` de l'exercice à remplacer et les `excludeIds`
2. Chercher 20 exercices similaires via ExerciseDB
3. Filtrer les IDs déjà présents
4. Sélectionner aléatoirement un exercice parmi les restants
5. Retourner l'exercice transformé

### 11.3 Système de Séries (Streak)

```
Séance terminée
       │
       ▼
Vérifier dernière séance (lastWorkoutAt)
       │
       ├─ Aucune séance précédente → streak = 1
       │
       ├─ ≤ 1 jour d'écart (même jour) → pas d'incrément
       │
       ├─ ≤ 1 jour d'écart (jour suivant) → streak + 1
       │
       └─ > 1 jour d'écart → streak = 1 (reset)
       │
       ▼
Mettre à jour currentStreak, longestStreak, lastWorkoutAt
```

### 11.4 Toggle Favori

- Contrainte unique `[userId, exerciseId]`
- Si l'exercice est déjà favori → suppression → `{ isFavorite: false }`
- Sinon → création → `{ isFavorite: true }`

### 11.5 Provisionnement Utilisateur

- `POST /api/v1/user/ensure` appelé automatiquement à chaque connexion
- Utilise `upsert` Prisma : crée l'utilisateur s'il n'existe pas, sinon met à jour `updatedAt`
- Garantit qu'une ligne existe en BD pour chaque utilisateur Supabase Auth

### 11.6 Cache en Mémoire

- Les listes d'équipements et muscles sont cachées 5 minutes en mémoire (backend)
- Évite les requêtes répétées à la BD ou à l'API ExerciseDB
- Invalidation automatique après TTL

---

## 12. Variables d'Environnement

### 12.1 Backend (`backend/.env`)

| Variable | Obligatoire | Défaut | Description |
|---|---|---|---|
| `PORT` | Non | `4000` | Port du serveur Express |
| `NODE_ENV` | Non | `development` | Environnement |
| `DATABASE_URL` | **Oui** | — | URL de connexion PostgreSQL (Supabase) |
| `SUPABASE_URL` | **Oui** | — | URL du projet Supabase |
| `SUPABASE_ANON_KEY` | **Oui** | — | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Oui** | — | Clé service (admin) Supabase |
| `SUPABASE_JWT_SECRET` | **Oui** | — | Secret JWT Supabase |
| `EXERCISEDB_API_KEY` | **Oui** | — | Clé API RapidAPI |
| `EXERCISEDB_API_URL` | Non | `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com` | URL ExerciseDB |
| `EXERCISEDB_API_HOST` | Non | `edb-with-videos-and-images-by-ascendapi.p.rapidapi.com` | Host ExerciseDB |
| `CLIENT_URL` | Non | `http://localhost:3000` | URL du frontend (CORS) |

### 12.2 Frontend (`frontend/.env`)

| Variable | Obligatoire | Défaut | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Oui** | — | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Oui** | — | Clé publique Supabase |
| `NEXT_PUBLIC_API_URL` | Non | `http://localhost:4000` | URL du backend Express |

---

## 13. Arborescence du Projet

```
WorkoutNow/
├── package.json                    # Monorepo root (concurrently)
├── CAHIER_DE_CHARGE.md             # Ce document
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma           # Schéma de base de données
│   └── src/
│       ├── index.ts                 # Point d'entrée Express
│       ├── config/
│       │   └── index.ts             # Configuration (env vars)
│       ├── middleware/
│       │   ├── auth.ts              # JWT verification
│       │   ├── rateLimiter.ts       # Rate limiting
│       │   └── validate.ts          # Zod validation
│       ├── routes/
│       │   ├── index.ts             # Router principal
│       │   ├── exercise.routes.ts   # Routes exercices
│       │   ├── user.routes.ts       # Routes utilisateur
│       │   └── workout.routes.ts    # Routes entraînements
│       ├── controllers/
│       │   ├── exercise.controller.ts
│       │   ├── user.controller.ts
│       │   └── workout.controller.ts
│       └── services/
│           ├── exercisedb.ts        # Client API ExerciseDB
│           └── prisma.ts            # Client Prisma singleton
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── .env.example
    └── src/
        ├── middleware.ts             # Next.js route protection
        ├── app/
        │   ├── layout.tsx            # Root layout (fonts, theme)
        │   ├── page.tsx              # Landing page
        │   ├── auth/
        │   │   └── callback/
        │   │       └── route.ts      # OAuth callback handler
        │   ├── (auth)/
        │   │   ├── login/
        │   │   │   └── page.tsx
        │   │   └── signup/
        │   │       └── page.tsx
        │   └── (protected)/
        │       ├── dashboard/
        │       │   └── page.tsx
        │       ├── workout-generator/
        │       │   └── page.tsx
        │       ├── workout/
        │       │   └── active/
        │       │       └── page.tsx
        │       ├── history/
        │       │   └── page.tsx
        │       ├── favorites/
        │       │   └── page.tsx
        │       └── profile/
        │           └── page.tsx
        ├── components/
        │   ├── layout/
        │   │   ├── AppShell.tsx       # Auth-guarded wrapper
        │   │   ├── Sidebar.tsx        # Desktop navigation
        │   │   ├── Header.tsx         # Mobile top bar
        │   │   └── MobileNav.tsx      # Mobile bottom nav
        │   ├── dashboard/
        │   │   ├── StatCard.tsx
        │   │   └── StreakCounter.tsx
        │   └── ui/
        │       ├── GlassCard.tsx
        │       ├── NeonButton.tsx
        │       └── AnimatedPage.tsx
        ├── lib/
        │   ├── api.ts                 # Axios client + interceptors
        │   └── supabase/
        │       ├── client.ts          # Browser Supabase client
        │       ├── server.ts          # Server Supabase client
        │       └── middleware.ts       # Middleware Supabase client
        ├── store/
        │   ├── useAuthStore.ts        # Auth state (Zustand)
        │   └── useWorkoutStore.ts     # Workout wizard state (Zustand)
        └── theme/
            ├── theme.ts               # MUI dark theme + colors
            └── ThemeRegistry.tsx       # MUI + Emotion SSR provider
```

---

## 14. Déploiement & Scripts

### 14.1 Scripts NPM (Racine)

| Script | Commande | Description |
|---|---|---|
| `dev` | `concurrently "npm run dev:backend" "npm run dev:frontend"` | Lance les deux serveurs en dev |
| `dev:backend` | `cd backend && npm run dev` | Serveur Express (tsx watch) |
| `dev:frontend` | `cd frontend && npm run dev` | Serveur Next.js |
| `build` | `cd backend && npm run build && cd ../frontend && npm run build` | Build production |
| `install:all` | `npm install && cd backend && npm install && cd ../frontend && npm install` | Installation complète |
| `db:push` | `cd backend && npx prisma db push` | Synchroniser schema → BD |
| `db:generate` | `cd backend && npx prisma generate` | Générer le client Prisma |
| `db:studio` | `cd backend && npx prisma studio` | Interface admin BD |
| `lint` | `cd frontend && npm run lint` | ESLint sur le frontend |

### 14.2 Prérequis pour le Lancement

1. **Node.js** 18+ installé
2. **Projet Supabase** créé (Auth activé, base PostgreSQL)
3. **Clé RapidAPI** pour ExerciseDB
4. Copier `.env.example` → `.env` dans `backend/` et `frontend/`
5. Remplir les variables d'environnement
6. `npm run install:all`
7. `npm run db:push` (synchroniser le schéma)
8. `npm run dev` (démarre les deux serveurs)

### 14.3 Ports

| Service | Port | URL |
|---|---|---|
| Backend Express | 4000 | `http://localhost:4000` |
| Frontend Next.js | 3000 | `http://localhost:3000` |
| Prisma Studio | 5555 | `http://localhost:5555` |

---

> **Fin du Cahier de Charge — WorkoutNow v2.0**
