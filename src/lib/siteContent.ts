export type SitePageSeo = {
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string
  ogImage: string
  canonicalUrl: string
}

export type SiteSection = {
  id: number
  page: string
  sectionKey: string
  heading: string
  body: string
  image: string
  bold: boolean
  order: number
}

export type SitePageData = {
  page: {
    slug: string
    title: string
    metaTitle: string
    metaDescription: string
    keywords: string
    ogImage: string
    canonicalUrl: string
    updatedAt: string
  }
  seo: SitePageSeo
  sections: SiteSection[]
}

export async function fetchPageContent(page = "home") {
  const response = await fetch(`/api/site/${page}`)

  if (!response.ok) {
    throw new Error(`Unable to load page content: ${response.status}`)
  }

  return (await response.json()) as SitePageData
}
