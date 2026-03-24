# Blogging

Local dev (no change):

- Login with .env password
- Drafts save to src/drafts/ files
- Publish writes into posts.ts locally

Production:

- Login with a GitHub Personal Access Token (needs repo scope)
- Drafts auto-save to your browser's localStorage
- Publish commits directly to posts.ts in your GitHub repo via the API, with a commit message like publish: On Slowing Down
- If you have CI/CD (Vercel, Netlify, etc.), the site auto-rebuilds

Setup needed for production:

1. Set VITE_GITHUB_REPO in your hosting platform's env vars (currently sudokufan/alex.day in .env — adjust if needed)
2. Create a GitHub PAT at github.com/settings/tokens with repo scope
3. Use that token as your login at /admin on the live site
