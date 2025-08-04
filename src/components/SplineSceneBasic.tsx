
'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { Phone, Brain, MessageSquare, Shield, Clock, Users } from "lucide-react"
import { useState } from "react";
 
export function SplineSceneBasic() {
  const [showCallModal, setShowCallModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callError, setCallError] = useState("");
  const [callSuccess, setCallSuccess] = useState(false);

  const handleCall = async () => {
    setIsCalling(true);
    setCallError("");
    setCallSuccess(false);
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : { success: false };
      if (res.ok && data.success) {
        setCallSuccess(true);
        setShowCallModal(false);
      } else {
        setCallError(data.error || "Failed to initiate call.");
      }
    } catch (err) {
      setCallError("Network error. Please try again.");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        size={400}
      />
      
      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                CallGenie
              </h1>
              <p className="text-neutral-400 text-lg">AI Phone Assistant Revolution</p>
            </div>
          </div>
          
          <p className="text-neutral-300 max-w-lg text-lg leading-relaxed">
            Transform your business communication with our intelligent AI assistant that handles calls 24/7, 
            schedules appointments, and provides natural conversational experiences for your customers.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-indigo-400" />
              <span className="text-neutral-300">Smart AI Responses</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-indigo-400" />
              <span className="text-neutral-300">24/7 Availability</span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-indigo-400" />
              <span className="text-neutral-300">Natural Conversations</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-indigo-400" />
              <span className="text-neutral-300">Multi-caller Support</span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => setShowCallModal(true)}
            >
              Start Free Trial
            </Button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white/20 border border-white/30 rounded-3xl p-8 flex flex-col items-center shadow-2xl min-w-[320px] max-w-xs w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Call a Number</h2>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black/40 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              disabled={isCalling}
            />
            {callError && <div className="text-red-400 mb-2 text-sm">{callError}</div>}
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleCall}
                disabled={isCalling || !phoneNumber}
              >
                {isCalling ? "Calling..." : "Call"}
              </Button>
              <Button
                className="flex-1 bg-rose-600 hover:bg-rose-700"
                onClick={() => setShowCallModal(false)}
                disabled={isCalling}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
