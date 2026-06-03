'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Course } from '@/types/dashboard';

interface DashboardViewProps {
  courses: Course[];
}

export default function DashboardView({ courses }: DashboardViewProps) {
  // Authentication
  const [userId, setUserId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Analytics' | 'Settings'>('Dashboard');

  // Animation config
  const springConfig = { type: 'spring', stiffness: 300, damping: 20 };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: springConfig }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === 'admin' && passcode === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid node signatures.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springConfig}
          className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-xl relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl mb-4">
              <Icons.Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Studio Gate</h1>
            <p className="text-xs text-zinc-400 mt-1">Enter credentials to mount database grid</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="User ID (admin)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50"
              required
            />
            <input
              type="password"
              placeholder="Passcode (1234)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50"
              required
            />
            {authError && <p className="text-xs text-red-400">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-zinc-50 font-semibold text-sm rounded-xl transition-colors"
            >
              Authenticate
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none" />

      {/* Sidebar */}
      <nav
        className={`bg-zinc-900/30 border-b md:border-b-0 md:border-r border-zinc-900 p-4 flex md:flex-col justify-between items-center transition-all duration-300 z-20 backdrop-blur-md ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <div className="flex md:flex-col gap-6 w-full items-center md:items-start">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="p-2 bg-purple-600 rounded-xl">
              <Icons.Terminal className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold tracking-tight hidden md:block">Studio.io</span>
            )}
          </div>

          <div className="hidden md:flex flex-col gap-1 w-full pt-4">
            {(['Dashboard', 'Analytics', 'Settings'] as const).map((tab) => {
              const Icon = tab === 'Dashboard' ? Icons.LayoutDashboard :
                          tab === 'Analytics' ? Icons.BarChart3 : Icons.Settings;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 text-zinc-400 hover:text-zinc-200 transition-colors w-full text-left"
                >
                  <Icon className="w-4 h-4" />
                  {!isSidebarCollapsed && tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeHighlight"
                      className="absolute inset-0 bg-purple-500/10 border-l-2 border-purple-500 rounded-xl z-[-1]"
                      transition={springConfig}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {isSidebarCollapsed ? <Icons.ChevronRight className="w-4 h-4" /> : <Icons.ChevronLeft className="w-4 h-4" />}
        </button>
      </nav>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 p-6 md:p-10 overflow-y-auto z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[150px]">
          {/* Hero */}
          <motion.section
            variants={itemVariants}
            whileHover={{ scale: 1.015 }}
            transition={springConfig}
            className="md:col-span-3 bg-gradient-to-r from-zinc-900/80 to-zinc-900/20 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm group relative"
          >
            <div>
              <h2 className="text-2xl font-black tracking-tight">Welcome back, Explorer</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Your localized infrastructure node is executing without computational overhead.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/10 px-3 py-1.5 rounded-xl w-fit">
              <Icons.Flame className="w-4 h-4" />
              <span>5 Day Learning Streak Active</span>
            </div>
          </motion.section>

          {/* Course Tiles */}
          {courses.map((course) => {
            const IconComponent = (Icons as any)[course.icon_name] || Icons.Code;

            return (
              <motion.article
                key={course.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.3)' }}
                transition={springConfig}
                className="md:col-span-1 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 group-hover:text-purple-400 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded-md">
                    {course.progress}%
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-bold text-sm tracking-tight text-zinc-200 truncate group-hover:text-zinc-50">
                    {course.title}
                  </h3>
                  <div className="w-full bg-zinc-950 h-1 rounded-full mt-3 overflow-hidden border border-zinc-900">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ ...springConfig, delay: 0.2 }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}

          {/* Activity Grid */}
          <motion.section
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="md:col-span-3 md:row-span-2 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md"
          >
            <div>
              <h3 className="font-bold text-sm tracking-tight text-zinc-200">Activity Telemetry</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Hardware-accelerated contribution tracking grid</p>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5 my-4">
              {Array.from({ length: 84 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm border border-zinc-950/40 ${
                    i % 7 === 0 ? 'bg-purple-500/40' : i % 5 === 0 ? 'bg-purple-500/20' : 'bg-zinc-900'
                  }`}
                />
              ))}
            </div>

            <div className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Icons.Cpu className="w-3 h-3 text-emerald-400" /> Layer repaints: 0ms (GPU Rendered)
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}