import React from 'react';
import { Scissors, Download, Info } from 'lucide-react';
import { Workspace } from '@/components/slicer/Workspace';
import { Controls } from '@/components/slicer/Controls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useSlicerStore } from '@/store/useSlicerStore';
export function HomePage() {
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">GridSlice Pro</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Advanced Slicer Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="relative top-0 right-0" />
            <Button disabled={!imageUrl} size="sm" className="hidden sm:flex gap-2">
              <Download className="w-4 h-4" />
              Download ZIP
            </Button>
          </div>
        </div>
      </header>
      {/* Main Studio */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        {/* Viewport */}
        <div className="flex-1 overflow-auto bg-muted/20 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full h-full max-w-5xl flex flex-col">
             <Workspace />
          </div>
        </div>
        {/* Control Deck */}
        <aside className="w-full md:w-[350px] border-l bg-card overflow-y-auto">
          <div className="p-6">
            <Controls />
            {imageUrl && (
              <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-semibold">Pro Tip</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Adjust gaps to handle "Safe Zones" or margins. The dimmed areas in the preview represent image data that will be discarded.
                </p>
                <Button className="w-full mt-2" variant="default">
                  Generate Slices
                </Button>
              </div>
            )}
          </div>
        </aside>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
}