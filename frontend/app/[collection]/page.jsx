import { notFound } from "next/navigation";
import { ProductCollectionClient } from "../components/ProductCollectionClient";
import { collections, getProductsByCollection } from "../lib/store";

export function generateStaticParams() {
  return Object.keys(collections).map((collection) => ({ collection }));
}

export async function generateMetadata({ params }) {
  const { collection: collectionSlug } = await params;
  const collection = collections[collectionSlug];

  if (!collection) {
    return {};
  }

  return {
    title: `INSÔNIA | ${collection.title}`
  };
}

export default async function CollectionPage({ params }) {
  const { collection: collectionSlug } = await params;
  const collection = collections[collectionSlug];

  if (!collection) {
    notFound();
  }

  const collectionProducts = getProductsByCollection(collectionSlug);

  return (
    <div className="collection-page">
      <section className="collection-hero shell">
        <p className="eyebrow">{collection.kicker}</p>
        <h1 className="collection-title">{collection.title}</h1>
        <p className="collection-description">{collection.description}</p>
      </section>

      <ProductCollectionClient products={collectionProducts} label={collection.label} />
    </div>
  );
}
