/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pokemontcg.io', 'tcg.pokemon.com'],
  },
};

module.exports = nextConfig;

