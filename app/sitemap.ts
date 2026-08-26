import type { MetadataRoute } from 'next'
const BASE = 'https://moneymeta.fun'
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/capital`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/solopreneurs`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/solopreneurs/study`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/report`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
  ]
}
