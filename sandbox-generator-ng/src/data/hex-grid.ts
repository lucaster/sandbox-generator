// Canonical topology for the 19-hex patch drawn by hex-draw-patch.
//
// Each hex is stored as an *axial* coordinate `{ q, r }`:
//
//   q — column coordinate. Increasing q moves one hex to the right and half a
//       row down.
//   r — row coordinate. Increasing r moves one full row straight down.
//
// The two axes are 60° apart, so `q` and `r` describe a skewed grid rather than
// screen pixels. Hexes are adjacent (share an edge) when their coordinates
// differ by one of the six vectors in `axialNeighborOffsets`. Because the grid
// is skewed, a move like (+1, -1) is a normal edge neighbour, not a diagonal.
//
// The drawing uses flat-top hexes (a horizontal edge at the top and bottom).
// With hex circumradius `R` and `h = R * sqrt(3) / 2`, axial coordinates map to
// SVG pixels as:
//
//   x = (3 / 2) * R * q
//   y = h * (q + 2 * r)
//
// `R` is the radius passed to `HexOps` (50 in hex-draw-patch); the axial `r` is
// a coordinate and is unrelated to that radius.
//
// Hex 1 is the centre (0, 0). Hexes 2–7 are the first ring (the six neighbours
// of the centre) and hexes 8–19 are the second ring. The numbering matches the
// order used by the drawing code.
//
// This file is the source of truth for adjacency in generation rules. The older
// `currHexNextHex` list in data.ts is only the spanning tree used to grow the
// map, not full hex adjacency.
const patchHexCoordinates: { [hex: number]: { q: number; r: number } } = {
  // Centre.
  1: { q: 0, r: 0 },
  // First ring: the six hexes around the centre.
  2: { q: 0, r: -1 },
  3: { q: 1, r: -1 },
  4: { q: 1, r: 0 },
  5: { q: 0, r: 1 },
  6: { q: -1, r: 1 },
  7: { q: -1, r: 0 },
  // Second ring: the twelve hexes around the first ring.
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

// The six axial directions. A hex at (q, r) shares an edge with the hex at
// (q + dq, r + dr) for every offset below. There are exactly six because each
// hex has six edge neighbours.
const axialNeighborOffsets = [
  { q: 1, r: 0 },
  { q: -1, r: 0 },
  { q: 0, r: 1 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
  { q: -1, r: 1 },
];

// Build the adjacency map once by testing every pair of hexes against the six
// axial directions. Results are sorted so callers get stable, test-friendly
// neighbour lists.
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

// Neighbours of a patch hex, or an empty list for a hex outside the 1–19 patch.
function neighborsOfPatchHex(hex: number): number[] {
  return patchHexNeighbors[hex] ?? [];
}

export {
  neighborsOfPatchHex,
  patchHexCoordinates,
  patchHexNeighbors,
};
