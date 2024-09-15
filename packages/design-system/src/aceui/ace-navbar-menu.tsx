'use client'
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

export const MenuItem = ({
  setActive,
  active,
  item,
  renderIcon,
  children,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  renderIcon: () => JSX.Element
  children?: React.ReactNode
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 1 }}
        className="cursor-pointer transition-colors hover:text-foreground text-muted-foreground"
      >
        {renderIcon()}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute left-6 transform -translate-y-1/2">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-popover backdrop-blur-sm rounded overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
}) => {
  return (
    <nav onMouseLeave={() => setActive(null)} className="relative flex justify-center">
      {children}
    </nav>
  )
}

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link {...rest} className="text-popover-foreground hover:text-muted-foreground">
      {children}
    </Link>
  )
}
