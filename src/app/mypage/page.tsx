"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/data/products";
import AuthGuard from "@/components/AuthGuard";

interface OrderItem {
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

type OrderStatus = "배송완료" | "배송중" | "결제완료" | "취소됨";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
  deliveryNote: string;
  paymentMethod: string;
  courier?: string;
  trackingNumber?: string;
}

const initialOrders: Order[] = [
  {
    id: "ORD-2026031501",
    date: "2026.03.15",
    status: "배송완료",
    items: [
      {
        name: "오버사이즈 코튼 티셔츠",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
        color: "화이트",
        size: "L",
        quantity: 2,
        price: 39000,
      },
      {
        name: "캔버스 토트백",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=750&fit=crop",
        color: "아이보리",
        size: "ONE SIZE",
        quantity: 1,
        price: 32000,
      },
    ],
    total: 110000,
    address: "서울시 강남구 테헤란로 123 아파트 456호",
    deliveryNote: "부재 시 경비실에 맡겨주세요",
    paymentMethod: "카드결제",
  },
  {
    id: "ORD-2026032001",
    date: "2026.03.20",
    status: "배송중",
    items: [
      {
        name: "메리노 울 니트",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop",
        color: "크림",
        size: "M",
        quantity: 1,
        price: 98000,
      },
    ],
    total: 98000,
    address: "서울시 마포구 월드컵북로 45 오피스텔 301호",
    deliveryNote: "문 앞에 놓아주세요",
    paymentMethod: "카카오페이",
    courier: "CJ대한통운",
    trackingNumber: "1234567890",
  },
  {
    id: "ORD-2026032501",
    date: "2026.03.25",
    status: "결제완료",
    items: [
      {
        name: "울 블렌드 오버코트",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&fit=crop",
        color: "베이지",
        size: "M",
        quantity: 1,
        price: 189000,
      },
      {
        name: "코듀로이 와이드 팬츠",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop",
        color: "브라운",
        size: "M",
        quantity: 1,
        price: 72000,
      },
    ],
    total: 261000,
    address: "경기도 성남시 분당구 판교역로 200 빌딩 8층",
    deliveryNote: "배송 전 전화 부탁드립니다",
    paymentMethod: "네이버페이",
  },
  {
    id: "ORD-2026030801",
    date: "2026.03.08",
    status: "취소됨",
    items: [
      {
        name: "리넨 블렌드 셔츠",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop",
        color: "네이비",
        size: "L",
        quantity: 1,
        price: 65000,
      },
    ],
    total: 65000,
    address: "서울시 송파구 올림픽로 300 아파트 1201호",
    deliveryNote: "없음",
    paymentMethod: "카드결제",
  },
];

const statusColors: Record<string, string> = {
  "배송완료": "bg-gray-100 text-gray-700",
  "배송중": "bg-blue-50 text-blue-700",
  "결제완료": "bg-green-50 text-green-700",
  "취소됨": "bg-red-50 text-red-500",
};

const filterOptions: Array<{ label: string; value: OrderStatus | "전체" }> = [
  { label: "전체", value: "전체" },
  { label: "결제완료", value: "결제완료" },
  { label: "배송중", value: "배송중" },
  { label: "배송완료", value: "배송완료" },
  { label: "취소됨", value: "취소됨" },
];

