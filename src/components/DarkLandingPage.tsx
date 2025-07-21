"use client";

import { motion } from "framer-motion";
import { Circle, Phone, MessageSquare, Brain, Shield, Mail, MapPin, LogIn, ChevronRight, User, LogOut, Mic, Volume2, Star, Check, ArrowRight, X } from "lucide-react";
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';
import { SplineSceneBasic } from './SplineSceneBasic';
import { SaathiDemo } from './SaathiDemo';
import { useState, useEffect, useRef } from 'react';
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { CallingAgent } from './CallingAgent';
import { Signup1 } from './ui/signup-1';
import { Login1 } from './ui/login-1';
import { useNavigate } from 'react-router-dom';

const ringingSoundUrl = '/ringtone.mp3';
const connectSoundUrl = '/connect.mp3';

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
        <div className={cn("relative overflow-hidden bg-[#030303]", className)}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
            
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={400}
                    height={100}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={300}
                    height={80}
                    rotate={-15}
                    gradient="from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={200}
                    height={60}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export const DarkLandingPage = () => {
  const { signInWithGoogle, loading, user, signOut } = useAuth();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showCallingAgent, setShowCallingAgent] = useState(false);
  const [showCallingAnimation, setShowCallingAnimation] = useState(false);
  const [assignedPhoneNumber, setAssignedPhoneNumber] = useState<string>('');
  const [loadingNumber, setLoadingNumber] = useState(false);
  const [callStep, setCallStep] = useState<'ringing'|'connecting'|'agent'>('ringing');
  const ringingAudioRef = useRef<HTMLAudioElement | null>(null);
  const connectAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  // Remove: const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);

  // Fetch assigned number if logged in
  useEffect(() => {
    const fetchUserPhoneNumber = async () => {
      if (!user?.id) return;
      setLoadingNumber(true);
      try {
        const response = await fetch(`/api/auth/phone/${user.id}`);
        const data = await response.json();
        if (data.success && data.phone_number) {
          setAssignedPhoneNumber(data.phone_number);
        } else {
          // Try to assign one
          const onboardResponse = await fetch('/api/auth/onboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id })
          });
          const onboardData = await onboardResponse.json();
          if (onboardData.success && onboardData.phone_number) {
            setAssignedPhoneNumber(onboardData.phone_number);
          }
        }
      } catch (error) {
        setAssignedPhoneNumber('');
      } finally {
        setLoadingNumber(false);
      }
    };
    if (user) fetchUserPhoneNumber();
  }, [user]);

  // Animated calling modal logic with sound
  useEffect(() => {
    if (showCallingAnimation) {
      setCallStep('ringing');
      // Play ringing sound
      if (ringingAudioRef.current) {
        ringingAudioRef.current.currentTime = 0;
        ringingAudioRef.current.play();
      }
      const t1 = setTimeout(() => {
        setCallStep('connecting');
        // Stop ringing, play connect sound
        if (ringingAudioRef.current) ringingAudioRef.current.pause();
        if (connectAudioRef.current) {
          connectAudioRef.current.currentTime = 0;
          connectAudioRef.current.play();
        }
      }, 1500);
      const t2 = setTimeout(() => {
        setCallStep('agent');
        setShowCallingAnimation(false);
        setShowCallingAgent(true);
        if (connectAudioRef.current) connectAudioRef.current.pause();
      }, 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); if (ringingAudioRef.current) ringingAudioRef.current.pause(); if (connectAudioRef.current) connectAudioRef.current.pause(); };
    } else {
      if (ringingAudioRef.current) ringingAudioRef.current.pause();
      if (connectAudioRef.current) connectAudioRef.current.pause();
    }
  }, [showCallingAnimation]);

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

  const handleCancelCall = () => {
    setShowCallingAnimation(false);
    setCallStep('ringing');
    if (ringingAudioRef.current) ringingAudioRef.current.pause();
    if (connectAudioRef.current) connectAudioRef.current.pause();
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
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
      {/* Animated Aurora/Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[120vw] h-[120vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-aurora-blur" style={{ filter: 'blur(80px)', opacity: 0.7 }}>
          <div className="absolute w-2/3 h-2/3 bg-gradient-to-br from-indigo-500 via-rose-500 to-purple-500 rounded-full mix-blend-lighten animate-aurora-move1" />
          <div className="absolute w-1/2 h-1/2 bg-gradient-to-tr from-rose-400 via-indigo-400 to-emerald-400 rounded-full mix-blend-lighten animate-aurora-move2" style={{ left: '40%', top: '30%' }} />
          <div className="absolute w-1/3 h-1/3 bg-gradient-to-tl from-purple-400 via-indigo-300 to-rose-300 rounded-full mix-blend-lighten animate-aurora-move3" style={{ left: '60%', top: '60%' }} />
        </div>
        <style>{`
          @keyframes aurora-blur {
            0%,100% { filter: blur(80px); }
            50% { filter: blur(120px); }
          }
          .animate-aurora-blur { animation: aurora-blur 12s ease-in-out infinite; }
          @keyframes aurora-move1 {
            0%,100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-40px) scale(1.1); }
          }
          .animate-aurora-move1 { animation: aurora-move1 14s ease-in-out infinite; }
          @keyframes aurora-move2 {
            0%,100% { transform: translateX(0) scale(1); }
            50% { transform: translateX(60px) scale(1.08); }
          }
          .animate-aurora-move2 { animation: aurora-move2 16s ease-in-out infinite; }
          @keyframes aurora-move3 {
            0%,100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(60px) scale(1.12); }
          }
          .animate-aurora-move3 { animation: aurora-move3 18s ease-in-out infinite; }
        `}</style>
      </div>
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/[0.1] bg-[#030303]/80 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-rose-600 p-2 rounded-xl shadow-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-rose-300 bg-clip-text text-transparent">
                CallGenie
              </span>
              <div className="text-xs text-white/60 -mt-1">AI Phone Assistant</div>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          <a href="#features" className="text-white/70 hover:text-white transition-colors font-medium">
            Features
          </a>
          <a href="/saathi" className="text-white/70 hover:text-white transition-colors font-medium">
            SAATHI
          </a>
          <a href="#pricing" className="text-white/70 hover:text-white transition-colors font-medium">
            Pricing
          </a>
          <a href="#about" className="text-white/70 hover:text-white transition-colors font-medium">
            About
          </a>
          <a href="#contact" className="text-white/70 hover:text-white transition-colors font-medium">
            Contact
          </a>
        </nav>

        {/* Sign In/Up Buttons */}
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-white/80">{user.email?.split('@')[0] || 'User'}</span>
                <ChevronRight className={`h-4 w-4 transition-transform text-white/60 ${showAuthDropdown ? 'rotate-90' : ''}`} />
              </button>
              
              {showAuthDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] rounded-lg shadow-xl border border-white/[0.1] py-1 z-50">
                  <div className="px-4 py-2 text-sm text-white/80 border-b border-white/[0.1]">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-white/50">Signed in</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/[0.05] flex items-center space-x-2"
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
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
              >
                <Circle className="h-2 w-2 fill-rose-500/80" />
                <span className="text-sm text-white/60 tracking-wide">
                  CallGenie AI
                </span>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              >
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                    Your AI-Powered
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                    Voice Assistant
                  </span>
                </h1>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              >
                <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
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
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-rose-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 animate-gradient-x text-lg relative overflow-hidden"
                  onClick={() => setShowSignup(true)}
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-rose-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-all duration-300" />
                </button>
                <button
                  className="px-6 py-3 rounded-lg border border-white/[0.2] text-white/80 hover:bg-white/[0.05] hover:scale-105 transition-all duration-300 text-lg"
                  onClick={() => setShowLogin(true)}
                >
                  Log In
                </button>
                <button className="px-6 py-3 rounded-lg border border-white/[0.2] text-white/80 hover:bg-white/[0.05] transition-all">
                  Learn More
                </button>
                <style>{`
                  @keyframes gradient-x {
                    0%,100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                  }
                  .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease-in-out infinite;
                  }
                `}</style>
              </motion.div>
            </div>
          </div>
        </SectionWithShapes>

        {/* Experience the Future Section */}
        <SectionWithShapes className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Experience the Future</h2>
              <p className="text-xl text-white/60">Interact with our AI-powered interface</p>
            </motion.div>
            <SplineSceneBasic />
            <div className="text-center mt-10 space-y-4">
              {user ? (
                <>
                  <div className="mb-2 text-white/80 text-lg">
                    {loadingNumber ? (
                      <span>Loading your CallGenie number...</span>
                    ) : assignedPhoneNumber ? (
                      <>
                        Your CallGenie Number: <span className="font-bold text-white bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">{assignedPhoneNumber}</span>
                      </>
                    ) : (
                      <span>Could not fetch your number.</span>
                    )}
                  </div>
                  <button
                    className="inline-block px-8 py-3 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition text-lg"
                    onClick={() => setShowCallingAnimation(true)}
                    disabled={loadingNumber || !assignedPhoneNumber}
                  >
                    Call Now
                  </button>
                  {assignedPhoneNumber && (
                    <div className="mt-4 text-center">
                      <p className="text-white/80 text-sm mb-2">Your CallGenie Number:</p>
                      <p className="text-white font-mono text-lg font-bold bg-white/10 px-4 py-2 rounded-lg">
                        {assignedPhoneNumber}
                      </p>
                      <p className="text-white/60 text-xs mt-2">Share this number with others to receive calls</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white/80 text-lg">
                  <span>Sign up or log in to get your CallGenie number and try the AI calling experience!</span>
                </div>
              )}
            </div>
            {/* Start Free Trial Button */}
            <div className="text-center mt-8">
              <button
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-rose-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg"
                onClick={() => navigate('/my-number')}
              >
                Start Free Trial
              </button>
            </div>
            {/* Animated Calling Modal */}
            {showCallingAnimation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <audio ref={ringingAudioRef} src={ringingSoundUrl} loop />
                <audio ref={connectAudioRef} src={connectSoundUrl} />
                <div className="relative bg-white/20 border border-white/30 rounded-3xl p-10 flex flex-col items-center shadow-2xl overflow-hidden">
                  {/* Animated background waves */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-500/30 to-rose-500/30 animate-pulse-slow blur-2xl" />
                    <div className="w-[180px] h-[180px] rounded-full bg-indigo-400/20 animate-pulse-fast blur-xl absolute" />
                  </div>
                  <div className="mb-4 z-10">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-xl animate-bounce-slow">
                      <Phone className="w-12 h-12 text-white drop-shadow-lg animate-shake" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2 z-10">Calling {assignedPhoneNumber}</div>
                  <div className="text-white/80 text-lg mb-4 z-10">
                    {callStep === 'ringing' && <span>Ringing...</span>}
                    {callStep === 'connecting' && <span>Connecting...</span>}
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 mb-4 z-10">
                    <p className="text-white/80 text-sm mb-1">Your CallGenie Number:</p>
                    <p className="text-white font-mono text-xl font-bold text-center">
                      {assignedPhoneNumber}
                    </p>
                    <p className="text-white/60 text-xs mt-2 text-center">Share this number with others</p>
                  </div>
                  <div className="flex gap-2 mt-2 z-10">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                  </div>
                  <button
                    className="mt-8 px-6 py-2 rounded-lg bg-rose-600/80 text-white font-semibold shadow hover:bg-rose-700 transition z-10"
                    onClick={handleCancelCall}
                  >
                    Cancel
                  </button>
                  {/* Animations */}
                  <style>{`
                    @keyframes pulse-slow { 0%,100%{opacity:0.7;} 50%{opacity:1;} }
                    .animate-pulse-slow { animation: pulse-slow 2.5s infinite; }
                    @keyframes pulse-fast { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
                    .animate-pulse-fast { animation: pulse-fast 1.2s infinite; }
                    @keyframes shake { 0%,100%{transform:rotate(-8deg);} 50%{transform:rotate(8deg);} }
                    .animate-shake { animation: shake 0.5s infinite; }
                    @keyframes bounce-slow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
                    .animate-bounce-slow { animation: bounce-slow 1.2s infinite; }
                  `}</style>
                </div>
              </div>
            )}
            {/* CallingAgent Modal */}
            {showCallingAgent && <CallingAgent onClose={() => setShowCallingAgent(false)} />}
          </div>
        </SectionWithShapes>

        {/* SAATHI Voice AI Section */}
        <SaathiDemo />

        {/* Features Section */}
        <SectionWithShapes className="py-24" id="features">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Why Choose CallGenie?</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Experience the future of phone communication with our advanced AI technology
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Smart AI Responses",
                  description: "Advanced AI understands context and responds naturally to callers"
                },
                {
                  icon: MessageSquare,
                  title: "Call Management",
                  description: "Efficiently handle multiple calls with intelligent routing and responses"
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Enterprise-grade security with 99.9% uptime guarantee"
                },
                {
                  icon: Star,
                  title: "Free Trial: Call Genie",
                  description: "Start your 7-day free trial and experience premium AI call features. No credit card required.",
                  cta: true
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                  className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
                >
                  <feature.icon className="h-8 w-8 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/60 mb-4">{feature.description}</p>
                  {feature.cta && (
                    <a href="/call-genie" className="inline-block px-5 py-2 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition">Start Free Trial</a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWithShapes>

        {/* Pricing Section */}
        <SectionWithShapes className="py-24" id="pricing">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Simple Pricing</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
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
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                  className={cn(
                    "p-8 rounded-2xl border transition-all",
                    plan.popular 
                      ? "bg-gradient-to-br from-indigo-500/20 to-rose-500/20 border-indigo-500/30" 
                      : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]"
                  )}
                >
                  {plan.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-sm font-medium mb-4">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/60">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-white/80">
                        <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-3 rounded-lg font-medium transition-all",
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white"
                      : "bg-white/[0.05] border border-white/[0.2] text-white/80 hover:bg-white/[0.1]"
                  )}>
                    Get Started
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWithShapes>

        {/* About Section */}
        <SectionWithShapes className="py-24" id="about">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-bold mb-6 text-white">About CallGenie</h2>
                <p className="text-white/60 mb-6">
                  CallGenie was born from the vision of revolutionizing how businesses handle phone communications. 
                  We understand that every call is an opportunity to build relationships and drive growth.
                </p>
                <p className="text-white/60 mb-6">
                  Our AI-powered platform combines cutting-edge natural language processing with intelligent 
                  workflow automation to ensure no call goes unanswered and every interaction is meaningful.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400">10K+</div>
                    <div className="text-sm text-white/50">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400">99.9%</div>
                    <div className="text-sm text-white/50">Uptime</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-br from-indigo-500/20 to-rose-500/20 p-8 rounded-2xl border border-indigo-500/30"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
                <p className="text-white/80">
                  To democratize AI-powered communication, making advanced phone automation accessible 
                  to businesses of all sizes while maintaining the human touch that customers expect.
                </p>
              </motion.div>
            </div>
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
              <h2 className="text-3xl font-bold mb-4 text-white">Get in Touch</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
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
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="font-medium text-white">Email</div>
                      <div className="text-white/60">riturajsuryawanshi51@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="font-medium text-white">Address</div>
                      <div className="text-white/60">Bhopal MP INDIA</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="font-medium text-white">Phone</div>
                      <div className="text-white/60">+917089956401</div>
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
                  <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    Send Message
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </SectionWithShapes>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.1] bg-[#030303]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-indigo-500 to-rose-600 p-2 rounded-xl">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-rose-300 bg-clip-text text-transparent">
                  CallGenie
                </span>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              © 2024 CallGenie. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 