# ExerciseDB API Configuration

## Overview
This app uses the **ExerciseDB with Videos and Images** API from RapidAPI (AscendAPI) to provide 1300+ exercises with videos, images, and detailed instructions.

## API Setup

### 1. Environment Variables

The API is configured in `backend/.env`:

```env
# ExerciseDB (RapidAPI)
EXERCISEDB_API_KEY=4a77fcb281mshec6695345477f3ep1cd4fcjsnd611e2876a5a
EXERCISEDB_API_URL=https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
EXERCISEDB_API_HOST=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
```

### 2. API Configuration

Location: `backend/src/config/index.ts`

```typescript
exerciseDB: {
  apiKey: process.env.EXERCISEDB_API_KEY || "",
  apiUrl: process.env.EXERCISEDB_API_URL || "https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
  apiHost: process.env.EXERCISEDB_API_HOST || "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
}
```

### 3. Service Implementation

Location: `backend/src/services/exercisedb.ts`

The `ExerciseDBClient` class provides methods to:
- Fetch exercises with filters
- Get exercise by ID
- Search exercises by name
- Get all body parts
- Get all equipment types

## API Endpoints

### 1. Liveness Check
```bash
GET /api/v1/liveness
Response: { "status": "we're so back" }
```

### 2. Get Body Parts
```bash
GET /api/v1/bodyparts
Response: {
  "success": true,
  "data": [
    { "name": "CHEST", "imageUrl": "..." },
    { "name": "BACK", "imageUrl": "..." },
    ...
  ]
}
```

### 3. Get Equipment
```bash
GET /api/v1/equipments
Response: {
  "success": true,
  "data": [
    { "name": "BARBELL", "imageUrl": "..." },
    { "name": "DUMBBELL", "imageUrl": "..." },
    ...
  ]
}
```

### 4. Get Exercises
```bash
GET /api/v1/exercises?limit=20&bodyParts=CHEST&equipments=BARBELL
Response: {
  "success": true,
  "meta": {
    "total": 200,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "exr_..."
  },
  "data": [
    {
      "exerciseId": "exr_...",
      "name": "Bench Press",
      "imageUrl": "https://cdn.exercisedb.dev/...",
      "videoUrl": "https://cdn.exercisedb.dev/...",
      "bodyParts": ["CHEST"],
      "equipments": ["BARBELL"],
      "exerciseType": "STRENGTH",
      "targetMuscles": ["PECTORALIS MAJOR"],
      "secondaryMuscles": ["TRICEPS", "SHOULDERS"],
      "overview": "...",
      "instructions": ["Step 1...", "Step 2..."],
      "exerciseTips": ["Tip 1...", "Tip 2..."],
      "keywords": ["chest", "push", "barbell"]
    },
    ...
  ]
}
```

### 5. Get Exercise by ID
```bash
GET /api/v1/exercises/{exerciseId}
Response: {
  "success": true,
  "data": { ...exercise object... }
}
```

### 6. Search Exercises
```bash
GET /api/v1/exercises/search?q=bench&limit=10
Response: {
  "success": true,
  "data": [...exercises matching query...]
}
```

## Testing the API

Run the test script to verify the API is working:

```bash
cd backend
node test-api.js
```

This will test:
- ✅ Liveness check
- ✅ Body parts endpoint
- ✅ Equipment endpoint
- ✅ Exercises endpoint

## Usage in Your App

### Backend Service
```typescript
import { exerciseDBClient } from './services/exercisedb';

// Get exercises with filters
const exercises = await exerciseDBClient.getExercises({
  bodyParts: ['CHEST', 'BACK'],
  equipments: ['BARBELL', 'DUMBBELL'],
  limit: 20
});

// Get all available body parts
const bodyParts = await exerciseDBClient.getAllBodyParts();

// Get all available equipment
const equipment = await exerciseDBClient.getAllEquipments();

// Search exercises
const results = await exerciseDBClient.searchExercises('bench press', 10);

// Get specific exercise
const exercise = await exerciseDBClient.getExerciseById('exr_...');
```

### Response Format Handling

The API returns data in this format:
```typescript
{
  success: boolean;
  data: T | T[];
  meta?: {
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
  }
}
```

The service automatically extracts the `data` field and handles both array and object responses.

## Features

### Exercise Data Includes:
- ✅ High-quality images
- ✅ MP4 video demonstrations
- ✅ Step-by-step instructions
- ✅ Exercise tips
- ✅ Target muscles (primary & secondary)
- ✅ Body parts worked
- ✅ Required equipment
- ✅ Exercise type (STRENGTH, CARDIO, etc.)
- ✅ Keywords for search

### Caching
The service includes in-memory caching for equipment and muscle lists to reduce API calls and improve performance.

## Rate Limits

Check your RapidAPI dashboard for rate limits on your subscription tier.

## Troubleshooting

### API Not Working?
1. Check your API key is correct in `.env`
2. Verify the API URL and host are correct
3. Run `node test-api.js` to test connectivity
4. Check RapidAPI dashboard for quota/limits
5. Verify your subscription is active

### Common Issues

**"ExerciseDB API key is not configured"**
- Make sure `.env` file exists in backend folder
- Check `EXERCISEDB_API_KEY` is set correctly

**Empty results**
- Check your filter combinations
- Try broader filters (fewer restrictions)
- Verify body part and equipment names match API format

**Rate limit errors**
- Check your RapidAPI subscription limits
- Implement caching to reduce API calls
- Use the workout generation service which has built-in caching

## Getting Your Own API Key

1. Go to [RapidAPI](https://rapidapi.com)
2. Sign up/Login
3. Subscribe to [ExerciseDB with Videos and Images by AscendAPI](https://rapidapi.com/ascendapi/api/edb-with-videos-and-images-by-ascendapi)
4. Copy your API key
5. Update `backend/.env` with your key