/* ── Star Rating Component ── */
function StarRating({ rating, onRate }: { rating: number; onRate: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${star <= rating ? "text-yellow-400" : "text-gray-200"} transition-colors`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ── Review Modal Component ── */
function ReviewModal({
  orderItem,
  onClose,
  onSubmit,
}: {
  orderItem: string;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 p-6 shadow-xl rounded-lg">
        <h3 className="text-base font-bold mb-1">리뷰 작성</h3>
        <p className="text-xs text-muted mb-4">{orderItem}</p>

        <div className="mb-4">
          <p className="text-xs text-muted mb-1.5">별점</p>
          <StarRating rating={rating} onRate={setRating} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="상품에 대한 솔직한 리뷰를 남겨주세요"
          rows={4}
          className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors resize-none mb-4"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border text-xs text-muted hover:text-foreground transition-colors"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

function MyPageContent() {
  const [toast, setToast] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "김민수",
    email: "kim@email.com",
    phone: "010-1234-5678",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "전체">("전체");
  const [reviewModal, setReviewModal] = useState<{ orderId: string; itemName: string } | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const validateProfile = (): boolean => {
    const errors: Record<string, string> = {};
    if (!profileForm.name.trim()) errors.name = "이름을 입력해주세요";
    if (!profileForm.email.trim()) errors.email = "이메일을 입력해주세요";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = () => {
    if (!validateProfile()) return;
    setEditingProfile(false);
    setProfileErrors({});
    showToast("수정되었습니다");
  };

  const handleCancelOrder = (orderId: string) => {
    if (!window.confirm("정말 주문을 취소하시겠습니까?")) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "취소됨" as OrderStatus } : o))
    );
    showToast("주문이 취소되었습니다");
  };

  const filteredOrders = activeFilter === "전체"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const statusCounts = orders.reduce<Record<string, number>>(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      acc["전체"] = (acc["전체"] || 0) + 1;
      return acc;
    },
    { "전체": 0, "결제완료": 0, "배송중": 0, "배송완료": 0, "취소됨": 0 }
  );

  return (
    <div id="page-mypage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <ReviewModal
          orderItem={reviewModal.itemName}
          onClose={() => setReviewModal(null)}
          onSubmit={() => {
            setReviewModal(null);
            showToast("리뷰가 등록되었습니다");
          }}
        />
      )}

      <h1 className="text-2xl font-bold tracking-tight mb-8">마이페이지</h1>

      {/* User info */}
      <section id="mypage-profile" className="border border-border p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-muted text-lg font-bold">
            김
          </div>
          <div className="flex-1">
            {editingProfile ? (
              <div className="space-y-2">
                <div>
                  <div className="flex gap-2 items-center">
                    <label className="text-xs text-muted w-12">이름<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => { setProfileForm({ ...profileForm, name: e.target.value }); setProfileErrors(prev => ({...prev, name: ""})); }}
                      className={`flex-1 px-2 py-1.5 text-sm border focus:outline-none focus:border-foreground transition-colors ${profileErrors.name ? "border-red-400" : "border-border"}`}
                    />
                  </div>
                  {profileErrors.name && <p className="text-xs text-red-500 mt-1 ml-14">{profileErrors.name}</p>}
                </div>
                <div>
                  <div className="flex gap-2 items-center">
                    <label className="text-xs text-muted w-12">이메일<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => { setProfileForm({ ...profileForm, email: e.target.value }); setProfileErrors(prev => ({...prev, email: ""})); }}
                      className={`flex-1 px-2 py-1.5 text-sm border focus:outline-none focus:border-foreground transition-colors ${profileErrors.email ? "border-red-400" : "border-border"}`}
                    />
                  </div>
                  {profileErrors.email && <p className="text-xs text-red-500 mt-1 ml-14">{profileErrors.email}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-xs text-muted w-12">전화 <span className="text-[10px] text-muted font-normal">(선택)</span></label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-sm border border-border focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleProfileSave}
                    className="px-4 py-1.5 bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="px-4 py-1.5 border border-border text-xs text-muted hover:text-foreground transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-bold">{profileForm.name}</h2>
                <p className="text-sm text-muted">{profileForm.email}</p>
                <p className="text-xs text-muted mt-0.5">{profileForm.phone}</p>
              </div>
            )}
          </div>
          {!editingProfile && (
            <button
              id="mypage-edit-btn"
              onClick={() => setEditingProfile(true)}
              className="px-3 py-1.5 text-xs border border-border text-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              수정
            </button>
          )}
          <div className="ml-auto hidden sm:flex gap-6 text-center">
            <div>
              <p className="text-lg font-bold">{orders.filter((o) => o.status !== "취소됨").length}</p>
              <p className="text-xs text-muted">주문</p>
            </div>
            <div>
              <p className="text-lg font-bold">5,420</p>
              <p className="text-xs text-muted">적립금</p>
            </div>
            <div>
              <p className="text-lg font-bold">2</p>
              <p className="text-xs text-muted">쿠폰</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order history */}
      <section>
        <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">주문 내역</h2>

        {/* Status filter */}
        <div id="mypage-order-filters" className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFilter === opt.value
                  ? "bg-foreground text-background"
                  : "bg-gray-100 text-muted hover:text-foreground"
              }`}
            >
              {opt.label} ({statusCounts[opt.value] || 0})
            </button>
          ))}
        </div>

        <div id="mypage-orders" className="space-y-6">
          {filteredOrders.length === 0 && (
            <p className="text-sm text-muted text-center py-8">해당 상태의 주문이 없습니다.</p>
          )}
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className="border border-border">
                {/* Order header - clickable */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full text-left px-5 py-3 bg-gray-50 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{order.id}</span>
                  <span className="text-muted">{order.date}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="ml-auto font-bold flex items-center gap-2">
                    {formatPrice(order.total)}
                    <svg
                      className={`w-4 h-4 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Order detail - expandable */}
                {isExpanded && (
                  <div className="divide-y divide-border">
                    {/* Items */}
                    {order.items.map((item, idx) => (
                      <div key={idx} className="px-5 py-4 flex gap-4">
                        <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted mt-0.5">{item.color} / {item.size} / {item.quantity}개</p>
                          <p className="text-sm font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}

                    {/* Delivery info */}
                    <div className="px-5 py-4 space-y-2">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">배송지 정보</h4>
                      <div className="text-sm text-muted space-y-0.5">
                        <p>{order.address}</p>
                        <p className="text-xs">배송 메모: {order.deliveryNote}</p>
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="px-5 py-4 space-y-2">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">결제 정보</h4>
                      <div className="text-sm text-muted space-y-0.5">
                        <p>결제 수단: {order.paymentMethod}</p>
                        <p>결제 금액: <span className="text-foreground font-semibold">{formatPrice(order.total)}</span></p>
                      </div>
                    </div>

                    {/* Delivery tracking for 배송중 */}
                    {order.status === "배송중" && order.courier && order.trackingNumber && (
                      <div className="px-5 py-4 space-y-2">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">배송 추적</h4>
                        <div className="text-sm text-muted space-y-0.5">
                          <p>택배사: {order.courier}</p>
                          <p>송장번호: {order.trackingNumber}</p>
                        </div>
                      </div>
                    )}

                    {/* Order summary footer */}
                    <div className="px-5 py-3 bg-gray-50 flex items-center justify-between text-xs text-muted">
                      <span>배송비: {order.total >= 50000 ? "무료" : formatPrice(3000)}</span>
                      <span>결제 금액: <strong className="text-foreground text-sm">{formatPrice(order.total)}</strong></span>
                    </div>

                    {/* Action buttons per status */}
                    <div className="px-5 py-3 flex flex-wrap gap-2">
                      {order.status === "결제완료" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                        >
                          주문 취소
                        </button>
                      )}
                      {order.status === "배송중" && (
                        <button
                          onClick={() => showToast("택배사 사이트로 이동합니다 (데모)")}
                          className="px-4 py-2 border border-blue-300 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors"
                        >
                          배송 조회
                        </button>
                      )}
                      {order.status === "배송완료" && (
                        <>
                          <button
                            onClick={() => showToast("교환/반품 신청이 접수되었습니다 (데모)")}
                            className="px-4 py-2 border border-border text-muted text-xs font-medium hover:text-foreground hover:border-foreground transition-colors"
                          >
                            교환/반품 신청
                          </button>
                          <button
                            onClick={() =>
                              setReviewModal({
                                orderId: order.id,
                                itemName: order.items.map((i) => i.name).join(", "),
                              })
                            }
                            className="px-4 py-2 bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
                          >
                            리뷰 작성
                          </button>
                        </>
                      )}
                      {order.status === "취소됨" && (
                        <span className="text-xs text-red-400 py-2">이 주문은 취소되었습니다.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
          &larr; 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <AuthGuard type="authRequired">
      <MyPageContent />
    </AuthGuard>
  );
}
