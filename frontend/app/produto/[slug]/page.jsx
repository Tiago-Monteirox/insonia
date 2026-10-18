import { notFound } from "next/navigation";
import { ProductDetail } from "../../components/ProductDetail";
import { getProductBySlug, products } from "../../lib/store";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `INSÔNIA | ${product.name}`,
    description: product.description
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((relatedProduct) => relatedProduct.id !== product.id && relatedProduct.categorySlug === product.categorySlug)
    .slice(0, 4);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
