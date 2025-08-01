"use client";

import { motion } from "framer-motion";
import { Circle, Phone, MessageSquare, Brain, Shield, Mail, MapPin, LogIn, ChevronRight, User, LogOut, Star, Check, ArrowRight, X } from "lucide-react";
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';
import { SplineSceneBasic } from './SplineSceneBasic';
import { SaathiDemo } from './SaathiDemo';
import { useState, useEffect, useRef } from 'react';
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";

import { Signup1 } from './ui/signup-1';
import { Login1 } from './ui/login-1';
import { useNavigate } from 'react-router-dom';



function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function SectionWithShapes({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
    return (
        <div className={cn("bg-black", className)}>
            {children}
        </div>
    );
}

export const DarkLandingPage = () => {
  const { signInWithGoogle, loading, user, signOut } = useAuth();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const navigate = useNavigate();
  // Remove: const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);





  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAuthDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowAuthDropdown(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };



  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] transition-all duration-300">
          <div className="relative w-full max-w-md mx-auto p-0 animate-fade-scale-in">
            <div className="rounded-3xl bg-white/20 border border-white/30 shadow-2xl backdrop-blur-2xl flex flex-col items-center px-8 py-8 sm:px-10 sm:py-10 glassmorphism">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition-all z-20" onClick={() => setShowSignup(false)} aria-label="Close signup modal">
                <X className="w-6 h-6" />
              </button>
              {/* Calling-themed image */}
              <div className="flex flex-col items-center mb-4 mt-2">
                <img src="/calling-illustration.png" alt="Calling Illustration" className="h-24 w-24 object-contain mb-2 drop-shadow-lg" />
              </div>
              <Signup1
                signupText="Create an account"
                googleText="Sign up with Google"
                loginText="Already have an account?"
                loginUrl="#"
                onSuccess={() => setShowSignup(false)}
              />
              <div className="flex flex-col items-center mt-4 gap-2 w-full">
                <button className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition-all w-full" onClick={() => setShowSignup(false)}>
                  Cancel
                </button>
                <span className="text-sm text-gray-600">Already have an account? <button className="text-indigo-600 hover:underline text-sm font-medium" onClick={() => { setShowSignup(false); setShowLogin(true); }}>Log in</button></span>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fade-scale-in {
              0% { opacity: 0; transform: scale(0.92); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-scale-in {
              animation: fade-scale-in 0.45s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] transition-all duration-300">
          <div className="relative w-full max-w-md mx-auto p-0 animate-fade-scale-in">
            <div className="rounded-3xl bg-white/20 border border-white/30 shadow-2xl backdrop-blur-2xl flex flex-col items-center px-8 py-8 sm:px-10 sm:py-10 glassmorphism">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition-all z-20" onClick={() => setShowLogin(false)} aria-label="Close login modal">
                <X className="w-6 h-6" />
              </button>
              <Login1
                loginText="Sign in to your account"
                googleText="Sign in with Google"
                signupText="Don't have an account?"
                signupUrl="#"
                onSuccess={() => setShowLogin(false)}
              />
              <div className="flex flex-col items-center mt-4 gap-2 w-full">
                <button className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition-all w-full" onClick={() => setShowLogin(false)}>
                  Cancel
                </button>
                <span className="text-sm text-gray-600">Don't have an account? <button className="text-indigo-600 hover:underline text-sm font-medium" onClick={() => { setShowLogin(false); setShowSignup(true); }}>Sign up</button></span>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fade-scale-in {
              0% { opacity: 0; transform: scale(0.92); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-scale-in {
              animation: fade-scale-in 0.45s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] transition-all duration-300">
          <div className="relative w-full max-w-2xl mx-auto p-0 animate-fade-scale-in">
            <div className="rounded-3xl bg-white/20 border border-white/30 shadow-2xl backdrop-blur-2xl flex flex-col px-8 py-8 glassmorphism">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition-all z-20" onClick={() => setShowLearnMore(false)} aria-label="Close learn more modal">
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">About SAATHI</h2>
                <p className="text-purple-100/80">Your AI-Powered Voice Companion</p>
              </div>
              
              <div className="space-y-4 text-white/90">
                <p className="text-lg leading-relaxed">
                  SAATHI is an advanced AI voice assistant that revolutionizes how you interact with technology. Built with cutting-edge natural language processing, SAATHI understands context, emotion, and intent to provide meaningful conversations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2 text-purple-300">🎤 Voice Recognition</h3>
                    <p className="text-sm text-white/80">Advanced speech recognition with support for multiple accents and languages</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2 text-purple-300">🧠 AI Intelligence</h3>
                    <p className="text-sm text-white/80">Powered by state-of-the-art AI models for contextual understanding</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2 text-purple-300">🔊 Natural Speech</h3>
                    <p className="text-sm text-white/80">Human-like voice synthesis for authentic conversations</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2 text-purple-300">💬 Smart Conversations</h3>
                    <p className="text-sm text-white/80">Context-aware responses with memory of previous interactions</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300"
                    onClick={() => { setShowLearnMore(false); window.location.href = '/saathi'; }}
                  >
                    Try SAATHI Now
                  </button>
                  <button 
                    className="px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    onClick={() => setShowLearnMore(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-purple-500/20 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center justify-center">
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
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          <button 
            onClick={() => {
              const element = document.getElementById('features');
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="text-purple-200/70 hover:text-white hover:bg-purple-600/20 transition-all duration-300 font-medium px-3 py-1 rounded-lg hover:shadow-lg hover:shadow-purple-500/25"
          >
            Features
          </button>
          <a href="/saathi" className="text-purple-200/70 hover:text-purple-100 transition-colors font-medium">
            SAATHI
          </a>
          <button 
            onClick={() => navigate('/pricing')}
            className="text-purple-200/70 hover:text-white hover:bg-purple-600/20 transition-all duration-300 font-medium px-3 py-1 rounded-lg hover:shadow-lg hover:shadow-purple-500/25"
          >
            Pricing
          </button>
          <button 
            onClick={() => navigate('/about')}
            className="text-purple-200/70 hover:text-white hover:bg-purple-600/20 transition-all duration-300 font-medium px-3 py-1 rounded-lg hover:shadow-lg hover:shadow-purple-500/25"
          >
            About
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="text-purple-200/70 hover:text-white hover:bg-purple-600/20 transition-all duration-300 font-medium px-3 py-1 rounded-lg hover:shadow-lg hover:shadow-purple-500/25"
          >
            Contact
          </button>
        </nav>

        {/* Sign In/Up Buttons */}
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-purple-200">{user.email?.split('@')[0] || 'User'}</span>
                <ChevronRight className={`h-4 w-4 transition-transform text-purple-300/60 ${showAuthDropdown ? 'rotate-90' : ''}`} />
              </button>
              
              {showAuthDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 rounded-lg shadow-xl border border-purple-500/30 py-1 z-50 backdrop-blur-sm">
                  <div className="px-4 py-2 text-sm text-purple-200 border-b border-purple-500/30">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-purple-300/50">Signed in</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-purple-200 hover:bg-purple-500/20 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <SectionWithShapes className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-8 backdrop-blur-sm"
              >
                <Circle className="h-2 w-2 fill-purple-400 animate-pulse" />
                <span className="text-sm text-purple-200/80 tracking-wide font-medium">
                  CallGenie AI
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 tracking-tight"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #a855f7, #8b5cf6, #ec4899, #a855f7)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  <motion.span 
                    className="block"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    Your AI-Powered
                  </motion.span>
                  <motion.span 
                    className="block"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                  >
                    Voice Assistant
                  </motion.span>
                </motion.h1>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              >
                <p className="text-lg sm:text-xl md:text-2xl text-purple-200/70 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
                  Experience the future of voice interaction with intelligent AI that understands and responds naturally.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
                className="space-x-4"
              >
                <button
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold shadow-2xl shadow-purple-500/25 hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/40 transition-all duration-300 text-lg relative overflow-hidden group"
                  onClick={() => setShowSignup(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Sign Up</span>
                </button>
                <button className="px-8 py-4 rounded-xl border-2 border-purple-500/50 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-lg">
                  Learn More
                </button>

              </motion.div>
            </div>
          </div>
        </SectionWithShapes>

        {/* Experience the Future Section */}
        <SectionWithShapes className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Experience the{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Future
                </span>
              </h2>
              <p className="text-xl text-purple-100/80 max-w-2xl mx-auto">
                Interact with our AI-powered interface and discover the next generation of voice communication
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-violet-400 mx-auto mt-6 rounded-full"></div>
            </motion.div>
            <SplineSceneBasic />
            <div className="text-center mt-10">
              <p className="text-purple-100/80 text-lg mb-6">
                Experience the power of AI-driven voice communication
              </p>
              <a 
                href="/dashboard"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 text-lg hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Try CallGenie Now</span>
              </a>
            </div>
          </div>
        </SectionWithShapes>

        {/* SAATHI Voice AI Section */}
        <SaathiDemo />



        {/* Features Section */}
        <SectionWithShapes className="py-24" id="features">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-16"
              >
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                    CallGenie?
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mb-8"></div>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 rounded-2xl shadow-2xl shadow-purple-500/25 flex-shrink-0">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">Smart AI Responses</h3>
                      <p className="text-purple-100/80 leading-relaxed text-lg">
                        Our advanced AI understands context, tone, and intent to provide natural, human-like responses that build trust with every caller.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-500/25 flex-shrink-0">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">Intelligent Call Management</h3>
                      <p className="text-purple-100/80 leading-relaxed text-lg">
                        Efficiently route, prioritize, and handle multiple calls simultaneously with intelligent automation that never misses an opportunity.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-500/25 flex-shrink-0">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">Enterprise-Grade Security</h3>
                      <p className="text-purple-100/80 leading-relaxed text-lg">
                        Bank-level encryption, GDPR compliance, and 99.9% uptime guarantee ensure your communications are always secure and reliable.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-3xl p-8 border border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                  <div className="text-center mb-8">
                    <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-6 rounded-3xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/40">
                      <Star className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Start Your Free Trial</h3>
                    <p className="text-purple-100/80 text-lg">
                      Experience premium AI call features with no credit card required
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      "7-day free trial",
                      "No credit card required",
                      "Full feature access",
                      "24/7 premium support",
                      "Easy setup in minutes"
                    ].map((item, index) => (
                      <div key={item} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"></div>
                        <span className="text-purple-100/90">{item}</span>
                      </div>
                    ))}
                  </div>

                  <a href="/dashboard" className="block w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 text-lg hover:scale-105 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Start Free Trial Now</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </SectionWithShapes>

        {/* Pricing Section */}
        <SectionWithShapes className="py-24" id="pricing">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Simple{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Pricing
                </span>
              </h2>
              <p className="text-xl text-purple-100/70 max-w-3xl mx-auto leading-relaxed">
                Choose the plan that fits your business needs
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "₹999",
                  period: "/month",
                  description: "Perfect for small businesses",
                  features: ["100 calls/month", "Basic AI responses", "Email support", "Standard features"],
                  popular: false
                },
                {
                  name: "Professional",
                  price: "₹2,499",
                  period: "/month",
                  description: "Ideal for growing businesses",
                  features: ["500 calls/month", "Advanced AI responses", "Priority support", "Custom integrations", "Analytics dashboard"],
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "₹4,999",
                  period: "/month",
                  description: "For large organizations",
                  features: ["Unlimited calls", "Custom AI training", "24/7 support", "Advanced analytics", "White-label options", "API access"],
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className={cn(
                    "p-8 rounded-2xl border transition-all",
                    plan.popular 
                      ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30" 
                      : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]"
                  )}
                >
                  {plan.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium mb-4">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-purple-100/60 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-purple-100/60">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-purple-100/90">
                        <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-3 rounded-lg font-medium transition-all relative overflow-hidden group",
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                      : "bg-white/[0.05] border border-white/[0.2] text-purple-200/80 hover:bg-white/[0.1]"
                  )}>
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500"
                    )}></div>
                    <span className="relative z-10">Get Started</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWithShapes>

        {/* About Section */}
        <SectionWithShapes className="py-32" id="about">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 px-4 py-2 rounded-full border border-purple-500/30 mb-6">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">About CallGenie</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Revolutionizing{" "}
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Communication
                </span>
              </h2>
              <p className="text-xl text-purple-100/70 max-w-3xl mx-auto leading-relaxed">
                Born from innovation, powered by AI, designed for the future of business communication
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-8">Our Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Connection</h4>
                  <p className="text-white/60 text-sm">
                    Enhancing human connections through technology that understands context, emotion, and intent.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </SectionWithShapes>

        {/* Contact Section */}
        <SectionWithShapes className="py-24" id="contact">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Get in{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Touch
                </span>
              </h2>
              <p className="text-xl text-purple-100/70 max-w-3xl mx-auto leading-relaxed">
                Ready to transform your phone communications? Let's talk about how CallGenie can help your business.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                <h3 className="text-xl font-semibold mb-6 text-white">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="font-medium text-white">Email</div>
                      <div className="text-purple-100/60">riturajsuryawanshi51@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="font-medium text-white">Address</div>
                      <div className="text-purple-100/60">Bhopal MP INDIA</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="font-medium text-white">Phone</div>
                      <div className="text-purple-100/60">+917089956401</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              >
                <h3 className="text-xl font-semibold mb-6 text-white">Send us a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white/40"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white/40"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white/40"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-102 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      Send Message
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </SectionWithShapes>

        {/* Build Something Real CTA Section */}
        <SectionWithShapes className="py-0">
          <div className="mx-4 md:mx-6 mb-16">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-16 md:p-24 text-center shadow-2xl shadow-purple-500/20"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Transform your calls
                <br />
                <span className="text-yellow-300">instantly</span> with AI
              </h2>
              <p className="text-xl md:text-2xl text-purple-100/80 mb-8">
                Start your AI voice assistant journey today - completely free
              </p>
              <a 
                href="/dashboard"
                className="inline-block px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 shadow-lg text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Start Free Trial</span>
              </a>
            </motion.div>
          </div>
        </SectionWithShapes>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-2 rounded-xl shadow-lg shadow-purple-500/25">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                    CallGenie
                  </span>
                </div>
              </div>
              <p className="text-purple-100/60 text-sm mb-4 max-w-md">
                Transform your phone communications with AI-powered assistance. Experience the future of intelligent call handling and customer service automation.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-purple-100/60 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>riturajsuryawanshi51@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-purple-100/60 text-sm mt-2">
                <Phone className="h-4 w-4" />
                <span>+917089956401</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-purple-100/60 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="/saathi" className="text-purple-100/60 hover:text-white transition-colors text-sm">SAATHI AI</a></li>
                <li><a href="#about" className="text-purple-100/60 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#contact" className="text-purple-100/60 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-100/60 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-purple-100/60 hover:text-white transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-purple-100/60 hover:text-white transition-colors text-sm">API Reference</a></li>
                <li><a href="#" className="text-purple-100/60 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-purple-100/60 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-purple-100/60 text-sm">
                © 2024 CallGenie. All rights reserved.
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-purple-100/60 text-sm">Follow us:</span>
                <div className="flex space-x-3">
                  <a href="#" className="text-purple-100/60 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-purple-100/60 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-purple-100/60 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 