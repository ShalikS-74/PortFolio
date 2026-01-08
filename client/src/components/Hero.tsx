import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Floating Glass Panels (Decorative) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-32 h-32 glass-panel rounded-2xl z-0 hidden lg:block opacity-40"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-10 w-48 h-48 glass-panel rounded-full z-0 hidden lg:block opacity-30 border-pink-500/20"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-6">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Next Gen Design</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Building the <br />
            <span className="text-gradient-hero">Digital Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
            Crafting immersive digital experiences with cutting-edge technology and luxury aesthetics. 
            Defining the intersection of art and engineering.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px -5px rgba(251, 191, 36, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-bold text-white bg-white/5 border border-amber-500/50 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Projects <ArrowRight size={20} />
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-bold text-gray-300 hover:text-white transition-colors"
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>

        {/* Visual Element (3D-ish Composition) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[400px] md:h-[600px] hidden md:flex items-center justify-center"
        >
          {/* Abstract geometric composition */}
          <div className="relative w-full h-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-pink-600 rounded-[2rem] opacity-20 blur-3xl transform rotate-6 animate-pulse" />
            <div className="absolute inset-0 bg-black/80 border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
              {/* Mock Interface Header */}
              <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              {/* Mock Content */}
              <div className="flex-1 p-8 relative">
                {/* Decorative lines */}
                <div className="absolute top-20 right-[-50px] w-[200px] h-[200px] rounded-full border border-pink-500/20" />
                <div className="absolute bottom-10 left-[-20px] w-[150px] h-[150px] rounded-full border border-amber-500/20" />
                
                <div className="space-y-4">
                  <div className="h-8 w-2/3 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
                  <div className="h-4 w-4/6 bg-white/5 rounded" />
                </div>
                
                {/* Hero Graphic Image */}
                 {/* Unsplash: Abstract digital art dark futuristic */}
                 <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="Digital Abstract"
                  className="absolute bottom-0 right-0 w-3/4 h-1/2 object-cover rounded-tl-2xl opacity-60 mix-blend-screen hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
