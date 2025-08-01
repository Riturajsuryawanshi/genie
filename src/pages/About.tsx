import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, MessageSquare, Star, ArrowLeft, Phone, Users, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 px-4 py-2 rounded-full border border-purple-500/30 mb-6">
            <Star className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">About CallGenie</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Revolutionizing{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Communication
            </span>
          </h1>
          <p className="text-xl text-purple-100/70 max-w-3xl mx-auto leading-relaxed">
            Born from innovation, powered by AI, designed for the future of business communication
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl flex-shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">AI-First Approach</h3>
                  <p className="text-purple-100/60 leading-relaxed">
                    CallGenie was born from the vision of revolutionizing how businesses handle phone communications.
                    We understand that every call is an opportunity to build relationships and drive growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-xl flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise Ready</h3>
                  <p className="text-purple-100/60 leading-relaxed">
                    Our AI-powered platform combines cutting-edge natural language processing with intelligent
                    workflow automation to ensure no call goes unanswered and every interaction is meaningful.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-3 rounded-xl flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Human-Centric Design</h3>
                  <p className="text-purple-100/60 leading-relaxed">
                    We believe technology should enhance human connections, not replace them. Our AI maintains
                    the warmth and understanding that customers expect from great service.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <motion.div
                className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-purple-400 mb-1">10K+</div>
                <div className="text-sm text-white/50">Happy Customers</div>
              </motion.div>
              <motion.div
                className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-violet-400 mb-1">99.9%</div>
                <div className="text-sm text-white/50">Uptime</div>
              </motion.div>
              <motion.div
                className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-fuchsia-400 mb-1">24/7</div>
                <div className="text-sm text-white/50">AI Support</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-8 rounded-3xl border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-400/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  To democratize AI-powered communication, making advanced phone automation accessible
                  to businesses of all sizes while maintaining the human touch that customers expect.
                </p>

                <div className="border-t border-white/20 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Our Vision</h4>
                  <p className="text-white/70">
                    A world where every business conversation is intelligent, efficient, and meaningful -
                    powered by AI that truly understands and serves human needs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Innovation</h4>
              <p className="text-white/60 text-sm">
                Constantly pushing the boundaries of what's possible with AI and communication technology.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Trust</h4>
              <p className="text-white/60 text-sm">
                Building secure, reliable solutions that businesses can depend on for their most important communications.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Connection</h4>
              <p className="text-white/60 text-sm">
                Enhancing human connections through technology that understands context, emotion, and intent.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Global Impact</h4>
              <p className="text-white/60 text-sm">
                Making advanced AI communication accessible to businesses worldwide, regardless of size or location.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-16 shadow-2xl shadow-purple-500/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Communication?
            </h2>
            <p className="text-xl text-purple-100/80 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using CallGenie to revolutionize their phone communications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-800 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 shadow-lg"
              >
                Start Free Trial
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
  );
};