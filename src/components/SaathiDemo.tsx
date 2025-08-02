import { useState } from 'react';
import { Mic, Brain, Volume2, MessageSquare, ArrowRight } from 'lucide-react';

export const SaathiDemo = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      image: '/ai voice.png',
      title: 'Voice Recognition',
      description: 'Advanced speech recognition that understands natural language and multiple accents with perfect clarity.'
    },
    {
      image: '/ai image.png', 
      title: 'AI Intelligence',
      description: 'Powered by cutting-edge AI that provides contextual and intelligent responses for meaningful conversations.'
    },
    {
      image: '/natural.png',
      title: 'Natural Speech',
      description: 'Human-like voice synthesis that sounds natural and engaging, creating authentic interactions.'
    },
    {
      image: '/ai chatbot.png',
      title: 'Smart Conversations',
      description: 'Engage in dynamic conversations with AI that remembers context and provides personalized responses.'
    }
  ];

  return (
    <div className="bg-black py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-4 rounded-2xl shadow-2xl shadow-purple-500/25">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Meet{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              SAATHI
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-purple-100/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your AI voice companion that understands and responds naturally. 
            Have real conversations, get instant answers, and experience the future of voice interaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold shadow-2xl shadow-purple-500/25 hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-2 relative overflow-hidden group"
              onClick={() => window.location.href = '/saathi'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Try SAATHI Now
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
            <button 
              className="px-8 py-4 rounded-xl border-2 border-purple-500/50 text-purple-200 transition-all duration-300 text-lg flex items-center justify-center gap-2 relative overflow-hidden group"
              onClick={() => setShowLearnMore(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                <MessageSquare className="h-5 w-5" />
                Learn More
              </span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="aspect-square p-6">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-500 ${hoveredCard === index ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-purple-100/80 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                
                <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 ${hoveredCard === index ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                  <h3 className="text-xl font-bold text-white text-center">{feature.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 