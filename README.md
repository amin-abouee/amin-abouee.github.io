# aabouee.github.io

Personal website of [Amin Abouee](https://aabouee.github.io) — robotics and computer vision engineer (SLAM, VIO, state estimation).

Built from the [magicuidesign/portfolio](https://github.com/magicuidesign/portfolio) template with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Magic UI](https://magicui.design/) and MDX (via content-collections). Fully static (`output: 'export'`), deployed to GitHub Pages with GitHub Actions.

## Editing content

- [`src/data/resume.tsx`](src/data/resume.tsx) — single source of truth: name, avatar, summary, skills, work, education, projects, publications, contact links, navbar.
- [`content/`](content/) — blog posts (MDX with `title`, `publishedAt`, `summary`).
- Company/university logos: drop images into `public/` and set `logoUrl`.

## Develop

```sh
npm install
npm run dev    # http://localhost:3000
npm run build  # static export into out/
```

## Deploy

Push to `main` — `.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages.

Prerequisite (one-time): the repo's **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**.
