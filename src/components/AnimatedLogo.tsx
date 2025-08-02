import { motion } from "framer-motion";
import { Phone, Sparkles, Zap } from "lucide-react";

export const AnimatedLogo = () => {
  return (
    <div className="flex items-center space-x-3 group cursor-pointer">
      {/* Animated Icon Container */}
      <div className="relative">
        {/* Main Icon Background */}
        <motion.div 
          className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-3 rounded-2xl shadow-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Animated Background Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-400 rounded-2xl opacity-60 blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Main Phone Icon */}
          <motion.div
            className="relative z-10"
            animate={{
              rotateY: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Phone className="h-7 w-7 text-white drop-shadow-lg" />
          </motion.div>
          
          {/* Floating Sparkles */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              rotate: 360,
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-300 drop-shadow-lg" />
          </motion.div>
          
          {/* Animated Lightning Bolt */}
          <motion.div
            className="absolute -bottom-1 -left-1"
            animate={{
              scale: [0.6, 1, 0.6],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap className="h-3 w-3 text-cyan-300 drop-shadow-lg" />
          </motion.div>
        </motion.div>
        
        {/* Orbiting Particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full shadow-lg"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Animated Text */}
      <div className="flex flex-col">
        <motion.span 
          className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent"
          whileHover={{
            backgroundPosition: ["0%", "100%"],
          }}
          transition={{ duration: 1 }}
          style={{
            backgroundSize: "200% 100%",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Call
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent"
          >
            Genie
          </motion.span>
        </motion.span>
        
        <motion.div 
          className="text-xs text-purple-300/70 -mt-1 font-medium tracking-wide"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.span
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            AI Phone Assistant
          </motion.span>
        </motion.div>
      </div>
      
      {/* Hover Effect Particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};