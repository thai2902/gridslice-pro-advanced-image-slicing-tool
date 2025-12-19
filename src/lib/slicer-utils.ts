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
  gapY: number,
  customRowHeights?: number[],
  customColWidths?: number[]
): SliceRect[] {
  const slices: SliceRect[] = [];
  // Default to uniform if no custom sizes provided or mismatch
  const colWidths = (customColWidths && customColWidths.length === cols)
    ? customColWidths
    : new Array(cols).fill(Math.max(1, (imgWidth - 2 * padding - (cols - 1) * gapX) / cols));
  const rowHeights = (customRowHeights && customRowHeights.length === rows)
    ? customRowHeights
    : new Array(rows).fill(Math.max(1, (imgHeight - 2 * padding - (rows - 1) * gapY) / rows));
  // Prefix sums for positioning
  const colXPositions: number[] = [];
  let currentX = padding;
  for (let i = 0; i < cols; i++) {
    colXPositions.push(currentX);
    currentX += colWidths[i] + gapX;
  }
  const rowYPositions: number[] = [];
  let currentY = padding;
  for (let i = 0; i < rows; i++) {
    rowYPositions.push(currentY);
    currentY += rowHeights[i] + gapY;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slices.push({
        x: colXPositions[c],
        y: rowYPositions[r],
        width: colWidths[c],
        height: rowHeights[r],
        row: r + 1,
        col: c + 1,
        label: `${(r * cols + c + 1).toString().padStart(2, '0')}`,
      });
    }
  }
  return slices;
}