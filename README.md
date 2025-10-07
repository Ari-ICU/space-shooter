# 🚀 Space Shooter

A browser-based space shooting game built with **Next.js 13**, TypeScript, and Tailwind CSS.  
Test your reflexes, destroy asteroids, and aim for the high score!

[Play Online](https://space-shooter-7yzp.vercel.app/) | [Next.js](https://nextjs.org)

---

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [Learn More](#learn-more)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Ari-ICU/space-shooter
cd space-shooter

Install dependencies:

npm install
# or
yarn install
# or
pnpm install


Run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open http://localhost:3000
 in your browser to play.

The game auto-updates as you edit files. Start by modifying app/page.tsx or the components in src/components.

Features

🚀 Smooth space shooter gameplay

⭐ High score tracking with localStorage

🔄 Restart & pause functionality

🌌 Starfield and particle effects

🎨 Responsive design with Tailwind CSS

⚡ Optimized fonts with next/font (Geist)

Technologies Used

Next.js 13
 (App Router & React 18)

TypeScript

Tailwind CSS

Framer Motion
 for animations

HTML5 <canvas> for game rendering

localStorage for storing high scores

Folder Structure
/app
  └─ page.tsx
/src
  └─ components
      └─ GameCanvas.tsx
      └─ gameLogic.ts
      └─ rendering.ts
      └─ types.ts
  └─ constants.ts
/public
  └─ assets (images, icons, etc.)
globals.css

Scripts

npm run dev — start development server

npm run build — build production app

npm run start — start production server

npm run lint — run TypeScript/ESLint checks

Learn More

Next.js Documentation
 — official docs

Next.js Learn
 — interactive tutorial

Tailwind CSS Docs

Framer Motion Docs

Deployment

Deploy easily with Vercel
:

vercel


Check out the official Next.js deployment guide
 for details.

Contributing

Contributions, suggestions, and bug reports are welcome!

Fork the repo

Create a branch (git checkout -b feature/my-feature)

Commit your changes (git commit -m "Add feature")

Push to the branch (git push origin feature/my-feature)

Open a pull request