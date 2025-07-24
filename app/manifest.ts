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
        src: '/logo128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}