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
  setImage: (url: string | null, dimensions?: { width: number; height: number }) => void;
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
  config: DEFAULT_CONFIG,
  setImage: (url, dimensions = null) => set({ imageUrl: url, imageDimensions: dimensions }),
  updateConfig: (updates) => set((state) => ({ config: { ...state.config, ...updates } })),
  resetConfig: () => set({ config: DEFAULT_CONFIG }),
}));