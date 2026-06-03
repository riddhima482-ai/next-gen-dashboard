import { supabase } from '@/utils/supabase';
import * as Icons from 'lucide-react';

export default async function DashboardPage() {
  // Fetch real-time courses from Supabase
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*');

  if (error || !courses) {
    return (
      <main className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center">
        <p>Error connecting to dashboard database. Check credentials.</p>
      </main>
    );
  }

  // Calculate quick analytics from our live database data
  const totalCourses = courses.length;
  const avgProgress = Math.round(
    courses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalCourses
  );
  const completedCourses = courses.filter(c => c.progress === 100).length;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-medium text-sm tracking-wider uppercase mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync Engaged
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400">
            Learning Studio
          </h1>
        </div>
        <div className="text-sm px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 flex items-center gap-2 w-fit">
          <Icons.Database className="w-4 h-4 text-emerald-400" />
          Connected to Supabase Cloud
        </div>
      </header>

      {/* THE BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[140px]">
        
        {/* CARD 1: OVERVIEW STAT (Small Bento Box) */}
        <div className="md:col-span-1 p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl flex flex-col justify-between backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium text-sm">Active Tracks</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <Icons.BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold tracking-tight">{totalCourses}</span>
            <p className="text-xs text-zinc-500 mt-1">Courses loaded dynamically</p>
          </div>
        </div>

        {/* CARD 2: PROGRESS STAT (Small Bento Box) */}
        <div className="md:col-span-1 p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl flex flex-col justify-between backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium text-sm">Average Progress</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <Icons.Percent className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold tracking-tight">{avgProgress}%</span>
            <p className="text-xs text-zinc-500 mt-1">Across all certification tracks</p>
          </div>
        </div>

        {/* CARD 3: COMPLETIONS (Small Bento Box) */}
        <div className="md:col-span-1 p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl flex flex-col justify-between backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium text-sm">Certificates Earned</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Icons.Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold tracking-tight">{completedCourses}</span>
            <p className="text-xs text-zinc-500 mt-1">Completed at 100% progress</p>
          </div>
        </div>

        {/* CARD 4: THE BIG WORKSPACE (Large Bento Box) */}
        <div className="md:col-span-2 md:row-span-3 p-8 bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-zinc-800/80 rounded-3xl flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full" />
          
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Course Matrix</h2>
            <p className="text-sm text-zinc-400 mt-1">Live tracking database matrix</p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[280px] pr-2">
            {courses.map((course) => {
              // Dynamically resolve lucide icons based on a fallback matching engine
              const IconComponent = (Icons as any)[course.icon] || Icons.Code2;

              return (
                <div 
                  key={course.id} 
                  className="p-4 bg-zinc-950/60 border border-zinc-800/60 rounded-2xl flex items-center justify-between gap-4 hover:border-zinc-700/60 transition-all duration-300 group/item"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 group-hover/item:text-purple-400 group-hover/item:border-purple-500/30 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm md:text-base truncate text-zinc-200">
                      {course.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-24 md:w-32 bg-zinc-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs md:text-sm font-bold text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2.5 py-1 rounded-md">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 5: RECENT UPDATES (Medium Side Bento Box) */}
        <div className="md:col-span-1 md:row-span-2 p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl flex flex-col justify-between backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-base tracking-tight mb-3">System Insights</h3>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <Icons.CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Next.js application listening on local port <code className="text-zinc-200">3000</code>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Icons.CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Tailwind UI engine initialized with compiled theme configurations.</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-800/60 text-xs text-zinc-500 flex items-center gap-1.5">
            <Icons.Clock className="w-3.5 h-3.5" />
            Last checked: Just now
          </div>
        </div>

        {/* CARD 6: QUICK LINKS (Small Corner Bento Box) */}
        <div className="md:col-span-1 p-6 bg-gradient-to-br from-purple-900/20 via-zinc-900/60 to-zinc-900/60 border border-zinc-800/80 rounded-3xl flex items-center justify-between group/link cursor-pointer hover:border-purple-500/30 transition-all">
          <div className="min-w-0">
            <span className="text-zinc-400 text-xs font-medium block">Studio Terminal</span>
            <span className="text-sm font-bold text-zinc-200 group-hover/link:text-purple-300 transition-colors">
              Open Supabase SQL
            </span>
          </div>
          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl text-zinc-400 group-hover/link:text-purple-400 group-hover/link:border-purple-500/30 transition-all">
            <Icons.ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

      </div>
    </main>
  );
}