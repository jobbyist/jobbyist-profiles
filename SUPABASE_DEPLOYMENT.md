# Supabase Deployment Guide

This guide explains how to deploy edge functions and database migrations to Supabase for the Jobbyist Profiles project.

## Prerequisites

1. **Supabase CLI**: Install the Supabase CLI
   ```bash
   # macOS/Linux
   brew install supabase/tap/supabase
   
   # Windows (via Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   
   # Or via npm
   npm install -g supabase
   ```

2. **Supabase Access Token**: Generate a token from your Supabase dashboard
   - Go to https://supabase.com/dashboard/account/tokens
   - Generate a new access token
   - Save it securely (you'll need it for deployment)

3. **Environment Variables**: Ensure you have the following secrets set in your GitHub repository:
   - `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
   - `SUPABASE_DB_PASSWORD`: Your Supabase database password
   - `LOVABLE_API_KEY`: API key for the AI assist function
   - `NAMECOM_API_KEY`: Name.com API key for domain registration
   - `NAMECOM_USERNAME`: Name.com username

## Project Configuration

The project is configured with:
- **Project ID**: `qwpegrmoqkgtioddyonv`
- **Project URL**: `https://qwpegrmoqkgtioddyonv.supabase.co`

## Local Development

### 1. Link to Supabase Project

```bash
# Login to Supabase
supabase login

# Link to the project
npm run supabase:link
# or
supabase link --project-ref qwpegrmoqkgtioddyonv
```

### 2. Start Local Supabase

```bash
npm run supabase:start
```

This will start a local Supabase instance with:
- API: http://localhost:54321
- Studio: http://localhost:54323
- Database: postgresql://postgres:postgres@localhost:54322/postgres

### 3. Apply Migrations Locally

```bash
npm run supabase:db:reset
```

### 4. Test Edge Functions Locally

```bash
# Serve all functions
supabase functions serve

# Serve a specific function
supabase functions serve ai-assist
```

## Deployment

### Automatic Deployment (Recommended)

The project uses GitHub Actions for automatic deployment. Deployments are triggered:

1. **When you push to main branch** with changes to:
   - `supabase/functions/**`
   - `supabase/migrations/**`
   - Workflow file itself

2. **Manual trigger**: Go to Actions → Deploy to Supabase → Run workflow

The workflow will:
1. Deploy database migrations
2. Deploy all edge functions
3. Set environment variables/secrets for functions

### Manual Deployment

If you need to deploy manually:

#### Deploy Database Migrations

```bash
# Push migrations to remote database
npm run supabase:db:push
# or
supabase db push
```

#### Deploy Edge Functions

```bash
# Deploy all functions
npm run supabase:functions:deploy

# Deploy specific function
supabase functions deploy ai-assist --no-verify-jwt
supabase functions deploy check-domain --no-verify-jwt
supabase functions deploy publish-website --no-verify-jwt
```

#### Set Function Secrets

```bash
# Set secrets for specific functions
supabase secrets set LOVABLE_API_KEY=your_key_here
supabase secrets set NAMECOM_API_KEY=your_key_here
supabase secrets set NAMECOM_USERNAME=your_username_here
```

## Edge Functions

The project has three edge functions:

### 1. ai-assist
- **Path**: `supabase/functions/ai-assist/index.ts`
- **Purpose**: Provides AI-powered content suggestions for resumes
- **JWT Verification**: Yes
- **Required Secrets**: `LOVABLE_API_KEY`

### 2. check-domain
- **Path**: `supabase/functions/check-domain/index.ts`
- **Purpose**: Checks domain availability via Name.com API
- **JWT Verification**: No (public endpoint)
- **Required Secrets**: `NAMECOM_API_KEY`, `NAMECOM_USERNAME`

### 3. publish-website
- **Path**: `supabase/functions/publish-website/index.ts`
- **Purpose**: Registers domains and publishes resume websites
- **JWT Verification**: Yes
- **Required Secrets**: `NAMECOM_API_KEY`, `NAMECOM_USERNAME`

## Database Migrations

Migrations are located in `supabase/migrations/`:

1. **20251001121834_6b5aceab-1c8e-4942-b65a-43ef88fa9be8.sql**
   - Creates `profiles` and `resumes` tables
   - Sets up Row Level Security (RLS) policies
   - Creates triggers for auto-updates

2. **20250101000000_published_websites.sql**
   - Creates `published_websites` table
   - Adds publication columns to `resumes` table
   - Sets up RLS policies for website publishing

## Troubleshooting

### Cannot Link to Project

```bash
# Make sure you're logged in
supabase login

# Try linking with explicit project ref
supabase link --project-ref qwpegrmoqkgtioddyonv
```

### Migration Fails

```bash
# Check migration status
supabase migration list

# Repair migration history if needed
supabase migration repair --status applied <migration_version>
```

### Function Deployment Fails

```bash
# Check function logs
supabase functions logs ai-assist

# Verify JWT settings in config.toml match deployment flags
```

### Local Development Issues

```bash
# Stop and clean up
npm run supabase:stop

# Start fresh
npm run supabase:start
npm run supabase:db:reset
```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Support

For issues related to:
- **Supabase deployment**: Check GitHub Actions logs and Supabase dashboard
- **Edge functions**: Review function logs in Supabase dashboard
- **Database migrations**: Check migration status with `supabase migration list`
