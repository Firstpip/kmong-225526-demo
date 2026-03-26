"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories, getProductsByCategory, formatPrice, products } from "@/data/products";
import type { Product } from "@/data/products";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[11px] font-medium px-2 py-1 tracking-wider">
            {product.badge}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted">{product.category}</p>
        <h3 className="text-sm font-medium leading-snug group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const heroSlides = [
  {
    title: "새로운 시즌,\n새로운 스타일",
    subtitle: "자체 구축 쇼핑몰에서 엄선한 아이템을 만나보세요.\n깔끔한 디자인과 편리한 쇼핑 경험을 제공합니다.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=600&fit=crop&q=80",
    cta: "쇼핑하기",
  },
  {
    title: "겨울 아우터\n최대 25% OFF",
    subtitle: "울 코트부터 라이트 다운까지,\n따뜻하고 스타일리시한 아우터 컬렉션.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=600&fit=crop&q=80",
    cta: "컬렉션 보기",
  },
  {
    title: "데일리 에센셜\n베이직 아이템",
    subtitle: "매일 입고 싶은 편안한 데일리룩.\n좋은 소재, 좋은 핏으로 완성합니다.",
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1400&h=600&fit=crop&q=80",
    cta: "지금 보기",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="home-hero relative h-[400px] sm:h-[480px] lg:h-[540px] overflow-hidden bg-gray-100">
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="mt-4 text-white/80 text-sm sm:text-base max-w-md whitespace-pre-line">
          {slide.subtitle}
        </p>
        <Link
          href="#home-all-products"
          className="inline-block mt-6 bg-white text-foreground px-6 py-3 text-sm font-medium hover:bg-gray-100 transition-colors w-fit"
        >
          {slide.cta}
        </Link>
        {/* Dots */}
        <div className="flex gap-2 mt-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Popular products: products sorted by review count
const popularProducts = [...products]
  .sort((a, b) => b.reviews.length - a.reviews.length)
  .slice(0, 4);

// New products: products with NEW badge or latest IDs
const newProducts = products.filter((p) => p.badge === "NEW").length > 0
  ? products.filter((p) => p.badge === "NEW")
  : products.slice(-4);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = getProductsByCategory(activeCategory).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-home">
      <HeroBanner />

      {/* Popular Products */}
      <section className="home-popular max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">인기 상품</h2>
          <Link href="#home-all-products" className="text-xs text-muted hover:text-foreground transition-colors">
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Products */}
      <section className="home-new bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">신상품</h2>
            <Link href="#home-all-products" className="text-xs text-muted hover:text-foreground transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section id="home-all-products" className="home-all-products max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="home-categories flex gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-foreground text-background font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="상품명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="home-search w-full sm:w-72 pl-4 pr-10 py-2.5 border border-border text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="home-product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted text-sm">
            검색 결과가 없습니다.
          </div>
        )}

        <p className="text-center text-xs text-muted/50 mt-12">
          총 {filtered.length}개 상품
        </p>
      </section>
    </div>
  );
}
