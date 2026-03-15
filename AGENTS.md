# Project Guidelines for Agents

This project is a Sudoku web app built with Next.js and deployed using GitHub Pages.

## Deployment Constraints

The application must remain compatible with **GitHub Pages static hosting**.

Because of this:

- The project must support **Next.js static export (`output: "export"`)**
- Do NOT introduce **server-side rendering (`getServerSideProps`)**
- Do NOT introduce **Next.js API routes**
- Do NOT add backend dependencies requiring a server runtime
- All logic must run **client-side**

## Data & APIs

If external services are needed (authentication, storage, leaderboard, etc.), they must use **client-side APIs** such as:

- Supabase
- Firebase
- REST APIs accessible from the browser

## Routing

- Use **static-compatible routing**
- Avoid dynamic server-generated pages
- Ensure pages work with `next export`

## Assets

- Images must be compatible with static export
- Use `images.unoptimized = true` in Next.js config if needed

## Build Process

The project must successfully run:
