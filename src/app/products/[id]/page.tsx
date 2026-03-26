import Link from "next/link";
import { products, getProduct } from "@/data/products";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-muted">상품을 찾을 수 없습니다.</p>
        <Link href="/" className="inline-block mt-4 text-sm underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
