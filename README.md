# 🧭 Pokémon Explorer

![App Screenshot](static/screenshot.png)

**Pokémon Explorer** is a sleek and responsive web application that allows users to browse, search, and explore detailed information about Pokémon from the official [PokéAPI](https://pokeapi.co/). The UI is inspired by modern dashboard layouts.

---

##  Features

-  **Search by name** with live filtering
-  **Filter by type** using multi-select dropdown
-  **Detailed Pokémon view** (image, stats, abilities, types)
-   Fully responsive and mobile-friendly design
-   Built with performance in mind and clean animations

---

## Technologies Used

- **[SvelteKit](https://kit.svelte.dev/)** – Fast and modern web framework
- **[TailwindCSS](https://tailwindcss.com/)** – Utility-first styling
- **[PokéAPI](https://pokeapi.co/)** – Free RESTful Pokémon data API
- **TypeScript** – For strong typing and maintainability

---

## Getting Started

### Prerequisites

- **Node.js 20+** (recommended)
- **Bun 1.0+** (preferred) OR **npm/yarn**

> **⚠️ Important:** This project is optimized for **Bun** but works with npm/yarn as well.

### Installation

#### Option 1: Using Bun (Recommended)
```bash
# Clone the repo
git clone https://github.com/your-username/pokemon-explorer.git
cd pokemon-explorer

# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server
bun dev
```

#### Option 2: Using npm/yarn
```bash
# Clone the repo
git clone https://github.com/your-username/pokemon-explorer.git
cd pokemon-explorer

# Remove bun.lock to avoid conflicts
rm bun.lock

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev:npm
# or
yarn dev
```

### Development Commands

| Command | Bun | npm | Description |
|---------|-----|-----|-------------|
| Development | `bun dev` | `npm run dev:npm` | Start dev server |
| Build | `bun run build` | `npm run build:npm` | Build for production |
| Preview | `bun run preview` | `npm run preview:npm` | Preview build |
| Type Check | `bun run check` | `npm run check` | Run type checking |
| Format | `bun run format` | `npm run format` | Format code |
| Lint | `bun run lint` | `npm run lint` | Lint code |
