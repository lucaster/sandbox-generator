import { Component, OnInit } from '@angular/core';
import { defineHex, Grid, Hex, rectangle } from 'honeycomb-grid';
import { G, SVG } from '@svgdotjs/svg.js';

@Component({
  selector: 'app-honeycomb-svg',
  imports: [],
  templateUrl: './honeycomb-svg.html',
  styleUrl: './honeycomb-svg.scss',
})
export class HoneycombSvg implements OnInit {
  ngOnInit(): void {
    // 1. Create a hex class:
    const Tile = defineHex({ dimensions: 30 });

    // 2. Create a grid by passing the class and a "traverser" for a rectangular-shaped grid:
    const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));

    // 3. Iterate over the grid to log each hex:
    grid.forEach(console.log);

    // Render with SVG:
    const draw = SVG().addTo('body').size('00%', '100%');
    grid.forEach(renderSVG);
    function renderSVG(hex: Hex) {
      const cornerPoints = hex.corners.map(({ x, y }) => [x, y] as [number, number]);
      const polygon = draw
        // create a polygon from a hex's corner points
        .polygon(cornerPoints)
        .fill('none')
        .stroke({ width: 1, color: '#999' });
      return draw.group().add(polygon);
    }
  }
}
