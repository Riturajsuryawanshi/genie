// React import not needed with modern JSX transform
import { motion } from 'framer-motion';
import { Brain, Shield, MessageSquare, Star, ArrowLeft, Phone, Users, Zap, Globe, Heart, Lightbulb, Target, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEO 
        title="About CallGenie - AI Voice Assistant Company | Our Mission & Vision"
        description="Learn about CallGenie's mission to revolutionize business communication with AI-powered voice assistants. Discover our story, values, and commitment to innovation."
        keywords="about CallGenie, AI voice assistant company, business communication innovation, voice AI technology, CallGenie mission"
        url="https://callgenie.ai/about"
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

        {/* Overview Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-8 rounded-3xl border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-400/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">CallGenie V2 - AI-Powered Voice Assistant</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                CallGenie V2 is a comprehensive AI-powered voice assistant platform that revolutionizes business communication through intelligent voice-to-voice interactions. Built with cutting-edge AI technology, it provides natural conversational experiences for customer service, appointment scheduling, and business automation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/[0.05] p-4 rounded-xl border border-white/[0.1]">
                  <div className="text-2xl font-bold text-purple-400 mb-1">🎤</div>
                  <div className="text-sm text-white font-medium mb-1">Voice Recognition</div>
                  <div className="text-xs text-white/60">OpenAI Whisper</div>
                </div>
                <div className="bg-white/[0.05] p-4 rounded-xl border border-white/[0.1]">
                  <div className="text-2xl font-bold text-violet-400 mb-1">🧠</div>
                  <div className="text-sm text-white font-medium mb-1">AI Intelligence</div>
                  <div className="text-xs text-white/60">GPT-4/GPT-3.5</div>
                </div>
                <div className="bg-white/[0.05] p-4 rounded-xl border border-white/[0.1]">
                  <div className="text-2xl font-bold text-fuchsia-400 mb-1">🔊</div>
                  <div className="text-sm text-white font-medium mb-1">Voice Synthesis</div>
                  <div className="text-xs text-white/60">OpenAI TTS</div>
                </div>
                <div className="bg-white/[0.05] p-4 rounded-xl border border-white/[0.1]">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">📱</div>
                  <div className="text-sm text-white font-medium mb-1">Phone Integration</div>
                  <div className="text-xs text-white/60">Exotel Support</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Voice AI Pipeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Voice AI Pipeline</h2>
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 p-8 rounded-3xl border border-purple-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold">1</div>
                <h4 className="font-semibold text-white mb-2">Call Reception</h4>
                <p className="text-white/60 text-sm">Exotel sends webhook with audio URL</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold">2</div>
                <h4 className="font-semibold text-white mb-2">Speech Recognition</h4>
                <p className="text-white/60 text-sm">OpenAI Whisper transcribes audio</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold">3</div>
                <h4 className="font-semibold text-white mb-2">AI Response</h4>
                <p className="text-white/60 text-sm">GPT generates contextual response</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold">4</div>
                <h4 className="font-semibold text-white mb-2">Voice Synthesis</h4>
                <p className="text-white/60 text-sm">Convert response to speech</p>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Team Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-purple-100/70 text-lg max-w-2xl mx-auto">
              The passionate minds behind CallGenie's revolutionary AI voice technology
            </p>
          </div>
          
          {/* Founding Duo Section */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 p-10 rounded-3xl border border-purple-500/20 backdrop-blur-sm mb-16"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo Section */}
              <div className="text-center">
                <div className="relative">
                  <img 
                    src="/founders-duo.jpg" 
                    alt="Rituraj Suryawanshi and Aayush Purohit - CallGenie Founders" 
                    className="w-full max-w-md mx-auto rounded-3xl shadow-2xl border-4 border-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div className="w-full max-w-md mx-auto h-80 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-3xl shadow-2xl border-4 border-white/10 flex items-center justify-center" style={{display: 'none'}}>
                    <div className="text-center">
                      <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-white/60 text-sm">Founders Photo</p>
                      <p className="text-white/40 text-xs">Add founders-duo.jpg to public folder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">The Founding Duo</h3>
                  </div>
                  <p className="text-xl text-purple-300 mb-6">Rituraj Suryawanshi & Aayush Purohit</p>
                </div>

                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  From a shared vision sketched during late-night brainstorming sessions to building a revolutionary AI platform, Rituraj and Aayush represent the perfect fusion of strategic brilliance and technical mastery. Their complementary expertise and unwavering commitment have transformed CallGenie from an ambitious idea into a game-changing reality.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.05] p-6 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">RS</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Rituraj Suryawanshi</h4>
                        <p className="text-purple-400 text-sm">Founder & CEO</p>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">
                      Visionary leader driving AI strategy, business growth, and market expansion with deep expertise in emerging technologies.
                    </p>
                  </div>

                  <div className="bg-white/[0.05] p-6 rounded-xl border border-violet-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-800 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">AP</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Aayush Purohit</h4>
                        <p className="text-violet-400 text-sm">Co-Founder & CTO</p>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">
                      Technical architect building scalable AI systems, ensuring robust platform delivery and innovative solution development.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-6 rounded-xl border border-purple-500/20">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-400" />
                    Shared Vision
                  </h4>
                  <p className="text-white/80 italic leading-relaxed">
                    "Together, we're not just building a product—we're crafting the future of intelligent business communication. Our combined passion for innovation, commitment to excellence, and shared belief in AI's transformative power drives everything we do at CallGenie."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Founder Profiles */}
          <div className="space-y-16 mb-12">
            {/* Rituraj Detailed Profile */}
            <motion.div 
              className="bg-gradient-to-br from-purple-500/15 to-violet-500/15 p-10 rounded-3xl border border-purple-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 text-center">
                  <div className="w-40 h-40 rounded-3xl mx-auto mb-6 shadow-2xl overflow-hidden border-4 border-purple-500/30">
                    <img 
                      src="/rituraj.jpg" 
                      alt="Rituraj Suryawanshi - Founder & CEO" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-5xl font-bold text-white">RS</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Rituraj Suryawanshi</h3>
                  <p className="text-purple-300 text-xl mb-4">Founder & CEO</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-400">AI Strategist & Visionary</span>
                  </div>
                  <div className="bg-white/[0.05] p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400 mb-1">6+</div>
                    <div className="text-white/70 text-sm">Years in Tech & AI</div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-4">The Visionary Behind CallGenie</h4>
                    <p className="text-white/80 leading-relaxed mb-4">
                      Rituraj Suryawanshi is a passionate entrepreneur with an unwavering commitment to revolutionizing business communication through artificial intelligence. His journey began with a deep fascination for emerging technologies and evolved into a mission to democratize AI-powered voice solutions for businesses worldwide.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-6">
                      With a unique blend of technical insight and strategic business acumen, Rituraj identified the critical gap in intelligent voice communication systems. His vision for CallGenie emerged from countless hours of market research, customer interviews, and a deep understanding of the pain points businesses face in modern communication.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.05] p-6 rounded-xl">
                      <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        Core Expertise
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• AI Strategy & Product Vision</li>
                        <li>• Business Development & Growth</li>
                        <li>• Market Analysis & Customer Psychology</li>
                        <li>• Team Leadership & Culture Building</li>
                        <li>• Investor Relations & Fundraising</li>
                        <li>• Strategic Partnerships</li>
                      </ul>
                    </div>

                    <div className="bg-white/[0.05] p-6 rounded-xl">
                      <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-purple-400" />
                        Key Achievements
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• Conceptualized CallGenie's AI-first approach</li>
                        <li>• Built strategic telecom partnerships</li>
                        <li>• Led successful product launches</li>
                        <li>• Established innovation-focused culture</li>
                        <li>• Developed enterprise go-to-market strategy</li>
                        <li>• Secured initial funding rounds</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-6 rounded-xl border border-purple-500/20">
                    <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-400" />
                      Leadership Philosophy
                    </h5>
                    <p className="text-white/80 italic leading-relaxed">
                      "Innovation isn't just about technology—it's about understanding human needs and creating solutions that genuinely improve lives. At CallGenie, we don't just build AI; we craft experiences that make business communication more human, more intelligent, and more impactful. Every decision we make is guided by our commitment to solving real problems for real people."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Aayush Detailed Profile */}
            <motion.div 
              className="bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 p-10 rounded-3xl border border-violet-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 text-center">
                  <div className="w-40 h-40 rounded-3xl mx-auto mb-6 shadow-2xl overflow-hidden border-4 border-violet-500/30">
                    <img 
                      src="/aayush.jpg" 
                      alt="Aayush Purohit - Co-Founder & CTO" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-700 flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-5xl font-bold text-white">AP</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Aayush Purohit</h3>
                  <p className="text-violet-300 text-xl mb-4">Co-Founder & CTO</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Zap className="h-5 w-5 text-violet-400" />
                    <span className="text-violet-400">Technical Architect & AI Engineer</span>
                  </div>
                  <div className="bg-white/[0.05] p-4 rounded-xl">
                    <div className="text-2xl font-bold text-violet-400 mb-1">8+</div>
                    <div className="text-white/70 text-sm">Years in Software Development</div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-4">The Technical Mastermind</h4>
                    <p className="text-white/80 leading-relaxed mb-4">
                      Aayush Purohit is a technical virtuoso with an exceptional ability to transform complex AI concepts into elegant, scalable solutions. His expertise spans the entire technology stack, from intuitive frontend experiences to sophisticated backend AI processing pipelines, making him the technical backbone of CallGenie's revolutionary platform.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-6">
                      With a deep understanding of both traditional software engineering principles and cutting-edge AI technologies, Aayush architects systems that are not only powerful and innovative but also maintainable, secure, and ready for enterprise-scale deployment. His technical leadership ensures CallGenie stays at the forefront of voice AI technology.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.05] p-6 rounded-xl">
                      <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-violet-400" />
                        Technical Mastery
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• Full-Stack Development (React, Node.js, TypeScript)</li>
                        <li>• AI/ML Integration (OpenAI GPT, Whisper, TTS)</li>
                        <li>• Cloud Architecture (AWS, Supabase, Docker)</li>
                        <li>• Database Design & Performance Optimization</li>
                        <li>• Real-time Systems & WebSocket Implementation</li>
                        <li>• DevOps & CI/CD Pipeline Management</li>
                      </ul>
                    </div>

                    <div className="bg-white/[0.05] p-6 rounded-xl">
                      <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-violet-400" />
                        Platform Innovations
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• Architected low-latency voice AI pipeline</li>
                        <li>• Implemented real-time audio processing</li>
                        <li>• Built scalable webhook infrastructure</li>
                        <li>• Optimized for sub-second response times</li>
                        <li>• Designed GDPR-compliant data systems</li>
                        <li>• Created automated testing frameworks</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-6 rounded-xl border border-violet-500/20">
                    <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-violet-400" />
                      Technical Philosophy
                    </h5>
                    <p className="text-white/80 italic leading-relaxed">
                      "Great technology should be invisible to the user but incredibly powerful under the hood. Every line of code we write at CallGenie is crafted with precision, scalability, and user experience in mind. We're not just building software—we're engineering the future of intelligent communication, one algorithm at a time."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Partnership Highlight */}
          <div className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 p-8 rounded-3xl border border-purple-500/20 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Users className="h-10 w-10 text-purple-400" />
                <Heart className="h-8 w-8 text-red-400" />
                <Globe className="h-10 w-10 text-violet-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">A Partnership Built on Excellence</h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                Together, Rituraj and Aayush form a dynamic duo that combines visionary leadership with technical excellence. Their complementary skills, shared values, and relentless pursuit of innovation have transformed CallGenie from a late-night idea into a revolutionary AI platform. From concept to execution, they work in perfect harmony to deliver cutting-edge solutions that transform how businesses communicate.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">3+</div>
                  <div className="text-white/70 text-sm">Years of Partnership</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-violet-400 mb-2">100%</div>
                  <div className="text-white/70 text-sm">Commitment to Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fuchsia-400 mb-2">24/7</div>
                  <div className="text-white/70 text-sm">Dedication</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">∞</div>
                  <div className="text-white/70 text-sm">Innovation Potential</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

            {/* Join Team Card */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-300 group cursor-pointer"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Join Our Team</h3>
                <p className="text-emerald-400 text-sm mb-4 font-medium">We're Hiring!</p>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Passionate about AI and voice technology? Join us in revolutionizing business communication.
                </p>
                <button className="px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-full text-sm font-medium transition-all duration-300 border border-emerald-500/30">
                  View Openings
                </button>
              </div>
            </motion.div>
          </div>

          {/* Team Stats */}
          <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl p-8 border border-purple-500/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
                <div className="text-white/70 text-sm">Founders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-violet-400 mb-2">5+</div>
                <div className="text-white/70 text-sm">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-fuchsia-400 mb-2">24/7</div>
                <div className="text-white/70 text-sm">Dedication</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">∞</div>
                <div className="text-white/70 text-sm">Innovation</div>
              </div>
            </div>
          </div>
        </motion.div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Innovation First</h4>
              <p className="text-white/60 text-sm">
                We push boundaries and challenge conventions to create breakthrough solutions.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Purpose-Driven</h4>
              <p className="text-white/60 text-sm">
                Every decision we make is guided by our mission to make a meaningful impact.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-3 rounded-xl w-fit mx-auto mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Relentless Execution</h4>
              <p className="text-white/60 text-sm">
                We turn ambitious visions into reality through dedication and hard work.
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
    </>
  );
};