'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import * as Icons from 'lucide-react';

export default function DashboardPage() {
  // Authentication states
  const [userId, setUserId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Database states
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  // Hardcoded default credentials
  const DEFAULT_USER_ID = 'admin';
  const DEFAULT_PASSCODE = '1234';

  // Fetch data only after successful login
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      try {
        const { data, error } = await supabase.from('courses').select('*');
        if (error || !data) {
          setDbError(true);
        } else {
          setCourses(data);
        }
      } catch (err) {
        setDbError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated]);

  // Handle the login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === DEFAULT_USER_ID && passcode === DEFAULT_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Access Denied.');
    }
  };

  // --- RENDERING THE LOGIN LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 font-sans antialiased relative overflow-hidden">
        {/* Background mesh highlights */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl mb-4 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Icons.Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-100">Studio Terminal Lock</h1>
            <p className="text-xs text-zinc-400 mt-1.5">Enter credentials to establish database handshake</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">User Identifier</label>
              <div className="relative">
                <Icons.User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Security Passcode</label>
              <div className="relative">
                <Icons.KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 tracking-widest placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400 font-medium animate-shake">
                <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-zinc-50 font-semibold text-sm rounded-xl transition-colors shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_4px_25px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 mt-2"
            >
              Authenticate Node
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- RENDERING THE LOADING LAUNCHPAD SCREEN ---
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
        <Icons.RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
        <p className="text-xs tracking-widest uppercase text-zinc-400 font-semibold">Syncing Cloud Matrix...</p>
      </main>
    );
  }

  // --- RENDERING DATABASE EXCEPTION ---
  if (dbError) {
    return (
      <main className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center p-6">
        <p className="font-medium text-sm">Error connecting to dashboard database. Check system configurations.</p>
      </main>
    );
  }

  // Calculate statistics from the database
  const totalCourses = courses.length;
  const avgProgress = totalCourses > 0 
    ? Math.round(courses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalCourses) 
    : 0;
  const completedCourses = courses.filter(c => c.progress === 100).length;

  // --- RENDERING THE FULL-SCALE METRIC BENTO GRID ---
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Structural system architecture background coordinates */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* PREMIUM METRIC HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs tracking-widest uppercase mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Live Sync Infrastructure Engine
            </div>
            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
              Learning Studio
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full text-zinc-300 flex items-center gap-2 backdrop-blur-md">
              <Icons.Cpu className="w-4 h-4 text-emerald-400" />
              Operational • Secure Cloud Mesh
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="p-2 bg-zinc-900/80 border border-zinc-800 hover:border-red-500/30 hover:text-red-400 rounded-full text-zinc-400 transition-all backdrop-blur-md"
              title="Lock Terminal"
            >
              <Icons.LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BENTO GRID WORKSPACE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[140px]">
          
          {/* TRACKS PANEL */}
          <div className="md:col-span-1 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md hover:border-zinc-700/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-semibold text-xs tracking-wider uppercase">Active Tracks</span>
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/10">
                <Icons.Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight">{totalCourses}</span>
              <p className="text-xs text-zinc-500 mt-1">Data clusters mapped dynamically</p>
            </div>
          </div>

          {/* MEAN PROGRESS PANEL */}
          <div className="md:col-span-1 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md hover:border-zinc-700/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-semibold text-xs tracking-wider uppercase">Global Progress</span>
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/10">
                <Icons.Compass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight">{avgProgress}%</span>
              <p className="text-xs text-zinc-500 mt-1">Mean system execution index</p>
            </div>
          </div>

          {/* MILESTONES INTEGRITY PANEL */}
          <div className="md:col-span-1 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md hover:border-zinc-700/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-semibold text-xs tracking-wider uppercase">Milestones Hit</span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/10">
                <Icons.ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight">{completedCourses}</span>
              <p className="text-xs text-zinc-500 mt-1">Modules at 100% deployment integrity</p>
            </div>
          </div>

          {/* LARGE WORKSPACE: CORE COURSE INDEX */}
          <div className="md:col-span-2 md:row-span-3 p-8 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 border border-zinc-800/60 rounded-3xl flex flex-col justify-between overflow-hidden relative backdrop-blur-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">Course Index Matrix</h2>
              <p className="text-xs text-zinc-400 mt-1">Internal telemetry and core metrics data feed</p>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[290px] pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {courses.map((course) => {
                const IconComponent = (Icons as any)[course.icon] || Icons.Terminal;

                return (
                  <div 
                    key={course.id} 
                    className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex items-center justify-between gap-4 hover:border-zinc-700/40 hover:bg-zinc-900/20 transition-all duration-300 group/item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 group-hover/item:text-purple-400 group-hover/item:border-purple-500/20 transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm truncate text-zinc-300 group-hover/item:text-zinc-100 transition-colors">
                        {course.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-24 md:w-32 bg-zinc-900 h-1 rounded-full overflow-hidden hidden sm:block border border-zinc-800/40">
                        <div 
                          className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/10 px-2.5 py-1 rounded-lg">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VAIB215 STYLE INSPIRED: LIVE REAL-TIME LOG FEED PANEL */}
          <div className="md:col-span-1 md:row-span-3 p-6 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 border border-zinc-800/60 rounded-3xl flex flex-col justify-between backdrop-blur-md">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-zinc-200">Live Transaction Logs</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Real-time terminal node logs</p>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </div>
              
              <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[320px] text-xs pr-1">
                <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-start gap-2.5">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md mt-0.5">
                    <Icons.RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-300">Database Core</span>
                      <span className="text-[10px] px-1 bg-zinc-800 text-zinc-400 rounded">GET</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Successfully pulled rows safely into web client bundle.</p>
                    <span className="text-[9px] text-zinc-600 block mt-1">Just now</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-start gap-2.5">
                  <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-md mt-0.5">
                    <Icons.Check className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-300">Theme Engine</span>
                      <span className="text-[10px] px-1 bg-purple-950/40 text-purple-400 rounded">v4.0</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Tailwind UI UX mesh rendered without structural style blockades.</p>
                    <span className="text-[9px] text-zinc-600 block mt-1">3m ago</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-start gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md mt-0.5">
                    <Icons.Smartphone className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-300">External Node</span>
                      <span className="text-[10px] px-1 bg-zinc-800 text-zinc-400 rounded">AUTH</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Device secure signature parsed. Interface locked behind local gateway wrapper.</p>
                    <span className="text-[9px] text-zinc-600 block mt-1">Just now</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-zinc-800/60 text-[11px] text-zinc-500 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icons.Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>Streaming live logs...</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-600">Secure TLS</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}