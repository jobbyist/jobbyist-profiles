#!/bin/bash

# Supabase Setup Script
# This script helps set up Supabase for local development

set -e

echo "🚀 Jobbyist Profiles - Supabase Setup"
echo "======================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed"
    echo ""
    echo "Please install it using one of the following methods:"
    echo ""
    echo "macOS/Linux:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "npm:"
    echo "  npm install -g supabase"
    echo ""
    echo "For other methods, visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI is installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please update .env with your actual credentials before continuing"
    echo ""
    read -p "Press Enter when you've updated the .env file..."
else
    echo "✅ .env file exists"
fi

echo ""

# Login to Supabase
echo "🔐 Logging in to Supabase..."
if supabase login; then
    echo "✅ Successfully logged in to Supabase"
else
    echo "❌ Failed to login to Supabase"
    exit 1
fi

echo ""

# Link to project
echo "🔗 Linking to Supabase project..."
if supabase link --project-ref qwpegrmoqkgtioddyonv; then
    echo "✅ Successfully linked to Supabase project"
else
    echo "❌ Failed to link to Supabase project"
    exit 1
fi

echo ""

# Ask if user wants to start local Supabase
read -p "Do you want to start local Supabase? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Starting local Supabase..."
    supabase start
    echo ""
    echo "✅ Local Supabase is running!"
    echo ""
    echo "Access points:"
    echo "  API URL: http://localhost:54321"
    echo "  Studio: http://localhost:54323"
    echo "  DB: postgresql://postgres:postgres@localhost:54322/postgres"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start the development server: npm run dev"
echo "  2. Apply migrations locally: npm run supabase:db:reset"
echo "  3. Test edge functions: supabase functions serve"
echo ""
echo "For more information, see SUPABASE_DEPLOYMENT.md"
