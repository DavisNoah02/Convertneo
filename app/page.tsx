"use client";

import { motion } from "motion/react";

export default function home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-lg text-center text-muted-foreground"
      >
        Your files, your browser. Convert images, audio, and video with zero server
        uploads and total privacy. Unlimited, secure, and instantly with{" "}
        <span className="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary">
          Convert-neo
        </span>
        !
      </motion.p>
    </main>
  );
}
