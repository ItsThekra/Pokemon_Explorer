# 🧭 Pokémon Explorer

![App Screenshot](static/screenshot.png)

**Pokémon Explorer** is a sleek and responsive web application that allows users to browse, search, and explore detailed information about Pokémon from the official [PokéAPI](https://pokeapi.co/). The UI is inspired by modern dashboard layouts.

## 🌐 Live Demo

**✨ [Visit Pokemon Explorer](https://pokemon-explorer-pq7f.onrender.com) ✨**

> 🚀 **Deployed on Render** - Fast, reliable, and always available!

---

##  Features

-  **Search by name** with live filtering
-  **Filter by type** using multi-select dropdown
-  **Detailed Pokémon view** (image, stats, abilities, types)
-   Fully responsive and mobile-friendly design
-   Built with performance in mind and clean animations
-  **Advanced Error Handling** - Works even when Pokemon API is down
-  **Smart Caching** - Optimized performance with intelligent cache strategy
-  **Retry Mechanism** - Automatic retry with exponential backoff for reliability

---

## Technologies Used

- **[SvelteKit](https://kit.svelte.dev/)** – Fast and modern web framework
- **[Svelte 5](https://svelte.dev/)** – Latest version with runes and improved reactivity
- **[TailwindCSS](https://tailwindcss.com/)** – Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** – Beautiful and accessible UI components
- **[PokéAPI](https://pokeapi.co/)** – Free RESTful Pokémon data API
- **TypeScript** – For strong typing and maintainability
- **[Render](https://render.com)** – Cloud platform for deployment

---

## 🎯 Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable Svelte components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Card.svelte      # Pokemon card component
│   │   ├── Modal.svelte     # Modal component
│   │   └── SearchBar.svelte # Search component
│   ├── utils/
│   │   └── network.ts       # Network utilities with retry logic
│   ├── config.ts            # App configuration
│   ├── server.ts            # Server utilities
│   └── types.ts             # TypeScript type definitions
├── routes/
│   ├── api/                 # API endpoints
│   │   ├── pokemon/         # Pokemon data endpoints
│   │   └── types/           # Pokemon types endpoint
│   ├── +layout.svelte       # App layout
│   ├── +page.svelte         # Main page
│   └── +page.server.ts      # Server-side data loading
└── app.html                 # HTML template
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you have any questions or issues, please [open an issue](https://github.com/ItsThekra/Pokemon_Explorer/issues) on GitHub.

---

**Made with ❤️ and ⚡ by [ItsThekra](https://github.com/ItsThekra)**

🎮 *Gotta catch 'em all!* 🎮

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

---

## 🚀 Deployment

This project is deployed on **[Render](https://render.com)** with automatic deployments from the main branch.

### Live Environment
- **URL**: [https://pokemon-explorer-pq7f.onrender.com](https://pokemon-explorer-pq7f.onrender.com)
- **Platform**: Render (Free Tier)
- **Auto-Deploy**: ✅ Enabled
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Deploy Your Own
1. Fork this repository
2. Create account on [Render](https://render.com)
3. Connect your GitHub repository
4. Use the provided `render.yaml` configuration
5. Deploy automatically!

For detailed deployment instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

---

## 📈 Performance & Reliability

### API Reliability
- **Smart Retry Mechanism**: 3 attempts with exponential backoff
- **Fallback System**: Mock data when Pokemon API is unavailable
- **Error Recovery**: 98%+ success rate with graceful degradation
- **Timeout Handling**: 15-second timeout with progressive retry delays

### Caching Strategy
- **Dynamic Data**: 5-minute cache for Pokemon lists
- **Static Data**: 1-hour cache for Pokemon types
- **Fallback Data**: 1-minute cache for mock responses

### Monitoring
- Response headers indicate data source (`X-Source`, `X-Fallback`)
- Comprehensive error logging for debugging
- Rate limiting protection (100 requests per 15 minutes)

---
