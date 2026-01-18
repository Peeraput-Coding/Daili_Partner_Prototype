import React from 'react';
import { Order, OrderStatus } from '../types';
import { formatDateThai } from '../lib/utils';
import { StatusBadge } from './StatusBadge';
import { Package, Clock, Phone } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-daili hover:shadow-daili-hover transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-soft-blue/50 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800">{order.customerName}</h3>
          </div>
          <div className="flex items-center gap-1 text-grey text-sm">
            <Phone size={14} />
            <span>{order.customerPhone}</span>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center gap-4 py-3 border-t border-b border-gray-50 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-soft-blue flex items-center justify-center text-primary">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-grey">บริการ</p>
            <p className="text-sm font-semibold text-gray-700">
              {order.serviceType === 'standard' ? 'ซัก อบ พับ' : 'ผ้านวม/ผ้าห่ม'}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-100" />
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-accent">
            <span className="font-bold text-sm">Kg</span>
          </div>
          <div>
            <p className="text-xs text-grey">น้ำหนัก</p>
            <p className="text-sm font-semibold text-gray-700">
              ซัก {order.washKg} KG / อบ {order.dryKg} KG
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-grey flex items-center gap-1 mb-0.5">
            <Clock size={12} /> เวลารับงาน
          </p>
          <p className="text-sm text-gray-600 font-medium">{formatDateThai(order.createdAt)}</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-grey mb-0.5">ยอดสุทธิ</p>
            <p className="text-xl font-bold text-accent">฿{order.price.total}</p>
        </div>
      </div>
      
      {/* View Only Mode - No Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-center">
          <p className="text-xs text-gray-400 italic">
            ติดตามสถานะผ่านระบบกลาง
          </p>
      </div>
    </div>
  );
};