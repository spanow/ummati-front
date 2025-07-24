/** @type {import('next').NextConfig} */
const nextConfig = {
  // TEMPORAIREMENT COMMENTÉ POUR PERMETTRE LES APPELS API
  // output: 'export',
  
  // Si tu veux exporter plus tard, utilise ces options :
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Configuration pour le développement avec API
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  }
}

module.exports = nextConfig