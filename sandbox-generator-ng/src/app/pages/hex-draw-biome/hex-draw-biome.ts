import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  ViewChild
} from '@angular/core';
import { biomeToImage, calcHexesBiome, Hexes } from '../../../data/data';
import { SvgDrawer } from '../../../drawing/hex';
import { HexOps } from '../../../drawing/hex-ops';
import { Point } from '../../../drawing/point';

@Component({
  selector: 'app-hex-draw-biome',
  imports: [],
  templateUrl: './hex-draw-biome.html',
  styleUrl: './hex-draw-biome.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexDrawBiome implements AfterViewInit {

  width = input(500);
  height = input(500);

  @ViewChild('svg') svgElement!: ElementRef<SVGElement>;

  ngAfterViewInit(): void {
    this.drawBiomePatch();
  }

  drawBiomePatch() {
    const biomes: Hexes = calcHexesBiome();
    const center_01 = { x: this.width() / 2, y: this.height() / 2 };
    const r = 50;
    const svg = this.svgElement.nativeElement;

    const hexOps = new HexOps(r);
    const biomeOpts = { width: 2.45 * hexOps.h, height: 2.45 * hexOps.h };
    const svgDrawer = new SvgDrawer(svg);

    const center_02 = hexOps.up(center_01);
    const center_03 = hexOps.upRight(center_01);
    const center_04 = hexOps.downRight(center_01);
    const center_05 = hexOps.down(center_01);
    const center_06 = hexOps.downLeft(center_01);
    const center_07 = hexOps.upLeft(center_01);
    const center_08 = hexOps.up(center_02);
    const center_09 = hexOps.downRight(center_08);
    const center_10 = hexOps.upRight(center_03);
    const center_11 = hexOps.down(center_10);
    const center_12 = hexOps.downRight(center_04);
    const center_13 = hexOps.downLeft(center_12);
    const center_14 = hexOps.down(center_05);
    const center_15 = hexOps.upLeft(center_14);
    const center_16 = hexOps.downLeft(center_06);
    const center_17 = hexOps.up(center_16);
    const center_18 = hexOps.upLeft(center_07);
    const center_19 = hexOps.upRight(center_18);
    var hexCenters: Point[] = [
      center_01,
      center_02,
      center_03,
      center_04,
      center_05,
      center_06,
      center_07,
      center_08,
      center_09,
      center_10,
      center_11,
      center_12,
      center_13,
      center_14,
      center_15,
      center_16,
      center_17,
      center_18,
      center_19,
    ];
    const hexagons: Point[][] = hexCenters.map(center => hexOps.hexPoints(center));

    for (let i = 0; i < hexagons.length; i++) {
      const n = i + 1;
      const center = hexCenters[i];
      const hexagon = hexagons[i];
      const biome = biomes[n];
      const imagePath = biomeToImage(biome);
      svgDrawer.drawPolygon(hexagon);
      svgDrawer.drawImageAtPoint(center, imagePath, biomeOpts);
      svgDrawer.drawTextAtPoint(center, n);
    }
  }

  drawSampleHexPatch() {
    const r = 50;
    const hexOps = new HexOps(r);
    const svg = this.svgElement.nativeElement;
    const svgDrawer = new SvgDrawer(svg);
    const biomeOpts = { width: 2.45 * hexOps.h, height: 2.45 * hexOps.h };
    const center_01 = { x: this.width() / 2, y: this.height() / 2 };

    const center_02 = hexOps.up(center_01);
    const center_03 = hexOps.upRight(center_01);
    const center_04 = hexOps.downRight(center_01);
    const center_05 = hexOps.down(center_01);
    const center_06 = hexOps.downLeft(center_01);
    const center_07 = hexOps.upLeft(center_01);
    const center_08 = hexOps.up(center_02);
    const center_09 = hexOps.downRight(center_08);
    const center_10 = hexOps.upRight(center_03);
    const center_11 = hexOps.down(center_10);
    const center_12 = hexOps.downRight(center_04);
    const center_13 = hexOps.downLeft(center_12);
    const center_14 = hexOps.down(center_05);
    const center_15 = hexOps.upLeft(center_14);
    const center_16 = hexOps.downLeft(center_06);
    const center_17 = hexOps.up(center_16);
    const center_18 = hexOps.upLeft(center_07);
    const center_19 = hexOps.upRight(center_18);

    const points_01 = hexOps.hexPoints(center_01);
    const points_02 = hexOps.hexPoints(center_02);
    const points_03 = hexOps.hexPoints(center_03);
    const points_04 = hexOps.hexPoints(center_04);
    const points_05 = hexOps.hexPoints(center_05);
    const points_06 = hexOps.hexPoints(center_06);
    const points_07 = hexOps.hexPoints(center_07);
    const points_08 = hexOps.hexPoints(center_08);
    const points_09 = hexOps.hexPoints(center_09);
    const points_10 = hexOps.hexPoints(center_10);
    const points_11 = hexOps.hexPoints(center_11);
    const points_12 = hexOps.hexPoints(center_12);
    const points_13 = hexOps.hexPoints(center_13);
    const points_14 = hexOps.hexPoints(center_14);
    const points_15 = hexOps.hexPoints(center_15);
    const points_16 = hexOps.hexPoints(center_16);
    const points_17 = hexOps.hexPoints(center_17);
    const points_18 = hexOps.hexPoints(center_18);
    const points_19 = hexOps.hexPoints(center_19);

    svgDrawer.drawPolygon(points_01);
    svgDrawer.drawPolygon(points_02);
    svgDrawer.drawPolygon(points_03);
    svgDrawer.drawPolygon(points_04);
    svgDrawer.drawPolygon(points_05);
    svgDrawer.drawPolygon(points_06);
    svgDrawer.drawPolygon(points_07);
    svgDrawer.drawPolygon(points_08);
    svgDrawer.drawPolygon(points_09);
    svgDrawer.drawPolygon(points_10);
    svgDrawer.drawPolygon(points_11);
    svgDrawer.drawPolygon(points_12);
    svgDrawer.drawPolygon(points_13);
    svgDrawer.drawPolygon(points_14);
    svgDrawer.drawPolygon(points_15);
    svgDrawer.drawPolygon(points_16);
    svgDrawer.drawPolygon(points_17);
    svgDrawer.drawPolygon(points_18);
    svgDrawer.drawPolygon(points_19);

    svgDrawer.drawImageAtPoint(center_01, '/assets/images/forest.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_02, '/assets/images/grassland.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_03, '/assets/images/hills.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_04, '/assets/images/marsh.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_05, '/assets/images/mountains.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_06, '/assets/images/forest.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_07, '/assets/images/grassland.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_08, '/assets/images/hills.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_09, '/assets/images/marsh.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_10, '/assets/images/mountains.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_11, '/assets/images/forest.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_12, '/assets/images/grassland.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_13, '/assets/images/hills.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_14, '/assets/images/marsh.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_15, '/assets/images/mountains.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_16, '/assets/images/forest.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_17, '/assets/images/grassland.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_18, '/assets/images/hills.png', biomeOpts);
    svgDrawer.drawImageAtPoint(center_19, '/assets/images/marsh.png', biomeOpts);

    svgDrawer.drawImageAtPoint(center_01, '/assets/images/abbey.png');
    svgDrawer.drawImageAtPoint(center_02, '/assets/images/castle.png');
    svgDrawer.drawImageAtPoint(center_03, '/assets/images/city.png');
    svgDrawer.drawImageAtPoint(center_04, '/assets/images/dungeon.png');
    svgDrawer.drawImageAtPoint(center_05, '/assets/images/hamlet.png');
    svgDrawer.drawImageAtPoint(center_06, '/assets/images/lair.png');
    svgDrawer.drawImageAtPoint(center_07, '/assets/images/landmark.png');
    svgDrawer.drawImageAtPoint(center_08, '/assets/images/tower.png');
    svgDrawer.drawImageAtPoint(center_09, '/assets/images/village.png');
    svgDrawer.drawImageAtPoint(center_11, '/assets/images/abbey.png');
    svgDrawer.drawImageAtPoint(center_12, '/assets/images/castle.png');
    svgDrawer.drawImageAtPoint(center_13, '/assets/images/city.png');
    svgDrawer.drawImageAtPoint(center_14, '/assets/images/dungeon.png');
    svgDrawer.drawImageAtPoint(center_15, '/assets/images/hamlet.png');
    svgDrawer.drawImageAtPoint(center_16, '/assets/images/lair.png');
    svgDrawer.drawImageAtPoint(center_17, '/assets/images/landmark.png');
    svgDrawer.drawImageAtPoint(center_18, '/assets/images/tower.png');
    svgDrawer.drawImageAtPoint(center_19, '/assets/images/village.png');

    svgDrawer.drawTextAtPoint(center_01, 1);
    svgDrawer.drawTextAtPoint(center_02, 2);
    svgDrawer.drawTextAtPoint(center_03, 3);
    svgDrawer.drawTextAtPoint(center_04, 4);
    svgDrawer.drawTextAtPoint(center_05, 5);
    svgDrawer.drawTextAtPoint(center_06, 6);
    svgDrawer.drawTextAtPoint(center_07, 7);
    svgDrawer.drawTextAtPoint(center_08, 8);
    svgDrawer.drawTextAtPoint(center_09, 9);
    svgDrawer.drawTextAtPoint(center_10, 10);
    svgDrawer.drawTextAtPoint(center_11, 11);
    svgDrawer.drawTextAtPoint(center_12, 12);
    svgDrawer.drawTextAtPoint(center_13, 13);
    svgDrawer.drawTextAtPoint(center_14, 14);
    svgDrawer.drawTextAtPoint(center_15, 15);
    svgDrawer.drawTextAtPoint(center_16, 16);
    svgDrawer.drawTextAtPoint(center_17, 17);
    svgDrawer.drawTextAtPoint(center_18, 18);
    svgDrawer.drawTextAtPoint(center_19, 19);
  }
}
