import React from 'react';

export default function ProductSchema({ product }: { product: any }) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solankivastrabhandar.com';
  const url = `${baseUrl}/sarees/${product.id}`;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.media?.map((m: any) => m.url?.startsWith('http') ? m.url : `${process.env.NEXT_PUBLIC_API_URL}${m.url}`) || [],
    "description": product.description || `Buy ${product.name} online at Solanki Vastra Bhandar.`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Solanki Vastra Bhandar"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Solanki Vastra Bhandar"
      }
    },
    ...(product.rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1
      }
    } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
