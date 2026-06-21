import { MetadataRoute } from 'next';

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solankivastrabhandar.com';

  // Static routes
  const routes = [
    '',
    '/collections',
    '/new-arrivals',
    '/best-sellers',
    '/occasions',
    '/about',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic products
  try {
    const res = await fetch(`${API_URL}/api/products?limit=1000`);
    if (res.ok) {
      const data = await res.json();
      const products = data.products || [];
      
      const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/sarees/${product.id}`,
        lastModified: new Date(product.updatedAt || new Date()).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

      return [...routes, ...productRoutes];
    }
  } catch (error) {
    console.error("Error generating sitemap", error);
  }

  return routes;
}
