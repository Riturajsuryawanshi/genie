import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, Building, Wallet, Shield, Check, Star, Crown, Zap, Rocket } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);

  // Get plan from URL params
  const planName = searchParams.get('plan') || 'Professional';
  const cycle = searchParams.get('cycle') || 'monthly';

  useEffect(() => {
    setBillingCycle(cycle as 'monthly' | 'yearly');
  }, [cycle]);

  const plans = {
    'Starter': {
      name: 'Starter',
      monthlyPrice: 99,
      yearlyPrice: 990,
      originalYearlyPrice: 1188,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '50 AI assistant calls per month',
        'Natural conversation AI',
        'Email support',
        'Call recordings & summaries'
      ]
    },
    'Professional': {
      name: 'Professional',
      monthlyPrice: 249,
      yearlyPrice: 2490,
      originalYearlyPrice: 2988,
      icon: Crown,
      color: 'from-purple-500 to-violet-500',
      features: [
        '200 AI assistant calls per month',
        'Advanced conversational AI',
        'Priority support',
        'Detailed call analytics',
        'CRM integrations'
      ]
    },
    'Enterprise': {
      name: 'Enterprise',
      monthlyPrice: 449,
      yearlyPrice: 4490,
      originalYearlyPrice: 5388,
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      features: [
        'Unlimited AI assistant calls',
        'Premium neural voice AI',
        '24/7 dedicated support',
        'White-label AI assistant',
        'Custom AI model training'
      ]
    }
  };

  const selectedPlan = plans[planName as keyof typeof plans] || plans.Professional;
  const currentPrice = billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;
  const originalPrice = billingCycle === 'yearly' ? selectedPlan.originalYearlyPrice : null;
  const savings = originalPrice ? originalPrice - currentPrice : 0;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, MasterCard, American Express',
      icon: CreditCard,
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, Paytm, BHIM',
      icon: Smartphone
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: Building
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      description: 'Paytm, Mobikwik, Amazon Pay',
      icon: Wallet
    }
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      // Here you would integrate with actual payment gateway like Razorpay, Stripe, etc.
      alert(`Payment of ₹${currentPrice.toLocaleString()} processed successfully! Welcome to ${selectedPlan.name} plan.`);
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-purple-500/20 bg-black/90 backdrop-blur-sm">
        <button 
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Pricing
        </button>
        
        <div className="flex items-center justify-center mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-2 rounded-xl shadow-lg shadow-purple-500/25">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                Secure Checkout
              </span>
              <div className="text-xs text-purple-300/60 -mt-1">256-bit SSL Encrypted</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Payment Methods Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Complete Your Purchase</h1>
              <p className="text-purple-100/70 mb-8">Choose your preferred payment method</p>

              {/* Payment Methods */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Payment Methods</h3>
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                      selectedPaymentMethod === method.id
                        ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/50"
                        : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]"
                    )}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          selectedPaymentMethod === method.id 
                            ? "bg-purple-500/20" 
                            : "bg-white/[0.05]"
                        )}>
                          <method.icon className="h-5 w-5 text-purple-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{method.name}</span>
                            {method.popular && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-purple-100/60">{method.description}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 transition-all",
                        selectedPaymentMethod === method.id
                          ? "border-purple-500 bg-purple-500"
                          : "border-white/[0.3]"
                      )}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6"
              >
                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white mb-4">Card Details</h4>
                    <div>
                      <label className="block text-sm text-purple-100/70 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/[0.4] focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-purple-100/70 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/[0.4] focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-purple-100/70 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/[0.4] focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-purple-100/70 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/[0.4] focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white mb-4">UPI Payment</h4>
                    <div>
                      <label className="block text-sm text-purple-100/70 mb-2">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@paytm"
                        className="w-full p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/[0.4] focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="text-sm text-purple-100/60">
                      Or scan QR code with any UPI app
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white mb-4">Net Banking</h4>
                    <div>
                      <label className="block text-sm text-purple-100/70 mb-2">Select Your Bank</label>
                      <select className="w-full p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white focus:border-purple-500/50 focus:outline-none">
                        <option value="">Choose your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white mb-4">Digital Wallet</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {['Paytm', 'Mobikwik', 'Amazon Pay', 'Freecharge'].map((wallet) => (
                        <button
                          key={wallet}
                          className="p-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white hover:bg-white/[0.1] transition-colors"
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Payment Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg rounded-xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      Pay ₹{currentPrice.toLocaleString()} Securely
                    </>
                  )}
                </span>
              </motion.button>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-purple-100/60 justify-center">
                <Shield className="h-4 w-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
              
              {/* Plan Details */}
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("p-3 rounded-xl bg-gradient-to-r", selectedPlan.color)}>
                  <selectedPlan.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{selectedPlan.name} Plan</h4>
                  <p className="text-purple-100/60">{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Billing</p>
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="bg-white/[0.05] rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium">Billing Cycle</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm transition-colors",
                        billingCycle === 'monthly' ? 'bg-purple-500 text-white' : 'text-purple-300 hover:text-white'
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm transition-colors",
                        billingCycle === 'yearly' ? 'bg-purple-500 text-white' : 'text-purple-300 hover:text-white'
                      )}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                {billingCycle === 'yearly' && savings > 0 && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Star className="h-4 w-4" />
                    <span>Save ₹{savings.toLocaleString()} with yearly billing!</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6">
                <h5 className="font-semibold text-white mb-3">What's Included:</h5>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-purple-100/80">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/[0.1] pt-4 space-y-2">
                <div className="flex justify-between text-purple-100/70">
                  <span>{selectedPlan.name} Plan ({billingCycle})</span>
                  <span>₹{currentPrice.toLocaleString()}</span>
                </div>
                {originalPrice && (
                  <div className="flex justify-between text-purple-100/70">
                    <span>Regular Price</span>
                    <span className="line-through">₹{originalPrice.toLocaleString()}</span>
                  </div>
                )}
                {savings > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>You Save</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/[0.1]">
                  <span>Total</span>
                  <span>₹{currentPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-6">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">30-Day Money Back Guarantee</span>
                </div>
                <p className="text-sm text-green-300/80">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};