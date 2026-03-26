export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  richDescription?: string;
  details: string[];
  specs: Record<string, string>;
  colors: string[];
  sizes: string[];
  badge?: string;
  reviews: Review[];
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export const categories = ["전체", "상의", "하의", "아우터", "액세서리"];

export const products: Product[] = [
  {
    id: 1,
    name: "오버사이즈 코튼 티셔츠",
    price: 39000,
    originalPrice: 52000,
    category: "상의",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop&q=80",
    description: "부드러운 코튼 소재의 오버사이즈 핏 티셔츠. 데일리로 편하게 착용하기 좋은 아이템입니다. 넉넉한 실루엣으로 체형에 구애받지 않으며, 단독 착용은 물론 레이어드에도 활용하기 좋습니다.",
    richDescription: `<h2>상품 소개</h2>
<p>부드러운 코튼 소재의 오버사이즈 핏 티셔츠입니다. 데일리로 편하게 착용하기 좋은 아이템으로, 넉넉한 실루엣이 특징입니다.</p>
<p><img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=500&fit=crop" /></p>
<h3>소재 안내</h3>
<ul><li>코튼 100%</li><li>부드러운 촉감</li><li>통기성이 좋아 여름에도 쾌적</li></ul>
<h3>핏 안내</h3>
<p>넉넉한 오버사이즈 핏으로 체형에 구애받지 않으며, 단독 착용은 물론 레이어드에도 활용하기 좋습니다.</p>
<blockquote>Tip: 평소 사이즈 그대로 선택하시면 적당한 오버핏으로 착용하실 수 있습니다.</blockquote>
<p><strong>세탁 방법:</strong> 찬물 손세탁 권장</p>`,
    details: ["소재: 코튼 100%", "핏: 오버사이즈", "세탁: 찬물 손세탁 권장", "원산지: 대한민국"],
    specs: { "소재": "코튼 100%", "핏": "오버사이즈", "두께": "보통", "무게": "약 220g", "시즌": "봄/여름/가을", "제조년월": "2026년 1월", "원산지": "대한민국" },
    colors: ["화이트", "블랙", "그레이"],
    sizes: ["S", "M", "L", "XL"],
    badge: "SALE",
    reviews: [
      { name: "김**", rating: 5, date: "2026.03.15", text: "핏이 정말 예뻐요! 오버사이즈인데 너무 크지 않아서 좋아요." },
      { name: "이**", rating: 4, date: "2026.03.10", text: "소재가 부드럽고 좋은데 세탁 후 약간 줄어들었어요." },
      { name: "박**", rating: 5, date: "2026.03.05", text: "데일리로 매일 입고 있어요. 색상도 깔끔하고 추천합니다." },
    ],
  },
  {
    id: 2,
    name: "와이드 데님 팬츠",
    price: 68000,
    category: "하의",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=750&fit=crop&q=80",
    description: "클래식한 와이드 핏 데님. 어떤 상의와도 매칭이 쉬운 베이직 아이템입니다. 편안한 착용감과 깔끔한 핏으로 데일리부터 오피스룩까지 다양하게 활용 가능합니다.",
    richDescription: `<h2>와이드 데님 팬츠</h2>
<p>클래식한 와이드 핏 데님으로, 어떤 상의와도 쉽게 매칭할 수 있는 베이직 아이템입니다.</p>
<p><img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=500&fit=crop" /></p>
<h3>소재 & 핏</h3>
<ul><li>면 98%, 스판 2% — 편안한 신축성</li><li>와이드 핏으로 편안한 착용감</li><li>깔끔한 스티칭 디테일</li></ul>
<h3>스타일링 가이드</h3>
<p>심플한 티셔츠부터 셔츠까지, 상의를 가리지 않는 만능 하의입니다. 롤업하여 착용하면 더욱 캐주얼한 무드를 연출할 수 있습니다.</p>
<blockquote>세탁 시 뒤집어서 찬물 세탁해 주세요. 데님 원단의 색빠짐을 최소화할 수 있습니다.</blockquote>`,
    details: ["소재: 데님 (면 98%, 스판 2%)", "핏: 와이드", "세탁: 뒤집어 찬물 세탁", "원산지: 대한민국"],
    specs: { "소재": "면 98%, 스판 2%", "핏": "와이드", "두께": "보통", "무게": "약 450g", "시즌": "사계절", "제조년월": "2026년 2월", "원산지": "대한민국" },
    colors: ["인디고", "라이트블루", "블랙"],
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      { name: "정**", rating: 5, date: "2026.03.12", text: "핏이 진짜 좋아요. 키 170에 M 사이즈 딱 맞아요." },
      { name: "최**", rating: 4, date: "2026.03.08", text: "두꺼운 데님이라 겨울에도 괜찮을 것 같아요." },
    ],
  },
  {
    id: 3,
    name: "울 블렌드 오버코트",
    price: 189000,
    originalPrice: 248000,
    category: "아우터",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&fit=crop&q=80",
    description: "고급스러운 울 블렌드 소재의 오버코트. 겨울 시즌 필수 아우터입니다. 클래식한 디자인으로 어떤 스타일에도 자연스럽게 매칭되며, 보온성과 핏 모두 만족스럽습니다.",
    richDescription: `<h2>울 블렌드 오버코트</h2>
<p>고급스러운 울 블렌드 소재로 제작된 클래식 오버코트입니다. 겨울 시즌의 필수 아우터로, 보온성과 스타일 모두 잡을 수 있습니다.</p>
<p><img src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=500&fit=crop" /></p>
<h3>소재 구성</h3>
<ul><li>울 70% — 뛰어난 보온성</li><li>폴리에스터 30% — 내구성 및 형태 유지</li></ul>
<h3>디테일</h3>
<ol><li>클래식한 싱글 브레스티드 디자인</li><li>고급 단추 마감</li><li>내부 포켓 포함</li></ol>
<p><strong>관리 방법:</strong> 드라이클리닝을 권장합니다. 직사광선을 피해 보관해 주세요.</p>`,
    details: ["소재: 울 70%, 폴리 30%", "핏: 레귤러", "세탁: 드라이클리닝", "원산지: 대한민국"],
    specs: { "소재": "울 70%, 폴리에스터 30%", "핏": "레귤러", "두께": "두꺼움", "무게": "약 1,200g", "시즌": "가을/겨울", "제조년월": "2025년 11월", "원산지": "대한민국" },
    colors: ["베이지", "차콜", "네이비"],
    sizes: ["S", "M", "L", "XL"],
    badge: "SALE",
    reviews: [
      { name: "한**", rating: 5, date: "2026.02.28", text: "가격 대비 퀄리티 최고. 울 비율도 높고 따뜻해요." },
      { name: "윤**", rating: 5, date: "2026.02.20", text: "세일할 때 사서 정말 만족합니다. 고급스러워요." },
      { name: "장**", rating: 4, date: "2026.02.15", text: "디자인 좋은데 무게감이 좀 있어요." },
    ],
  },
  {
    id: 4,
    name: "도트 패턴 셔츠",
    price: 52000,
    category: "상의",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80",
    description: "세련된 도트(점무늬) 패턴의 셔츠. 클래식하면서도 위트 있는 디자인으로 캐주얼룩과 세미 포멀룩 모두 소화 가능합니다. 부드러운 코튼 소재로 착용감도 뛰어납니다.",
    richDescription: `<h2>도트 패턴 셔츠</h2>
<p>세련된 도트 패턴이 돋보이는 셔츠입니다. 클래식하면서도 위트 있는 디자인으로 다양한 룩에 활용 가능합니다.</p>
<p><img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=500&fit=crop" /></p>
<h3>특징</h3>
<ul><li>정교한 도트 패턴 프린트</li><li>코튼 100% — 산뜻한 착용감</li><li>레귤러 핏으로 깔끔한 실루엣</li></ul>
<h3>코디 추천</h3>
<p>슬랙스와 함께 오피스룩으로, 데님과 함께 캐주얼룩으로 다양하게 연출해 보세요.</p>
<p><strong>세탁 방법:</strong> 찬물 세탁, 중성세제 사용 권장</p>`,
    details: ["소재: 코튼 100%", "핏: 레귤러", "세탁: 찬물 세탁", "원산지: 대한민국"],
    specs: { "소재": "코튼 100%", "핏": "레귤러", "두께": "얇음", "무게": "약 190g", "시즌": "봄/여름/가을", "제조년월": "2026년 3월", "원산지": "대한민국" },
    colors: ["화이트/네이비", "블랙/화이트"],
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      { name: "서**", rating: 4, date: "2026.03.18", text: "도트 패턴이 너무 크지 않아서 깔끔해요. 코디하기 좋아요." },
    ],
  },
  {
    id: 5,
    name: "베이지 코튼 치노 팬츠",
    price: 62000,
    category: "하의",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80",
    description: "깔끔한 실루엣의 베이지 코튼 치노 팬츠. 부드러운 면 소재로 편안한 착용감을 제공하며, 슬림 스트레이트 핏으로 캐주얼부터 비즈니스 캐주얼까지 다양하게 활용 가능합니다.",
    richDescription: `<h2>베이지 코튼 치노 팬츠</h2>
<p>깔끔한 실루엣의 치노 팬츠입니다. 슬림 스트레이트 핏으로 캐주얼부터 비즈니스 캐주얼까지 폭넓게 활용할 수 있습니다.</p>
<p><img src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=500&fit=crop" /></p>
<h3>소재 정보</h3>
<ul><li>면 97%, 스판 3%</li><li>부드러운 촉감과 적절한 신축성</li><li>구김이 적어 관리가 편리</li></ul>
<h3>사이즈 참고</h3>
<p>슬림 스트레이트 핏으로 정사이즈 착용을 권장드립니다. 편한 착용감을 원하시면 한 사이즈 업을 추천합니다.</p>
<p><strong>세탁 방법:</strong> 찬물 세탁, 자연건조 권장</p>`,
    details: ["소재: 면 97%, 스판 3%", "핏: 슬림 스트레이트", "세탁: 찬물 세탁", "원산지: 대한민국"],
    specs: { "소재": "면 97%, 스판 3%", "핏": "슬림 스트레이트", "두께": "보통", "무게": "약 380g", "시즌": "사계절", "제조년월": "2026년 1월", "원산지": "대한민국" },
    colors: ["베이지", "카키", "네이비"],
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      { name: "오**", rating: 5, date: "2026.03.14", text: "핏이 깔끔하고 소재가 편해요. 사무실에도 입기 좋아요." },
      { name: "강**", rating: 5, date: "2026.03.09", text: "베이지 색상이 사진이랑 거의 같아요. 만족합니다." },
    ],
  },
  {
    id: 6,
    name: "캔버스 토트백",
    price: 32000,
    category: "액세서리",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=750&fit=crop&q=80",
    description: "튼튼한 캔버스 소재의 데일리 토트백. 넉넉한 수납공간이 특징입니다. 노트북, 책, 일상 소지품을 모두 담을 수 있으며, 심플한 디자인으로 어디에나 잘 어울립니다.",
    richDescription: `<h2>캔버스 토트백</h2>
<p>튼튼한 캔버스 소재로 제작된 데일리 토트백입니다. 넉넉한 수납공간으로 다양한 용도로 활용할 수 있습니다.</p>
<p><img src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=500&fit=crop" /></p>
<h3>제품 특징</h3>
<ul><li>캔버스 (면 100%) — 내구성이 뛰어남</li><li>사이즈: 40 x 35 x 12cm</li><li>내부 포켓 1개 — 소지품 정리에 편리</li></ul>
<h3>활용 팁</h3>
<p>노트북, 책, 텀블러 등 일상 소지품을 모두 담을 수 있는 넉넉한 크기입니다. 심플한 디자인으로 어떤 스타일에도 잘 어울립니다.</p>
<p><strong>세탁 방법:</strong> 손세탁 후 자연건조</p>`,
    details: ["소재: 캔버스 (면 100%)", "사이즈: 40x35x12cm", "세탁: 손세탁", "원산지: 대한민국"],
    specs: { "소재": "캔버스 (면 100%)", "크기": "40 x 35 x 12cm", "무게": "약 320g", "수납": "내부 포켓 1개", "시즌": "사계절", "제조년월": "2026년 2월", "원산지": "대한민국" },
    colors: ["아이보리", "블랙"],
    sizes: ["ONE SIZE"],
    reviews: [
      { name: "신**", rating: 4, date: "2026.03.20", text: "가볍고 수납이 넉넉해요. 가성비 좋습니다." },
    ],
  },
  {
    id: 7,
    name: "컬러 프린트 반팔 티셔츠",
    price: 35000,
    category: "상의",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop&q=80",
    description: "유니크한 컬러 프린트가 돋보이는 반팔 티셔츠. 가벼운 코튼 소재로 여름 데일리룩에 딱 맞으며, 개성 있는 디자인으로 심플한 하의와 매칭하면 완성도 높은 스타일링이 가능합니다.",
    richDescription: `<h2>컬러 프린트 반팔 티셔츠</h2>
<p>유니크한 컬러 프린트가 돋보이는 반팔 티셔츠입니다. 여름 데일리룩의 포인트 아이템으로 활용해 보세요.</p>
<p><img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=500&fit=crop" /></p>
<h3>프린트 특징</h3>
<ul><li>고품질 디지털 프린트 — 세탁 후에도 색감 유지</li><li>코튼 100% 소재</li><li>가볍고 통기성 우수</li></ul>
<h3>스타일링</h3>
<p>심플한 데님이나 면바지와 매칭하면 완성도 높은 캐주얼 스타일링이 가능합니다. 개성 있는 프린트가 포인트가 됩니다.</p>
<blockquote>사이즈가 약간 작게 나오므로 한 사이즈 업을 추천드립니다.</blockquote>
<p><strong>세탁 방법:</strong> 뒤집어서 찬물 세탁 권장</p>`,
    details: ["소재: 코튼 100%", "핏: 레귤러", "세탁: 뒤집어 찬물 세탁", "원산지: 대한민국"],
    specs: { "소재": "코튼 100%", "핏": "레귤러", "두께": "얇음", "무게": "약 180g", "시즌": "봄/여름", "제조년월": "2026년 3월", "원산지": "대한민국" },
    colors: ["멀티컬러", "블랙프린트"],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
    reviews: [
      { name: "조**", rating: 5, date: "2026.03.22", text: "프린트가 세탁해도 잘 안 빠져요. 디자인 예뻐요." },
      { name: "임**", rating: 5, date: "2026.03.19", text: "여름에 딱 좋은 두께. 색감도 사진이랑 같아요." },
      { name: "황**", rating: 4, date: "2026.03.16", text: "핏은 좋은데 사이즈가 약간 작게 나와요. 한 사이즈 업 추천." },
    ],
  },
  {
    id: 8,
    name: "데님 트러커 자켓",
    price: 89000,
    originalPrice: 118000,
    category: "아우터",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&h=750&fit=crop&q=80",
    description: "클래식한 데님 트러커 자켓. 봄가을 시즌 가장 활용도 높은 아우터입니다. 워싱 처리된 인디고 데님 소재로 빈티지한 무드를 연출하며, 어떤 스타일에도 자연스럽게 어울립니다.",
    richDescription: `<h2>데님 트러커 자켓</h2>
<p>클래식한 데님 트러커 자켓으로, 봄가을 시즌에 가장 활용도 높은 아우터입니다.</p>
<p><img src="https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=500&fit=crop" /></p>
<h3>소재 & 디테일</h3>
<ul><li>데님 (면 100%)</li><li>워싱 처리된 인디고 컬러 — 빈티지한 무드</li><li>메탈 버튼 마감</li></ul>
<h3>스타일링 포인트</h3>
<p>후드티 위에 레이어드하거나 셔츠 위에 가볍게 걸쳐 입으면 멋스러운 캐주얼 스타일을 완성할 수 있습니다.</p>
<blockquote>첫 세탁 시 약간의 색빠짐이 있을 수 있습니다. 단독 세탁을 권장합니다.</blockquote>
<p><strong>세탁 방법:</strong> 뒤집어서 찬물 세탁, 자연건조</p>`,
    details: ["소재: 데님 (면 100%)", "핏: 레귤러", "세탁: 뒤집어 찬물 세탁", "원산지: 대한민국"],
    specs: { "소재": "데님 (면 100%)", "핏": "레귤러", "두께": "보통", "무게": "약 650g", "시즌": "봄/가을", "제조년월": "2026년 2월", "원산지": "대한민국" },
    colors: ["인디고", "라이트워싱", "블랙"],
    sizes: ["S", "M", "L", "XL"],
    badge: "SALE",
    reviews: [
      { name: "배**", rating: 5, date: "2026.03.01", text: "워싱 색감이 예뻐요. 봄에 딱 좋은 두께입니다." },
      { name: "류**", rating: 4, date: "2026.02.25", text: "클래식한 핏이라 어디에나 잘 어울려요. 세일해서 더 만족." },
    ],
  },
];

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "전체") return products;
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
    .concat(
      products
        .filter((p) => p.id !== product.id && p.category !== product.category)
        .slice(0, limit)
    )
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}
