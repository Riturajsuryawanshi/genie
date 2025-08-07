import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowLeft, Phone, Zap, Shield, Users, Crown, Rocket, Globe, HeadphonesIcon, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const plans = [
    {
      name: "Starter",
      price: billingCycle === 'monthly' ? "₹99" : "₹990",
      originalPrice: billingCycle === 'yearly' ? "₹1,188" : null,
      period: billingCycle === 'monthly' ? "/month" : "/year",
      description: "Perfect for individuals and small teams starting with AI calling",
      features: [
        "50 AI assistant calls per month",
        "Natural conversation AI",
        "Basic call scheduling",
        "Email support",
        "Call recordings & summaries",
        "Simple analytics dashboard",
        "English language support",
        "Basic phone integrations"
      ],
      popular: false,
      icon: Zap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional",
      price: billingCycle === 'monthly' ? "₹249" : "₹2,490",
      originalPrice: billingCycle === 'yearly' ? "₹2,988" : null,
      period: billingCycle === 'monthly' ? "/month" : "/year",
      description: "Ideal for growing businesses with regular AI calling needs",
      features: [
        "200 AI assistant calls per month",
        "Advanced conversational AI",
        "Smart call routing & scheduling",
        "Priority email & chat support",
        "Detailed call analytics & insights",
        "CRM integrations (Salesforce, HubSpot)",
        "Multi-language AI support (10+ languages)",
        "Custom AI response training",
        "Advanced call filtering",
        "Team collaboration tools"
      ],
      popular: true,
      icon: Crown,
      color: "from-purple-500 to-violet-500"
    },
    {
      name: "Enterprise",
      price: billingCycle === 'monthly' ? "₹449" : "₹4,490",
      originalPrice: billingCycle === 'yearly' ? "₹5,388" : null,
      period: billingCycle === 'monthly' ? "/month" : "/year",
      description: "For large organizations requiring unlimited AI calling capabilities",
      features: [
        "Unlimited AI assistant calls",
        "Premium neural voice AI",
        "Instant AI response time",
        "24/7 dedicated support hotline",
        "Advanced AI personality customization",
        "White-label AI assistant branding",
        "Custom AI model training & fine-tuning",
        "Enterprise-grade security & compliance",
        "Advanced API access & webhooks",
        "Multi-tenant team management",
        "Dedicated account manager",
        "Custom deployment & infrastructure"
      ],
      popular: false,
      icon: Rocket,
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Phone,
      title: "Intelligent AI Assistant",
      description: "Human-like conversations that handle calls professionally with contextual understanding"
    },
    {
      icon: Shield,
      title: "Secure Call Handling",
      description: "Enterprise-grade security for all AI assistant calls and data protection"
    },
    {
      icon: Users,
      title: "Smart Call Routing",
      description: "AI automatically routes calls to the right person or department efficiently"
    },
    {
      icon: BarChart3,
      title: "Call Performance Insights",
      description: "Detailed analytics on AI assistant performance and call outcomes"
    },
    {
      icon: Globe,
      title: "Multi-Language AI",
      description: "AI assistant supports 10+ languages for global business communication"
    },
    {
      icon: HeadphonesIcon,
      title: "Always Available",
      description: "Your AI calling assistant works 24/7, never misses a call or takes a break"
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly."
    },
    {
      question: "What happens if I exceed my call limit?",
      answer: "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional call credits at competitive rates."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial with full access to Professional plan features. No credit card required to start."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Absolutely. Our Enterprise plan includes custom solutions, dedicated support, and can be tailored to your specific business needs."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with popular CRM systems, communication tools like Slack and Teams, and offer API access for custom integrations."
    }
  ];

  return (
    <>
      <SEO 
        title="CallGenie Pricing - AI Voice Assistant Plans | Start Free"
        description="Choose the perfect CallGenie plan for your business. Start with our free trial, then scale with Starter (₹99/month), Professional (₹249/month), or Enterprise (₹449/month) plans."
        keywords="AI voice assistant pricing, phone automation cost, voice AI plans, business phone system pricing, CallGenie pricing"
        url="https://callgenie.ai/pricing"
      />
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-purple-500/20 bg-black/90 backdrop-blur-sm">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
        
        <div className="flex items-center justify-center mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-2 rounded-xl shadow-lg shadow-purple-500/25">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                CallGenie
              </span>
              <div className="text-xs text-purple-300/60 -mt-1">AI Phone Assistant</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 px-4 py-2 rounded-full border border-purple-500/30 mb-6">
            <Star className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Simple Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-purple-100/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-lg", billingCycle === 'monthly' ? 'text-white' : 'text-purple-300/60')}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-purple-500/20 rounded-full border border-purple-500/30 transition-all"
            >
              <div className={cn(
                "absolute top-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all",
                billingCycle === 'yearly' ? 'left-9' : 'left-1'
              )} />
            </button>
            <span className={cn("text-lg", billingCycle === 'yearly' ? 'text-white' : 'text-purple-300/60')}>
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Save 17%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={cn(
                "relative p-8 rounded-3xl border transition-all duration-300",
                plan.popular 
                  ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/50 shadow-2xl shadow-purple-500/25" 
                  : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium shadow-lg">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={cn("inline-flex p-3 rounded-2xl mb-4 bg-gradient-to-r", plan.color)}>
                  <plan.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-purple-100/60 mb-6">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-purple-100/60 ml-1">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-purple-300/60 line-through text-lg">
                    {plan.originalPrice}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-purple-100/90">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate(`/payment?plan=${encodeURIComponent(plan.name)}&cycle=${billingCycle}`)}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group",
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
                    : "bg-white/[0.05] border border-white/[0.2] text-purple-200/80 hover:bg-white/[0.1] hover:text-white"
                )}
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  plan.popular
                    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500"
                )} />
                <span className="relative z-10">Get Started</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-purple-100/70 max-w-2xl mx-auto">
              Powerful features to transform your business communication
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              >
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-100/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-purple-100/70">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-purple-100/70 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-16 shadow-2xl shadow-purple-500/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100/80 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using CallGenie. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-800 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Start Free Trial</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      </div>
    </>
  );
};