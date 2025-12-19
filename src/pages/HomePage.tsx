import React from 'react';
import { Scissors, Download, Info, RotateCcw, Loader2 } from 'lucide-react';
import { Workspace } from '@/components/slicer/Workspace';
import { Controls } from '@/components/slicer/Controls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useSlicerStore } from '@/store/useSlicerStore';
import { useExport } from '@/hooks/use-export';
import { cn } from '@/lib/utils';
export function HomePage() {
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  const isProcessing = useSlicerStore((s) => s.isProcessing);
  const setImage = useSlicerStore((s) => s.setImage);
  const resetConfig = useSlicerStore((s) => s.resetConfig);
  const { exportSlices } = useExport();
  const handleReset = () => {
    setImage(null);
    resetConfig();
  };
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">GridSlice Pro</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-medium">Advanced Slicer Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle className="relative top-0 right-0" />
            {imageUrl && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleReset}
                title="Reset Workspace"
                className="h-9 w-9"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            <Button 
              disabled={!imageUrl || isProcessing} 
              size="sm" 
              onClick={exportSlices}
              className="gap-2 shadow-primary/20 shadow-md"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Download ZIP</span>
            </Button>
          </div>
        </div>
      </header>
      {/* Main Studio */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        {/* Viewport */}
        <div className="flex-1 overflow-auto bg-muted/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 h-full flex items-center justify-center">
             <div className="w-full h-full max-w-5xl flex flex-col">
                <Workspace />
             </div>
          </div>
          {isProcessing && (
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
              <div className="bg-card p-6 rounded-2xl border shadow-2xl flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <div className="text-center">
                  <p className="font-semibold">Generating Assets</p>
                  <p className="text-sm text-muted-foreground">Slicing and bundling your image...</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Control Deck */}
        <aside className="w-full md:w-[380px] border-l bg-card overflow-y-auto shadow-2xl z-10">
          <div className="p-6 md:p-8">
            <Controls />
            {imageUrl && (
              <div className="mt-8 p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <div className="flex items-center gap-2 text-primary relative">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative">
                  Gaps represent areas that will be discarded. Use them for "Safe Zones" or to remove bleed margins from print designs.
                </p>
                <Button 
                  className="w-full mt-2 font-semibold" 
                  variant="default"
                  onClick={exportSlices}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Generate & Download"}
                </Button>
              </div>
            )}
          </div>
        </aside>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}