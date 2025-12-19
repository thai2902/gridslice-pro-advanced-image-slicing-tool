import React from 'react';
import { useSlicerStore } from '@/store/useSlicerStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3X3, Maximize, MousePointer2, Type } from 'lucide-react';
export function Controls() {
  const config = useSlicerStore((s) => s.config);
  const updateConfig = useSlicerStore((s) => s.updateConfig);
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  if (!imageUrl) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="pt-6 text-center space-y-2">
          <MousePointer2 className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">Upload an image to reveal controls</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Grid3X3 className="w-4 h-4" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Grid Layout</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Rows</Label>
              <span className="text-xs font-mono bg-secondary px-1.5 rounded">{config.rows}</span>
            </div>
            <Slider
              value={[config.rows]}
              min={1}
              max={12}
              step={1}
              onValueChange={([val]) => updateConfig({ rows: val })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Columns</Label>
              <span className="text-xs font-mono bg-secondary px-1.5 rounded">{config.cols}</span>
            </div>
            <Slider
              value={[config.cols]}
              min={1}
              max={12}
              step={1}
              onValueChange={([val]) => updateConfig({ cols: val })}
            />
          </div>
        </div>
      </section>
      <Separator />
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Maximize className="w-4 h-4" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Spacing (px)</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Global Padding</Label>
              <span className="text-xs font-mono bg-secondary px-1.5 rounded">{config.padding}px</span>
            </div>
            <Slider
              value={[config.padding]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => updateConfig({ padding: val })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Horizontal Gap</Label>
              <span className="text-xs font-mono bg-secondary px-1.5 rounded">{config.gapX}px</span>
            </div>
            <Slider
              value={[config.gapX]}
              min={0}
              max={50}
              step={1}
              onValueChange={([val]) => updateConfig({ gapX: val })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Vertical Gap</Label>
              <span className="text-xs font-mono bg-secondary px-1.5 rounded">{config.gapY}px</span>
            </div>
            <Slider
              value={[config.gapY]}
              min={0}
              max={50}
              step={1}
              onValueChange={([val]) => updateConfig({ gapY: val })}
            />
          </div>
        </div>
      </section>
      <Separator />
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Type className="w-4 h-4" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Visuals</h3>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-numbers" className="cursor-pointer">Show Grid Numbers</Label>
          <Switch
            id="show-numbers"
            checked={config.showNumbers}
            onCheckedChange={(val) => updateConfig({ showNumbers: val })}
          />
        </div>
      </section>
    </div>
  );
}