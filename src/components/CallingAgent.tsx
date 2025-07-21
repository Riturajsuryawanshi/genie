import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Phone, Mic, MicOff, Volume2, VolumeX, User, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Simple animated avatar (could be replaced with Lottie or SVG animation)
const AgentAvatar = ({ status }: { status: string }) => (
  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-xl">
    <User className="w-12 h-12 text-white drop-shadow-lg animate-bounce" />
    <span className={cn(
      'absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white',
      status === 'connected' ? 'bg-green-400 animate-pulse' : status === 'ringing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'
    )} />
  </div>
);

// Simple waveform animation
const Waveform = ({ active }: { active: boolean }) => (
  <div className="flex items-end h-8 space-x-1">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className={cn(
          'w-1 rounded bg-indigo-400 transition-all duration-300',
          active ? `h-${(i % 4) + 2}` : 'h-2 bg-gray-300'
        )}
        style={{ animation: active ? `wave 1s infinite ${i * 0.08}s` : undefined }}
      />
    ))}
    <style>{`
      @keyframes wave {
        0%, 100% { height: 0.5rem; }
        20% { height: 2rem; }
        40% { height: 1rem; }
        60% { height: 1.5rem; }
        80% { height: 1rem; }
      }
    `}</style>
  </div>
);

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

export const CallingAgent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callStart, setCallStart] = useState<number | null>(null);
  const [callTime, setCallTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<number>(0);
  const [aiThinking, setAiThinking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate call flow for demo
  useEffect(() => {
    setStatus('ringing');
    const connectTimeout = setTimeout(() => {
      setStatus('connected');
      setCallStart(Date.now());
    }, 1800);
    return () => clearTimeout(connectTimeout);
  }, []);

  // Call timer
  useEffect(() => {
    if (status === 'connected' && callStart) {
      timerRef.current = setInterval(() => {
        setCallTime(Date.now() - callStart);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, callStart]);

  // End call handler
  const handleEndCall = () => {
    setStatus('ended');
    setShowFeedback(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Feedback handler
  const handleFeedback = (score: number) => {
    setFeedback(score);
    toast({ title: 'Thank you!', description: 'Your feedback helps us improve.' });
    setTimeout(() => {
      setShowFeedback(false);
      onClose?.();
    }, 1200);
  };

  // Simulate AI thinking
  useEffect(() => {
    if (status === 'connected') {
      setAiThinking(true);
      const thinkTimeout = setTimeout(() => setAiThinking(false), 1800);
      return () => clearTimeout(thinkTimeout);
    }
  }, [status]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Animated Aurora/Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[90vw] h-[90vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-aurora-blur" style={{ filter: 'blur(60px)', opacity: 0.8 }}>
          <div className="absolute w-2/3 h-2/3 bg-gradient-to-br from-indigo-500 via-rose-500 to-purple-500 rounded-full mix-blend-lighten animate-aurora-move1" />
          <div className="absolute w-1/2 h-1/2 bg-gradient-to-tr from-rose-400 via-indigo-400 to-emerald-400 rounded-full mix-blend-lighten animate-aurora-move2" style={{ left: '40%', top: '30%' }} />
          <div className="absolute w-1/3 h-1/3 bg-gradient-to-tl from-purple-400 via-indigo-300 to-rose-300 rounded-full mix-blend-lighten animate-aurora-move3" style={{ left: '60%', top: '60%' }} />
        </div>
        <style>{`
          @keyframes aurora-blur {
            0%,100% { filter: blur(60px); }
            50% { filter: blur(100px); }
          }
          .animate-aurora-blur { animation: aurora-blur 10s ease-in-out infinite; }
          @keyframes aurora-move1 {
            0%,100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.08); }
          }
          .animate-aurora-move1 { animation: aurora-move1 12s ease-in-out infinite; }
          @keyframes aurora-move2 {
            0%,100% { transform: translateX(0) scale(1); }
            50% { transform: translateX(40px) scale(1.05); }
          }
          .animate-aurora-move2 { animation: aurora-move2 14s ease-in-out infinite; }
          @keyframes aurora-move3 {
            0%,100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(40px) scale(1.1); }
          }
          .animate-aurora-move3 { animation: aurora-move3 16s ease-in-out infinite; }
        `}</style>
      </div>
      {/* Main Card Content (z-10) */}
      <Card className="relative w-full max-w-md p-8 rounded-3xl bg-white/30 border border-white/20 shadow-2xl backdrop-blur-2xl flex flex-col items-center glassmorphism z-10">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
        <AgentAvatar status={status} />
        <div className="mt-4 text-center">
          <div className="text-lg font-semibold text-white drop-shadow">SAATHI</div>
          <div className="text-xs text-white/70">AI Calling Agent</div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2">
            <Phone className={cn('w-5 h-5', status === 'connected' ? 'text-green-400 animate-pulse' : status === 'ringing' ? 'text-yellow-400 animate-pulse' : 'text-gray-400')} />
            <span className="text-white/80 text-sm font-medium">
              {status === 'ringing' && 'Ringing...'}
              {status === 'connected' && 'Connected'}
              {status === 'ended' && 'Call Ended'}
            </span>
          </div>
          {status === 'connected' && (
            <div className="mt-2 text-xs text-white/60">{formatTime(callTime)}</div>
          )}
        </div>
        <div className="mt-8 mb-4 w-full flex flex-col items-center">
          <Waveform active={status === 'connected' && !isMuted} />
          {aiThinking && (
            <div className="mt-2 flex items-center justify-center gap-1 animate-pulse">
              <span className="w-2 h-2 bg-white/80 rounded-full" />
              <span className="w-2 h-2 bg-white/60 rounded-full" />
              <span className="w-2 h-2 bg-white/40 rounded-full" />
              <span className="ml-2 text-xs text-white/70">SAATHI is thinking...</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMuted(v => !v)} className="text-white/80 hover:text-white">
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsSpeaker(v => !v)} className="text-white/80 hover:text-white">
            {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>
          <Button variant="destructive" size="icon" onClick={handleEndCall} className="text-white/80 hover:text-white bg-rose-600/80">
            <X className="w-6 h-6" />
          </Button>
        </div>
        {showFeedback && (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-white/90 font-medium mb-2">How was your call?</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => handleFeedback(i)} className={cn('p-1 rounded-full', feedback >= i ? 'bg-yellow-400' : 'bg-white/30 hover:bg-yellow-200')}> <Star className={cn('w-6 h-6', feedback >= i ? 'text-yellow-600' : 'text-white/80')} /> </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}; 