import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImageIcon, Focus } from 'lucide-react';
import { useSlicerStore } from '@/store/useSlicerStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function Workspace() {
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  const setImage = useSlicerStore((s) => s.setImage);
  const rows = useSlicerStore((s) => s.config.rows);
  const cols = useSlicerStore((s) => s.config.cols);
  const gapX = useSlicerStore((s) => s.config.gapX);
  const gapY = useSlicerStore((s) => s.config.gapY);
  const padding = useSlicerStore((s) => s.config.padding);
  const showNumbers = useSlicerStore((s) => s.config.showNumbers);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImage(url, { width: img.width, height: img.height });
      };
      img.src = url;
    }
  }, [setImage]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !!imageUrl,
  });
  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const img = entry.target.querySelector('img');
        if (img) {
          setDisplaySize({ width: img.clientWidth, height: img.clientHeight });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [imageUrl]);
  const renderOverlay = () => {
    if (!imageUrl || displaySize.width === 0) return null;
    const cells = [];
    // Scale gaps and padding to match display size vs original size
    // In preview, we simplify by just using the display pixels as "units"
    const cellWidth = (displaySize.width - 2 * padding - (cols - 1) * gapX) / cols;
    const cellHeight = (displaySize.height - 2 * padding - (rows - 1) * gapY) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const left = padding + c * (cellWidth + gapX);
        const top = padding + r * (cellHeight + gapY);
        const index = r * cols + c + 1;
        cells.push(
          <div
            key={`${r}-${c}`}
            className="absolute border border-primary/30 bg-primary/5 flex items-center justify-center pointer-events-none transition-all duration-200"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${cellWidth}px`,
              height: `${cellHeight}px`,
            }}
          >
            {showNumbers && (
              <span className="text-[10px] font-bold text-primary bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-border">
                {index.toString().padStart(2, '0')}
              </span>
            )}
          </div>
        );
      }
    }
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Discarded areas (Gaps and Padding) represented by darkened overlay */}
        <div className="absolute inset-0 bg-black/40" style={{ 
          maskImage: `linear-gradient(black, black)`,
          WebkitMaskImage: `linear-gradient(black, black)`,
          clipPath: `inset(${padding}px)` 
        }} />
        {/* Highlighted active grid area */}
        <div className="absolute inset-0 border-2 border-dashed border-primary/20 pointer-events-none" style={{ margin: `${padding}px` }} />
        {/* Grid Cells */}
        {cells}
      </div>
    );
  };
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-center min-h-[450px] rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-inner",
        isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border bg-muted/10",
        !imageUrl && "hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
      )}
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        {!imageUrl ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6 p-12 max-w-sm"
          >
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-10 h-10" />
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Slice with Precision</h2>
              <p className="text-sm text-muted-foreground">
                Drag and drop your high-res image here to start your grid project.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
              <span>PNG</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>JPG</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>WEBP</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full p-6 md:p-12 flex items-center justify-center"
          >
            <div ref={containerRef} className="relative shadow-2xl rounded-lg overflow-hidden ring-1 ring-border bg-white group">
              <img
                src={imageUrl}
                alt="Studio Preview"
                className="max-w-full max-h-[65vh] object-contain block select-none"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setDisplaySize({ width: img.clientWidth, height: img.clientHeight });
                }}
              />
              {renderOverlay()}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImage(null);
              }}
              className="absolute top-4 right-4 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20 group"
              title="Remove Image"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-[10px] font-medium uppercase tracking-wider text-muted-foreground select-none">
              <Focus className="w-3 h-3 text-primary" />
              Real-time Preview
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}