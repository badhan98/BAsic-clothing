'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, FileText } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useState } from 'react';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    cart,
    coupon,
    giftWrap,
    orderNotes,
    removeFromCart,
    updateCartQuantity,
    applyCoupon,
    removeCoupon,
    setGiftWrap,
    setOrderNotes,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (!success) {
      setCouponError('Invalid coupon code. Try WELCOME20 or BASIC10.');
    } else {
      setCouponCode('');
    }
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const tax = parseFloat(((subtotal - discount) * 0.08).toFixed(2));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0b0b0b] border-l border-white/10 text-white z-[1000] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-white/90" />
                <span className="font-medium tracking-widest text-sm uppercase">Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:text-white/60 transition-colors cursor-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                  <ShoppingBag className="w-12 h-12 text-white/20 stroke-1" />
                  <p className="text-white/40 font-light tracking-wide text-sm">Your cart is empty.</p>
                  <button
                    onClick={onClose}
                    className="border border-white/20 px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-none"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <motion.div
                    key={`${item.product.id}-${item.color.hex}-${item.size}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex space-x-4 border-b border-white/5 pb-6"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 bg-[#101010] relative flex-shrink-0 group overflow-hidden border border-white/5">
                      <img
                        src={item.product.images.find(img => img.color === item.color.name)?.url || item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium tracking-wide text-white/90">
                            {item.product.name}
                          </h4>
                          <span className="text-sm font-light text-white/90">
                            ${(item.product.basePrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 font-light mt-1 uppercase tracking-wider">
                          Color: {item.color.name} | Size: {item.size}
                        </p>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-white/10 bg-black/40">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.color.hex, item.size, item.quantity - 1)}
                            className="p-1.5 hover:text-white/60 transition-colors cursor-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-light">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.color.hex, item.size, item.quantity + 1)}
                            className="p-1.5 hover:text-white/60 transition-colors cursor-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.color.hex, item.size)}
                          className="text-white/40 hover:text-white transition-colors cursor-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Checkout & Summary Panel */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#101010] border-t border-white/10 space-y-4">
                {/* Notes and Coupon Toggle */}
                <div className="flex justify-between text-xs font-light text-white/60 border-b border-white/5 pb-3">
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center space-x-1 hover:text-white transition-colors cursor-none"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Order Notes</span>
                  </button>
                  <label className="flex items-center space-x-2 cursor-none">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="accent-white cursor-none"
                    />
                    <span>Gift Wrap (+$5.00)</span>
                  </label>
                </div>

                {showNotes && (
                  <textarea
                    placeholder="Add special instructions for your shipment..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-xs p-3 font-light text-white focus:outline-none focus:border-white transition-colors h-16 resize-none"
                  />
                )}

                {/* Coupon Code Entry */}
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="COUPON CODE (e.g. WELCOME20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 text-xs px-3 py-2 font-light text-white uppercase tracking-wider focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="border border-white/20 px-4 text-xs font-light hover:bg-white hover:text-black transition-colors cursor-none"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-red-500 text-[10px] font-light">{couponError}</p>}

                {coupon && (
                  <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 text-xs font-light">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3 h-3 text-white/80" />
                      <span>{coupon.code} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-white/40 hover:text-white transition-colors cursor-none text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1.5 pt-2 text-xs font-light text-white/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-white">
                      <span>Discount</span>
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
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-white pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-white text-black py-3 text-xs uppercase font-medium tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 cursor-none mt-2"
                >
                  <span>Proceed to Checkout</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
