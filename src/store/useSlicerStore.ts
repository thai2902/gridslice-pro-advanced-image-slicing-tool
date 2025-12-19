import { create } from 'zustand';
interface GridConfig {
  rows: number;
  cols: number;
  gapX: number;
  gapY: number;
  padding: number;
  showNumbers: boolean;
}
interface SlicerState {
  imageUrl: string | null;
  imageDimensions: { width: number; height: number } | null;
  config: GridConfig;
  isProcessing: boolean;
  setImage: (url: string | null, dimensions?: { width: number; height: number }) => void;
  setProcessing: (processing: boolean) => void;
  updateConfig: (updates: Partial<GridConfig>) => void;
  resetConfig: () => void;
}
const DEFAULT_CONFIG: GridConfig = {
  rows: 2,
  cols: 2,
  gapX: 0,
  gapY: 0,
  padding: 0,
  showNumbers: true,
};
export const useSlicerStore = create<SlicerState>((set) => ({
  imageUrl: null,
  imageDimensions: null,
  isProcessing: false,
  config: DEFAULT_CONFIG,
  setImage: (url, dimensions = null) => set({ 
    imageUrl: url, 
    imageDimensions: dimensions,
    isProcessing: false 
  }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  updateConfig: (updates) => set((state) => {
    const nextConfig = { ...state.config, ...updates };
    // Logic validation: Rows/Cols bounds
    nextConfig.rows = Math.max(1, Math.min(24, nextConfig.rows));
    nextConfig.cols = Math.max(1, Math.min(24, nextConfig.cols));
    // Spacing validation (cannot be negative)
    nextConfig.padding = Math.max(0, nextConfig.padding);
    nextConfig.gapX = Math.max(0, nextConfig.gapX);
    nextConfig.gapY = Math.max(0, nextConfig.gapY);
    return { config: nextConfig };
  }),
  resetConfig: () => set({ config: DEFAULT_CONFIG }),
}));