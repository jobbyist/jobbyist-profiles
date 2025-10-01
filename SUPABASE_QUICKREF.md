# Supabase Quick Reference

Quick reference for common Supabase operations in this project.

## Initial Setup

```bash
# Install Supabase CLI (macOS/Linux)
brew install supabase/tap/supabase

# Run setup script
./scripts/setup-supabase.sh

# Or manually
supabase login
npm run supabase:link
```

## Local Development

```bash
# Start local Supabase
npm run supabase:start

# Stop local Supabase
npm run supabase:stop

# Check status
npm run supabase:status

# Reset database (reapply all migrations)
npm run supabase:db:reset
```

## Database Operations

```bash
# Push migrations to remote
npm run supabase:db:push

# Create a new migration
supabase migration new <migration_name>

# List migrations
supabase migration list

# Apply migrations locally
supabase db reset
```

## Edge Functions

```bash
# Deploy all functions
npm run supabase:functions:deploy

# Deploy specific function
supabase functions deploy ai-assist
supabase functions deploy check-domain
supabase functions deploy publish-website

# Test function locally
supabase functions serve
supabase functions serve ai-assist --no-verify-jwt

# View function logs
supabase functions logs ai-assist
supabase functions logs check-domain
supabase functions logs publish-website
```

## Secrets Management

```bash
# Set a secret
supabase secrets set MY_SECRET=value

# List secrets
supabase secrets list

# Unset a secret
supabase secrets unset MY_SECRET

# Set multiple secrets from file
echo "KEY1=value1" > .env.secrets
echo "KEY2=value2" >> .env.secrets
supabase secrets set --env-file .env.secrets
rm .env.secrets
```

## Common Commands

```bash
# View project info
supabase projects list
supabase status

# Generate TypeScript types from database
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Open Supabase Studio (local)
# Visit http://localhost:54323

# Open Supabase Dashboard (remote)
supabase projects open
```

## Troubleshooting

```bash
# Reset everything and start fresh
npm run supabase:stop
supabase db reset
npm run supabase:start

# Check logs
supabase functions logs <function-name>

# Repair migration history
supabase migration repair --status applied <version>

# Re-link project
supabase unlink
npm run supabase:link
```

## GitHub Actions

Automatic deployment happens when you push to `main` with changes to:
- `supabase/functions/**`
- `supabase/migrations/**`

Or trigger manually:
1. Go to Actions tab
2. Select "Deploy to Supabase"
3. Click "Run workflow"

## Environment Variables

### Local Development (.env)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### GitHub Secrets (for CI/CD)
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `LOVABLE_API_KEY`
- `NAMECOM_API_KEY`
- `NAMECOM_USERNAME`

### Edge Function Secrets (set via CLI)
- `LOVABLE_API_KEY` - for ai-assist function
- `NAMECOM_API_KEY` - for domain functions
- `NAMECOM_USERNAME` - for domain functions

## Project Details

- **Project ID**: `qwpegrmoqkgtioddyonv`
- **Project URL**: `https://qwpegrmoqkgtioddyonv.supabase.co`
- **Local API**: `http://localhost:54321`
- **Local Studio**: `http://localhost:54323`

## Resources

- [Full Documentation](./SUPABASE_DEPLOYMENT.md)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
