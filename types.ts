export type OrderStatus = 
  | 'order_received' 
  | 'pickup_in_progress' 
  | 'washing' 
  | 'drying' 
  | 'delivery_in_progress' 
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  partnerId: string;
  customerName: string;
  customerPhone: string;
  serviceType: 'standard' | 'bedding';
  washKg: number;
  dryKg: number;
  price: {
    subtotal: number;
    discount: number;
    total: number; // Net amount customer pays
  };
  status: OrderStatus;
  createdAt: string; // ISO String
  estimatedReadyAt: string;
}

export interface FinancialRecord {
  orderId: string;
  grossAmount: number;    // Total
  gpAmount: number;       // Deduct 30%
  taxAmount: number;      // Deduct 3%
  netAmount: number;      // Partner receives
  status: 'pending' | 'paid';
}

export interface NavItem {
  id: string;
  label: string;
  icon: any; // Lucide icon type
}