import React, { useMemo } from 'react';
import { useSlicerStore, NumberPosition } from '@/store/useSlicerStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Settings2,
  Type,
  RotateCcw,
  LayoutGrid,
  BoxSelect,
  Sparkles,
  Info,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
export function Controls() {
  // CRITICAL: All hook calls MUST happen at the top, before any return statements.
  const configRows = useSlicerStore((s) => s.config.rows);
  const configCols = useSlicerStore((s) => s.config.cols);
  const configPadding = useSlicerStore((s) => s.config.padding);
  const configGapX = useSlicerStore((s) => s.config.gapX);
  const configGapY = useSlicerStore((s) => s.config.gapY);
  const configShowNumbers = useSlicerStore((s) => s.config.showNumbers);
  const configNumberPosition = useSlicerStore((s) => s.config.numberPosition);
  const updateConfig = useSlicerStore((s) => s.updateConfig);
  const resetConfig = useSlicerStore((s) => s.resetConfig);
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  const rowHeights = useSlicerStore((s) => s.rowHeights);
  const colWidths = useSlicerStore((s) => s.colWidths);
  const recomputeUniformSizes = useSlicerStore((s) => s.recomputeUniformSizes);
  // Determine if proportions are custom
  const isCustom = useMemo(() => {
    if (rowHeights.length > 1 && !rowHeights.every(h => Math.abs(h - rowHeights[0]) < 0.1)) return true;
    if (colWidths.length > 1 && !colWidths.every(w => Math.abs(w - colWidths[0]) < 0.1)) return true;
    return false;
  }, [rowHeights, colWidths]);
  // Conditional rendering happens AFTER all hook calls.
  if (!imageUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 px-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/40">
          <Settings2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Studio Locked</p>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            Upload an image to unlock advanced grid configurations and precision tools.
          </p>
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
      <Accordion type="multiple" defaultValue={['grid', 'spacing', 'visuals']} className="w-full">
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
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{configRows}</span>
                </div>
                <Slider 
                  value={[configRows]} 
                  min={1} 
                  max={24} 
                  step={1} 
                  onValueChange={([val]) => updateConfig({ rows: val })} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Columns</Label>
                  <span className="text-xs font-mono bg-secondary font-bold text-secondary-foreground px-2 py-0.5 rounded border border-border">{configCols}</span>
                </div>
                <Slider 
                  value={[configCols]} 
                  min={1} 
                  max={24} 
                  step={1} 
                  onValueChange={([val]) => updateConfig({ cols: val })} 
                />
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
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outer Padding</Label>
                  <span className="text-xs font-mono font-bold">{configPadding}px</span>
                </div>
                <Slider 
                  value={[configPadding]} 
                  min={0} 
                  max={250} 
                  step={1} 
                  onValueChange={([val]) => updateConfig({ padding: val })} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Horiz. Gutters</Label>
                  <span className="text-xs font-mono font-bold">{configGapX}px</span>
                </div>
                <Slider 
                  value={[configGapX]} 
                  min={0} 
                  max={100} 
                  step={1} 
                  onValueChange={([val]) => updateConfig({ gapX: val })} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vert. Gutters</Label>
                  <span className="text-xs font-mono font-bold">{configGapY}px</span>
                </div>
                <Slider 
                  value={[configGapY]} 
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
        <AccordionItem value="visuals" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Type className="w-4 h-4 text-primary" />
              <span className="text-sm">Output Markers</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 space-y-4">
            <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="show-numbers" className="cursor-pointer text-sm font-semibold">Burn Labels</Label>
                <p className="text-[10px] text-muted-foreground">Add index numbers to export</p>
              </div>
              <Switch 
                id="show-numbers" 
                checked={configShowNumbers} 
                onCheckedChange={(checked) => updateConfig({ showNumbers: checked })} 
              />
            </div>
            <AnimatePresence>
              {configShowNumbers && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</Label>
                  </div>
                  <Select 
                    value={configNumberPosition} 
                    onValueChange={(val: NumberPosition) => updateConfig({ numberPosition: val })}
                  >
                    <SelectTrigger className="w-full bg-secondary">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">
                        <div className="flex items-center gap-2">
                          <ArrowUpLeft className="w-4 h-4" />
                          <span>Top Left</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="top-right">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Top Right</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bottom-left">
                        <div className="flex items-center gap-2">
                          <ArrowDownLeft className="w-4 h-4" />
                          <span>Bottom Left</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bottom-right">
                        <div className="flex items-center gap-2">
                          <ArrowDownRight className="w-4 h-4" />
                          <span>Bottom Right</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>
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
        <Button variant="outline" size="sm" onClick={resetConfig} className="w-full gap-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-3 h-3" />Reset All Settings
        </Button>
      </div>
    </div>
  );
}