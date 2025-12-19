import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type NumberPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
interface GridConfig {
  rows: number;
  cols: number;
  gapX: number;
  gapY: number;
  padding: number;
  showNumbers: boolean;
  numberPosition: NumberPosition;
}
interface SlicerState {
  imageUrl: string | null;
  imageDimensions: { width: number; height: number } | null;
  config: GridConfig;
  rowHeights: number[];
  colWidths: number[];
  isProcessing: boolean;
  setImage: (url: string | null, dimensions?: { width: number; height: number }) => void;
  setProcessing: (processing: boolean) => void;
  updateConfig: (updates: Partial<GridConfig>) => void;
  setRowHeight: (index: number, height: number) => void;
  setColWidth: (index: number, width: number) => void;
  recomputeUniformSizes: () => void;
  resetConfig: () => void;
}
const DEFAULT_CONFIG: GridConfig = {
  rows: 2,
  cols: 2,
  gapX: 0,
  gapY: 0,
  padding: 0,
  showNumbers: true,
  numberPosition: 'top-left',
};
export const calculateUniformSizes = (total: number, count: number, padding: number, gap: number) => {
  if (count <= 0) return [];
  const totalGaps = (count - 1) * gap;
  const available = Math.max(0, total - (2 * padding) - totalGaps);
  const size = available / count;
  return new Array(count).fill(Math.max(1, size));
};
export const useSlicerStore = create<SlicerState>()(
  persist(
    (set, get) => ({
      imageUrl: null,
      imageDimensions: null,
      isProcessing: false,
      config: DEFAULT_CONFIG,
      rowHeights: [],
      colWidths: [],
      setImage: (url, dimensions = null) => {
        const currentUrl = get().imageUrl;
        if (currentUrl && currentUrl.startsWith('blob:')) {
          URL.revokeObjectURL(currentUrl);
        }
        if (!url || !dimensions) {
          set({ imageUrl: null, imageDimensions: null, rowHeights: [], colWidths: [], isProcessing: false });
          return;
        }
        const { config } = get();
        const colWidths = calculateUniformSizes(dimensions.width, config.cols, config.padding, config.gapX);
        const rowHeights = calculateUniformSizes(dimensions.height, config.rows, config.padding, config.gapY);
        set({
          imageUrl: url,
          imageDimensions: dimensions,
          colWidths,
          rowHeights,
          isProcessing: false
        });
      },
      setProcessing: (processing) => set({ isProcessing: processing }),
      updateConfig: (updates) => set((state) => {
        const nextConfig = { ...state.config, ...updates };
        nextConfig.rows = Math.max(1, Math.min(24, nextConfig.rows));
        nextConfig.cols = Math.max(1, Math.min(24, nextConfig.cols));
        nextConfig.padding = Math.max(0, nextConfig.padding);
        nextConfig.gapX = Math.max(0, nextConfig.gapX);
        nextConfig.gapY = Math.max(0, nextConfig.gapY);
        let { colWidths, rowHeights, imageDimensions } = state;
        if (imageDimensions && (updates.rows !== undefined || updates.cols !== undefined || updates.padding !== undefined || updates.gapX !== undefined || updates.gapY !== undefined)) {
          colWidths = calculateUniformSizes(imageDimensions.width, nextConfig.cols, nextConfig.padding, nextConfig.gapX);
          rowHeights = calculateUniformSizes(imageDimensions.height, nextConfig.rows, nextConfig.padding, nextConfig.gapY);
        }
        return { config: nextConfig, colWidths, rowHeights };
      }),
      setRowHeight: (index, height) => set((state) => {
        const next = [...state.rowHeights];
        if (index >= 0 && index < next.length) {
          next[index] = Math.max(1, height);
        }
        return { rowHeights: next };
      }),
      setColWidth: (index, width) => set((state) => {
        const next = [...state.colWidths];
        if (index >= 0 && index < next.length) {
          next[index] = Math.max(1, width);
        }
        return { colWidths: next };
      }),
      recomputeUniformSizes: () => {
        const { imageDimensions, config } = get();
        if (!imageDimensions) return;
        set({
          colWidths: calculateUniformSizes(imageDimensions.width, config.cols, config.padding, config.gapX),
          rowHeights: calculateUniformSizes(imageDimensions.height, config.rows, config.padding, config.gapY),
        });
      },
      resetConfig: () => set((state) => {
        const nextConfig = DEFAULT_CONFIG;
        let colWidths = state.colWidths;
        let rowHeights = state.rowHeights;
        if (state.imageDimensions) {
          colWidths = calculateUniformSizes(state.imageDimensions.width, nextConfig.cols, nextConfig.padding, nextConfig.gapX);
          rowHeights = calculateUniformSizes(state.imageDimensions.height, nextConfig.rows, nextConfig.padding, nextConfig.gapY);
        }
        return { config: nextConfig, colWidths, rowHeights };
      }),
    }),
    {
      name: 'gridslice-storage',
      partialize: (state) => ({ config: state.config }),
    }
  )
);