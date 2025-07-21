import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SaathiChat } from './SaathiChat';

export const SaathiPage = () => {
  // You can keep any auth or toast logic you want here
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <SaathiChat />
    </div>
  );
}; 