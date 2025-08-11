import { useState } from 'react';
import { Dashboard } from './Dashboard';
import { useToast } from '@/hooks/use-toast';
import { getCallGenieNumber } from '@/utils/config';

export const DashboardWrapper = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  const copyNumber = () => {
    const phoneNumber = getCallGenieNumber();
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: "Number copied!",
      description: "Your CallGenie number has been copied to clipboard.",
    });
  };

  return (
    <Dashboard 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      copyNumber={copyNumber} 
    />
  );
};