"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import AuthGuard from "@/components/AuthGuard";

function CartPageContent() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const total = getCartTotal();
  const shippingFee = total >= 50000 ? 0 : 3000;

  if (items.length === 0) {
    return (
      <div id="cart-empty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 mx-auto text-border mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-xl font-bold mb-2">장바구니가 비어있습니다</h1>
          <p className="text-sm text-muted mb-8">마음에 드는 상품을 장바구니에 담아보세요.</p>
          <Link
            href="/"
            className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="page-cart" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">장바구니</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="border-b border-border pb-2 mb-4 hidden sm:grid grid-cols-[1fr_100px_120px_60px] gap-4 text-xs text-muted font-medium">
            <span>상품정보</span>
            <span className="text-center">수량</span>
            <span className="text-right">금액</span>
            <span />
          </div>

          <div id="cart-items" className="space-y-6">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-4 sm:grid sm:grid-cols-[1fr_100px_120px_60px] sm:gap-4 sm:items-center border-b border-border pb-6"
              >
                {/* Product info */}
                <div className="flex gap-4 min-w-0">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-30 bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/products/${item.productId}`} className="text-sm font-medium hover:underline line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted mt-1">{item.color} / {item.size}</p>
                    <p className="text-sm font-semibold mt-1 sm:hidden">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>

                {/* Quantity - mobile inline */}
                <div className="flex sm:justify-center items-start sm:items-center">
                  <div className="flex border border-border">
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground text-sm"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center text-sm border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price - desktop */}
                <div className="hidden sm:block text-right">
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>

                {/* Remove */}
                <div className="flex items-start sm:items-center sm:justify-center">
                  <button
                    onClick={() => removeFromCart(item.productId, item.color, item.size)}
                    className="text-muted hover:text-foreground transition-colors"
                    aria-label="삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 lg:mt-0">
          <div id="cart-summary" className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-sm font-bold mb-4">주문 요약</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">상품 금액</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">배송비</span>
                <span>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-accent">
                  {formatPrice(50000 - total)} 더 구매 시 무료배송
                </p>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>총 결제금액</span>
                <span className="text-lg">{formatPrice(total + shippingFee)}</span>
              </div>
            </div>
            <Link
              id="cart-order-btn"
              href="/checkout"
              className="block w-full mt-6 bg-foreground text-background text-center py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              주문하기
            </Link>
            <Link
              href="/"
              className="block w-full mt-3 text-center py-3 text-sm text-muted hover:text-foreground border border-border transition-colors"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard type="authRequired">
      <CartPageContent />
    </AuthGuard>
  );
}
