/**
 * @file usePrintReceipt.ts
 * @description Hook that generates a clean, print-optimised receipt for a booking
 *   and opens the browser print dialog in a new window. The receipt includes
 *   journey details, passenger manifest, pricing breakdown, and payment info.
 * @module hooks/print
 */

import { useCallback } from 'react';
import { format } from 'date-fns';

import type { Booking } from '@/types/bookings.types';

/**
 * buildReceiptHtml
 * @description Constructs a self-contained HTML document with inline CSS
 *   for printing a booking receipt.
 */
function buildReceiptHtml(booking: Booking): string {
  const p = booking.pricing;

  const pricingRows: { label: string; value: number }[] = [
    { label: 'Base Fare', value: p?.baseFare ?? 0 },
    ...(p && p.platformFee > 0 ? [{ label: 'Platform Fee', value: p.platformFee }] : []),
    ...(p && p.agentFee > 0 ? [{ label: 'Agent Fee', value: p.agentFee }] : []),
    ...(p && p.convenienceFee > 0 ? [{ label: 'Convenience Fee', value: p.convenienceFee }] : []),
    ...(p && p.gst > 0 ? [{ label: 'GST', value: p.gst }] : []),
    ...(p && (p.deliveryCharge ?? 0) > 0 ? [{ label: 'Delivery Fee', value: p.deliveryCharge! }] : []),
    ...(p && (p.discount ?? 0) > 0 ? [{ label: 'Discount', value: -(p.discount ?? 0) }] : []),
  ];

  const today = format(new Date(), 'dd MMM yyyy, h:mm a');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Booking Receipt — ${booking.bookingId}</title>
<style>
  @page { margin: 15mm 10mm; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: #1a1a1a;
    max-width: 720px;
    margin: 0 auto;
    padding: 20px;
  }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
  }

  /* ── Header ── */
  .receipt-header {
    text-align: center;
    border-bottom: 2px solid #1a73e8;
    padding-bottom: 16px;
    margin-bottom: 20px;
  }
  .receipt-header h1 {
    font-size: 20px;
    color: #1a73e8;
    margin-bottom: 4px;
  }
  .receipt-header .subtitle {
    font-size: 12px;
    color: #666;
  }
  .receipt-header .booking-id {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #888;
    margin-top: 4px;
  }

  /* ── Sections ── */
  .section {
    margin-bottom: 18px;
  }
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a73e8;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
    margin-bottom: 10px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
  }
  .row .label { color: #555; }
  .row .value { font-weight: 500; }

  /* ── Grid ── */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 20px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px 20px;
  }

  /* ── Passengers ── */
  .passenger-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .passenger-table th {
    background: #f5f5f5;
    text-align: left;
    padding: 6px 8px;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    color: #555;
  }
  .passenger-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #eee;
  }

  /* ── Pricing ── */
  .pricing-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .pricing-table td { padding: 4px 0; }
  .pricing-table .total-row td {
    border-top: 2px solid #1a73e8;
    padding-top: 8px;
    font-weight: 700;
    font-size: 15px;
  }
  .pricing-table .discount-row td { color: #16a34a; }
  .amt { text-align: right; font-weight: 600; }

  /* ── Footer ── */
  .footer {
    margin-top: 24px;
    padding-top: 12px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 11px;
    color: #999;
  }
  .footer .print-btn {
    margin-top: 8px;
    padding: 8px 24px;
    font-size: 13px;
    background: #1a73e8;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .footer .print-btn:hover { background: #1557b0; }
</style>
</head>
<body>

<div class="receipt-header">
  <h1>Booking Receipt</h1>
  <p class="subtitle">TripTatkal — Railway Ticket Booking</p>
  <p class="booking-id">#${booking.bookingId}</p>
</div>

<!-- Journey Details -->
<div class="section">
  <div class="section-title">Journey Details</div>
  <div class="grid-2">
    <div class="row"><span class="label">Train</span><span class="value">${booking.trainName || ''} (${booking.trainNumber})</span></div>
    <div class="row"><span class="label">Class</span><span class="value">${booking.travelClass || '—'}</span></div>
    <div class="row"><span class="label">Route</span><span class="value">${booking.sourceStationCode} → ${booking.destinationStationCode}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${booking.journeyDate ? format(new Date(booking.journeyDate), 'dd MMM yyyy') : '—'}</span></div>
    <div class="row"><span class="label">Timing</span><span class="value">${booking.departureTime || '—'} — ${booking.arrivalTime || '—'}</span></div>
    <div class="row"><span class="label">PNR</span><span class="value" style="font-family:'Courier New',monospace">${booking.pnrNumber || 'Awaiting PNR'}</span></div>
  </div>
</div>

<!-- Passengers -->
<div class="section">
  <div class="section-title">Passengers (${booking.passengers.length})</div>
  <table class="passenger-table">
    <thead>
      <tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Berth</th><th>ID Type</th><th>ID Number</th></tr>
    </thead>
    <tbody>
      ${booking.passengers.map((p, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.age}</td>
          <td>${p.gender}</td>
          <td>${p.berthPreference || '—'}</td>
          <td>${p.idCardType || '—'}</td>
          <td style="font-family:'Courier New',monospace">${p.idCardNumber || '—'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</div>

<!-- Pricing Breakdown -->
<div class="section">
  <div class="section-title">Price Breakdown</div>
  <table class="pricing-table">
    ${pricingRows.map(r => `
      <tr class="${r.value < 0 ? 'discount-row' : ''}">
        <td>${r.label}</td>
        <td class="amt">${r.value < 0 ? '−' : '₹'}${Math.abs(r.value).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')}
    <tr class="total-row">
      <td>Total Amount</td>
      <td class="amt">₹${(p?.totalAmount ?? 0).toLocaleString('en-IN')}</td>
    </tr>
  </table>
</div>

<!-- Payment Info -->
${(booking.paymentId || booking.paymentStatus) ? `
<div class="section">
  <div class="section-title">Payment</div>
  <div class="grid-2">
    ${booking.paymentStatus ? `<div class="row"><span class="label">Status</span><span class="value" style="text-transform:capitalize">${booking.paymentStatus}</span></div>` : ''}
    ${booking.paymentId ? `<div class="row"><span class="label">Payment ID</span><span class="value" style="font-family:'Courier New',monospace;font-size:11px">${booking.paymentId}</span></div>` : ''}
    ${booking.razorpayOrderId ? `<div class="row"><span class="label">Order ID</span><span class="value" style="font-family:'Courier New',monospace;font-size:11px">${booking.razorpayOrderId}</span></div>` : ''}
  </div>
</div>
` : ''}

<!-- Delivery -->
<div class="section">
  <div class="section-title">Home Delivery</div>
  <p>${booking.needHomeDelivery
    ? 'Requested' + (booking.deliveryAddress ? ` — ${[booking.deliveryAddress.line1, booking.deliveryAddress.line2, booking.deliveryAddress.city, booking.deliveryAddress.state, booking.deliveryAddress.pincode].filter(Boolean).join(', ')}` : '')
    : 'Not requested'}
  </p>
</div>

<!-- Footer -->
<div class="footer">
  <p>Generated on ${today} · TripTatkal</p>
  <p style="margin-top:4px">This is a computer-generated receipt and does not require a physical signature.</p>
  <button class="print-btn no-print" onclick="window.print()">🖨 Print Receipt</button>
</div>

<script>
  // Auto-trigger print on load, but keep the window open so user can print again
  window.onload = function() { setTimeout(function() { window.print(); }, 300); };
<\/script>
</body>
</html>`;
}

/**
 * usePrintReceipt
 * @description Hook that returns a printReceipt function. Call it with a Booking
 *   to open a clean, formatted receipt in a new window and trigger the print dialog.
 *
 * @example
 * const { printReceipt } = usePrintReceipt();
 * printReceipt(booking);
 */
export function usePrintReceipt() {
  const printReceipt = useCallback((booking: Booking) => {
    const html = buildReceiptHtml(booking);
    const win = window.open('', '_blank');
    if (!win) {
      // Popup blocked — fall back to window.print
      window.print();
      return;
    }
    win.document.write(html);
    win.document.close();
  }, []);

  return { printReceipt };
}
