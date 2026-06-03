import { supabase } from '@/utils/supabase';
import * as Icons from 'lucide-react';
import * as motion from 'framer-motion/client'; 

interface Course {
  id: string;
  title: string;
  progress: number;
  icon: string; 
  created_at: string;
}

export const revalidate = 0;

export default async function Page() {
  // Pull entries straight from your server database
  const { data: fetchResults, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !fetchResults) {
    return (
      <main className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center font-mono text-xs">
        [!] CRITICAL ENGINE EXCEPTION: Could not mount server database clusters.
      </main>
    );
  }

  const courses = fetchResults as Course[];
  const springPhysics = { type: 'spring', stiffness: 300, damping: 20 };

  return (
    // Fixed container framework prevents the main grid from pushing the navigation menu out
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* 1. STRUCTURAL NAVIGATION SIDEBAR (Stays firmly fixed on the left on desktop screens) */}
      <nav className="w-full md:w-64 bg-zinc-900/40 border-b md:border-b-0 md:border-r border-zinc-800/60 p-5 flex md:flex-col justify-between items-center md:items-start backdrop-blur-md z-20 shrink-0">
        <div className="flex md:flex-col gap-8 w-full items-center md:items-start">
          {/* Main Workspace Brand Identification */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Icons.Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tight text-sm uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Studio Core
            </span>
          </div>
          
          {/* Dashboard Navigation Items */}
          <div className="hidden md:flex flex-col gap-1.5 w-full">
            <div className="px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-1">
              Navigation
            </div>
            <div className="px-4 py-3 text-sm font-semibold rounded-xl flex items-center gap-3 bg-purple-500/10 border-l-2 border-purple-500 text-purple-300 transition-all">
              <Icons.LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <div className="px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-all cursor-pointer">
              <Icons.BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </div>
            <div className="px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-all cursor-pointer">
              <Icons.Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Base Telemetry Tag */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-600 font-mono border-t border-zinc-900/60 pt-4 w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>NODE // ONLINE</span>
        </div>
      </nav>

      {/* 2. DYNAMIC BENTO WORKSPACE LAYOUT CONTAINER */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[150px]">
          
          {/* HERO GREETING TILE */}
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPhysics}
            whileHover={{ scale: 1.01 }}
            className="md:col-span-3 bg-gradient-to-r from-zinc-900/60 via-zinc-900/30 to-transparent border border-zinc-800/60 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm relative group"
          >
            <div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-100">
                Welcome back, Explorer
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Your hardware-accelerated educational environment is streaming data feeds with zero layout repaints.</p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/10 px-3 py-1.5 rounded-xl w-fit">
              <Icons.Flame className="w-4 h-4 fill-amber-500/20 animate-pulse" />
              <span>5 Day Streak Active</span>
            </div>
          </motion.section>

          {/* DYNAMIC COURSE CARDS (Staggered Animation Modules) */}
          {courses.map((course) => {
            const IconComponent = (Icons as any)[course.icon] || Icons.Code;

            return (
              <motion.article 
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springPhysics}
                whileHover={{ scale: 1.02, borderColor: 'rgba(168,85,247,0.3)' }}
                className="md:col-span-1 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 group-hover:text-purple-400 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2.5 py-0.5 rounded-lg">
                    {course.progress}%
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-bold text-sm tracking-tight text-zinc-200 truncate group-hover:text-zinc-50">
                    {course.title}
                  </h3>
                  
                  {/* Smooth, spring-animated progress metrics */}
                  <div className="w-full bg-zinc-950 h-1 rounded-full mt-3 overflow-hidden border border-zinc-900">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ ...springPhysics, delay: 0.15 }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}

          {/* TELEMETRY CONTRIBUTION MATRIX GRID */}
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPhysics}
            whileHover={{ scale: 1.01 }}
            className="md:col-span-3 md:row-span-2 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md"
          >
            <div>
              <h3 className="font-bold text-sm tracking-tight text-zinc-200">Activity Telemetry</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Hardware-accelerated layout contribution matrix</p>
            </div>
            
            <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5 my-4">
              {Array.from({ length: 84 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`asymmetrical-box aspect-square rounded-sm border border-zinc-950/40 transition-colors duration-300 ${
                    i % 7 === 0 ? 'bg-purple-500/40 hover:bg-purple-400' : i % 5 === 0 ? 'bg-purple-500/20 hover:bg-purple-400' : 'bg-zinc-900 hover:bg-zinc-800'
                  }`} 
                />
              ))}
            </div>
            
            <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
              <Icons.Cpu className="w-3 h-3 text-emerald-400 animate-pulse" /> 
              <span>GPU Composited Layer Repaints: 0ms (Layout Stable)</span>
            </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}