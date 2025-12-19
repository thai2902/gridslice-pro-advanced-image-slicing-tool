import React from 'react';
import { useSlicerStore } from '@/store/useSlicerStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings2, Type, RotateCcw, LayoutGrid, BoxSelect, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function Controls() {
  const config = useSlicerStore((s) => s.config);
  const updateConfig = useSlicerStore((s) => s.updateConfig);
  const resetConfig = useSlicerStore((s) => s.resetConfig);
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  const rowHeights = useSlicerStore((s) => s.rowHeights);
  const colWidths = useSlicerStore((s) => s.colWidths);
  const recomputeUniformSizes = useSlicerStore((s) => s.recomputeUniformSizes);
  // Determine if proportions are custom
  const isCustom = React.useMemo(() => {
    if (rowHeights.length > 1 && !rowHeights.every(h => Math.abs(h - rowHeights[0]) < 0.1)) return true;
    if (colWidths.length > 1 && !colWidths.every(w => Math.abs(w - colWidths[0]) < 0.1)) return true;
    return false;
  }, [rowHeights, colWidths]);
  if (!imageUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 px-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/40"><Settings2 className="w-6 h-6" /></div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Studio Locked</p>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">Upload an image to unlock advanced grid configurations and precision tools.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Studio Controls</h2>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          Fine-tune your slicing parameters.
          {isCustom && <span className="flex items-center gap-1 text-primary font-bold"><Sparkles className="w-3 h-3" /> Custom Mode</span>}
        </p>
      </div>
      <Accordion type="multiple" defaultValue={['grid', 'spacing']} className="w-full">
        <AccordionItem value="grid" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3">
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
                <Slider value={[config.rows]} min={1} max={24} step={1} onValueChange={([val]) => updateConfig({ rows: val })} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Columns</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{config.cols}</span>
                </div>
                <Slider value={[config.cols]} min={1} max={24} step={1} onValueChange={([val]) => updateConfig({ cols: val })} />
              </div>
              {isCustom && (
                <Button variant="secondary" size="sm" className="w-full gap-2 text-[10px] font-bold uppercase" onClick={recomputeUniformSizes}>
                  <RotateCcw className="w-3 h-3" /> Reset Proportions
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <Separator className="opacity-50" />
        <AccordionItem value="spacing" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <BoxSelect className="w-4 h-4 text-primary" />
              <span className="text-sm">Gaps & Offsets</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center"><Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outer Padding</Label><span className="text-xs font-mono font-bold">{config.padding}px</span></div>
                <Slider value={[config.padding]} min={0} max={250} step={1} onValueChange={([val]) => updateConfig({ padding: val })} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Horiz. Gutters</Label><span className="text-xs font-mono font-bold">{config.gapX}px</span></div>
                <Slider value={[config.gapX]} min={0} max={100} step={1} onValueChange={([val]) => updateConfig({ gapX: val })} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vert. Gutters</Label><span className="text-xs font-mono font-bold">{config.gapY}px</span></div>
                <Slider value={[config.gapY]} min={0} max={100} step={1} onValueChange={([val]) => updateConfig({ gapY: val })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <Separator className="opacity-50" />
        <AccordionItem value="visuals" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3">
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
              <Switch id="show-numbers" checked={config.showNumbers} onCheckedChange={(checked) => updateConfig({ showNumbers: checked })} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-tight">
          <strong>Tip:</strong> You can drag the lines directly in the preview workspace to create custom-sized slices.
        </p>
      </div>
      <div className="pt-4">
        <Button variant="outline" size="sm" onClick={resetConfig} className="w-full gap-2 text-muted-foreground hover:text-foreground"><RotateCcw className="w-3 h-3" />Reset All Settings</Button>
      </div>
    </div>
  );
}