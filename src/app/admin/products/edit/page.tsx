"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { products as initialProducts, formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import RichEditor from "@/components/RichEditor";
import AuthGuard from "@/components/AuthGuard";

const PRODUCTS_KEY = "shop-demo-products";
const EDIT_ID_KEY = "shop-demo-edit-id";

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

function ProductEditPageContent() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Basic info
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("상의");
  const [description, setDescription] = useState("");
  const [richDescription, setRichDescription] = useState("");

  // Image
  const [hasImage, setHasImage] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  // Options (dynamic)
  const [options, setOptions] = useState<ProductOption[]>([]);

  // Specs (dynamic)
  const [specs, setSpecs] = useState<ProductSpec[]>([]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Load product data from localStorage
  useEffect(() => {
    const editId = localStorage.getItem(EDIT_ID_KEY);
    if (!editId) {
      router.push("/admin");
      return;
    }

    const id = Number(editId);
    setProductId(id);

    let productList: Product[] = [];
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      productList = stored ? JSON.parse(stored) : [...initialProducts];
    } catch {
      productList = [...initialProducts];
    }

    const product = productList.find((p) => p.id === id);
    if (!product) {
      showToast("상품을 찾을 수 없습니다");
      setTimeout(() => router.push("/admin"), 1000);
      return;
    }

    // Fill form with product data
    setName(product.name);
    setPrice(
      product.originalPrice ? String(product.originalPrice) : String(product.price)
    );
    setDiscountPrice(
      product.originalPrice ? String(product.price) : ""
    );
    setCategory(product.category);
    setDescription(product.description);
    // localStorage에 richDescription이 없으면 원본 데이터에서 가져오기
    const originalProduct = initialProducts.find((p) => p.id === id);
    setRichDescription(product.richDescription || originalProduct?.richDescription || "");
    setImageUrl(product.image);
    setHasImage(true);

    // Build options from colors and sizes
    const loadedOptions: ProductOption[] = [];
    if (product.colors && product.colors.length > 0 && product.colors[0] !== "기본") {
      loadedOptions.push({
        id: crypto.randomUUID(),
        name: "색상",
        values: product.colors.join(", "),
      });
    }
    if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== "M") {
      loadedOptions.push({
        id: crypto.randomUUID(),
        name: "사이즈",
        values: product.sizes.join(", "),
      });
    } else if (product.sizes && product.sizes.length > 1) {
      loadedOptions.push({
        id: crypto.randomUUID(),
        name: "사이즈",
        values: product.sizes.join(", "),
      });
    }
    setOptions(loadedOptions);

    // Build specs from product.specs
    const loadedSpecs: ProductSpec[] = Object.entries(product.specs || {}).map(
      ([key, value]) => ({
        id: crypto.randomUUID(),
        key,
        value,
      })
    );
    setSpecs(loadedSpecs);

    setLoaded(true);
  }, [router]);

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
    if (productId === null) return;

    // Load existing products
    let existingProducts: Product[] = [];
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      existingProducts = stored ? JSON.parse(stored) : [...initialProducts];
    } catch {
      existingProducts = [...initialProducts];
    }

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

    // Determine pricing
    let finalPrice = Number(price);
    let finalOriginalPrice: number | undefined = undefined;
    if (discountPrice && Number(discountPrice) > 0) {
      finalOriginalPrice = Number(price);
      finalPrice = Number(discountPrice);
    }

    const updatedProducts = existingProducts.map((p) => {
      if (p.id !== productId) return p;
      return {
        ...p,
        name: name.trim(),
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        category,
        description: description.trim() || p.description,
        richDescription: richDescription || p.richDescription,
        details: detailsArr.length > 0 ? detailsArr : p.details,
        specs: Object.keys(specsObj).length > 0 ? specsObj : p.specs,
        colors,
        sizes,
      };
    });

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    localStorage.removeItem(EDIT_ID_KEY);

    showToast(`"${name}" 상품이 수정되었습니다`);
    setTimeout(() => {
      router.push("/admin");
    }, 800);
  };

  const inputBase =
    "w-full px-3 py-2 border text-sm focus:outline-none focus:border-foreground transition-colors bg-white";
  const labelClass = "block text-xs text-muted mb-1.5 font-medium";

  if (!loaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-sm text-muted">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div id="page-admin-product-edit" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
            onClick={() => {
              localStorage.removeItem(EDIT_ID_KEY);
              router.push("/admin");
            }}
            className="text-xs text-muted hover:text-foreground transition-colors mb-2 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            관리자로 돌아가기
          </button>
          <h1 className="text-2xl font-bold tracking-tight">상품 수정</h1>
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
            {hasImage && imageUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="상품 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted">클릭하여 이미지 변경 (데모)</p>
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
            저장하기
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(EDIT_ID_KEY);
              router.push("/admin");
            }}
            className="px-6 py-2.5 border border-border text-sm text-muted hover:text-foreground transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductEditPage() {
  return (
    <AuthGuard type="adminOnly">
      <ProductEditPageContent />
    </AuthGuard>
  );
}
