import '../styles/global.css';
import '../styles/card-grid.css';
import '../styles/search.css';
import '../styles/cards/base.css';
import '../styles/cards.css';
import '../styles/cards/basic.css';
import '../styles/cards/reverse-holo.css';
import '../styles/cards/regular-holo.css';
import '../styles/cards/cosmos-holo.css';
import '../styles/cards/amazing-rare.css';
import '../styles/cards/radiant-holo.css';
import '../styles/cards/v-regular.css';
import '../styles/cards/v-full-art.css';
import '../styles/cards/v-max.css';
import '../styles/cards/v-star.css';
import '../styles/cards/trainer-full-art.css';
import '../styles/cards/rainbow-holo.css';
import '../styles/cards/rainbow-alt.css';
import '../styles/cards/secret-rare.css';
import '../styles/cards/trainer-gallery-holo.css';
import '../styles/cards/trainer-gallery-v-regular.css';
import '../styles/cards/trainer-gallery-v-max.css';
import '../styles/cards/trainer-gallery-secret-rare.css';
import '../styles/cards/shiny-rare.css';
import '../styles/cards/shiny-v.css';
import '../styles/cards/shiny-vmax.css';
import '../styles/cards/swsh-pikachu.css';
import { ActiveCardProvider } from '../lib/contexts/ActiveCardContext';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pokémon Cards CSS Holographic Effect</title>
        <meta name="description" content="An exploration of what's possible with CSS for Pokemon Cards, simeydotme (Simon Goellner)" />
        <link rel="canonical" href="https://poke-holo.simey.me" />
        <link rel="icon" href="/favicon.png" />
        <meta name="thumbnail" content="/thumb.png" />
        <meta property="og:url" content="https://poke-holo.simey.me" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pokémon Cards CSS Holographic Effect" />
        <meta property="og:description" content="An exploration of what's possible with CSS for Pokemon Cards, simeydotme (Simon Goellner)" />
        <meta property="og:image" content="https://poke-holo.simey.me/thumb.png" />
        <meta name="twitter:title" content="Pokémon Cards CSS Holographic Effect" />
        <meta name="twitter:description" content="An exploration of what's possible with CSS for Pokemon Cards, simeydotme (Simon Goellner)" />
        <meta name="twitter:image" content="https://poke-holo.simey.me/thumb.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@simeydotme" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,700;1,300;1,700&family=Roboto:ital,wght@0,300;0,700;1,300;1,700&display=swap" />
      </Head>
      <ActiveCardProvider>
        <Component {...pageProps} />
      </ActiveCardProvider>
    </>
  );
}

