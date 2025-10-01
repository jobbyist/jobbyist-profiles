# Domain Registration & Website Publishing Feature

This document describes the domain registration and website publishing feature integrated with Name.com API.

## Overview

Users can now publish their resumes as professional websites with custom `.me` or `.cv` domains, in addition to downloading them as PDFs.

## Features

### User Interface Changes

- **Finish Button**: Replaced the "Download PDF" button with a "Finish" dropdown button in the BuilderNew page
- **Two Options**:
  1. **Download as a PDF**: Downloads the resume as a PDF file (existing functionality)
  2. **Publish as a website**: Opens a dialog to register a domain and publish the resume

### Domain Registration

- **Supported TLDs**: `.me` and `.cv` domains
- **API Integration**: Name.com API (Development environment)
  - API URL: `https://api.dev.name.com`
  - API Key: `4841da18ed841dbd4708bb4052a054428172e583`
- **Real-time Availability**: Check domain availability before registration
- **User-friendly Interface**: Simple dialog with domain input and TLD selection

### Website Publishing

- **Static HTML Generation**: Generates a professional, responsive HTML website from resume data
- **Templates**: Clean, modern design with:
  - Personal information header
  - Professional summary
  - Work experience section
  - Education section
  - Skills display
- **Responsive Design**: Mobile-friendly layout
- **Print-ready**: Optimized for printing directly from the browser

### Database Schema

New table: `published_websites`
- `id`: UUID (primary key)
- `resume_id`: UUID (foreign key to resumes table)
- `domain`: TEXT (unique)
- `html_content`: TEXT (generated HTML)
- `template_id`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

Updated `resumes` table with:
- `published_url`: TEXT (stores the published domain)
- `published_at`: TIMESTAMP (publication timestamp)

## Technical Implementation

### Frontend Components

1. **PublishWebsiteDialog** (`src/components/builder/PublishWebsiteDialog.tsx`)
   - Domain name input with validation
   - TLD selection (`.me` or `.cv`)
   - Domain availability checker
   - Publication workflow

2. **PublishedResume** (`src/pages/PublishedResume.tsx`)
   - Public page for viewing published resumes
   - Loads HTML content from database
   - Route: `/resume/:domain`

3. **BuilderNew** (`src/pages/BuilderNew.tsx`)
   - Updated with Finish dropdown button
   - Integration with PublishWebsiteDialog

### Backend Functions

1. **check-domain** (`supabase/functions/check-domain/index.ts`)
   - Checks domain availability via Name.com API
   - Returns availability status and price
   - Error handling for API failures

2. **publish-website** (`supabase/functions/publish-website/index.ts`)
   - Registers domain via Name.com API
   - Generates static HTML from resume data
   - Stores website in database
   - Updates resume with publication info

### Security

- Row Level Security (RLS) policies enabled on `published_websites` table
- Users can only manage their own published websites
- Public read access for viewing published websites
- API keys stored as environment variables in Supabase

## Usage Flow

1. User completes their resume in the builder
2. Clicks the "Finish" button
3. Selects "Publish as a website" from the dropdown
4. Enters desired domain name (e.g., "johnsmith")
5. Selects TLD (.me or .cv)
6. Clicks "Check Availability"
7. If available, clicks "Publish Website"
8. System registers the domain and publishes the website
9. User receives confirmation with the website URL

## Environment Variables

Required environment variables (set in Supabase dashboard):
- `NAMECOM_API_KEY`: Name.com API key (default: 4841da18ed841dbd4708bb4052a054428172e583)
- `NAMECOM_USERNAME`: Name.com username (default: jobbyist)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Development Notes

- The implementation uses the Name.com development API endpoint
- In production, the API URL should be changed to `https://api.name.com`
- Domain registration in development mode may not charge actual fees
- The generated HTML is self-contained with inline CSS for portability

## Future Enhancements

- Multiple template selection for published websites
- Custom DNS configuration options
- Analytics integration for published websites
- Custom domain support (CNAME)
- Website preview before publishing
- Edit and republish functionality
- Domain management dashboard

## Testing

To test the feature:
1. Navigate to the builder page (`/builder/:id`)
2. Complete the resume information
3. Click the "Finish" button
4. Select "Publish as a website"
5. Enter a test domain name
6. Check availability (using dev API)
7. Publish (in dev mode, may not actually register)

## Files Modified/Created

### Modified
- `src/App.tsx` - Added PublishedResume route
- `src/pages/BuilderNew.tsx` - Replaced download button with Finish dropdown

### Created
- `src/components/builder/PublishWebsiteDialog.tsx` - Main dialog component
- `src/pages/PublishedResume.tsx` - Public viewing page
- `supabase/functions/check-domain/index.ts` - Domain availability checker
- `supabase/functions/publish-website/index.ts` - Website publisher
- `supabase/migrations/20250101000000_published_websites.sql` - Database schema

## Support

For issues related to:
- **Domain registration**: Check Name.com API documentation
- **Website publishing**: Review Supabase function logs
- **Database**: Check Supabase dashboard and RLS policies
