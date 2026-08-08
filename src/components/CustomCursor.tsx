import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 400, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100]"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div
        className="flex items-center justify-center mix-blend-difference bg-white overflow-hidden origin-center absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
        animate={{
          width: isHovering ? 80 : 16,
          height: isHovering ? 80 : 16,
          borderRadius: isHovering ? "50%" : "2px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
          className="text-black"
        >
          <ArrowUpRight size={32} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
