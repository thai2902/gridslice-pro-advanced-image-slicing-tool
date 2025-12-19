import React from 'react';
import { useSlicerStore } from '@/store/useSlicerStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Grid3X3, 
  Maximize, 
  Settings2, 
  Type, 
  RotateCcw,
  LayoutGrid,
  BoxSelect
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
export function Controls() {
  const config = useSlicerStore((s) => s.config);
  const updateConfig = useSlicerStore((s) => s.updateConfig);
  const resetConfig = useSlicerStore((s) => s.resetConfig);
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  if (!imageUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 px-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/40">
          <Settings2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Studio Locked</p>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            Upload an image to unlock advanced grid configurations and export settings.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Studio Controls</h2>
        <p className="text-xs text-muted-foreground">Fine-tune your slicing parameters.</p>
      </div>
      <Accordion type="multiple" defaultValue={['grid', 'spacing']} className="w-full">
        {/* Grid Layout Section */}
        <AccordionItem value="grid" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3 group">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <span className="text-sm">Grid Structure</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rows</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{config.rows}</span>
                </div>
                <Slider
                  value={[config.rows]}
                  min={1}
                  max={24}
                  step={1}
                  onValueChange={([val]) => updateConfig({ rows: val })}
                  className="py-2"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Columns</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{config.cols}</span>
                </div>
                <Slider
                  value={[config.cols]}
                  min={1}
                  max={24}
                  step={1}
                  onValueChange={([val]) => updateConfig({ cols: val })}
                  className="py-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <Separator className="opacity-50" />
        {/* Spacing Section */}
        <AccordionItem value="spacing" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3 group">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <BoxSelect className="w-4 h-4 text-primary" />
              <span className="text-sm">Gaps & Offsets</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outer Padding</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{config.padding}px</span>
                </div>
                <Slider
                  value={[config.padding]}
                  min={0}
                  max={250}
                  step={1}
                  onValueChange={([val]) => updateConfig({ padding: val })}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Horiz. Gutters</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{config.gapX}px</span>
                </div>
                <Slider
                  value={[config.gapX]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([val]) => updateConfig({ gapX: val })}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vert. Gutters</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{config.gapY}px</span>
                </div>
                <Slider
                  value={[config.gapY]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([val]) => updateConfig({ gapY: val })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <Separator className="opacity-50" />
        {/* Visual Options */}
        <AccordionItem value="visuals" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3 group">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Type className="w-4 h-4 text-primary" />
              <span className="text-sm">Output Markers</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="show-numbers" className="cursor-pointer text-sm font-semibold">Burn Labels</Label>
                <p className="text-[10px] text-muted-foreground">Add index numbers to export</p>
              </div>
              <Switch
                id="show-numbers"
                checked={config.showNumbers}
                onValueChange={(val) => updateConfig({ showNumbers: val })}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetConfig}
          className="w-full gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to Factory Defaults
        </Button>
      </div>
    </div>
  );
}