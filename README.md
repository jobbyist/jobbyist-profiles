# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ca7da371-b69b-4a00-b0d2-ef38af1e2378

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ca7da371-b69b-4a00-b0d2-ef38af1e2378) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is configured for automatic deployment to GitHub Pages.

**Automatic Deployment**

The project automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow:

1. Builds the project using `npm run build`
2. Deploys the built files to GitHub Pages
3. Serves the site at the custom domain: **profiles.jobbyist.africa**

**Manual Deployment**

You can also trigger a manual deployment:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" and select the `main` branch

**GitHub Pages Configuration**

To enable GitHub Pages for this repository:

1. Go to Settings → Pages in the GitHub repository
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Configure your DNS provider to point **profiles.jobbyist.africa** to GitHub Pages:
   - Add a CNAME record pointing to `<username>.github.io`
   - Or add A records pointing to GitHub Pages IP addresses (see [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))

Alternatively, you can also deploy via [Lovable](https://lovable.dev/projects/ca7da371-b69b-4a00-b0d2-ef38af1e2378) by clicking Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

**For GitHub Pages (Current Setup)**

This project is configured to use the custom domain **profiles.jobbyist.africa**. The domain is set via the `CNAME` file in the `public/` directory.

To use your own custom domain:
1. Update `public/CNAME` with your domain name
2. Configure your DNS provider to point to GitHub Pages (see deployment section above)
3. Push your changes to the `main` branch
4. Wait for GitHub Actions to deploy

**For Lovable**

To connect a domain via Lovable, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
