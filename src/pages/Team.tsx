import { Users, Heart, Lightbulb, Target, Rocket, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Team = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-xl hover:bg-black/70 transition-all duration-200 border border-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Meet Our Team
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The visionaries behind CallGenie - transforming ideas into reality
          </p>
        </div>
      </section>

      {/* Team Photo & Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Team Photo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <img 
                    src="/ceo.jpg" 
                    alt="Rituraj and Aayush - CallGenie Founders" 
                    className="w-full h-80 object-cover object-center rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">The Founding Duo</h3>
                  <p className="text-purple-300">Rituraj Suryawanshi & Aayush Purohit</p>
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="relative">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                    Our Journey
                  </h2>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    From an idea sketched on a late-night call to a vision transforming into reality, we – 
                    <span className="text-purple-400 font-semibold"> Rituraj Suryawanshi (Founder)</span> and 
                    <span className="text-purple-400 font-semibold"> Aayush Purohit (Co-Founder)</span> – 
                    embarked on this journey with one mission: to build solutions that make a real difference.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    We believe innovation isn't just about technology, it's about people, purpose, and passion. 
                    Together, we bring complementary skills, relentless drive, and a shared dream to create something impactful. 
                    This is more than a company – it's our commitment to shaping a better future, one step at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profiles */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
            The Visionaries
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rituraj */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">RS</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Rituraj Suryawanshi</h3>
                <p className="text-purple-400 font-semibold">Founder & CEO</p>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                A visionary leader with a passion for AI and innovation. Rituraj brings strategic thinking 
                and technical expertise to drive CallGenie's mission of transforming business communication 
                through intelligent voice solutions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">AI Strategy</span>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Leadership</span>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Innovation</span>
              </div>
            </div>

            {/* Aayush */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AP</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Aayush Purohit</h3>
                <p className="text-purple-400 font-semibold">Co-Founder & CTO</p>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                A technical mastermind with deep expertise in software architecture and AI implementation. 
                Aayush ensures CallGenie's technology stack is robust, scalable, and delivers exceptional 
                user experiences across all platforms.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Full-Stack Dev</span>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">AI/ML</span>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation First</h3>
              <p className="text-gray-300">We push boundaries and challenge conventions to create breakthrough solutions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Purpose-Driven</h3>
              <p className="text-gray-300">Every decision we make is guided by our mission to make a meaningful impact.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Relentless Execution</h3>
              <p className="text-gray-300">We turn ambitious visions into reality through dedication and hard work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/20">
            <Star className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">Join Our Journey</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              We're just getting started. As we continue to innovate and grow, we're always looking for 
              passionate individuals who share our vision of transforming the future through technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                Get In Touch
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-3 bg-black/30 text-white rounded-xl font-semibold hover:bg-black/50 transition-all duration-200 border border-purple-500/20"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};