import ProductPageClient from "@/components/ProductPageClient";

interface ProductPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return [
    { slug: "glass-bottle-milk" },
    { slug: "fresh-curd" },
    { slug: "paneer" },
    { slug: "ghee" },
    { slug: "buttermilk" },
  ];
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient productSlug={params.slug} />;
}
