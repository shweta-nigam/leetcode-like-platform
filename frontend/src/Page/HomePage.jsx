import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, Sparkles } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import { motion } from "framer-motion";

const HomePage = () => {
  const getAllProblems = useProblemStore((state) => state.getAllProblems);
  const problems = useProblemStore((state) => state.problems);
  const isProblemsLoading = useProblemStore((state) => state.isProblemsLoading);

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white px-4 py-20 flex flex-col items-center overflow-hidden">
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00241F] via-[#540979] to-[#0066FF] opacity-10 blur-3xl" />
        {/* Floating Icons */}
        <motion.div
          className="absolute top-10 left-10 text-primary opacity-30"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 text-primary opacity-30"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Main Content Box */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="relative z-10 max-w-4xl text-center bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-md before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-transparent before:bg-gradient-to-r before:from-[#00241F] before:via-[#540979] before:to-[#0066FF] before:blur-sm before:opacity-50 before:animate-pulse before:z-[-1]"
>
<h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#00241F] via-[#540979] to-[#0066FF] text-transparent bg-clip-text glow-text animate-letterGlow">
  Welcome to lillyCode
</h1>







  <p className="mt-6 text-lg sm:text-xl font-medium text-gray-300 leading-relaxed max-w-2xl mx-auto">
    <span className="text-white font-semibold">lillyCode</span> is your ultimate destination to master coding interviews. Practice
    curated problems, level up your logic, and walk into interviews with confidence and clarity.
  </p>
</motion.div>


      {/* Problem Table or Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 w-full max-w-6xl z-10"
      >
        {problems?.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <p className="text-center text-lg font-semibold text-gray-400 border border-primary px-4 py-2 rounded-md border-dashed">
            No problems found
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;
