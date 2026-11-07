// Axial coordinates of the 19 hexes drawn by hex-draw-patch: the centre hex
// plus two rings. The drawing code uses the same layout, so these coordinates
// are the canonical topology for domain calculations.
const patchHexCoordinates: { [hex: number]: { q: number; r: number } } = {
  1: { q: 0, r: 0 },
  2: { q: 0, r: -1 },
  3: { q: 1, r: -1 },
  4: { q: 1, r: 0 },
  5: { q: 0, r: 1 },
  6: { q: -1, r: 1 },
  7: { q: -1, r: 0 },
  8: { q: 0, r: -2 },
  9: { q: 1, r: -2 },
  10: { q: 2, r: -2 },
  11: { q: 2, r: -1 },
  12: { q: 2, r: 0 },
  13: { q: 1, r: 1 },
  14: { q: 0, r: 2 },
  15: { q: -1, r: 2 },
  16: { q: -2, r: 2 },
  17: { q: -2, r: 1 },
  18: { q: -2, r: 0 },
  19: { q: -1, r: -1 },
};

const axialNeighborOffsets = [
  { q: 1, r: 0 },
  { q: -1, r: 0 },
  { q: 0, r: 1 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
  { q: -1, r: 1 },
];

function calcPatchHexNeighbors(): { [hex: number]: number[] } {
  const hexes = Object.keys(patchHexCoordinates).map(Number);
  const result: { [hex: number]: number[] } = {};
  for (const hex of hexes) {
    const { q, r } = patchHexCoordinates[hex];
    result[hex] = hexes
      .filter((other) => {
        const coordinate = patchHexCoordinates[other];
        return axialNeighborOffsets.some(
          (offset) => q + offset.q === coordinate.q && r + offset.r === coordinate.r
        );
      })
      .sort((a, b) => a - b);
  }
  return result;
}

const patchHexNeighbors = calcPatchHexNeighbors();

function neighborsOfPatchHex(hex: number): number[] {
  return patchHexNeighbors[hex] ?? [];
}

export {
  neighborsOfPatchHex,
  patchHexCoordinates,
  patchHexNeighbors,
};
