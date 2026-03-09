# 🔧 Environment Setup Quick Reference

## Backend (.env)

Create `backend/.env` with these variables:

```env
# Server
PORT=4000
NODE_ENV=development

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Supabase Auth
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# ExerciseDB API (RapidAPI)
EXERCISEDB_API_KEY=4a77fcb281mshec6695345477f3ep1cd4fcjsnd611e2876a5a
EXERCISEDB_API_URL=https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
EXERCISEDB_API_HOST=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com

# CORS
CLIENT_URL=http://localhost:3000
```

## Frontend (.env.local)

Create `frontend/.env.local` with these variables:

```env
# Supabase (Public - Safe for Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 📝 Notes

### ExerciseDB API Key
- **Current Key**: Already included above (shared demo key)
- **Get Your Own**: Visit [RapidAPI ExerciseDB](https://rapidapi.com/ascendapi/api/edb-with-videos-and-images-by-ascendapi)
- **Free Tier**: Check RapidAPI for current limits
- **Documentation**: See [EXERCISEDB_API.md](./EXERCISEDB_API.md)

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Get API keys from Settings → API
4. Run Prisma migrations: `cd backend && npx prisma migrate dev`
5. Seed database: `npm run seed`

### Testing API Connection
```bash
cd backend
node test-api.js
```

Should show:
- ✅ Liveness Check
- ✅ Body Parts (18 types)
- ✅ Equipment (28 types)
- ✅ Sample Exercises

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Setup Environment**
   - Copy `.env.example` files
   - Fill in Supabase credentials
   - ExerciseDB key already provided

3. **Setup Database**
   ```bash
   cd backend
   npx prisma migrate dev
   npm run seed
   ```

4. **Start Development**
   ```bash
   # From root directory
   npm run dev
   
   # Or manually:
   cd backend && npm run dev  # Port 4000
   cd frontend && npm run dev # Port 3000
   ```

5. **Access App**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - Health: http://localhost:4000/health

## 🔍 Verify Setup

**Backend Health Check:**
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Frontend:**
- Visit http://localhost:3000
- Should redirect to login if not authenticated
- Sign up → Should redirect to dashboard

## 📚 Additional Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [EXERCISEDB_API.md](./EXERCISEDB_API.md) - API documentation
- [SEEDING_GUIDE.md](./backend/SEEDING_GUIDE.md) - Database seeding
- [README.md](./README.md) - Full documentation
