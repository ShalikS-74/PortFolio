import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Brain, Gamepad2, Rocket, Layers } from "lucide-react";

export default function Home() {
  const skills = [
    { 
      title: "Languages", 
      items: [
        { name: "Python", icon: "devicon-python-plain colored" },
        { name: "C", icon: "devicon-c-plain colored" },
        { name: "JavaScript", icon: "devicon-javascript-plain colored" },
        { name: "TypeScript", icon: "devicon-typescript-plain colored" },
        { name: "Java", icon: "devicon-java-plain colored" },
        { name: "HTML", icon: "devicon-html5-plain colored" },
      ] 
    },
    { 
      title: "Frontend", 
      items: [
        { name: "React", icon: "devicon-react-original colored" },
        { name: "CSS", icon: "devicon-css3-plain colored" },
        { name: "Tailwind CSS", icon: "devicon-tailwindcss-original colored" },
      ] 
    },
    { 
      title: "Backend", 
      items: [
        { name: "Node.js", icon: "devicon-nodejs-plain colored" },
        { name: "Express", icon: "devicon-express-original" },
        { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
      ] 
    },
    { 
      title: "Tools", 
      items: [
        { name: "VS Code", icon: "devicon-vscode-plain colored" },
        { name: "GitHub", icon: "devicon-github-original" },
      ] 
    },
  ];

  // Experience and goals removed per request

  return (
    <div className="bg-background min-h-screen selection:bg-pink-500/30">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

        {/* About */}
        <section id="about" className="py-20 px-6 relative overflow-hidden">
          <div className="absolute top-10 right-[-200px] w-[420px] h-[420px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-amber-400 font-semibold mb-3">Bio</p>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 leading-tight">
                AI/ML enthusiast, game dev explorer, full-stack learner.
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I enjoy building web applications and developing games, as well as playing them. I'm particularly interested in artificial intelligence and applying machine learning to solve practical, real-world challenges.
              </p>
              <div className="flex flex-wrap gap-3">
                {["AI/ML", "Game Dev", "Web Apps", "Always Learning"].map((label) => (
                  <span key={label} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200">
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-center">
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">Projects completed</p>
                <p className="text-5xl font-bold text-amber-400 mb-6">1</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-2">Years of Studying</p>
                <p className="text-4xl font-bold text-amber-400 mb-6">2</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-2">Git Commits</p>
                <p className="text-4xl font-bold text-amber-400">50</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="text-pink-400" size={20} />
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Coming soon</p>
                </div>
                <p className="text-gray-400">Achievements unlocked.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                Skills & Stack
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Tools I reach for while building projects.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((group, i) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-2xl p-5 h-full"
                >
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">{group.title}</p>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 text-gray-200 group/item hover:text-white transition-colors">
                        <i className={`${item.icon} text-2xl transition-transform group-hover/item:scale-110`} />
                        <span className="text-base">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Projects />

        {/* Experience section removed as requested */}

        {/* Future goals section removed as requested */}

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
              Let's build something <br/> 
              <span className="text-gradient-gold">tangible together</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-12 leading-relaxed"
            >
              Open to AI/ML projects, collaborative builds, and full-stack roles. If you want a fast-moving prototyper who ships and iterates, drop a note.
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
                  <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-1">Prefer DMs</p>
                  <a href="https://www.linkedin.com/in/shalik-sahul-43aaa0378/" target="_blank" rel="noopener noreferrer" className="text-2xl text-white font-bold hover:text-pink-500 transition-colors">
                    LinkedIn Message
                  </a>
                  <p className="text-sm text-gray-400 mt-1">Add your email and I will link it up.</p>
                </div>
                <div className="h-12 w-px bg-white/10 hidden md:block" />
                <div className="flex gap-4">
                  {[{ Icon: Github, href: "https://github.com/ShalikS-74/" }, { Icon: Linkedin, href: "https://www.linkedin.com/in/shalik-sahul-43aaa0378/" }, { Icon: Mail, href: "mailto:shaliksahul74@gmail.com" }].map(({ Icon, href }, i) => (
                    <motion.a
                      key={i}
                      href={href}
                      whileHover={{ y: -5, color: '#FBBF24' }}
                      className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-amber-500/50 transition-colors"
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
    </div>
  );
}
