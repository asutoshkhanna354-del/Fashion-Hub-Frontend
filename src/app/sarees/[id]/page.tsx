import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

// Server-side data fetching
async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: "Product Not Found | Solanki Vastra Bhandar",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solankivastrabhandar.com';
  const url = `${baseUrl}/sarees/${product.id}`;
  const img = product.media?.[0]?.url || "";
  const imageUrl = img.startsWith("http") ? img : `${API_URL}${img}`;

  return {
    title: `${product.name} | Solanki Vastra Bhandar`,
    description: product.description || `Buy ${product.name} online at Solanki Vastra Bhandar. Premium collection.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} online.`,
      url: url,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Buy ${product.name} online.`,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-ivory pt-28 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl text-plum mb-2">Product Not Found</h1>
            <a href="/sarees/" className="text-rose-gold hover:underline text-sm">Browse Sarees</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solankivastrabhandar.com';
  const breadcrumbItems = [
    { name: "Home", url: baseUrl },
    { name: "Sarees", url: `${baseUrl}/sarees` },
    { name: product.name, url: `${baseUrl}/sarees/${product.id}` }
  ];

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      <ProductDetailClient initialProduct={product} />
      <Footer />
    </>
  );
}
