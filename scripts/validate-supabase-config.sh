#!/bin/bash

# Supabase Configuration Validator
# This script validates that all required files and configurations are in place

set -e

echo "🔍 Supabase Configuration Validator"
echo "===================================="
echo ""

ERRORS=0
WARNINGS=0

# Function to report error
error() {
    echo "❌ ERROR: $1"
    ((ERRORS++))
}

# Function to report warning
warning() {
    echo "⚠️  WARNING: $1"
    ((WARNINGS++))
}

# Function to report success
success() {
    echo "✅ $1"
}

# Check config.toml exists
echo "Checking Supabase configuration files..."
if [ -f "supabase/config.toml" ]; then
    success "supabase/config.toml exists"
    
    # Check if project_id is set
    if grep -q "project_id = \"qwpegrmoqkgtioddyonv\"" supabase/config.toml; then
        success "Project ID is configured"
    else
        error "Project ID is not configured in config.toml"
    fi
else
    error "supabase/config.toml not found"
fi

echo ""

# Check edge functions
echo "Checking edge functions..."
FUNCTIONS=("ai-assist" "check-domain" "publish-website")
for func in "${FUNCTIONS[@]}"; do
    if [ -f "supabase/functions/$func/index.ts" ]; then
        success "Edge function '$func' exists"
    else
        error "Edge function '$func' not found"
    fi
done

echo ""

# Check migrations
echo "Checking database migrations..."
MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
if [ $MIGRATION_COUNT -gt 0 ]; then
    success "Found $MIGRATION_COUNT migration file(s)"
    for migration in supabase/migrations/*.sql; do
        echo "   - $(basename $migration)"
    done
else
    warning "No migration files found"
fi

echo ""

# Check .env file
echo "Checking environment configuration..."
if [ -f ".env" ]; then
    success ".env file exists"
    
    # Check required variables
    REQUIRED_VARS=("VITE_SUPABASE_URL" "VITE_SUPABASE_PUBLISHABLE_KEY" "VITE_SUPABASE_PROJECT_ID")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env; then
            success "Environment variable $var is set"
        else
            error "Environment variable $var is not set in .env"
        fi
    done
else
    warning ".env file not found (use .env.example as template)"
fi

echo ""

# Check GitHub workflow
echo "Checking GitHub Actions workflow..."
if [ -f ".github/workflows/deploy-supabase.yml" ]; then
    success "Supabase deployment workflow exists"
else
    error "GitHub Actions workflow for Supabase not found"
fi

echo ""

# Check documentation
echo "Checking documentation..."
DOCS=("SUPABASE_DEPLOYMENT.md" "SUPABASE_QUICKREF.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        success "Documentation file '$doc' exists"
    else
        warning "Documentation file '$doc' not found"
    fi
done

echo ""

# Check scripts
echo "Checking setup scripts..."
if [ -f "scripts/setup-supabase.sh" ]; then
    success "Setup script exists"
    if [ -x "scripts/setup-supabase.sh" ]; then
        success "Setup script is executable"
    else
        warning "Setup script is not executable (run: chmod +x scripts/setup-supabase.sh)"
    fi
else
    warning "Setup script not found"
fi

echo ""

# Check package.json scripts
echo "Checking npm scripts..."
if [ -f "package.json" ]; then
    SCRIPTS=("supabase:start" "supabase:stop" "supabase:link" "supabase:db:push" "supabase:functions:deploy")
    for script in "${SCRIPTS[@]}"; do
        if grep -q "\"$script\":" package.json; then
            success "npm script '$script' is configured"
        else
            warning "npm script '$script' not found in package.json"
        fi
    done
else
    error "package.json not found"
fi

echo ""
echo "===================================="
echo "Validation Complete"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo "❌ Found $ERRORS error(s)"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "⚠️  Found $WARNINGS warning(s)"
fi

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Configuration is valid."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "✅ Configuration is valid with some warnings."
    exit 0
else
    echo "❌ Configuration has errors. Please fix them before deploying."
    exit 1
fi
