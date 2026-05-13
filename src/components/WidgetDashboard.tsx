import React from 'react';
import { motion } from 'motion/react';
import { X, LayoutGrid, Sparkles, Plus, Pin, PinOff, Info } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import VinylWidget from './widgets/VinylWidget';
import DotMatrixWidget from './widgets/DotMatrixWidget';
import CassetteWidget from './widgets/CassetteWidget';
import NothingStatusWidget from './widgets/NothingStatusWidget';
import CDWidget from './widgets/CDWidget';

interface WidgetDashboardProps {
  onClose: () => void;
}

export default function WidgetDashboard({ onClose }: WidgetDashboardProps) {
  const { pinnedWidgetIds, togglePinnedWidget } = usePlayerStore();

  const WidgetWrapper = ({ children, id, label }: { children: React.ReactNode, id: string, label: string }) => {
    const isPinned = pinnedWidgetIds.includes(id);
    return (
      <div className="relative group">
        {children}
        <button 
          onClick={() => togglePinnedWidget(id)}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border transition-all ${isPinned ? 'bg-nothing-red border-nothing-red text-white' : 'bg-black/40 border-white/10 text-white/40 opacity-0 group-hover:opacity-100 uppercase'}`}
          title={isPinned ? "Unpin from Deck" : "Pin to Deck"}
        >
          {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
        </button>
        <div className="absolute bottom-4 left-4 dot-matrix text-[7px] opacity-0 group-hover:opacity-40 pointer-events-none uppercase">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-3xl overflow-y-auto nothing-scroll">
      <div className="min-h-full flex flex-col pt-safe px-6">
        {/* Header */}
      <header className="h-20 lg:h-32 flex items-center justify-between shrink-0 mb-8 border-b border-white/5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <LayoutGrid className="w-5 h-5 text-nothing-red" />
             <h1 className="dot-matrix text-2xl lg:text-4xl tracking-[0.2em] font-bold uppercase">Widget_Dashboard</h1>
          </div>
          <p className="text-[10px] font-mono opacity-20 uppercase tracking-[0.4em]">Interactive Control Modules</p>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group"
        >
          <X className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
      </header>

      {/* Info Notice about Home Screen Widgets */}
      <div className="mb-12 p-6 bg-nothing-red/5 border border-nothing-red/10 rounded-[24px] flex items-start gap-5">
         <Info className="w-5 h-5 text-nothing-red shrink-0 mt-1" />
         <div className="space-y-3">
            <h3 className="dot-matrix text-[11px] font-bold text-nothing-red tracking-widest uppercase">System_Note: Home_Screen_Widgets</h3>
            <p className="text-[10px] font-mono opacity-60 leading-relaxed uppercase max-w-2xl">
               Due to browser limitations, these widgets live inside the MiniLam ecosystem. 
               For a Home Screen experience, use "Add to Home Screen" in your browser menu. 
               Native Android/iOS home screen widgets are currently in prototype phase for future standalone builds.
            </p>
         </div>
      </div>

      {/* Grid Layouts */}
      <div className="flex-1 pb-32 space-y-16">
        {/* Core System Widgets */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 opacity-40">
              <Sparkles className="w-4 h-4" />
              <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">System_Interfaces</span>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <WidgetWrapper id="nothingstatus" label="Status Module">
                <NothingStatusWidget />
              </WidgetWrapper>
              <WidgetWrapper id="vinyl_med" label="Vinyl Deck">
                <VinylWidget size="medium" reduced={true} />
              </WidgetWrapper>
              <WidgetWrapper id="dotmatrix_med" label="Matrix Vis">
                <DotMatrixWidget size="medium" reduced={true} />
              </WidgetWrapper>
           </div>
        </section>

        {/* Small Collectibles */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 opacity-40">
              <Plus className="w-4 h-4" />
              <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Mini_Modules_2x2</span>
           </div>
           
           <div className="flex flex-wrap gap-8">
              <WidgetWrapper id="vinyl_sm" label="Vinyl Mini">
                <VinylWidget size="small" reduced={true} />
              </WidgetWrapper>
              <WidgetWrapper id="dotmatrix_sm" label="Matrix Mini">
                <DotMatrixWidget size="small" reduced={true} />
              </WidgetWrapper>
              <WidgetWrapper id="cassette_sm" label="Tape Mini">
                <CassetteWidget size="small" reduced={true} />
              </WidgetWrapper>
              <WidgetWrapper id="cd_sm" label="CD Mini">
                <CDWidget size="small" reduced={true} />
              </WidgetWrapper>
              {/* Empty slot placeholder */}
              <div className="w-40 h-40 rounded-[24px] border border-white/5 border-dashed flex flex-col items-center justify-center gap-2 opacity-20 hover:opacity-40 transition-opacity cursor-pointer">
                 <Plus className="w-4 h-4" />
                 <span className="dot-matrix text-[6px] tracking-widest">ADD_MODULE</span>
              </div>
           </div>
        </section>

        {/* Large Experimental Units */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 opacity-40">
              <Sparkles className="w-4 h-4" />
              <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Hardware_Pro_4x4</span>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col gap-4">
                 <WidgetWrapper id="vinyl_lg" label="Master Deck">
                   <VinylWidget size="large" />
                 </WidgetWrapper>
                 <p className="text-[8px] font-mono opacity-20 uppercase tracking-[0.2em] px-4">Pro_Vinyl_Deck_System // Mechanical_Simulation_v1</p>
              </div>
              <div className="flex flex-col gap-4">
                 <WidgetWrapper id="cassette_med" label="Deck Module">
                   <CassetteWidget size="medium" />
                 </WidgetWrapper>
                 <div className="w-full h-40 bg-white/[0.02] border border-white/5 rounded-[24px] p-6 flex flex-col justify-center">
                    <span className="dot-matrix text-[12px] text-nothing-red mb-2 uppercase">Ambient_Override</span>
                    <p className="text-[9px] font-mono opacity-30 leading-relaxed uppercase">
                       Quick switch for rain, night drive, and focus modes.<br />
                       Integrated into widget core.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* Footer Branding */}
      <footer className="h-20 shrink-0 border-t border-white/5 flex items-center justify-center gap-4 opacity-20 pointer-events-none">
         <span className="dot-matrix text-[8px] tracking-[0.5em] uppercase">Minilam // Laboratory // System_Widgets</span>
         <div className="w-1 h-1 rounded-full bg-nothing-red" />
      </footer>
      </div>
    </div>
  );
}
