/* ============================
   BARBERPRO — Modelos de Dados
   ============================ */

// ─── Usuário ────────────────────────────────────────────
export type UserRole = 'cliente' | 'dono' | 'funcionario';

export interface UserProfile {
  uid: string;
  role: UserRole;
  shopId?: string;
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  blocked?: boolean;
  blockedReason?: string;
  noShowCount?: number;
  pushToken?: string;
  createdAt?: any;
}

// ─── Barbearia ──────────────────────────────────────────
export interface Barbershop {
  name: string;
  slug: string;
  ownerUid: string;
  address?: string;
  geo?: { lat: number; lng: number };
  photos?: string[];
  phone?: string;
  description?: string;
  subscription: {
    status: 'active' | 'inactive' | 'canceled' | 'trial';
    plan?: 'monthly' | 'quarterly' | 'yearly';
    renewAt?: any;
    stripe?: { customer?: string };
  };
  dailyLimitPerCustomer?: number;
  createdAt?: any;
}

// ─── Serviço ────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  name: string;
  priceCents: number;
  durationMin: number;
  active: boolean;
  description?: string;
  photoUrl?: string;
  category?: string;
}

// ─── Staff / Barbeiro ───────────────────────────────────
export interface StaffMember {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  active: boolean;
  joinedAt?: any;
  schedule?: WeeklySchedule;
}

export interface WeeklySchedule {
  [day: string]: { start: string; end: string; off?: boolean }; // "mon": { start: "09:00", end: "18:00" }
}

// ─── Agendamento ────────────────────────────────────────
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Appointment {
  id: string;
  shopId: string;
  serviceId: string;
  serviceName?: string;
  staffUid?: string;
  staffName?: string;
  customerUid: string;
  customerName?: string;
  start: any; // Firestore Timestamp or Date
  end: any;
  durationMin: number;
  status: AppointmentStatus;
  priceCents?: number;
  paid?: boolean;
  cancelledBy?: string;
  cancelReason?: string;
  createdAt?: any;
}

// ─── Promoções ──────────────────────────────────────────
export type PromoType = 'discount' | 'bundle' | 'loyalty' | 'flash';

export interface Promotion {
  id: string;
  type: PromoType;
  title: string;
  description?: string;
  discountPercent?: number;
  discountCents?: number;
  active: boolean;
  startsAt?: any;
  expiresAt?: any;
  usageLimit?: number;
  usageCount?: number;
  serviceIds?: string[];
  createdAt?: any;
}

// ─── Fidelidade ─────────────────────────────────────────
export interface LoyaltyRecord {
  customerUid: string;
  points: number;
  visits: number;
  progress: Record<string, number>; // serviceId → count
  rewards: LoyaltyReward[];
}

export interface LoyaltyReward {
  id: string;
  type: 'free_service' | 'discount' | 'gift';
  value: number;
  description: string;
  redeemed: boolean;
  expiresAt?: any;
}

// ─── Estoque ────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  qty: number;
  minQty: number;
  priceCents: number;
  category?: string;
  photoUrl?: string;
}

export interface InventoryMovement {
  type: 'in' | 'out';
  qty: number;
  at: any;
  note?: string;
  byUid?: string;
}

// ─── Stories ────────────────────────────────────────────
export interface Story {
  id: string;
  mediaUrl: string;
  caption?: string;
  createdAt: any;
  expiresAt: any;
}

// ─── Chat ───────────────────────────────────────────────
export interface ChatRoom {
  id: string;
  shopId: string;
  customerUid: string;
  customerName?: string;
  lastMessage?: string;
  lastMessageAt?: any;
  unread?: number;
}

export interface ChatMessage {
  id: string;
  fromUid: string;
  text: string;
  mediaUrl?: string;
  createdAt: any;
}

// ─── Notificações ───────────────────────────────────────
export interface AppNotification {
  id: string;
  type: 'appointment' | 'reminder' | 'promotion' | 'system' | 'chat' | 'review';
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: any;
}

// ─── Avaliações ─────────────────────────────────────────
export interface Review {
  id: string;
  shopId: string;
  appointmentId: string;
  customerUid: string;
  customerName?: string;
  customerPhoto?: string;
  staffUid?: string;
  staffName?: string;
  rating: number; // 1-5
  comment?: string;
  reply?: string; // Resposta do dono
  repliedAt?: any;
  createdAt: any;
}

// ─── Relatórios ─────────────────────────────────────────
export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowCount: number;
  newCustomers: number;
  topServices: { serviceId: string; name: string; count: number; revenue: number }[];
}

// ═════════════════════════════════════════════════════════
// NOVAS FUNCIONALIDADES SOCIAIS
// ═════════════════════════════════════════════════════════

