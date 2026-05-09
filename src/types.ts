
export enum Category {
  WEAVING = 'Weaving',
  POTTERY = 'Pottery',
  DELICACY = 'Delicacy',
  ACCESSORY = 'Accessory'
}

export type UserRole = 'customer' | 'seller' | 'admin';

export interface PaymentCredential {
  id: string;
  type: PaymentMethod;
  accountName: string;
  accountNumber: string;
  expiryDate?: string;
  cvv?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string; // Keeping for legacy/backend compatibility if needed, but removing from UI
  gender?: 'Male' | 'Female' | 'Other';
  birthDate?: string;
  createdAt?: any;
  bag?: CartItem[]; // Persisted Shopping Cart
  addresses?: Address[];
  bankAccounts?: BankAccount[];
  paymentCredentials?: PaymentCredential[];
  shopName?: string;
  shopAddress?: string;
  shopProvince?: string;
  shopCity?: string;
  shopBarangay?: string;
  shopImage?: string;
  status?: 'active' | 'suspended' | 'banned';
  suspensionEndDate?: any; // Timestamp
  sellerEmail?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  isVerified?: boolean;
  sellerReply?: string;
  sellerReplyCreatedAt?: any;
}

export interface Variation {
  id: string;
  name: string;
  image: string;
  price: number;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  artisan: string;
  sellerId?: string;
  stock?: number;
  variations?: Variation[];
  sellerStatus?: 'active' | 'suspended' | 'banned';
  adminStatus?: 'active' | 'suspended' | 'deleted'; // Status set by admin
  adminStatusReason?: string; // Reason provided by admin
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: Variation;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageTimestamp: any;
  updatedAt: any;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Cancellation Requested';
export type PaymentMethod = 'GCash' | 'COD' | 'Credit/Debit Card';
export type DeliveryMethod = 'Standard' | 'Pickup';

export interface Address {
  id?: string; // Optional for new addresses
  fullName: string;
  mobileNumber: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  isDefault?: boolean;
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: Address;
  createdAt: any;
  updatedAt?: any;
  sellerIds?: string[]; // List of sellers involved in this order
  trackingNumber?: string;
  courier?: string;
  cancellationReason?: string;
  shippingLabel?: ShippingLabel;
}

export interface ShippingLabel{
  labelId: string;
  carrier: 'J&T Express';
  trackingNumber: string;
  recipient: {name: string; address: string; phone: string; };
  sender: { name: string; address: string};
  orderId: string;
  itemCount: number;
  generatedAt: any;
  status: 'ready' | 'printed';
}

export interface SellerApplication {
  id?: string;
  userId?: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  province: string;
  city: string;
  category: Category | string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}