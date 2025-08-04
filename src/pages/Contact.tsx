import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowLeft, Send, MessageSquare, Clock, Users, Headphones, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // The original fetch() call to '/api/contact' was causing a network error
    // because there is no backend API route set up to handle it.
    // The following code simulates the API call for demonstration purposes.
    console.log('Simulating form submission with data:', formData);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    try {
      // In a real app, you would have your fetch() call here.
      // We'll simulate a successful response. Change to 'false' to test error handling.
      const mockSuccess = true;

      if (mockSuccess) {
        setIsSubmitted(true);
        console.log('Message sent successfully: (Simulated)');

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            subject: '',
            message: ''
          });
        }, 5000);
      } else {
        // Simulate an error response from the server
        setError('Failed to send message. Please try again. (Simulated)');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      value: "supernovaind00@gmail.com",
      action: "mailto:supernovaind00@gmail.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      value: "+91 7089956401",
      action: "tel:+917089956401"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our office location",
      value: "Bhopal, MP, India",
      action: "#"
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "24/7 Available"
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      availability: "Mon-Fri, 9AM-6PM IST"
    },
    {
      icon: Globe,
      title: "Help Center",
      description: "Browse our comprehensive documentation",
      availability: "Always Available"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get started with CallGenie?",
      answer: "You can start using CallGenie immediately after signing up. Our setup process takes less than 5 minutes, and you'll be making AI-powered calls right away."
    },
    {
      question: "Do you offer technical support during setup?",
      answer: "Yes! We provide comprehensive onboarding support including live chat, phone support, and detailed documentation to ensure smooth setup."
    },
    {
      question: "Can I schedule a demo before purchasing?",
      answer: "Absolutely! We offer personalized demos where our team will show you how CallGenie can specifically benefit your business. Contact us to schedule one."
    },
    {
      question: "What's your response time for support tickets?",
      answer: "We typically respond to support tickets within 2-4 hours during business hours, and within 24 hours for non-urgent matters."
    }
  ];

  return (
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Get in{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-purple-100/70 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your phone communications? Let's talk about how CallGenie can help your business grow.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.action}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all text-center group"
            >
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <method.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
              <p className="text-purple-100/60 mb-4">{method.description}</p>
              <p className="text-purple-300 font-medium">{method.value}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* Contact Form & Support Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Company</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Subject *</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="demo">Request Demo</option>
                  <option value="support">Technical Support</option>
                  <option value="pricing">Pricing Questions</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Message *</label>
                <textarea 
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                  placeholder="Tell us about your project or question..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Message Sent!
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Send Message
                    </span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Support Options */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Other Ways to Reach Us</h2>
            <div className="space-y-6 mb-8">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  whileHover={{ x: 5 }}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl flex-shrink-0">
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                      <p className="text-purple-100/60 mb-2">{option.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">{option.availability}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Business Hours
              </h3>
              <div className="space-y-2 text-purple-100/80">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-500/30">
                  <p className="text-sm text-purple-300">
                    <strong>Emergency Support:</strong> Available 24/7 for Enterprise customers
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-purple-100/70">
              Quick answers to common questions
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
              Don't wait! Start transforming your business communication today with CallGenie's AI-powered phone assistant.
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
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300"
              >
                View Pricing
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};