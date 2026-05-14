import type { Metadata } from 'next'
import { VideosClient } from '@/components/videos/VideosClient'
import { Breadcrumb } from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Game Videos | GameHub',
  description: 'Discover the best gaming videos from YouTube and Twitch. Gameplay, tutorials, reviews, live streams, and more.',
  openGraph: {
    title: 'Game Videos | GameHub',
    description: 'Discover the best gaming videos from YouTube and Twitch. Gameplay, tutorials, reviews, live streams, and more.',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/videos/1200/630',
        width: 1200,
        height: 630,
        alt: 'Game Videos - GameHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Videos | GameHub',
    description: 'Discover the best gaming videos from YouTube and Twitch. Gameplay, tutorials, reviews, live streams, and more.',
    images: ['https://picsum.photos/seed/videos/1200/630'],
  },
}

export default async function VideosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Videos', href: '/videos' }
        ]} />
      </div>
      
      <VideosClient />
    </div>
  )
}
