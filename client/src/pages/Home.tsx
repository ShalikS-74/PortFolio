import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background min-h-screen selection:bg-pink-500/30">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />
        
        <Projects />

        {/* About / Contact Section */}
        <section id="contact" className="py-24 px-6 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold font-display mb-8"
            >
              Ready to create something <br/> 
              <span className="text-gradient-gold">extraordinary?</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-12 leading-relaxed"
            >
              I'm currently available for freelance projects and open to full-time opportunities.
              If you have a project that needs a premium touch, let's talk.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-3xl inline-block"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-left">
                  <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-1">Email Me</p>
                  <a href="mailto:hello@example.com" className="text-2xl text-white font-bold hover:text-pink-500 transition-colors">
                    hello@luxfuture.dev
                  </a>
                </div>
                <div className="h-12 w-px bg-white/10 hidden md:block" />
                <div className="flex gap-4">
                  {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ y: -5, color: '#FBBF24' }}
                      className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-amber-500/50 transition-colors"
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2024 LuxFuture. All rights reserved. Designed & Built with ❤️</p>
      </footer>
    </div>
  );
}
