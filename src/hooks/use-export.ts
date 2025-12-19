import { useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useSlicerStore } from '@/store/useSlicerStore';
import { calculateSlices } from '@/lib/slicer-utils';
import { toast } from 'sonner';
export function useExport() {
  const imageUrl = useSlicerStore((s) => s.imageUrl);
  const dims = useSlicerStore((s) => s.imageDimensions);
  const rows = useSlicerStore((s) => s.config.rows);
  const cols = useSlicerStore((s) => s.config.cols);
  const gapX = useSlicerStore((s) => s.config.gapX);
  const gapY = useSlicerStore((s) => s.config.gapY);
  const padding = useSlicerStore((s) => s.config.padding);
  const showNumbers = useSlicerStore((s) => s.config.showNumbers);
  const rowHeights = useSlicerStore((s) => s.rowHeights);
  const colWidths = useSlicerStore((s) => s.colWidths);
  const setProcessing = useSlicerStore((s) => s.setProcessing);
  const exportSlices = useCallback(async () => {
    if (!imageUrl || !dims) {
      toast.error('No image loaded');
      return;
    }
    setProcessing(true);
    const toastId = toast.loading('Generating high-res slices...');
    try {
      const zip = new JSZip();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const slices = calculateSlices(dims.width, dims.height, rows, cols, padding, gapX, gapY, rowHeights, colWidths);
      for (const slice of slices) {
        canvas.width = slice.width;
        canvas.height = slice.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          slice.x, slice.y, slice.width, slice.height,
          0, 0, slice.width, slice.height
        );
        if (showNumbers) {
          const fontSize = Math.max(12, Math.min(slice.width, slice.height) * 0.15);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          const text = slice.label;
          const metrics = ctx.measureText(text);
          const textPadding = fontSize * 0.4;
          ctx.fillRect(5, 5, metrics.width + textPadding, fontSize + textPadding);
          ctx.fillStyle = '#000000';
          ctx.fillText(text, 5 + textPadding / 2, 5 + fontSize);
        }
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );
        if (blob) {
          zip.file(`slice_${slice.row.toString().padStart(2, '0')}_${slice.col.toString().padStart(2, '0')}.png`, blob);
        }
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `gridslice_pro_${Date.now()}.zip`);
      toast.success('Professional export complete!', { id: toastId });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Processing failed. Please try again.', { id: toastId });
    } finally {
      setProcessing(false);
    }
  }, [imageUrl, dims, rows, cols, gapX, gapY, padding, showNumbers, rowHeights, colWidths, setProcessing]);
  return { exportSlices };
}