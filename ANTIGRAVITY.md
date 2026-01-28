# ANTIGRAVITY.md

## Core Rules
- Use **only pnpm** as the package manager. Never use npm or yarn. [github](https://github.com/orgs/pnpm/discussions/4735)
- Do not run `pnpm dev` or any development server unless explicitly instructed by the user. [reddit](https://www.reddit.com/r/nextjs/comments/1ehkgy5/nextjs_pnpm_the_worst_combo_they_had_the/)

## Package Management
- Install dependencies with `pnpm install`.
- Run scripts using `pnpm run <script>`.
- Commit `pnpm-lock.yaml` to version control. [answers.netlify](https://answers.netlify.com/t/using-pnpm-and-pnpm-workspaces/2759)

## Development Workflow
- Before suggesting or executing dev server commands, confirm with user: "Do you want me to start the dev server now?"
- For builds: use `pnpm build` only when requested.
- Use Next.js 15+ best practices with App Router and TypeScript. [antigravity](https://antigravity.codes/workflows/production/setup-nextjs-seo-sitemap-robots-jsonld)

## Project Standards
- Stack: Next.js, React, Tailwind CSS, TypeScript.
- Folder structure: Follow Next.js conventions (`app/`, `components/`, `lib/`).
- Code style: ESLint + Prettier, enforced via `pnpm lint`.
- Testing: Vitest or Jest if added. [datacamp](https://www.datacamp.com/tutorial/google-antigravity-tutorial)

## Safety Instructions
- Never auto-execute terminal commands without approval.
- Scan changes before applying; ask for confirmation on file modifications.
- Respect `.gitignore` and `pnpm-workspace.yaml` if present. [reddit](https://www.reddit.com/r/GoogleAntigravityIDE/comments/1pgf6dt/antigravitys_geminimd_file/)