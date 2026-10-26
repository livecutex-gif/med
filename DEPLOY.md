# Deploying MediCare Hospital to Vercel

The app deploys to **https://medicare-hospital-demo.vercel.app** (project name:
`medicare-hospital-demo`). Everything is scripted — you only need two things:

1. **A managed Postgres database.** The demo uses ordinary Postgres + Drizzle, so
   any hosted Postgres works. [Neon](https://neon.tech) (free tier) is the
   fastest: *Sign up → New Project → copy the connection string* (the "pooled"
   one is ideal).
2. **Vercel access.** Either `npx vercel login` interactively, or a token from
   <https://vercel.com/account/tokens>.

## One-command deploy

```bash
export DATABASE_URL="postgresql://user:password@host/database"
# and optionally:
export VERCEL_TOKEN="your-token"

bash scripts/deploy-vercel.sh
```

The script will:

1. Create (or reuse) the Vercel project `medicare-hospital-demo`
2. Set `DATABASE_URL` for production + preview
3. Push the Drizzle schema to your managed database
4. Seed the fictional departments, doctors, and sample records
5. Deploy to production

### Notes

- **Name taken?** If someone else already owns `medicare-hospital-demo`, run
  with `VERCEL_PROJECT_NAME=medicare-hospital-care bash scripts/deploy-vercel.sh`
  (or any name you like — the URL follows the project name).
- **Auto-seed safety net:** even without step 4, the app detects an empty
  database on first request and seeds the fictional data automatically (via a
  Postgres advisory lock). Schema still needs `drizzle-kit push` once — the
  script does it for you.
- **Git-based deploys:** you can also push this repo to GitHub/GitLab and use
  *Vercel → Add New → Project → Import*. Set `DATABASE_URL` in the project
  settings, and run `npx drizzle-kit push` + `npx tsx scripts/seed.ts` once
  from your machine afterwards (or rely on the auto-seed).
- This remains a **fictional demonstration**: no authentication on `/admin`,
  no real patient data.
