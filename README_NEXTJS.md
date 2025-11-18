# Pokemon Cards CSS - Next.js Version

This is a Next.js conversion of the original Svelte Pokemon Cards CSS project. It showcases realistic holographic effects for Pokemon Trading Card Game cards using advanced CSS techniques.

## Features

- **3D Card Rotations** with CSS transforms based on cursor position
- **Multiple Holographic Effects** including Regular Holo, Cosmos, Rainbow Rare, Secret Rare, and more
- **Interactive Card Exploration** - click cards to expand and examine them closely
- **Search Functionality** - search for cards by name using the Pokemon TCG API
- **Responsive Design** - works on desktop and mobile devices
- **Device Orientation Support** - cards respond to device tilt on mobile

## Tech Stack

- **Next.js 14** with Page Router
- **React 18**
- **Pokemon TCG SDK** for card data
- **Advanced CSS** with custom properties, gradients, filters, and blend modes

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/simeydotme/pokemon-cards-css.git
cd pokemon-cards-css
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file from the example:
```bash
cp .env.local.example .env.local
```

4. Add your Pokemon TCG API key to `.env.local`:
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_CDN=your_cdn_url
NEXT_PUBLIC_GA=your_ga_id (optional)
```

You can get a free API key from [Pokemon TCG Developers](https://dev.pokemontcg.io/).

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pokemon-cards-css/
├── components/          # React components
│   ├── Cards.js        # Card grid layout component
│   └── Search.js       # Search functionality component
├── lib/
│   ├── components/     # Card-specific components
│   │   ├── Card.js           # Main card component with effects
│   │   ├── CardProxy.js      # Card wrapper with data processing
│   │   ├── alternate-arts.json
│   │   └── promos.json
│   ├── contexts/       # React context providers
│   │   └── ActiveCardContext.js
│   ├── helpers/        # Utility functions
│   │   └── Math.js
│   └── hooks/          # Custom React hooks
│       ├── useOrientation.js
│       └── useSpring.js
├── pages/              # Next.js pages
│   ├── _app.js        # App wrapper with providers
│   ├── _document.js   # HTML document structure
│   └── index.js       # Home page
├── public/             # Static assets
│   ├── css/           # Card effect stylesheets
│   ├── data/          # Card data
│   └── img/           # Images and textures
└── next.config.js     # Next.js configuration
```

## Card Effects

This project includes CSS effects for the following card types:

- Basic/Common cards
- Reverse Holo
- Regular Holo Rare
- Galaxy/Cosmos Holo
- Amazing Rare
- Radiant Holo
- Trainer Gallery
- Pokemon V (Regular, Full Art, Alternate Art)
- Pokemon VMAX (Regular, Alternate/Rainbow)
- Pokemon VSTAR
- Trainer Full Art
- Rainbow Rare
- Secret Rare (Gold)
- Shiny Vault

## How It Works

The effects are achieved through:

1. **CSS Custom Properties** - Dynamic values controlled by JavaScript
2. **Background Gradients** - Multiple layered gradients with different blend modes
3. **CSS Filters** - Brightness, contrast, and saturation adjustments
4. **Clip Paths** - Masking specific areas of cards
5. **3D Transforms** - Perspective and rotation based on interaction
6. **Spring Animations** - Smooth, natural-feeling motion

## Credits

- Original Design & Development: [@simeydotme](https://twitter.com/simeydotme) (Simon Goellner)
- Card data provided by [Pokemon TCG API](https://pokemontcg.io/)
- Converted to Next.js from the original Svelte version

## License

See [LICENSE](LICENSE) file for details.

