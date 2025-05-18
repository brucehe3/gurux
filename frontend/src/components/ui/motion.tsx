import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  children: React.ReactNode;
}

export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, ...props }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface FadeInStaggerProps {
  children: React.ReactNode;
  faster?: boolean;
}

export function FadeInStagger({ children, faster = false }: FadeInStaggerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      viewport={{ once: true, margin: "0px 0px -200px" }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStaggerItem({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        animate: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}