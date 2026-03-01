"use client"

import Link from 'next/link'
import { useState, useRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function NoahHoverCard() {
  const [visible, setVisible] = useState(false)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter() {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    showTimer.current = setTimeout(() => setVisible(true), 400)
  }

  function handleMouseLeave() {
    if (showTimer.current) clearTimeout(showTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 150)
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="https://noa-dave.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors duration-150"
      >
        noah-dave
      </Link>

      {/* Hover Card */}
      <div
        className={`
          absolute bottom-full left-1/2 mb-3 -translate-x-1/2
          w-56 rounded-xl border border-zinc-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          shadow-lg dark:shadow-zinc-950/50
          p-4 z-50
          transition-all duration-200
          ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}
        `}
      >
        <div className="mb-3 h-12 w-12 overflow-hidden rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700">
          <img
            src="/profile.png"
            alt="noah-dave"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Noah Dave</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">@DavisNoah02</p>
        </div>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Software developer & creator of Convert-neo.
        </p>
        <div className="mt-3 flex gap-2">
          <a
            href="https://noa-dave.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-150"
          >
            Portfolio
          </a>
          <a
            href="https://github.com/DavisNoah02"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-150"
          >
            GitHub
          </a>
        </div>
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 rounded-sm border-r border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
      </div>
    </span>
  )
}

export default function FooterSection() {
  return (
    <TooltipProvider delayDuration={300}>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-transparent py-6">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">

            <span className="text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} Convert-neo, All rights reserved
            </span>

            <span className="text-zinc-500 dark:text-zinc-400">
              Made with <span className="text-green-500">💚</span> by{' '}
              <NoahHoverCard />
            </span>

            {/* Split button: Star | Fork */}
            <div className="flex items-stretch overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-900 shadow-sm">

              {/* Star */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://github.com/DavisNoah02/Convertneo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap
                      text-zinc-600 dark:text-zinc-400
                      hover:text-yellow-500 dark:hover:text-yellow-400
                      hover:bg-zinc-100 dark:hover:bg-zinc-800
                      transition-all duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13" height="13"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-zinc-400 dark:text-zinc-500 group-hover:text-yellow-400 transition-colors duration-150"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Star
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  ⭐ Give us a star on GitHub!
                </TooltipContent>
              </Tooltip>

              <span className="w-px bg-zinc-200 dark:bg-zinc-700" />

              {/* Fork */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://github.com/DavisNoah02/Convertneo/fork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap
                      text-zinc-600 dark:text-zinc-400
                      hover:text-emerald-600 dark:hover:text-emerald-400
                      hover:bg-zinc-100 dark:hover:bg-zinc-800
                      transition-all duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13" height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-150"
                    >
                      <circle cx="12" cy="18" r="3" />
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
                      <line x1="12" y1="12" x2="12" y2="15" />
                    </svg>
                    Fork
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                 Fork & contribute to the project!
                </TooltipContent>
              </Tooltip>

            </div>

          </div>
        </div>
      </footer>
    </TooltipProvider>
  )
}