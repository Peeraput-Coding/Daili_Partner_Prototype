import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logic: Gross - 30% GP - 3% Tax = Net
export const calculateFinancials = (grossAmount: number) => {
  const GP_RATE = 0.30; // 30%
  const TAX_RATE = 0.03; // 3%

  const gpAmount = grossAmount * GP_RATE;
  const taxAmount = grossAmount * TAX_RATE;
  const netAmount = grossAmount - gpAmount - taxAmount;

  return {
    gross: grossAmount,
    gp: gpAmount,
    tax: taxAmount,
    net: netAmount
  };
};

export const formatDateThai = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'order_received': 
      return { label: 'ได้รับคำสั่งซื้อ', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
    case 'pickup_in_progress': 
      return { label: 'กำลังไปรับผ้า', bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' };
    case 'washing': 
      return { label: 'กำลังซัก', bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' };
    case 'drying': 
      return { label: 'กำลังอบ', bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' };
    case 'delivery_in_progress': 
      return { label: 'กำลังไปส่ง', bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-500' };
    case 'delivered': 
      return { label: 'ส่งผ้าสำเร็จ', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
    default: 
      return { label: 'ยกเลิก', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
  }
};