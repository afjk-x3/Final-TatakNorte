import React, { useRef } from 'react';
import { ShippingLabel } from '@/types';

interface ShippingLabelModalProps {
  label: ShippingLabel;
  onClose: () => void;
}

const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({ label, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - ${label.labelId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            .label { width: 100mm; padding: 16px; border: 2px solid #000; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
            .carrier { font-size: 18px; font-weight: bold; color: #E63946; }
            .label-id { font-size: 11px; color: #666; }
            .section { margin-bottom: 10px; }
            .section-title { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #888; margin-bottom: 2px; }
            .section-value { font-size: 13px; font-weight: bold; }
            .section-sub { font-size: 11px; color: #333; }
            .barcode { text-align: center; margin: 12px 0; padding: 8px; border: 1px solid #ddd; }
            .barcode-lines { font-family: 'Libre Barcode 128', monospace; font-size: 48px; letter-spacing: 2px; }
            .tracking { font-size: 14px; font-weight: bold; letter-spacing: 3px; margin-top: 4px; }
            .divider { border-top: 1px dashed #999; margin: 10px 0; }
            .footer { font-size: 9px; color: #888; text-align: center; margin-top: 8px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Simple barcode-like visual using characters
  const generateBarcodeDisplay = (trackingNumber: string) => {
    return trackingNumber.split('').map((char, i) => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          width: parseInt(char) % 2 === 0 ? '2px' : '3px',
          height: '40px',
          backgroundColor: '#000',
          marginRight: '1px',
          verticalAlign: 'middle',
        }}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">🏷️ Shipping Label</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Label Preview */}
        <div className="p-6">
          <div
            ref={printRef}
            className="border-2 border-gray-900 rounded-lg p-5 font-mono text-sm bg-white"
            style={{ minWidth: '300px' }}
          >
            {/* Carrier Header */}
            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3 mb-4">
              <div>
                <div className="text-red-600 font-black text-xl tracking-tight">J&T Express</div>
                <div className="text-xs text-gray-500 mt-0.5">Philippines</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Label ID</div>
                <div className="font-bold text-gray-800">{label.labelId}</div>
              </div>
            </div>

            {/* FROM */}
            <div className="mb-3">
              <div className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">From</div>
              <div className="font-bold text-gray-900">{label.sender.name}</div>
              <div className="text-gray-600 text-xs">{label.sender.address}</div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* TO */}
            <div className="mb-3">
              <div className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">To</div>
              <div className="font-bold text-gray-900 text-base">{label.recipient.name}</div>
              <div className="text-gray-700 text-xs leading-relaxed">{label.recipient.address}</div>
              {label.recipient.phone && (
                <div className="text-gray-600 text-xs mt-1">📞 {label.recipient.phone}</div>
              )}
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Order Info */}
            <div className="flex justify-between text-xs text-gray-600 mb-3">
              <div>
                <span className="text-gray-400 uppercase tracking-wide">Order</span>
                <div className="font-bold text-gray-800">#{label.orderId.slice(-8).toUpperCase()}</div>
              </div>
              <div className="text-right">
                <span className="text-gray-400 uppercase tracking-wide">Items</span>
                <div className="font-bold text-gray-800">{label.itemCount} item{label.itemCount !== 1 ? 's' : ''}</div>
              </div>
              <div className="text-right">
                <span className="text-gray-400 uppercase tracking-wide">Carrier</span>
                <div className="font-bold text-red-600">J&T</div>
              </div>
            </div>

            {/* Barcode */}
            <div className="text-center border border-gray-200 rounded p-3 bg-gray-50 mt-2">
              <div className="flex justify-center items-end gap-px mb-2">
                {generateBarcodeDisplay(label.trackingNumber)}
              </div>
              <div className="font-bold tracking-[0.3em] text-gray-900 text-sm">
                {label.trackingNumber}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 mt-3">
              Heritage in every thread — Tatak Norte
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition"
          >
            🖨️ Print Label
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabelModal;
