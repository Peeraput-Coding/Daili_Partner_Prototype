import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Printer, Download, Building2, Calendar, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Order } from '../types';
import html2canvas from 'html2canvas';

interface EBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onShowComingSoon: () => void;
}

export const EBillModal: React.FC<EBillModalProps> = ({ isOpen, onClose, orders, onShowComingSoon }) => {
  // Step 1: Input, Step 2: Confirmed (Ready to Print)
  const [step, setStep] = useState<'input' | 'confirmed'>('input');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [paymentCycle, setPaymentCycle] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [bank, setBank] = useState('');
  const [otherBank, setOtherBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [taxId, setTaxId] = useState('');

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
        setStep('input');
        setIsPreviewMode(false);
    }
  }, [isOpen]);

  // Filter orders based on cycle
  const filteredOrders = useMemo(() => {
      if (paymentCycle === 'monthly') {
          const currentYear = new Date().getFullYear();
          return orders.filter(o => {
              const d = new Date(o.createdAt);
              return d.getMonth() === selectedMonth && d.getFullYear() === currentYear;
          });
      }
      return orders; // If all/weekly logic needed, expand here. For now assume "All available for payment"
  }, [orders, paymentCycle, selectedMonth]);

  // Calculate totals
  const totalGross = filteredOrders.reduce((sum, o) => sum + o.price.total, 0);
  const gp = totalGross * 0.30;
  const tax = totalGross * 0.03;
  const net = totalGross - gp - tax;

  const getBankName = () => bank === 'other' ? otherBank : bank.toUpperCase();
  const getMonthName = (m: number) => ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][m];

  const handleSaveImage = async () => {
    if (invoiceRef.current) {
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2, // Higher quality
                backgroundColor: '#ffffff'
            });
            const link = document.createElement('a');
            link.download = `Invoice_Daili_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error("Failed to save image", error);
            alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ");
        }
    }
  };

  if (!isOpen) return null;

  // --- PRINT PREVIEW VIEW (MODERN DESIGN) ---
  if (isPreviewMode) {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 print:p-0 print:block print:inset-0 print:bg-white print:z-[9999]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden" onClick={() => setIsPreviewMode(false)} />
            
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col animate-fade-in text-gray-800 font-sans rounded-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:max-h-none print:h-auto print:rounded-none">
                
                {/* Invoice Content to Capture */}
                <div className="overflow-y-auto flex-1 custom-scrollbar bg-gray-50/50">
                    <div ref={invoiceRef} className="bg-white min-h-[800px] print:min-h-0 mx-auto shadow-sm">
                        {/* Header */}
                        <div className="bg-primary text-white p-8 print:print-color-adjust">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-wider">INVOICE</h1>
                                    <p className="text-blue-100 text-sm mt-1">ใบวางบิล / ใบแจ้งหนี้</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-bold">Daili Partner</h2>
                                    <p className="text-sm text-blue-100">ระบบจัดการร้านซักผ้า</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10">
                            {/* Dates & IDs */}
                            <div className="flex justify-between border-b border-gray-100 pb-8 mb-8">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">เลขที่เอกสาร (No.)</p>
                                    <p className="font-mono font-bold text-lg">INV-{new Date().getFullYear()}{String(new Date().getMonth()+1).padStart(2,'0')}-{Math.floor(Math.random()*1000)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">วันที่ (Date)</p>
                                    <p className="font-bold">{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Parties */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
                                <div>
                                    <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">ผู้รับเงิน (Bill To)</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-full">
                                        <p className="font-bold text-lg text-gray-900 mb-1">{accountName || "ไม่ระบุชื่อ"}</p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-semibold">Tax ID:</span> {taxId || "-"}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-400 mb-1">ข้อมูลบัญชีธนาคาร</p>
                                            <p className="font-semibold text-gray-800">{getBankName()} Bank</p>
                                            <p className="font-mono text-gray-600">{accountNo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">ผู้ชำระเงิน (Payer)</h3>
                                    <div className="p-4 pl-0">
                                        <p className="font-bold text-gray-900">บริษัท เดลี่ วอช แอนด์ เดลิเวอรี่ จำกัด</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            123 อาคารสาทรทาวเวอร์ ชั้น 15 <br/>
                                            เขตสาทร กรุงเทพมหานคร 10120
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <span className="font-semibold">Tax ID:</span> 0105566778899
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="mb-10 overflow-x-auto">
                                <table className="w-full min-w-[500px]">
                                    <thead>
                                        <tr className="bg-soft-blue text-primary text-sm uppercase tracking-wider">
                                            <th className="py-3 px-4 text-left rounded-l-lg">รายละเอียด (Description)</th>
                                            <th className="py-3 px-4 text-right rounded-r-lg">จำนวนเงิน (THB)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 px-4">
                                                <p className="font-semibold">รายได้จากการให้บริการ (Gross Sales)</p>
                                                <p className="text-xs text-gray-400">รอบการชำระ: {paymentCycle === 'monthly' ? `ประจำเดือน ${getMonthName(selectedMonth)}` : 'ยอดสะสมทั้งหมด'}</p>
                                            </td>
                                            <td className="py-4 px-4 text-right font-medium">{totalGross.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 px-4 text-red-500">
                                                <p>หัก ส่วนแบ่งรายได้ (GP 30%)</p>
                                                <p className="text-xs text-red-300">ค่าขนส่ง 25% + การตลาด 5%</p>
                                            </td>
                                            <td className="py-4 px-4 text-right text-red-500">-{gp.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 px-4 text-red-500">หัก ภาษี ณ ที่จ่าย (WHT 3%)</td>
                                            <td className="py-4 px-4 text-right text-red-500">-{tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Total */}
                            <div className="flex justify-end mb-12">
                                <div className="bg-primary/5 p-6 rounded-2xl w-full max-w-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">ยอดรวมทั้งสิ้น</span>
                                        <span className="font-bold text-xl text-primary">{net.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <div className="border-t border-blue-200 my-2"></div>
                                    <p className="text-right text-xs text-primary font-semibold">Net Payment (THB)</p>
                                </div>
                            </div>

                            {/* Footer / Notes */}
                            <div className="text-center text-xs text-gray-400 mt-20 print:mt-10">
                                <p>เอกสารนี้ถูกสร้างขึ้นโดยอัตโนมัติจากระบบ Daili Partner</p>
                                <p>หากมีข้อสงสัยกรุณาติดต่อ support@dailiwash.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-gray-100 p-4 flex flex-col sm:flex-row justify-center gap-4 print:hidden z-50 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                        <Printer size={18} /> สั่งพิมพ์
                    </button>
                    <button onClick={handleSaveImage} className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        <ImageIcon size={18} /> บันทึกรูป (Save)
                    </button>
                    <button onClick={() => setIsPreviewMode(false)} className="flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100">
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Building2 size={24} /> ออกเอกสารใบวางบิล
            </h3>
            <p className="text-blue-100 text-sm mt-1">E-Bill Generation System</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Step 1: Cycle Selection */}
            <section>
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-primary"/> 1. เลือกรอบการรับเงิน
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPaymentCycle('monthly')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${paymentCycle === 'monthly' ? 'bg-white shadow-sm text-primary border border-primary/20' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            รายเดือน (Monthly)
                        </button>
                         {/* Placeholder for weekly */}
                         <button 
                            onClick={() => setPaymentCycle('all')}
                             className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${paymentCycle === 'all' ? 'bg-white shadow-sm text-primary border border-primary/20' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            ทั้งหมด (All Time)
                        </button>
                    </div>
                    
                    {paymentCycle === 'monthly' && (
                        <div className="flex items-center gap-2 mt-2 bg-white p-2 rounded-lg border border-gray-200">
                             <span className="text-sm text-gray-600 pl-2">เดือน:</span>
                             <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="flex-1 bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                             >
                                 {[...Array(12)].map((_, i) => (
                                     <option key={i} value={i}>{getMonthName(i)}</option>
                                 ))}
                             </select>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2 text-sm">
                        <span className="text-gray-500">จำนวนออเดอร์:</span>
                        <span className="font-bold text-gray-800">{filteredOrders.length} รายการ</span>
                    </div>
                </div>
            </section>

             {/* Step 2: Bank Details */}
             <section>
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Building2 size={16} className="text-primary"/> 2. ข้อมูลผู้รับเงิน
                </h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">ชื่อธนาคาร</label>
                            <select 
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">เลือกธนาคาร</option>
                                <option value="kbank">KBANK</option>
                                <option value="scb">SCB</option>
                                <option value="bbl">BBL</option>
                                <option value="ktb">KTB</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">เลขที่บัญชี</label>
                            <input 
                                type="text" 
                                value={accountNo}
                                onChange={(e) => setAccountNo(e.target.value)}
                                placeholder="XXX-X-XXXXX-X"
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    {bank === 'other' && (
                        <input 
                            type="text" 
                            value={otherBank}
                            onChange={(e) => setOtherBank(e.target.value)}
                            placeholder="ระบุชื่อธนาคาร"
                            className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                    )}

                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">ชื่อบัญชี / ชื่อบริษัท</label>
                        <input 
                            type="text" 
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="ชื่อตรงกับหน้าสมุดบัญชี"
                            className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
                        <input 
                            type="text" 
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                            placeholder="13 หลัก"
                            className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                    </div>
                </div>
            </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
            {step === 'input' ? (
                 <button 
                    onClick={() => setStep('confirmed')}
                    disabled={!bank || !accountNo || !accountName || filteredOrders.length === 0}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckCircle size={18} /> ยืนยันข้อมูล (Confirm)
                </button>
            ) : (
                <div className="flex gap-3 animate-fade-in">
                    <button 
                        onClick={() => setIsPreviewMode(true)}
                        className="flex-1 py-3 rounded-xl bg-white border border-primary text-primary font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Printer size={18} /> พิมพ์ / บันทึก
                    </button>
                    <button onClick={onShowComingSoon} className="flex-1 py-3 rounded-xl bg-accent text-white font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                        <Download size={18} /> ดาวน์โหลด PDF
                    </button>
                </div>
            )}
            
            {step === 'confirmed' && (
                 <p className="text-center text-xs text-gray-400 mt-3 cursor-pointer hover:underline" onClick={() => setStep('input')}>
                     แก้ไขข้อมูล
                 </p>
            )}
        </div>
      </div>
    </div>
  );
};