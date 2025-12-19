import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useSlicerStore } from '@/store/useSlicerStore';
import { cn } from '@/lib/utils';
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
            className="absolute border border-primary/40 bg-primary/5 flex items-center justify-center pointer-events-none transition-all duration-200"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${cellWidth}px`,
              height: `${cellHeight}px`,
            }}
          >
            {showNumbers && (
              <span className="text-2xs font-bold text-primary bg-background/80 px-1 rounded shadow-sm">
                {index.toString().padStart(2, '0')}
              </span>
            )}
          </div>
        );
      }
    }
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Padding Overlays */}
        <div className="absolute inset-0 bg-black/20" style={{ padding: `${padding}px` }}>
          <div className="w-full h-full bg-transparent border border-dashed border-white/40" />
        </div>
        {/* Grid Cells */}
        {cells}
      </div>
    );
  };
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-center min-h-[400px] bg-muted/30 rounded-xl border-2 border-dashed transition-colors overflow-hidden",
        isDragActive ? "border-primary bg-primary/5" : "border-border",
        !imageUrl && "hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
      )}
    >
      <input {...getInputProps()} />
      {!imageUrl ? (
        <div className="text-center space-y-4 p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-medium">Click or drag image to slice</p>
            <p className="text-sm text-muted-foreground">Supports PNG, JPG, WEBP</p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="relative max-w-full max-h-full p-8 flex items-center justify-center">
          <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-[70vh] object-contain block"
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
            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-transform z-10"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}