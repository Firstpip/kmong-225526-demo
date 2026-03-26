"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { products as initialProducts, formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import RichEditor from "@/components/RichEditor";
import AuthGuard from "@/components/AuthGuard";

const PRODUCTS_KEY = "shop-demo-products";

function formatNumber(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  return num ? Number(num).toLocaleString("ko-KR") : "";
}
function parseNumber(formatted: string): string {
  return formatted.replace(/[^0-9]/g, "");
}

interface ProductOption {
  id: string;
  name: string;
  values: string;
}

interface ProductSpec {
  id: string;
  key: string;
  value: string;
}

function ProductAddPageContent() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Basic info
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("상의");
  const [description, setDescription] = useState("");
  const [richDescription, setRichDescription] = useState("");

  // Image
  const [hasImage, setHasImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options (dynamic)
  const [options, setOptions] = useState<ProductOption[]>([]);

  // Specs (dynamic)
  const [specs, setSpecs] = useState<ProductSpec[]>([]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", values: "" },
    ]);
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const updateOption = (id: string, field: "name" | "values", value: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
    setErrors((prev) => ({ ...prev, [`option_${id}_${field}`]: "" }));
  };

  const addSpec = () => {
    setSpecs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "" },
    ]);
  };

  const removeSpec = (id: string) => {
    setSpecs((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSpec = (id: string, field: "key" | "value", value: string) => {
    setSpecs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    setErrors((prev) => ({ ...prev, [`spec_${id}_${field}`]: "" }));
  };

  const handleImageAreaClick = () => {
    setHasImage(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "상품명을 입력해주세요";
    if (!price || Number(price) <= 0) newErrors.price = "가격을 올바르게 입력해주세요";

    // Validate options (required if added)
    options.forEach((opt) => {
      if (!opt.name.trim()) newErrors[`option_${opt.id}_name`] = "옵션명을 입력해주세요";
      if (!opt.values.trim()) newErrors[`option_${opt.id}_values`] = "옵션값을 입력해주세요";
    });

    // Validate specs (required if added)
    specs.forEach((spec) => {
      if (!spec.key.trim()) newErrors[`spec_${spec.id}_key`] = "항목명을 입력해주세요";
      if (!spec.value.trim()) newErrors[`spec_${spec.id}_value`] = "값을 입력해주세요";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Load existing products
    let existingProducts: Product[] = [];
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      existingProducts = stored ? JSON.parse(stored) : [...initialProducts];
    } catch {
      existingProducts = [...initialProducts];
    }

    const newId = Math.max(...existingProducts.map((p) => p.id), 0) + 1;

    // Build specs object
    const specsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    // Build details array from specs
    const detailsArr = Object.entries(specsObj).map(
      ([k, v]) => `${k}: ${v}`
    );

    // Build colors and sizes from options
    let colors = ["기본"];
    let sizes = ["M"];
    options.forEach((opt) => {
      const vals = opt.values
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (vals.length === 0) return;
      if (opt.name.includes("색") || opt.name.toLowerCase().includes("color")) {
        colors = vals;
      } else if (
        opt.name.includes("사이즈") ||
        opt.name.toLowerCase().includes("size")
      ) {
        sizes = vals;
      }
    });

    const newProduct: Product = {
      id: newId,
      name: name.trim(),
      price: Number(price),
      ...(discountPrice ? {} : {}),
      originalPrice: discountPrice ? Number(price) : undefined,
      category,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop&q=80",
      description: description.trim() || "새로 등록된 상품입니다.",
      richDescription: richDescription || undefined,
      details: detailsArr.length > 0 ? detailsArr : ["소재: -", "핏: -"],
      specs: Object.keys(specsObj).length > 0 ? specsObj : { 소재: "-", 핏: "-" },
      colors,
      sizes,
      badge: "NEW",
      reviews: [],
    };

    // If discount price is provided, use it as the actual price and original price as the listed price
    if (discountPrice && Number(discountPrice) > 0) {
      newProduct.originalPrice = Number(price);
      newProduct.price = Number(discountPrice);
    }

    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

    showToast(`"${name}" 상품이 등록되었습니다`);
    setTimeout(() => {
      router.push("/admin");
    }, 800);
  };

  const inputBase =
    "w-full px-3 py-2 border text-sm focus:outline-none focus:border-foreground transition-colors bg-white";
  const labelClass = "block text-xs text-muted mb-1.5 font-medium";

  return (
    <div id="page-admin-product-new" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/admin")}
            className="text-xs text-muted hover:text-foreground transition-colors mb-2 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            관리자로 돌아가기
          </button>
          <h1 className="text-2xl font-bold tracking-tight">상품 등록</h1>
        </div>
        <span className="text-xs text-muted bg-gray-100 px-3 py-1">DEMO</span>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section id="product-form-basic">
          <h2 className="text-sm font-bold mb-4 pb-2 border-b border-border">기본 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>상품명<span className="text-red-500 ml-0.5">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ""})); }}
                placeholder="상품명을 입력하세요"
                className={`${inputBase} ${errors.name ? "border-red-400" : "border-border"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>가격<span className="text-red-500 ml-0.5">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  value={formatNumber(price)}
                  onChange={(e) => { setPrice(parseNumber(e.target.value)); setErrors(prev => ({...prev, price: ""})); }}
                  placeholder="0"
                  className={`${inputBase} pr-8 ${errors.price ? "border-red-400" : "border-border"}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">원</span>
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className={labelClass}>할인가 <span className="text-xs text-muted font-normal">(선택)</span></label>
              <div className="relative">
                <input
                  type="text"
                  value={formatNumber(discountPrice)}
                  onChange={(e) => setDiscountPrice(parseNumber(e.target.value))}
                  placeholder="0"
                  className={`${inputBase} pr-8 border-border`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">원</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>카테고리<span className="text-red-500 ml-0.5">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputBase} border-border`}
              >
                <option value="상의">상의</option>
                <option value="하의">하의</option>
                <option value="아우터">아우터</option>
                <option value="액세서리">액세서리</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>상품 설명 <span className="text-xs text-muted font-normal">(선택)</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="상품에 대한 상세한 설명을 입력하세요"
                rows={4}
                className={`${inputBase} border-border resize-y`}
              />
            </div>
          </div>
        </section>

        {/* Thumbnail Image */}
        <section id="product-form-image">
          <h2 className="text-sm font-bold mb-4 pb-2 border-b border-border">대표 이미지 / 썸네일 <span className="text-xs text-muted font-normal">(선택)</span></h2>
          <div
            onClick={handleImageAreaClick}
            className={`border-2 border-dashed ${
              hasImage ? "border-foreground/30" : "border-border"
            } p-8 text-center cursor-pointer hover:border-foreground/50 transition-colors`}
          >
            {hasImage ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop&q=80"
                    alt="상품 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted">이미지가 업로드되었습니다 (데모)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4">
                <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-muted">
                  이미지를 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-muted/60">PNG, JPG, WEBP (최대 5MB)</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </section>

        {/* Options */}
        <section id="product-form-options">
          <h2 className="text-sm font-bold mb-4 pb-2 border-b border-border">옵션 추가</h2>
          {options.length === 0 && (
            <p className="text-sm text-muted mb-4">등록된 옵션이 없습니다.</p>
          )}
          <div className="space-y-3">
            {options.map((opt) => (
              <div key={opt.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>옵션명<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => updateOption(opt.id, "name", e.target.value)}
                      placeholder='예: 색상, 사이즈'
                      className={`${inputBase} ${errors[`option_${opt.id}_name`] ? "border-red-400" : "border-border"}`}
                    />
                    {errors[`option_${opt.id}_name`] && <p className="text-xs text-red-500 mt-1">{errors[`option_${opt.id}_name`]}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>옵션값 (쉼표 구분)<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      value={opt.values}
                      onChange={(e) => updateOption(opt.id, "values", e.target.value)}
                      placeholder='예: 화이트, 블랙, 그레이'
                      className={`${inputBase} ${errors[`option_${opt.id}_values`] ? "border-red-400" : "border-border"}`}
                    />
                    {errors[`option_${opt.id}_values`] && <p className="text-xs text-red-500 mt-1">{errors[`option_${opt.id}_values`]}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeOption(opt.id)}
                  className="mt-6 p-2 text-muted hover:text-red-500 transition-colors"
                  title="옵션 삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="mt-4 px-4 py-2 border border-dashed border-border text-sm text-muted hover:text-foreground hover:border-foreground transition-colors"
          >
            + 옵션 추가
          </button>
        </section>

        {/* Rich Description */}
        <section id="product-form-rich-desc">
          <h2 className="text-sm font-bold mb-4 pb-2 border-b border-border">상품 상세 설명 <span className="text-xs text-muted font-normal">(선택)</span></h2>
          <p className="text-xs text-muted mb-3">이미지, 서식 등을 포함한 상세한 상품 설명을 작성할 수 있습니다.</p>
          <RichEditor
            value={richDescription}
            onChange={setRichDescription}
            placeholder="상품 상세 설명을 입력하세요..."
          />
        </section>

        {/* Product Specs */}
        <section id="product-form-specs">
          <h2 className="text-sm font-bold mb-4 pb-2 border-b border-border">상품 상세 정보</h2>
          {specs.length === 0 && (
            <p className="text-sm text-muted mb-4">등록된 상세 정보가 없습니다.</p>
          )}
          <div className="space-y-3">
            {specs.map((spec) => (
              <div key={spec.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>항목명<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => updateSpec(spec.id, "key", e.target.value)}
                      placeholder='예: 소재'
                      className={`${inputBase} ${errors[`spec_${spec.id}_key`] ? "border-red-400" : "border-border"}`}
                    />
                    {errors[`spec_${spec.id}_key`] && <p className="text-xs text-red-500 mt-1">{errors[`spec_${spec.id}_key`]}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>값<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpec(spec.id, "value", e.target.value)}
                      placeholder='예: 코튼 100%'
                      className={`${inputBase} ${errors[`spec_${spec.id}_value`] ? "border-red-400" : "border-border"}`}
                    />
                    {errors[`spec_${spec.id}_value`] && <p className="text-xs text-red-500 mt-1">{errors[`spec_${spec.id}_value`]}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeSpec(spec.id)}
                  className="mt-6 p-2 text-muted hover:text-red-500 transition-colors"
                  title="상세 정보 삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addSpec}
            className="mt-4 px-4 py-2 border border-dashed border-border text-sm text-muted hover:text-foreground hover:border-foreground transition-colors"
          >
            + 상세 정보 추가
          </button>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            id="product-submit-btn"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            등록하기
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2.5 border border-border text-sm text-muted hover:text-foreground transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductAddPage() {
  return (
    <AuthGuard type="adminOnly">
      <ProductAddPageContent />
    </AuthGuard>
  );
}