// ─── Chat Global ────────────────────────────────────────
export type ChatRoomType = 'country' | 'worldwide';

export interface GlobalChatRoom {
  id: string;
  type: ChatRoomType;
  country?: string; // ex: "BR", "PT", "US" (null para worldwide)
  name: string;
  description?: string;
  photoUrl?: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageAt?: any;
  createdAt: any;
}

export interface GlobalChatMessage {
  id: string;
  roomId: string;
  fromUid: string;
  fromName?: string;
  fromPhoto?: string;
  fromCountry?: string;
  fromRole: 'dono' | 'funcionario';
  text: string;
  textOriginal?: string; // Texto original antes da tradução
  language?: string; // Idioma da mensagem original
  mediaUrl?: string;
  translations?: Record<string, string>; // { 'pt': '...', 'en': '...' }
  createdAt: any;
}

// ─── Feed Global (Instagram-like) ───────────────────────
export type PostType = 'photo' | 'video' | 'gallery';

export interface GlobalFeedPost {
  id: string;
  type: PostType;
  mediaUrls: string[]; // URLs das fotos/vídeos
  thumbnailUrl?: string; // Para vídeos
  caption?: string;
  hashtags?: string[];
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  authorShopId: string;
  authorShopName: string;
  authorRole: 'dono' | 'funcionario';
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  likedBy?: string[]; // UIDs que curtiram
  taggedStaff?: string[]; // UIDs de barbeiros tagueados
  location?: string;
  createdAt: any;
}

export interface FeedComment {
  id: string;
  postId: string;
  fromUid: string;
  fromName: string;
  fromPhoto?: string;
  fromRole: 'dono' | 'funcionario' | 'cliente';
  text: string;
  likes: number;
  likedBy?: string[];
  createdAt: any;
}

// ─── Sistema de Seguir ─────────────────────────────────
export interface FollowRelationship {
  followerUid: string; // Quem segue
  followerName: string;
  followerPhoto?: string;
  followingUid: string; // Quem está sendo seguido (barbeiro)
  followingName: string;
  followingPhoto?: string;
  followingShopId: string;
  followingShopName: string;
  createdAt: any;
}

export interface UserFollowStats {
  uid: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

// ─── Galeria do Cliente ─────────────────────────────────
export interface SavedPost {
  id: string;
  userUid: string;
  postId: string;
  postData: GlobalFeedPost;
  savedAt: any;
  collection?: string; // Pasta/coleção (ex: "Cortes Favoritos", "Ideias")
}

export interface UserGallery {
  customerUid: string;
  posts: SavedPost[];
  appointments: {
    appointmentId: string;
    serviceName: string;
    barberName: string;
    shopName: string;
    date: string;
    photoUrl?: string;
    rating?: number;
    review?: string;
  }[];
}

// ─── Avaliação de Corte (Específica) ──────────────────────
export interface HaircutReview {
  id: string;
  appointmentId: string;
  customerUid: string;
  customerName?: string;
  customerPhoto?: string;
  shopId: string;
  shopName: string;
  staffUid: string;
  staffName: string;
  staffPhoto?: string;
  // Avaliações separadas
  haircutRating: number; // 1-5 - Avaliação do corte em si
  serviceRating: number; // 1-5 - Avaliação do atendimento
  barbershopRating: number; // 1-5 - Avaliação da barbearia
  // Fotos do resultado
  resultPhotos?: string[]; // Fotos do corte final
  beforePhoto?: string; // Foto antes (opcional)
  // Comentários
  haircutComment?: string; // Sobre o corte
  serviceComment?: string; // Sobre o atendimento
  // Tags
  tags?: string[]; // ex: ["fade", "degradê", "barba", "moderno"]
  // Curtidas e comentários
  likes: number;
  likedBy?: string[];
  comments: FeedComment[];
  // Compartilhamento
  shared: boolean;
  sharedAt?: any;
  // Resposta do barbeiro
  barberReply?: string;
  barberRepliedAt?: any;
  createdAt: any;
}

// ─── Perfil Público do Barbeiro ─────────────────────────
export interface BarberPublicProfile {
  uid: string;
  name: string;
  photoUrl?: string;
  bio?: string;
  specialty?: string[]; // Especialidades
  shopId: string;
  shopName: string;
  shopAddress?: string;
  shopPhoto?: string;
  // Estatísticas
  followers: number;
  following: number;
  postsCount: number;
  totalCuts: number;
  avgRating: number;
  // Redes sociais
  instagram?: string;
  tiktok?: string;
  // Portfólio
  portfolioPhotos?: string[];
  // Disponibilidade para seguir
  allowFollow: boolean;
  // Criado em
  joinedAt: any;
}
