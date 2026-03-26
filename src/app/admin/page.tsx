"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { products as initialProducts, formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import AuthGuard from "@/components/AuthGuard";

const PRODUCTS_KEY = "shop-demo-products";
const EDIT_ID_KEY = "shop-demo-edit-id";

type Tab = "dashboard" | "products" | "orders";

interface OrderItem {
  name: string;
  option: string;
  quantity: number;
  price: number;
  image: string;
}

interface StatusHistoryEntry {
  status: string;
  date: string;
}

interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  date: string;
  address: string;
  deliveryNote: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
  statusHistory: StatusHistoryEntry[];
  courier: string;
  trackingNumber: string;
}

const dummyOrders: AdminOrder[] = [
  {
    id: "ORD-2026032601",
    customer: "김민수",
    phone: "010-1234-5678",
    date: "2026.03.26 14:23",
    address: "서울시 강남구 테헤란로 123, 4층",
    deliveryNote: "부재시 경비실에 맡겨주세요",
    items: [
      { name: "오버사이즈 코튼 티셔츠", option: "화이트 / M", quantity: 2, price: 78000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=120&fit=crop&q=80" },
      { name: "와이드 데님 팬츠", option: "인디고 / M", quantity: 1, price: 68000, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=120&fit=crop&q=80" },
    ],
    subtotal: 146000,
    shipping: 0,
    total: 146000,
    paymentMethod: "카드결제",
    status: "결제완료",
    statusHistory: [{ status: "결제완료", date: "2026.03.26 14:23" }],
    courier: "",
    trackingNumber: "",
  },
  {
    id: "ORD-2026032501",
    customer: "이서연",
    phone: "010-9876-5432",
    date: "2026.03.25 10:05",
    address: "서울시 마포구 월드컵북로 56, 302호",
    deliveryNote: "문 앞에 놓아주세요",
    items: [
      { name: "울 블렌드 오버코트", option: "베이지 / S", quantity: 1, price: 189000, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&h=120&fit=crop&q=80" },
    ],
    subtotal: 189000,
    shipping: 0,
    total: 189000,
    paymentMethod: "카드결제",
    status: "배송준비",
    statusHistory: [
      { status: "결제완료", date: "2026.03.25 10:05" },
      { status: "배송준비", date: "2026.03.25 15:30" },
    ],
    courier: "",
    trackingNumber: "",
  },
  {
    id: "ORD-2026032401",
    customer: "박준형",
    phone: "010-5555-1234",
    date: "2026.03.24 09:12",
    address: "경기도 성남시 분당구 판교로 234, 1201호",
    deliveryNote: "택배함에 넣어주세요",
    items: [
      { name: "와이드 데님 팬츠", option: "블랙 / L", quantity: 1, price: 68000, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=120&fit=crop&q=80" },
      { name: "도트 패턴 셔츠", option: "화이트/네이비 / M", quantity: 1, price: 52000, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=120&fit=crop&q=80" },
      { name: "베이지 코튼 치노 팬츠", option: "베이지 / M", quantity: 1, price: 62000, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&h=120&fit=crop&q=80" },
    ],
    subtotal: 182000,
    shipping: 0,
    total: 182000,
    paymentMethod: "무통장입금",
    status: "배송중",
    statusHistory: [
      { status: "결제완료", date: "2026.03.24 09:12" },
      { status: "배송준비", date: "2026.03.24 14:00" },
      { status: "배송중", date: "2026.03.25 09:30" },
    ],
    courier: "CJ대한통운",
    trackingNumber: "6123456789012",
  },
  {
    id: "ORD-2026032301",
    customer: "최유진",
    phone: "010-3333-7777",
    date: "2026.03.23 18:45",
    address: "서울시 송파구 올림픽로 300, 505호",
    deliveryNote: "",
    items: [
      { name: "오버사이즈 코튼 티셔츠", option: "그레이 / L", quantity: 1, price: 39000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=120&fit=crop&q=80" },
      { name: "와이드 데님 팬츠", option: "라이트블루 / S", quantity: 1, price: 68000, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=120&fit=crop&q=80" },
    ],
    subtotal: 107000,
    shipping: 0,
    total: 107000,
    paymentMethod: "카드결제",
    status: "배송완료",
    statusHistory: [
      { status: "결제완료", date: "2026.03.23 18:45" },
      { status: "배송준비", date: "2026.03.24 09:00" },
      { status: "배송중", date: "2026.03.24 16:00" },
      { status: "배송완료", date: "2026.03.25 11:20" },
    ],
    courier: "한진택배",
    trackingNumber: "5501234567890",
  },
  {
    id: "ORD-2026032201",
    customer: "정하늘",
    phone: "010-8888-2222",
    date: "2026.03.22 11:30",
    address: "인천시 연수구 송도대로 100, 708호",
    deliveryNote: "경비실 맡겨주세요",
    items: [
      { name: "울 블렌드 오버코트", option: "차콜 / M", quantity: 1, price: 189000, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&h=120&fit=crop&q=80" },
    ],
    subtotal: 189000,
    shipping: 0,
    total: 189000,
    paymentMethod: "카드결제",
    status: "배송완료",
    statusHistory: [
      { status: "결제완료", date: "2026.03.22 11:30" },
      { status: "배송준비", date: "2026.03.22 17:00" },
      { status: "배송중", date: "2026.03.23 10:00" },
      { status: "배송완료", date: "2026.03.24 14:30" },
    ],
    courier: "롯데택배",
    trackingNumber: "2209876543210",
  },
  {
    id: "ORD-2026032101",
    customer: "한소희",
    phone: "010-6666-4444",
    date: "2026.03.21 16:10",
    address: "서울시 용산구 이태원로 55, 201호",
    deliveryNote: "전화 주세요",
    items: [
      { name: "도트 패턴 셔츠", option: "블랙/화이트 / S", quantity: 1, price: 52000, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=120&fit=crop&q=80" },
      { name: "오버사이즈 코튼 티셔츠", option: "블랙 / M", quantity: 1, price: 39000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=120&fit=crop&q=80" },
    ],
    subtotal: 91000,
    shipping: 3000,
    total: 94000,
    paymentMethod: "카카오페이",
    status: "취소",
    statusHistory: [
      { status: "결제완료", date: "2026.03.21 16:10" },
      { status: "취소", date: "2026.03.21 18:30" },
    ],
    courier: "",
    trackingNumber: "",
  },
];

const statusOptions = ["결제완료", "배송준비", "배송중", "배송완료", "취소"];
const courierOptions = ["CJ대한통운", "한진택배", "롯데택배", "우체국택배"];

function DashboardCards({ productCount }: { productCount: number }) {
  const cards = [
    { label: "총 상품", value: `${productCount}개`, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { label: "총 주문", value: "15건", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "총 매출", value: "2,340,000원", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "신규 회원", value: "3명", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
            </svg>
            <span className="text-xs text-muted">{card.label}</span>
          </div>
          <p className="text-xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function ProductsTable({
  productList,
  onEdit,
  onDelete,
}: {
  productList: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 font-medium text-muted">상품</th>
            <th className="pb-3 font-medium text-muted hidden sm:table-cell">카테고리</th>
            <th className="pb-3 font-medium text-muted text-right">가격</th>
            <th className="pb-3 font-medium text-muted text-center">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {productList.map((p) => (
            <tr key={p.id}>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    {p.badge && (
                      <span className="text-[10px] text-accent font-medium">{p.badge}</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 text-muted hidden sm:table-cell">{p.category}</td>
              <td className="py-3 text-right font-medium">{formatPrice(p.price)}</td>
              <td className="py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(p.id)}
                    className="px-3 py-1 text-xs border border-border text-muted hover:text-foreground hover:border-foreground transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-3 py-1 text-xs border border-border text-red-400 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getItemsSummary(items: OrderItem[]): string {
  if (items.length === 1) return items[0].name;
  return `${items[0].name} 외 ${items.length - 1}건`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "결제완료": return "text-blue-600 bg-blue-50";
    case "배송준비": return "text-amber-600 bg-amber-50";
    case "배송중": return "text-emerald-600 bg-emerald-50";
    case "배송완료": return "text-gray-600 bg-gray-100";
    case "취소": return "text-red-500 bg-red-50";
    default: return "text-muted bg-gray-50";
  }
}

function getNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  onSaveTracking,
  showToast,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onSaveTracking: (orderId: string, courier: string, trackingNumber: string) => void;
  showToast: (msg: string) => void;
}) {
  const [courier, setCourier] = useState(order.courier || courierOptions[0]);
  const [trackingNum, setTrackingNum] = useState(order.trackingNumber);
  const showTracking = order.status === "배송준비" || order.status === "배송중";

  const handleSaveTracking = () => {
    if (!trackingNum.trim()) {
      showToast("송장번호를 입력해주세요");
      return;
    }
    onSaveTracking(order.id, courier, trackingNum);
    showToast("송장번호가 등록되었습니다");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white shadow-xl max-w-2xl w-full mx-4 my-auto rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-base font-bold">주문 상세</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 주문 정보 */}
          <div>
            <h4 className="text-sm font-bold mb-3">주문 정보</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted">주문번호</span>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <span className="text-muted">주문일시</span>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <span className="text-muted">주문자</span>
                <p className="font-medium">{order.customer}</p>
              </div>
              <div>
                <span className="text-muted">연락처</span>
                <p className="font-medium">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* 배송지 정보 */}
          <div className="border-t border-border pt-5">
            <h4 className="text-sm font-bold mb-3">배송지 정보</h4>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-muted">주소</span>
                <p className="font-medium">{order.address}</p>
              </div>
              {order.deliveryNote && (
                <div>
                  <span className="text-muted">배송 요청사항</span>
                  <p className="font-medium">{order.deliveryNote}</p>
                </div>
              )}
            </div>
          </div>

          {/* 주문 상품 */}
          <div className="border-t border-border pt-5">
            <h4 className="text-sm font-bold mb-3">주문 상품</h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <div className="relative w-14 h-[68px] bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted">{item.option}</p>
                    <p className="text-xs text-muted">수량: {item.quantity}</p>
                  </div>
                  <p className="font-medium flex-shrink-0">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="border-t border-border pt-5">
            <h4 className="text-sm font-bold mb-3">결제 정보</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">결제수단</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">상품금액</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">배송비</span>
                <span>{order.shipping === 0 ? "무료" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-bold">결제금액</span>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* 송장번호 입력 */}
          {showTracking && (
            <div className="border-t border-border pt-5">
              <h4 className="text-sm font-bold mb-3">송장 정보</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-foreground"
                >
                  {courierOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={trackingNum}
                  onChange={(e) => setTrackingNum(e.target.value)}
                  placeholder="송장번호 입력"
                  className="flex-1 px-3 py-2 text-sm border border-border focus:outline-none focus:border-foreground"
                />
                <button
                  onClick={handleSaveTracking}
                  className="px-4 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  등록
                </button>
              </div>
              {order.trackingNumber && (
                <p className="text-xs text-muted mt-2">현재: {order.courier} {order.trackingNumber}</p>
              )}
            </div>
          )}

          {/* 상태 변경 */}
          <div className="border-t border-border pt-5">
            <h4 className="text-sm font-bold mb-3">주문 상태</h4>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
                className="px-2 py-1 text-xs border border-border bg-white focus:outline-none focus:border-foreground"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 상태 변경 이력 */}
          <div className="border-t border-border pt-5">
            <h4 className="text-sm font-bold mb-3">상태 변경 이력</h4>
            <div className="space-y-0">
              {order.statusHistory.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm relative pb-4">
                  {/* Timeline line */}
                  {idx < order.statusHistory.length - 1 && (
                    <div className="absolute left-[5px] top-3 bottom-0 w-px bg-border" />
                  )}
                  {/* Dot */}
                  <div className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-[3px] border-2 ${
                    idx === order.statusHistory.length - 1 ? "border-foreground bg-foreground" : "border-border bg-white"
                  }`} />
                  <div className="flex-1">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                    <p className="text-xs text-muted mt-1">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-border text-sm font-medium text-muted hover:text-foreground hover:border-foreground transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersTable({ showToast }: { showToast: (msg: string) => void }) {
  const [orders, setOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("전체");

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const now = getNow();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: newStatus,
          statusHistory: [...o.statusHistory, { status: newStatus, date: now }],
        };
      })
    );
    // Update the selected order if the modal is open
    setSelectedOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: newStatus,
        statusHistory: [...prev.statusHistory, { status: newStatus, date: now }],
      };
    });
    showToast(`주문 ${orderId} 상태가 "${newStatus}"(으)로 변경되었습니다`);
  };

  const handleSaveTracking = (orderId: string, courier: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, courier, trackingNumber } : o))
    );
    setSelectedOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return { ...prev, courier, trackingNumber };
    });
  };

  const statusCounts = statusOptions.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const filteredOrders = statusFilter === "전체" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      {/* Status filter buttons */}
      <div id="admin-order-filters" className="flex flex-wrap gap-2 mb-5">
        {["전체", ...statusOptions].map((s) => {
          const count = s === "전체" ? orders.length : (statusCounts[s] || 0);
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:text-foreground hover:border-foreground"
              }`}
            >
              {s} <span className={isActive ? "text-background/70" : "text-muted"}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onSaveTracking={handleSaveTracking}
          showToast={showToast}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-medium text-muted">주문번호</th>
              <th className="pb-3 font-medium text-muted hidden sm:table-cell">고객</th>
              <th className="pb-3 font-medium text-muted hidden md:table-cell">날짜</th>
              <th className="pb-3 font-medium text-muted hidden lg:table-cell">상품</th>
              <th className="pb-3 font-medium text-muted text-right">금액</th>
              <th className="pb-3 font-medium text-muted text-center">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 font-medium">{order.id}</td>
                <td className="py-3 text-muted hidden sm:table-cell">{order.customer}</td>
                <td className="py-3 text-muted hidden md:table-cell">{order.date.split(" ")[0]}</td>
                <td className="py-3 text-muted hidden lg:table-cell truncate max-w-[200px]">{getItemsSummary(order.items)}</td>
                <td className="py-3 text-right font-medium">{formatPrice(order.total)}</td>
                <td className="py-3">
                  <div className="flex justify-center">
                    <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted text-sm">
                  해당 상태의 주문이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<string | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) {
        setProductList(JSON.parse(stored));
      } else {
        setProductList([...initialProducts]);
      }
    } catch {
      setProductList([...initialProducts]);
    }
    setLoaded(true);
  }, []);

  // Persist products to localStorage whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productList));
    }
  }, [productList, loaded]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleEdit = (id: number) => {
    localStorage.setItem(EDIT_ID_KEY, String(id));
    router.push("/admin/products/edit");
  };

  const handleDeleteConfirm = (id: number) => {
    setConfirmDelete(id);
  };

  const handleDeleteExecute = () => {
    if (confirmDelete === null) return;
    const product = productList.find((p) => p.id === confirmDelete);
    setProductList((prev) => prev.filter((p) => p.id !== confirmDelete));
    setConfirmDelete(null);
    if (product) {
      showToast(`"${product.name}" 이(가) 삭제되었습니다`);
    }
  };

  const tabs: { value: Tab; label: string }[] = [
    { value: "dashboard", label: "대시보드" },
    { value: "products", label: "상품 관리" },
    { value: "orders", label: "주문 관리" },
  ];

  return (
    <div id="page-admin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 shadow-xl max-w-sm w-full mx-4 rounded-lg">
            <h3 className="text-base font-bold mb-2">상품 삭제</h3>
            <p className="text-sm text-muted mb-6">
              &quot;{productList.find((p) => p.id === confirmDelete)?.name}&quot;을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-border text-sm text-muted hover:text-foreground transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteExecute}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">관리자</h1>
        <span className="text-xs text-muted bg-gray-100 px-3 py-1">DEMO</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            id={`admin-tab-${tab.value}`}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "dashboard" && (
        <div id="admin-dashboard" className="space-y-8">
          <DashboardCards productCount={productList.length} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold mb-4">최근 주문</h3>
              <div className="space-y-3">
                {dummyOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm border-b border-border pb-3">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-muted">{getItemsSummary(order.items)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4">인기 상품</h3>
              <div className="space-y-3">
                {productList.slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-3 text-sm border-b border-border pb-3">
                    <span className="text-muted font-medium w-5">{idx + 1}</span>
                    <div className="relative w-8 h-10 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="32px" />
                    </div>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="font-medium">{formatPrice(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div id="admin-products">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">총 {productList.length}개 상품</p>
            <button
              id="admin-add-product-btn"
              onClick={() => router.push("/admin/products/new")}
              className="px-4 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              + 상품 추가
            </button>
          </div>
          <ProductsTable productList={productList} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
        </div>
      )}

      {activeTab === "orders" && (
        <div id="admin-orders">
          <OrdersTable showToast={showToast} />
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard type="adminOnly">
      <AdminPageContent />
    </AuthGuard>
  );
}
