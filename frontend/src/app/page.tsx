'use client'
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
  

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl font-bold mt-6 text-white drop-shadow-lg"
      >
        Welcome to Quizzo
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-2 text-lg text-white"
      >
        Your ultimate quiz management system
      </motion.p>

      <motion.button
        onClick={() => router.push("/dashboard")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow hover:bg-gray-100 transition duration-300"
      >
        Get Started
      </motion.button>
    </div>
  );
}
