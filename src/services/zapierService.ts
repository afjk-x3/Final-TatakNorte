import { CartItem, PaymentMethod, DeliveryMethod, Address, Order } from '@/types';

/**
 * Sends a notification to Zapier when a new order is created.
 * Only fires for prepaid methods (GCash or Credit/Debit Card).
 * This function is non-blocking and will not crash the app if the request fails.
 */
export const zapierNewOrder = (
  orderId: string,
  customerId: string,
  customerName: string,
  customerEmail: string,
  items: CartItem[],
  totalAmount: number,
  paymentMethod: PaymentMethod,
  deliveryMethod: DeliveryMethod,
  shippingAddress?: Address,
  sellerEmail?: string,
  sellerName?: string
) => {
  // Only fire for specific payment methods
  if (paymentMethod !== 'GCash' && paymentMethod !== 'Credit/Debit Card' && paymentMethod !== 'COD') {
    return;
  }

  const webhookUrl = import.meta.env.VITE_ZAPIER_NEW_ORDER;

  if (!webhookUrl) {
    console.warn('Zapier Webhook URL is not configured in environment variables.');
    return;
  }

  const itemsSummary = items
    .map(item => {
      const variation = item.selectedVariation?.name || 'Standard';
      const itemTotal = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(item.price * item.quantity);
      return `• ${item.quantity}x ${item.name} (${variation}) - ${itemTotal}`;
    })
    .join('\n');

  const formattedTotal = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(totalAmount);

  const payload = {
    customerEmail: customerEmail,
    customerName: customerName,
    orderId: orderId,
    customerId: customerId,
    orderTotal: formattedTotal,
    itemsSummary: itemsSummary,
    itemCount: items.length,
    paymentMethod: paymentMethod,
    deliveryMethod: deliveryMethod,
    // Shipping Address Details for Shipping Labels
    shippingName: shippingAddress.fullName,
    shippingStreet: shippingAddress.street,
    shippingBarangay: shippingAddress.barangay,
    shippingCity: shippingAddress.city,
    shippingProvince: shippingAddress.province,
    shippingPhone: shippingAddress.mobileNumber,
    sellerEmail: sellerEmail || '', 
    
    senderName: sellerName || 'Tatak Norte',
    senderAddress: 'Batac City, Ilocos Norte',
    carrier: 'J&T Express',
    timestamp: new Date().toISOString(),
    source: 'tataknorte',
  };

  // Perform the request asynchronously (non-blocking)
  fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(payload),
  })
    .then(() => console.log('Zapier notification sent successfully'))
    .catch((error) => {
      // Non-blocking: we just log the error
      console.error('Failed to send Zapier notification:', error);
    });
};

/**
 * Specifically triggers a shipping label generation in Zapier.
 * This can be called manually by a seller or automated.
 */
export const triggerShippingLabel = (order: Order) => {
  const webhookUrl = import.meta.env.VITE_ZAPIER_NEW_ORDER; // Re-using SAME hook or could use a new one if specified

  if (!webhookUrl || !order.shippingAddress) {
    console.warn('Zapier Webhook URL is not configured or no shipping address available.');
    return;
  }

  const payload = {
    action: 'GENERATE_LABEL',
    orderId: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingFullName: order.shippingAddress.fullName,
    shippingMobile: order.shippingAddress.mobileNumber,
    shippingStreet: order.shippingAddress.street,
    shippingBarangay: order.shippingAddress.barangay,
    shippingCity: order.shippingAddress.city,
    shippingProvince: order.shippingAddress.province,
    items: order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
    timestamp: new Date().toISOString(),
    source: 'tataknorte',
  };

  fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(payload),
  }).then(() => console.log('Shipping label trigger sent to Zapier'))
    .catch(err => console.error('Zapier shipping label trigger failed:', err));
};
