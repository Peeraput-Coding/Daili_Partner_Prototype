import { Order, OrderStatus } from './types';

// Generators for realistic data
const NAMES = ['คุณสมชาย', 'คุณวิภา', 'คุณอารียา', 'คุณธนินทร์', 'คุณปิติ', 'คุณมานะ', 'คุณก้องเกียรติ', 'คุณสมหญิง', 'Hostel A', 'Hotel B'];
const PHONES = ['081', '090', '089', '088', '085'];
const STATUS_POOL: OrderStatus[] = ['order_received', 'pickup_in_progress', 'washing', 'drying', 'delivery_in_progress', 'delivered'];

const generateOrders = (count: number): Order[] => {
  const orders: Order[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const isBedding = Math.random() > 0.7; // 30% chance of bedding
    const serviceType = isBedding ? 'bedding' : 'standard';
    
    // Weights
    const washKg = isBedding ? [14, 18, 28][Math.floor(Math.random() * 3)] : [9, 14, 18, 28][Math.floor(Math.random() * 4)];
    const dryKg = isBedding ? [15, 28][Math.floor(Math.random() * 2)] : washKg; // Usually dry matches wash

    // Prices (approx 129 - 219 range)
    const basePrice = isBedding ? 180 : 130;
    const variance = Math.floor(Math.random() * 50);
    const total = basePrice + variance;
    const subtotal = total + 10;
    
    // Generate Realistic Time (Weighted towards 08:00 - 20:00)
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const dateBase = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Time weighting logic
    let hour;
    const timeRoll = Math.random();
    if (timeRoll < 0.1) hour = Math.floor(Math.random() * 7); // 00:00 - 06:00 (10% chance)
    else if (timeRoll < 0.4) hour = 7 + Math.floor(Math.random() * 5); // 07:00 - 11:00 (30% chance - Morning Rush)
    else if (timeRoll < 0.7) hour = 12 + Math.floor(Math.random() * 5); // 12:00 - 16:00 (30% chance - Afternoon)
    else hour = 17 + Math.floor(Math.random() * 5); // 17:00 - 21:00 (30% chance - Evening Rush)

    // Set time
    dateBase.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
    
    // Adjust status based on recency
    let status: OrderStatus = 'delivered';
    if (daysAgo === 0) {
       status = STATUS_POOL[Math.floor(Math.random() * 5)]; // Not delivered yet for today
    } else if (daysAgo <= 2) {
       status = Math.random() > 0.5 ? 'delivered' : 'delivery_in_progress';
    }

    orders.push({
      id: `ORD-${(1000 + i).toString()}`,
      partnerId: 'PARTNER_001',
      customerName: NAMES[Math.floor(Math.random() * NAMES.length)],
      customerPhone: `${PHONES[Math.floor(Math.random() * PHONES.length)]}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType,
      washKg,
      dryKg,
      price: { subtotal, discount: 10, total },
      status,
      createdAt: dateBase.toISOString(),
      estimatedReadyAt: new Date(dateBase.getTime() + (4 * 60 * 60 * 1000)).toISOString()
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate ~115 orders for the demo
export const MOCK_ORDERS: Order[] = generateOrders(115);

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "สมัครพาร์ทเนอร์สำเร็จ!",
    message: "ยินดีต้อนรับสู่ครอบครัว Daili Wash & Delivery เริ่มรับงานได้เลย",
    time: "2 วันที่แล้ว",
    type: "success"
  },
  {
    id: 2,
    title: "ยอดขายทะลุเป้า!",
    message: "ยินดีด้วย! วันนี้ร้านของคุณทำยอดขายได้ถึง 2,000 บาท",
    time: "5 ชั่วโมงที่แล้ว",
    type: "success"
  },
  {
    id: 3,
    title: "ออเดอร์ใหม่เข้า",
    message: "มีลูกค้าเรียกใช้บริการซักอบด่วน โปรดตรวจสอบ",
    time: "10 นาทีที่แล้ว",
    type: "info"
  }
];

// Placeholder data (App.tsx calculates real values now, but keeping types consistent)
export const MOCK_WEEKLY_DATA = [];
export const MOCK_MONTHLY_DATA = [];
export const MOCK_CUSTOMER_DATA = [];
export const MOCK_HOURLY_DATA = [];