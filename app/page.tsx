"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import 3D Canvas without Server-Side Rendering
const SkyCanvas = dynamic(() => import("./components/SkyCanvas"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#7CAADA] via-[#659BD0] to-[#5187BF] selection:bg-[#2A2B2A] selection:text-[#F1F2EB]">
      
      {/* 0. UNIFIED TACTILE SURFACE GRAIN OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none z-0" />

      {/* 3D R3F SKY ENGINE (CLOUD, GOD-RAYS, MIST, CURSOR PARALLAX) */}
      <SkyCanvas />

      {/* 1. FULL-WIDTH TOP GLASSMORPHISM NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.06)]">
        <nav className="flex w-full items-center justify-between px-8 py-5 sm:px-12 lg:px-16">
          
          {/* LOGO */}
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl tracking-tight text-white font-normal hover:opacity-80 transition-opacity drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
          >
            Renbyte
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-medium tracking-[0.25em] uppercase text-white/90">
            <Link href="#work" className="hover:text-white transition-colors">
              WORK
            </Link>
            <Link href="#capabilities" className="hover:text-white transition-colors">
              CAPABILITIES
            </Link>
            <Link href="#manifesto" className="hover:text-white transition-colors">
              MANIFESTO
            </Link>
          </div>

          {/* ACCURATE OPTICAL GLASS CAPSULE BUTTON */}
          <Link
            href="#contact"
            className="group relative inline-flex items-center justify-center rounded-full p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12),0_4px_10px_rgba(255,255,255,0.2)]"
          >
            {/* Soft Metallic Specular Rim (Reflective Edge Highlight) */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-200/40 via-white/90 to-amber-100/60 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Clear Translucent Glass Core */}
            <span className="relative flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 px-7 py-2.5 backdrop-blur-2xl transition-all duration-300 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-1.5px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              
              {/* Top Arc Specular Gloss Sheen (3D Curved Lens Reflection) */}
              <span className="absolute top-[1px] left-3 right-3 h-[45%] rounded-t-full bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />

              {/* Bottom Edge Refractive Counter-Highlight */}
              <span className="absolute bottom-[1px] left-4 right-4 h-[25%] rounded-b-full bg-gradient-to-t from-white/35 to-transparent pointer-events-none" />

              {/* Solid Black Typography Inside */}
              <span className="relative z-10 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#2A2B2A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                START A PROJECT →
              </span>
            </span>
          </Link>

        </nav>
      </header>

      {/* 2. HERO SECTION (~76% WIDTH) */}
      <div className="relative flex h-screen w-[76%] items-center justify-start px-12 sm:px-16 lg:px-24 z-10 pointer-events-none">
        
        {/* HERO AMBIENT ATMOSPHERIC LIGHTS */}
        <div className="absolute top-1/4 left-1/3 h-[420px] w-[420px] rounded-full bg-violet-400/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-[120px] pointer-events-none" />

        {/* HERO TYPOGRAPHY */}
        <div className="relative z-10 space-y-3 border-l border-white/30 pl-8 py-2 pointer-events-auto">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.15)]">
            Renbyte
          </h1>
          <p className="font-sans text-lg sm:text-2xl font-light tracking-wide text-white/90">
            Carving the new renaissance
          </p>
        </div>
      </div>

      {/* 3. SEAMLESS PROGRESSIVE SOFT LINEN GLASS SIDEBAR (~24% WIDTH) */}
      <div className="relative h-screen w-[24%] overflow-hidden bg-gradient-to-r from-[#F1F2EB]/40 via-[#F1F2EB]/75 to-[#F1F2EB]/90 backdrop-blur-3xl shadow-[-30px_0_60px_-10px_rgba(0,0,0,0.06)] z-20">
        
        {/* OPTICAL CHAMFER BEVEL (DUAL SPECULAR LIGHT RAIL) */}
        <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-white/90 via-white/20 to-white/60 pointer-events-none z-30" />
        <div className="absolute top-0 left-[1px] bottom-0 w-[1px] bg-black/5 pointer-events-none z-30" />

        {/* VOLUMETRIC LIGHT BRIDGE (CENTERED ON SEAM FOR NATURAL LIGHT BLEED) */}
        <div className="absolute top-1/2 -left-28 h-[400px] w-[400px] rounded-full bg-[#F1F2EB]/30 blur-[140px] pointer-events-none z-10" />

        {/* INNER SIDEBAR SOFT LINEN BLOOM LIGHTS */}
        <div className="absolute -top-16 -right-16 h-80 w-80 rounded-full bg-amber-100/60 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-amber-200/40 blur-[90px] pointer-events-none" />

        {/* GLASS CONTENT CONTAINER (GRAPHITE #2A2B2A TYPOGRAPHY) */}
        <div className="relative z-20 flex h-full flex-col justify-between p-8 pt-28 text-[#2A2B2A]">
          <div className="space-y-6">
            <span className="text-[9px] font-semibold tracking-[0.3em] uppercase opacity-50">
              01 / INDEX
            </span>
            <ul className="space-y-4 text-xs font-medium tracking-[0.2em] uppercase">
              <li className="hover:opacity-60 transition-opacity cursor-pointer">SELECTED WORK</li>
              <li className="hover:opacity-60 transition-opacity cursor-pointer">CAPABILITIES</li>
              <li className="hover:opacity-60 transition-opacity cursor-pointer">MANIFESTO</li>
              <li className="hover:opacity-60 transition-opacity cursor-pointer">GET IN TOUCH</li>
            </ul>
          </div>

          <div className="border-t border-[#2A2B2A]/15 pt-4 text-[9px] tracking-[0.25em] font-medium uppercase opacity-70">
            ● AVAILABLE FOR Q4 PROJECTS
          </div>
        </div>

      </div>

    </main>
  );
}