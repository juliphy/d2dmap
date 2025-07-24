import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Door-To-Door Map',
    short_name: 'D2DMap',
    description: 'Door-to-Door Map written on Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1DB2ED',
    icons: [
      {
        src: '/public/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/public/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}