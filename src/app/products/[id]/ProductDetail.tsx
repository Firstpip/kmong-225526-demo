"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, getRelatedProducts, getAverageRating } from "@/data/products";
import type { Product, Review } from "@/data/products";
import { useCart } from "@/context/CartContext";

function requireLogin(router: ReturnType<typeof useRouter>, currentPath: string, showToast: (msg: string) => void): boolean {
  const isLoggedIn = localStorage.getItem("shop-demo-logged-in") === "true";
  if (!isLoggedIn) {
    showToast("로그인이 필요합니다");
    localStorage.setItem("shop-demo-redirect", currentPath);
    setTimeout(() => router.push(`/login?redirect=${encodeURIComponent(currentPath)}`), 800);
    return false;
  }
  return true;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewSection({ reviews }: { reviews: Review[] }) {
  const avg = getAverageRating(reviews);
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-semibold">리뷰</h3>
        <span className="text-sm text-muted">({reviews.length}개)</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <StarRating rating={Math.round(avg)} />
          <span className="text-sm font-medium">{avg}</span>
        </div>
      </div>
      <div className="space-y-6">
        {reviews.map((review, i) => (
          <div key={i} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium">{review.name}</span>
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted ml-auto">{review.date}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product);
  if (related.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">관련 상품</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {related.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-3">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <p className="text-xs text-muted">{p.category}</p>
            <h4 className="text-sm font-medium group-hover:underline">{p.name}</h4>
            <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ShippingInfo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">배송 / 교환 / 반품 안내</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border p-4">
          <p className="text-sm font-medium mb-2">배송 안내</p>
          <ul className="text-xs text-muted space-y-1.5">
            <li>— 배송비: 3,000원 (5만원 이상 무료)</li>
            <li>— 배송기간: 결제 후 1~3일 이내</li>
            <li>— 도서산간 지역 추가 배송비 발생</li>
          </ul>
        </div>
        <div className="border border-border p-4">
          <p className="text-sm font-medium mb-2">교환 안내</p>
          <ul className="text-xs text-muted space-y-1.5">
            <li>— 수령 후 7일 이내 교환 가능</li>
            <li>— 택이 제거되지 않은 상태</li>
            <li>— 교환 배송비: 왕복 6,000원</li>
          </ul>
        </div>
        <div className="border border-border p-4">
          <p className="text-sm font-medium mb-2">반품 안내</p>
          <ul className="text-xs text-muted space-y-1.5">
            <li>— 수령 후 7일 이내 반품 가능</li>
            <li>— 제품 하자 시 무료 반품</li>
            <li>— 단순 변심: 반품 배송비 3,000원</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeTab, setActiveTab] = useState<"detail" | "review" | "shipping">("detail");
  const [toast, setToast] = useState<string | null>(null);
  const avg = getAverageRating(product.reviews);
  const { addToCart } = useCart();
  const router = useRouter();

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    if (!requireLogin(router, `/products/${product.id}`, showToast)) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page-product-detail max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="product-breadcrumb text-xs text-muted mb-8 flex gap-2">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <span>/</span>
        <Link href="/#home-all-products" className="hover:text-foreground">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image */}
        <div className="product-image relative aspect-[4/5] bg-gray-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-foreground text-background text-xs font-medium px-3 py-1.5 tracking-wider">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div id="product-info" className="flex flex-col">
          <p className="text-xs text-muted mb-2">{product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={Math.round(avg)} />
            <span className="text-sm text-muted">{avg} ({product.reviews.length}개 리뷰)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-base text-muted line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm text-red-500 font-medium">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <div className="border-t border-border mt-6 pt-6">
            <p className="text-sm leading-relaxed text-muted">{product.description}</p>
          </div>

          {/* Details */}
          <div className="border-t border-border mt-6 pt-6">
            <h3 className="text-sm font-medium mb-3">상품 정보</h3>
            <ul className="space-y-1.5">
              {product.details.map((detail, i) => (
                <li key={i} className="text-sm text-muted flex gap-2">
                  <span className="text-border">—</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Color */}
          <div id="product-colors" className="border-t border-border mt-6 pt-6">
            <h3 className="text-sm font-medium mb-3">색상</h3>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedColor === color
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted hover:border-foreground"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div id="product-sizes" className="border-t border-border mt-6 pt-6">
            <h3 className="text-sm font-medium mb-3">사이즈</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-10 text-sm border transition-colors ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="border-t border-border mt-6 pt-6 flex flex-col gap-4">
            <div id="product-quantity" className="flex items-center gap-3">
              <span className="text-sm font-medium">수량</span>
              <div className="flex border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                >−</button>
                <span className="w-12 h-10 flex items-center justify-center text-sm border-x border-border">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                >+</button>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                id="product-add-cart-btn"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 text-sm font-medium transition-all ${
                  added ? "bg-green-600 text-white" : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {added ? "장바구니에 담겼습니다" : "장바구니 담기"}
              </button>
              <button
                id="product-buy-now-btn"
                onClick={() => {
                  if (!requireLogin(router, `/products/${product.id}`, showToast)) return;
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: selectedColor,
                    size: selectedSize,
                    quantity,
                  });
                  router.push("/checkout");
                }}
                className="px-6 py-3.5 border border-foreground text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                바로 구매
              </button>
            </div>

            <p className="text-xs text-muted mt-2">
              총 금액: <span className="text-foreground font-semibold">{formatPrice(product.price * quantity)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Reviews / Shipping */}
      <div id="product-tabs" className="mt-16 border-t border-border">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("detail")}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "detail"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            상세정보
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "review"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            리뷰 ({product.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "shipping"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            배송 / 교환 / 반품
          </button>
        </div>
        <div className="py-8">
          {activeTab === "detail" ? (
            <div className="space-y-6">
              {product.richDescription && (
                <div
                  className="rich-content mb-8"
                  dangerouslySetInnerHTML={{ __html: product.richDescription }}
                />
              )}
              <h3 className="text-lg font-semibold">상품 상세 스펙</h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b border-border">
                      <td className="py-3 pr-4 text-muted font-medium w-32">{key}</td>
                      <td className="py-3">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">사용 가능 색상</h4>
                <p className="text-sm text-muted">{product.colors.join(", ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">사용 가능 사이즈</h4>
                <p className="text-sm text-muted">{product.sizes.join(" / ")}</p>
              </div>
            </div>
          ) : activeTab === "review" ? (
            <ReviewSection reviews={product.reviews} />
          ) : (
            <ShippingInfo />
          )}
        </div>
      </div>

      {/* Related Products */}
      <div id="product-related" className="mt-8 border-t border-border pt-12">
        <RelatedProducts product={product} />
      </div>

      {/* Back */}
      <div className="mt-16 pt-8 border-t border-border">
        <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
