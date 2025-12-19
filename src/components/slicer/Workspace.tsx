import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Focus, MoveHorizontal, MoveVertical } from 'lucide-react';
import { useSlicerStore, NumberPosition } from '@/store/useSlicerStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function Workspace() {
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  const setImage = useSlicerStore((s) => s.setImage);
  const imageDimensions = useSlicerStore((s) => s.imageDimensions);
  const rows = useSlicerStore((s) => s.config.rows);
  const cols = useSlicerStore((s) => s.config.cols);
  const gapX = useSlicerStore((s) => s.config.gapX);
  const gapY = useSlicerStore((s) => s.config.gapY);
  const padding = useSlicerStore((s) => s.config.padding);
  const showNumbers = useSlicerStore((s) => s.config.showNumbers);
  const numberPosition = useSlicerStore((s) => s.config.numberPosition);
  const colWidths = useSlicerStore((s) => s.colWidths);
  const rowHeights = useSlicerStore((s) => s.rowHeights);
  const setColWidth = useSlicerStore((s) => s.setColWidth);
  const setRowHeight = useSlicerStore((s) => s.setRowHeight);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState<{ type: 'col' | 'row'; index: number } | null>(null);
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
    const updateSize = () => {
      const img = containerRef.current?.querySelector('img');
      if (img) setDisplaySize({ width: img.clientWidth, height: img.clientHeight });
    };
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();
    return () => observer.disconnect();
  }, [imageUrl]);
  const handleMouseDown = (e: React.MouseEvent, type: 'col' | 'row', index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing({ type, index });
    document.body.style.cursor = type === 'col' ? 'col-resize' : 'row-resize';
  };
  useEffect(() => {
    if (!isResizing || !imageDimensions || displaySize.width === 0) return;
    const scaleX = imageDimensions.width / displaySize.width;
    const scaleY = imageDimensions.height / displaySize.height;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (isResizing.type === 'col') {
        const mouseX = (e.clientX - rect.left) * scaleX;
        let prevSum = padding;
        for (let i = 0; i < isResizing.index; i++) {
          prevSum += colWidths[i] + gapX;
        }
        const currentW = colWidths[isResizing.index];
        const nextW = colWidths[isResizing.index + 1];
        const delta = mouseX - (prevSum + currentW);
        if (currentW + delta > 5 && nextW - delta > 5) {
          setColWidth(isResizing.index, currentW + delta);
          setColWidth(isResizing.index + 1, nextW - delta);
        }
      } else {
        const mouseY = (e.clientY - rect.top) * scaleY;
        let prevSum = padding;
        for (let i = 0; i < isResizing.index; i++) {
          prevSum += rowHeights[i] + gapY;
        }
        const currentH = rowHeights[isResizing.index];
        const nextH = rowHeights[isResizing.index + 1];
        const delta = mouseY - (prevSum + currentH);
        if (currentH + delta > 5 && nextH - delta > 5) {
          setRowHeight(isResizing.index, currentH + delta);
          setRowHeight(isResizing.index + 1, nextH - delta);
        }
      }
    };
    const handleMouseUp = () => {
      setIsResizing(null);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, colWidths, rowHeights, imageDimensions, displaySize, padding, gapX, gapY, setColWidth, setRowHeight]);
  const getBadgePositionClasses = (pos: NumberPosition) => {
    switch (pos) {
      case 'top-left': return 'top-1 left-1';
      case 'top-right': return 'top-1 right-1';
      case 'bottom-left': return 'bottom-1 left-1';
      case 'bottom-right': return 'bottom-1 right-1';
      default: return 'top-1 left-1';
    }
  };
  const renderOverlay = () => {
    if (!imageUrl || displaySize.width === 0 || !imageDimensions) return null;
    const scaleX = displaySize.width / imageDimensions.width;
    const scaleY = displaySize.height / imageDimensions.height;
    const pX = padding * scaleX;
    const pY = padding * scaleY;
    const gX = gapX * scaleX;
    const gY = gapY * scaleY;
    const cells = [];
    const masks = [];
    // Outer padding masks
    masks.push(<div key="p-t" className="absolute top-0 left-0 right-0 bg-black/40" style={{ height: `${pY}px` }} />);
    masks.push(<div key="p-b" className="absolute bottom-0 left-0 right-0 bg-black/40" style={{ height: `${pY}px` }} />);
    masks.push(<div key="p-l" className="absolute top-0 bottom-0 left-0 bg-black/40" style={{ width: `${pX}px`, top: `${pY}px`, bottom: `${pY}px` }} />);
    masks.push(<div key="p-r" className="absolute top-0 bottom-0 right-0 bg-black/40" style={{ width: `${pX}px`, top: `${pY}px`, bottom: `${pY}px` }} />);
    let currentY = pY;
    for (let r = 0; r < rows; r++) {
      let currentX = pX;
      const h = rowHeights[r] * scaleY;
      for (let c = 0; c < cols; c++) {
        const w = colWidths[c] * scaleX;
        const index = r * cols + c + 1;
        cells.push(
          <div
            key={`cell-${r}-${c}`}
            className="absolute border border-primary/40 flex items-center justify-center pointer-events-none"
            style={{ left: `${currentX}px`, top: `${currentY}px`, width: `${w}px`, height: `${h}px` }}
          >
            {showNumbers && (
              <motion.span 
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "absolute text-[10px] font-bold text-primary bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-border pointer-events-none z-10",
                  getBadgePositionClasses(numberPosition)
                )}
              >
                {index.toString().padStart(2, '0')}
              </motion.span>
            )}
          </div>
        );
        if (c < cols - 1) {
          masks.push(
            <div
              key={`gx-${r}-${c}`}
              className="absolute bg-black/40"
              style={{ left: `${currentX + w}px`, top: `${currentY}px`, width: `${gX}px`, height: `${h}px` }}
            />
          );
        }
        currentX += w + gX;
      }
      if (r < rows - 1) {
        masks.push(
          <div
            key={`gy-${r}`}
            className="absolute bg-black/40"
            style={{ left: `${pX}px`, top: `${currentY + h}px`, right: `${pX}px`, height: `${gY}px` }}
          />
        );
      }
      currentY += h + gY;
    }
    const handles = [];
    let currentXPos = pX;
    for (let i = 0; i < cols - 1; i++) {
      currentXPos += colWidths[i] * scaleX;
      const x = currentXPos + gX / 2;
      handles.push(
        <div
          key={`col-h-${i}`}
          onMouseDown={(e) => handleMouseDown(e, 'col', i)}
          className={cn(
            "absolute top-0 bottom-0 w-8 -ml-4 z-30 cursor-col-resize group flex items-center justify-center",
            isResizing?.type === 'col' && isResizing.index === i && "opacity-100"
          )}
          style={{ left: `${x}px` }}
        >
          <div className="w-0.5 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
          <div className="absolute bg-primary text-white p-1 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg">
            <MoveHorizontal className="w-3 h-3" />
          </div>
        </div>
      );
      currentXPos += gX;
    }
    let currentYPos = pY;
    for (let i = 0; i < rows - 1; i++) {
      currentYPos += rowHeights[i] * scaleY;
      const y = currentYPos + gY / 2;
      handles.push(
        <div
          key={`row-h-${i}`}
          onMouseDown={(e) => handleMouseDown(e, 'row', i)}
          className={cn(
            "absolute left-0 right-0 h-8 -mt-4 z-30 cursor-row-resize group flex items-center justify-center",
            isResizing?.type === 'row' && isResizing.index === i && "opacity-100"
          )}
          style={{ top: `${y}px` }}
        >
          <div className="h-0.5 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
          <div className="absolute bg-primary text-white p-1 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg">
            <MoveVertical className="w-3 h-3" />
          </div>
        </div>
      );
      currentYPos += gY;
    }
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {masks}
        <div className="pointer-events-auto">{cells}</div>
        <div className="pointer-events-auto">{handles}</div>
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
      <AnimatePresence>
        {!imageUrl ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 p-12 max-w-sm">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary"><Upload className="w-10 h-10" /></div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Slice with Precision</h2>
              <p className="text-sm text-muted-foreground">Drag and drop your high-res image here to start your grid project.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full p-6 md:p-12 flex items-center justify-center">
            <div ref={containerRef} className="relative shadow-2xl rounded-lg overflow-hidden ring-1 ring-border bg-white select-none">
              <img src={imageUrl} alt="Studio Preview" className="max-w-full max-h-[65vh] object-contain block pointer-events-none" />
              {renderOverlay()}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute top-4 right-4 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-40"><X className="w-5 h-5" /></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-[10px] font-medium uppercase tracking-wider text-muted-foreground"><Focus className="w-3 h-3 text-primary" />Interactive Precision Studio</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}