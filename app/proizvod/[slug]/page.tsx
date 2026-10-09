import type { Metadata } from "next";
import { ProductView } from "@/components/ProductView";
import { COLORS, getProduct, products } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

// The default products are prerendered; ones added in the demo admin render on demand.
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return { title: "Artikal" };
  const title = `${product.name}, ${COLORS[product.color].name.toLowerCase()}`;
  return { title, description: product.description, openGraph: { title, images: [product.photos[0].src] } };
}

export default async function ProductPage({ params }: Props) {
  return <ProductView slug={(await params).slug} />;
}
