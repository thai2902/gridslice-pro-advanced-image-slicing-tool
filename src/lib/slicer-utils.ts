export interface SliceRect {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
  label: string;
}
export function calculateSlices(
  imgWidth: number,
  imgHeight: number,
  rows: number,
  cols: number,
  padding: number,
  gapX: number,
  gapY: number
): SliceRect[] {
  const slices: SliceRect[] = [];
  // Available space after padding and gaps
  const availableWidth = imgWidth - 2 * padding - (cols - 1) * gapX;
  const availableHeight = imgHeight - 2 * padding - (rows - 1) * gapY;
  // Actual slice dimensions
  const sliceWidth = Math.max(1, availableWidth / cols);
  const sliceHeight = Math.max(1, availableHeight / rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padding + c * (sliceWidth + gapX);
      const y = padding + r * (sliceHeight + gapY);
      slices.push({
        x,
        y,
        width: sliceWidth,
        height: sliceHeight,
        row: r + 1,
        col: c + 1,
        label: `${(r * cols + c + 1).toString().padStart(2, '0')}`,
      });
    }
  }
  return slices;
}