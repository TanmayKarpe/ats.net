# ATS - Analytical Testing Services Portal

A modern React + Vite + TypeScript web application for Kavayitri Bahinabai Chaudhari North Maharashtra University's Analytical Testing Services.

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Admin Portal Setup

The admin portal uses environment-based development authentication. See [docs/admin-dev-setup.md](./docs/admin-dev-setup.md) for complete setup instructions.

### Quick Admin Access

```bash
# Set your development key in .env.local
echo "VITE_ADMIN_DEV_KEY=your_dev_key_here" >> .env.local

# Start the dev server
npm run dev

# Visit http://localhost:5173/admin/login
# Enter your dev key and log in
```

## Project Structure

```
src/
  components/          - Reusable React components
    layout/           - Header, Footer, Layout components
    sections/         - Page sections (Hero, About, etc)
    ui/              - shadcn/ui components
  pages/              - Page components
    admin/           - Admin pages (login, dashboard)
  data/               - Local data files
  contexts/           - React contexts (auth, etc)
  hooks/              - Custom React hooks
  __tests__/          - Unit and integration tests
docs/
  admin-dev-setup.md  - Admin development guide
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build with dev optimizations
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
npm run test         # Run tests (when configured)
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **State**: React Context + TanStack Query
- **Testing**: Vitest + Playwright (when configured)
- **Auth**: Local dev + Supabase (optional)

## Key Features

- ✅ Public website with instrument catalog
- ✅ Admin portal with dev key authentication
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support (via theme system)
- ✅ Type-safe TypeScript throughout
- ✅ Component-driven UI with Tailwind CSS

## Admin Authentication

The admin system supports two authentication modes:

1. **Local Development** (default)
   - Set `VITE_ADMIN_DEV_KEY` in `.env.local`
   - If not set, a paste-once modal appears on login page

2. **Supabase** (future)
   - Set `VITE_USE_SUPABASE=true`
   - Configure Supabase credentials

See [docs/admin-dev-setup.md](./docs/admin-dev-setup.md) for details.

## Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Test locally: `npm run dev`
4. Commit with clear messages: `git commit -m "feat: description"`
5. Push and open a pull request

## License

Proprietary - Kavayitri Bahinabai Chaudhari North Maharashtra University

## Support

For issues or questions, check the documentation or open an issue on GitHub.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
