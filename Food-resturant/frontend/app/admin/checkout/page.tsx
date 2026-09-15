'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Plus } from 'lucide-react';
import { orderAPI, stripeAPI } from '@/lib/api';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// ─── Suggested upsell items ───────────────────────────────────────────────────
const ALL_SUGGESTED_ITEMS = [
  { productId: 's1', name: 'Cola Couronne', basePrice: 3.5 },
  { productId: 's2', name: 'Fried Plantains', basePrice: 5.0 },
  { productId: 's3', name: 'Mango Passion Juice', basePrice: 4.5 },
  { productId: 's4', name: 'Pikliz (Spicy Slaw)', basePrice: 3.0 },
  { productId: 's5', name: 'Haitian Patties', basePrice: 6.5 },
  { productId: 's6', name: 'Water Bottle', basePrice: 2.0 },
  { productId: 's7', name: 'Akasan (Corn Flour Shake)', basePrice: 5.5 },
];

// ─── Inner payment form (must be inside <Elements>) ──────────────────────────
interface PaymentFormProps {
  total: number;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    method: string;
  };
  orderItems: any[];
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function StripePaymentForm({ total, formData, orderItems, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    onError('');

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will redirect here on 3-D Secure; we handle success via return_url
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
          },
        },
      },
      redirect: 'if_required', // don't redirect for regular card payments
    });

    if (error) {
      onError(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded — create the order in our database
      try {
        await orderAPI.create({
          totalAmount: total,
          paymentMethod: 'stripe',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          orderItems,
          paymentStatus: 'paid',
        });
        onSuccess();
      } catch (err: any) {
        onError(err.message || 'Payment was processed but failed to save the order. Please contact support.');
      }
    } else {
      onError('Payment was not completed. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} id="stripe-payment-form">
      {/* Stripe's PaymentElement renders Card Number, Expiry, CVC etc. */}
      <div className="stripe-payment-element-wrapper">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                name: 'never', // we provide it ourselves
                email: 'never',
                phone: 'never',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        form="stripe-payment-form"
        disabled={isProcessing || !stripe || !elements}
        className="w-full mt-8 bg-[#E8B904] text-black font-black uppercase tracking-widest py-5 rounded-xl hover:bg-[#CFA203] transition-colors shadow-[0_0_20px_rgba(232,185,4,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

// ─── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, addItemSilent, clearCart } = useCartStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Stripe state
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');

  // Contact / order form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    method: 'pickup',
  });

  // Totals
  const subtotal = items.reduce((acc, item) => {
    const itemTotal = item.basePrice + item.options.reduce((oAcc: number, o: any) => oAcc + o.price, 0);
    return acc + itemTotal * item.quantity;
  }, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const suggestedItems = useMemo(() => {
    const itemIds = new Set(items.map((i) => i.productId));
    return ALL_SUGGESTED_ITEMS.filter((s) => !itemIds.has(s.productId)).slice(0, 3);
  }, [items]);

  // Load Stripe publishable key and create a PaymentIntent when cart has items
  useEffect(() => {
    if (items.length === 0) return;

    const initStripe = async () => {
      setStripeLoading(true);
      setStripeError('');
      try {
        // Fetch the publishable key from our backend (stored in DB by admin)
        const { publishableKey } = await stripeAPI.getPublicConfig();
        setStripePromise(loadStripe(publishableKey));

        // Create a PaymentIntent for the current cart total
        const { clientSecret: cs } = await stripeAPI.createPaymentIntent(total);
        setClientSecret(cs);
      } catch (err: any) {
        setStripeError(err.message || 'Failed to initialize payment. Please refresh and try again.');
      } finally {
        setStripeLoading(false);
      }
    };

    initStripe();
    // Re-create the intent whenever the cart total changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, items.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const orderItems = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.basePrice,
    quantity: item.quantity,
    options: item.options,
  }));

  const handleSuccess = () => {
    clearCart();
    setIsSuccess(true);
  };

  // Stripe Elements appearance to match the dark theme
  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#E8B904',
        colorBackground: '#000000',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'inherit',
        borderRadius: '12px',
      },
      rules: {
        '.Input': {
          border: '1px solid rgba(255,255,255,0.2)',
          backgroundColor: '#000000',
          color: '#ffffff',
        },
        '.Input:focus': {
          border: '1px solid #E8B904',
          boxShadow: 'none',
        },
        '.Label': {
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
        },
        '.Tab': {
          border: '1px solid rgba(255,255,255,0.2)',
          backgroundColor: '#171717',
          color: 'rgba(255,255,255,0.7)',
        },
        '.Tab--selected': {
          border: '1px solid #E8B904',
          backgroundColor: 'rgba(232,185,4,0.1)',
          color: '#ffffff',
        },
      },
    },
  };

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-black">
        <NavBar />
        <div className="container mx-auto px-6 py-32 text-center max-w-2xl">
          <div className="bg-neutral-900 border border-[#E8B904]/20 p-12 rounded-3xl">
            <h1 className="text-4xl font-black text-[#E8B904] uppercase tracking-widest mb-4">
              Order Confirmed!
            </h1>
            <p className="text-white/70 mb-8 text-lg">
              Thank you for your order. We are preparing your delicious meal.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#E8B904] text-black font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#CFA203] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ─── Main checkout UI ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-black">
      <NavBar />

      <div className="container mx-auto px-6 py-32 max-w-7xl">
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12">
          Secure <span className="text-[#A31616]">Checkout</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center bg-neutral-900 border border-[#E8B904]/20 p-12 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-white/60 mb-8">
              Add some delicious items to your cart before checking out.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-[#E8B904] text-black font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#CFA203] transition-colors"
            >
              Go to Menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* ── Form Section ── */}
            <div className="w-full lg:w-2/3 space-y-12">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#E8B904] uppercase tracking-wide border-b border-white/10 pb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">First Name</label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] focus:ring-1 focus:ring-[#E8B904] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Last Name</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] focus:ring-1 focus:ring-[#E8B904] outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] focus:ring-1 focus:ring-[#E8B904] outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] focus:ring-1 focus:ring-[#E8B904] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Order Method */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#E8B904] uppercase tracking-wide border-b border-white/10 pb-4">
                  Order Method
                </h3>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="pickup"
                      checked={formData.method === 'pickup'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-4 rounded-xl border border-white/20 peer-checked:border-[#A31616] peer-checked:bg-[#A31616]/10 text-center transition-all">
                      <span className="text-white font-bold">Pickup</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="delivery"
                      checked={formData.method === 'delivery'}
                      onChange={handleChange}
                      className="peer sr-only"
                      disabled
                    />
                    <div className="p-4 rounded-xl border border-white/20 opacity-50 cursor-not-allowed text-center">
                      <span className="text-white font-bold">Delivery</span>
                      <span className="block text-xs text-white/50 mt-1">Coming Soon</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment — Stripe Elements */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#E8B904] uppercase tracking-wide border-b border-white/10 pb-4">
                  Payment
                </h3>

                {stripeError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                    {stripeError}
                  </div>
                )}

                {stripeLoading && (
                  <div className="text-white/50 text-sm py-4">Initializing secure payment…</div>
                )}

                {!stripeLoading && !stripeError && stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={elementsOptions}>
                    <StripePaymentForm
                      total={total}
                      formData={formData}
                      orderItems={orderItems}
                      onSuccess={handleSuccess}
                      onError={setError}
                    />
                  </Elements>
                )}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="w-full lg:w-1/3">
              <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8 sticky top-32">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-sm">
                      <div className="flex gap-3">
                        <span className="text-[#E8B904] font-bold">{item.quantity}x</span>
                        <div className="text-white/80">
                          <p className="font-medium text-white">{item.name}</p>
                          {item.options.map((opt: any, i: number) => (
                            <p key={i} className="text-xs text-white/50">
                              + {opt.name}
                            </p>
                          ))}
                        </div>
                      </div>
                      <span className="text-white font-medium">
                        $
                        {(
                          (item.basePrice +
                            item.options.reduce((a: number, o: any) => a + o.price, 0)) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Taxes</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-[#E8B904]">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Upsell */}
                {suggestedItems.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                      Complete your meal
                    </h4>
                    <div className="space-y-3">
                      {suggestedItems.map((suggestion) => (
                        <div
                          key={suggestion.productId}
                          className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5"
                        >
                          <div>
                            <p className="text-white text-sm font-medium">{suggestion.name}</p>
                            <p className="text-[#E8B904] text-xs font-bold">
                              ${suggestion.basePrice.toFixed(2)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              addItemSilent({
                                productId: suggestion.productId,
                                name: suggestion.name,
                                basePrice: suggestion.basePrice,
                                quantity: 1,
                                options: [],
                              })
                            }
                            className="bg-white/10 hover:bg-[#E8B904] text-white hover:text-black transition-colors w-8 h-8 flex items-center justify-center rounded-full shrink-0"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
