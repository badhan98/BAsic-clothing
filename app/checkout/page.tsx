'use client';

import { useState, useEffect } from 'react';
import { useStore, CartItem } from '@/lib/store';
import { db } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, CreditCard, ChevronRight, Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
  const router = useRouter();
  const {
    cart,
    coupon,
    giftWrap,
    orderNotes,
    clearCart,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    user
  } = useStore();

  // Redirect if cart is empty and checkout isn't finished
  useEffect(() => {
    if (cart.length === 0 && activeStep !== 'confirmation') {
      router.push('/shop');
    }
  }, [cart, router]);

  const [activeStep, setActiveStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  // Form States
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [address, setAddress] = useState(user?.addresses[0]?.addressLine1 || '');
  const [city, setCity] = useState(user?.addresses[0]?.city || '');
  const [state, setState] = useState(user?.addresses[0]?.state || '');
  const [zip, setZip] = useState(user?.addresses[0]?.postalCode || '');
  const [phone, setPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Options
  const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shippingCost = shippingMethod === 'standard' ? (subtotal > 150 ? 0 : 15.00) : 35.00;
  const tax = parseFloat(((subtotal - discount) * 0.08).toFixed(2));
  const finalTotal = parseFloat((subtotal - discount + (giftWrap ? 5.00 : 0) + shippingCost + tax).toFixed(2));

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !state || !zip || !phone) {
      setError('Please fill in all shipment details.');
      return;
    }
    setError('');
    setActiveStep('payment');
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setError('');

    // Simulate Payment Webhook and Gateway Processing
    setTimeout(async () => {
      try {
        const orderData = {
          items: cart.map(item => ({
            id: item.product.id,
            name: item.product.name,
            size: item.size,
            color: item.color.name,
            quantity: item.quantity,
            price: item.product.basePrice
          })),
          subtotal,
          discount,
          tax,
          shippingCost,
          total: finalTotal,
          coupon_code: coupon?.code || null,
          shipping_address: {
            firstName,
            lastName,
            address,
            city,
            state,
            zip,
            phone
          },
          billing_address: {
            firstName,
            lastName,
            address,
            city,
            state,
            zip
          },
          email,
          phone,
          payment: {
            gateway: paymentGateway,
            status: 'captured',
            amount: finalTotal,
            transaction_id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          }
        };

        const resOrder = await db.submitOrder(orderData);
        setCreatedOrder(resOrder);
        setIsProcessing(false);
        setActiveStep('confirmation');
        clearCart();
      } catch (err: any) {
        setError('Transaction declined. Please check mock cards.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="pt-28 pb-32 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Step Wizard Header */}
        <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-16 text-xs uppercase tracking-widest font-medium">
          <button
            onClick={() => activeStep !== 'confirmation' && setActiveStep('shipping')}
            className={`flex items-center space-x-2 transition-all cursor-none ${
              activeStep === 'shipping' ? 'text-white font-semibold' : 'text-white/40'
            }`}
          >
            <span>01. Shipping</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            disabled={activeStep === 'shipping' || activeStep === 'confirmation'}
            onClick={() => setActiveStep('payment')}
            className={`flex items-center space-x-2 transition-all cursor-none ${
              activeStep === 'payment' ? 'text-white font-semibold' : 'text-white/40'
            }`}
          >
            <span>02. Payment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span
            className={`flex items-center space-x-2 transition-all ${
              activeStep === 'confirmation' ? 'text-white font-semibold' : 'text-white/40'
            }`}
          >
            <span>03. Confirmation</span>
          </span>
        </div>

        {activeStep === 'confirmation' ? (
          /* 3. CONFIRMATION SCREEN */
          <div className="max-w-xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 block">Transaction Success</span>
              <h2 className="text-3xl font-bold uppercase tracking-wide">ORDER ACQUIRED</h2>
              <p className="text-xs text-white/55 font-light leading-relaxed max-w-sm mx-auto">
                Thank you for shopping with BASIC. Your shipping session has been initialized. Tracking notifications will be dispatched shortly.
              </p>
            </div>

            {createdOrder && (
              <div className="bg-[#0b0b0b] border border-white/5 p-6 text-left space-y-4 text-xs font-light">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/50">Order Reference</span>
                  <span className="font-semibold text-white uppercase">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Tracking Number</span>
                  <span className="text-white uppercase font-mono">{createdOrder.tracking_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Estimated Delivery</span>
                  <span className="text-white">
                    {new Date(createdOrder.estimated_delivery).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Total Amount Charged</span>
                  <span className="text-white font-semibold">${createdOrder.total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-block bg-white text-black px-10 py-4 text-xs uppercase tracking-widest font-semibold hover:bg-white/80 transition-all cursor-none"
              >
                Continue Catalog Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* SHIPPING AND PAYMENT STEP SPLIT SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Steps Forms Panel */}
            <div className="lg:col-span-7">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-6 flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {activeStep === 'shipping' ? (
                /* 1. SHIPPING STEP FORM */
                <form onSubmit={handleShippingSubmit} className="space-y-6 text-xs font-light animate-fade-in">
                  <h3 className="text-sm font-semibold uppercase tracking-widest border-b border-white/5 pb-3">Shipment Coordinates</h3>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Email Address (for order tracking)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER EMAIL ADDRESS"
                      className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-white/50 block">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="FIRST NAME"
                        className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-white/50 block">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="LAST NAME"
                        className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="STREET ADDRESS AND APT NUMBER"
                      className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-white/50 block">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="CITY"
                        className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-white/50 block">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="STATE"
                        className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-white/50 block">Zip Code</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="ZIP CODE"
                        className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Phone Number (for courier notifications)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="PHONE NUMBER"
                      className="w-full bg-[#0b0b0b] border border-white/10 px-4 py-3 text-white uppercase focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  {/* Shipping option checkboxes */}
                  <div className="space-y-3 pt-4">
                    <label className="text-white/50 block font-medium uppercase tracking-wider">Courier Dispatch Speed</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between border border-white/10 p-4 bg-black/40 cursor-none">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="accent-white cursor-none"
                          />
                          <div>
                            <span className="font-semibold block">DHL STANDARD SHIPPING</span>
                            <span className="text-[10px] text-white/40 font-light">Delivery in 3 - 5 business days</span>
                          </div>
                        </div>
                        <span className="font-semibold">{subtotal > 150 ? 'FREE' : '$15.00'}</span>
                      </label>

                      <label className="flex items-center justify-between border border-white/10 p-4 bg-black/40 cursor-none">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="accent-white cursor-none"
                          />
                          <div>
                            <span className="font-semibold block">DHL EXPRESS PRIORITY</span>
                            <span className="text-[10px] text-white/40 font-light">Delivery in 1 - 2 business days (signature required)</span>
                          </div>
                        </div>
                        <span className="font-semibold">$35.00</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black py-4 uppercase font-medium tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 cursor-none mt-6"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* 2. PAYMENT STEP */
                <div className="space-y-8 animate-fade-in">
                  <h3 className="text-sm font-semibold uppercase tracking-widest border-b border-white/5 pb-3">Gateway Authentication</h3>

                  {/* Payment Gateway Tabs */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentGateway('razorpay')}
                      className={`border p-5 text-center flex flex-col items-center justify-center space-y-2 cursor-none transition-all ${
                        paymentGateway === 'razorpay' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-white/80" />
                      <span className="text-[10px] uppercase tracking-widest font-semibold block">Razorpay Gateway</span>
                      <span className="text-[9px] text-white/40 font-light">Cards, UPI, Netbanking</span>
                    </button>

                    <button
                      onClick={() => setPaymentGateway('paypal')}
                      className={`border p-5 text-center flex flex-col items-center justify-center space-y-2 cursor-none transition-all ${
                        paymentGateway === 'paypal' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-white/80" />
                      <span className="text-[10px] uppercase tracking-widest font-semibold block">PayPal Checkout</span>
                      <span className="text-[9px] text-white/40 font-light">International, PayPal Balance</span>
                    </button>
                  </div>

                  {/* Mock Payment Details info */}
                  <div className="bg-[#101010] p-6 border border-white/5 space-y-4">
                    <div className="flex items-center space-x-2 text-white/80">
                      <Lock className="w-4 h-4 text-white/50" />
                      <h4 className="text-[10px] uppercase tracking-widest font-semibold">Secure Sandboxed Payment</h4>
                    </div>
                    <p className="text-[10px] text-white/45 leading-relaxed font-light">
                      This order is fully simulated. No actual financial debits will execute. Clicking &quot;Finalize Transaction&quot; invokes local webhook hooks and completes the stock decrement loop.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveStep('shipping')}
                      className="border border-white/20 px-6 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-none"
                    >
                      Back
                    </button>

                    <button
                      disabled={isProcessing}
                      onClick={handlePaymentSubmit}
                      className="flex-1 bg-white text-black py-4 text-xs font-semibold uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 cursor-none"
                    >
                      {isProcessing ? (
                        <span className="animate-pulse">Processing Transaction...</span>
                      ) : (
                        <>
                          <span>Finalize Transaction</span>
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 bg-[#0b0b0b] border border-white/5 p-6 space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-white/5 pb-3">Bag Summary</h3>

              {/* Items List */}
              <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-none">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.color.hex}-${item.size}`} className="flex space-x-3 justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-12 bg-[#101010] relative flex-shrink-0 border border-white/5">
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover filter grayscale" />
                      </div>
                      <div>
                        <span className="font-medium text-white/90 block">{item.product.name}</span>
                        <span className="text-[10px] text-white/40 block uppercase">
                          Size: {item.size} | Color: {item.color.name} (x{item.quantity})
                        </span>
                      </div>
                    </div>
                    <span className="text-white/80">${(item.product.basePrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary Totals */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs font-light text-white/55">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-white font-normal">
                    <span>Discount Coupon ({coupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Gift Wrap</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white border-t border-white/5 pt-3">
                  <span>Est Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
