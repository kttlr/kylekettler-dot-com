import { motion } from 'framer-motion'

export default function SpotlightCard() {
  return (
    <div className="group relative rounded-xl border border-white/10 bg-gray-900 p-4 shadow-2xl">
      <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  650px circle at ${mouseX}px ${mouseY}px,
                  rgba(14, 165, 233, 0.15),
                  transparent 80%
                )
              `,
            }}
          />
    </div>
 )
}
