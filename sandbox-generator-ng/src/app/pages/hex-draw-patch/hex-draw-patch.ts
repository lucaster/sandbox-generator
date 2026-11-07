import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  ViewChild
} from '@angular/core';
import { calcContentWithPath, calcHexesDetailedContentWithDetails } from '../../../data/content';
import { calcHexesBiome, calcHexesDetailedFeature, fromHexesDetailedToImagePathHexes, fromHexesToHexesDetailed, Hexes, HexesDetailed } from '../../../data/data';
import { calcFactions, type Faction, type FactionResult } from '../../../data/factions';
import { calcLair } from '../../../data/lairs';
import { SvgDrawer, type FactionShape } from '../../../drawing/hex';
import { HexOps } from '../../../drawing/hex-ops';
import { Point } from '../../../drawing/point';

@Component({
  selector: 'app-hex-draw-patch',
  imports: [CommonModule],
  templateUrl: './hex-draw-patch.html',
  styleUrl: './hex-draw-patch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexDrawPatch implements AfterViewInit {

  width = input(500);
  height = input(500);
  @ViewChild('svg') svgElement!: ElementRef<SVGElement>;
  readonly factionShapes: FactionShape[] = [
    'circle',
    'square',
    'triangle',
    'diamond',
    'hexagon',
    'star',
  ];
  readonly factionColors: string[] = [
    '#2f6f9f',
    '#a34a28',
    '#3f7a3f',
    '#7a3f8f',
    '#9a7b1f',
    '#3f5f7f',
    '#8f3f4f',
    '#4f6f3f',
  ];
  hexDetailList = signal<{
    hexNum: number;
    details: string[] | null;
    content: { treasure: string; convey: string | null; } | null;
    lair: ReturnType<typeof calcLair> | null;
    factions: number[];
    contested: boolean;
  }[]>([]);
  factionList = signal<Faction[]>([]);
  private hexesDetailed: HexesDetailed | null = null;
  private biomes: Hexes | null = null;
  private contentDetails: {
    [hexNum: number]: ReturnType<typeof calcContentWithPath>;
  } = {};
  private lairs: {
    [hexNum: number]: ReturnType<typeof calcLair>;
  } = {};
  private factionResult: FactionResult | null = null;

  ngAfterViewInit() {
    this.onDrawFeatureHexPatch();
  }

  onDrawBiomePatch() {
    this.resetPatch();
    this.drawBiomePatch();
    this.updateHexDetailList();
  }

  private drawBiomePatch() {
    const svg = this.svgElement.nativeElement;
    const svgDrawer = new SvgDrawer(svg);
    const r = 50;
    const hexOps = new HexOps(r);
    const imageOpts = { width: 2.45 * hexOps.h, height: 2.45 * hexOps.h };
    const hexes = calcHexesBiome();
    this.hexesDetailed = fromHexesToHexesDetailed(hexes);
    const imagePathHexes = fromHexesDetailedToImagePathHexes(this.hexesDetailed);
    this.drawPatch(
      svgDrawer,
      hexOps,
      imagePathHexes,
      imageOpts,
    );
  }

  onDrawFeatureHexPatch() {
    this.resetPatch();
    this.drawFeatureHexPatch();
    this.updateHexDetailList();
  }

  private drawFeatureHexPatch() {
    const svg = this.svgElement.nativeElement;
    const svgDrawer = new SvgDrawer(svg);
    const r = 50;
    const hexOps = new HexOps(r);
    const imageOpts = { width: 50, height: 50 };
    this.hexesDetailed = calcHexesDetailedFeature();
    // Features do not depend on the biome, but a lair does. Generate a biome
    // map alongside the features so each lair hex can be detailed.
    const hasLair = Object.values(this.hexesDetailed).some(
      (details) => details.includes('Lair')
    );
    this.biomes = hasLair ? calcHexesBiome() : null;
    const imagePathHexes = fromHexesDetailedToImagePathHexes(this.hexesDetailed);
    this.drawPatch(
      svgDrawer,
      hexOps,
      imagePathHexes,
      imageOpts,
    );
  }

  onDrawContentHexPatch() {
    this.resetPatch();
    this.drawContentHexPatch();
    this.updateHexDetailList();
  }

  private drawContentHexPatch() {
    const svg = this.svgElement.nativeElement;
    const svgDrawer = new SvgDrawer(svg);
    const r = 50;
    const hexOps = new HexOps(r);
    const { hexesDetailed, contents } = calcHexesDetailedContentWithDetails();
    this.hexesDetailed = hexesDetailed;
    this.contentDetails = contents;
    const imagePathHexes = fromHexesDetailedToImagePathHexes(this.hexesDetailed);
    this.drawPatch(
      svgDrawer,
      hexOps,
      imagePathHexes,
    );
  }

  // Factions are downstream of features and lairs: features decide which
  // settlements create domains, and the lair inhabitants decide which lairs do.
  // drawFeatureHexPatch also prepares the biome map that drawFactions needs.
  onDrawFactionPatch() {
    this.resetPatch();
    this.drawFeatureHexPatch();
    this.drawFactions();
    this.updateHexDetailList();
  }

  private drawFactions() {
    if (!this.hexesDetailed) {
      return;
    }

    const lairInhabitants: { [hexNum: number]: string; } = {};
    if (this.biomes) {
      for (const key of Object.keys(this.hexesDetailed)) {
        const hexNum = Number(key);
        if (this.hexesDetailed[hexNum].includes('Lair')) {
          const lair = calcLair(this.biomes[hexNum]);
          this.lairs[hexNum] = lair;
          lairInhabitants[hexNum] = lair.inhabitants;
        }
      }
    }

    this.factionResult = calcFactions(this.hexesDetailed, { lairInhabitants });
    this.factionList.set(this.factionResult.factions);

    const svgDrawer = new SvgDrawer(this.svgElement.nativeElement);
    const hexOps = new HexOps(50);
    this.drawFactionSymbols(
      svgDrawer,
      this.calcHexCenters(hexOps),
      this.factionResult.hexFactions,
    );
  }

  private drawFactionSymbols(
    svgDrawer: SvgDrawer,
    hexCenters: Point[],
    hexFactions: { [hex: number]: number[]; },
  ) {
    for (let i = 0; i < hexCenters.length; i++) {
      const hexNum = i + 1;
      const factionNumbers = hexFactions[hexNum] ?? [];
      if (factionNumbers.length === 0) {
        continue;
      }

      const center = hexCenters[i];
      const crowded = factionNumbers.length > 3;
      const size = crowded ? 7 : 9;
      const spacing = crowded
        ? Math.min(9, 56 / Math.max(1, factionNumbers.length - 1))
        : Math.min(16, 64 / Math.max(1, factionNumbers.length - 1));
      const startX = center.x - ((factionNumbers.length - 1) * spacing) / 2;
      factionNumbers.forEach((factionNumber, index) => {
        svgDrawer.drawSymbolAtPoint(
          { x: startX + index * spacing, y: center.y + 32 },
          this.factionShape(factionNumber),
          {
            size,
            fill: this.factionColor(factionNumber),
            text: factionNumber,
            fontSize: crowded ? '9' : '11',
          }
        );
      });
    }
  }

  factionColor(factionNumber: number): string {
    return this.factionColors[(factionNumber - 1) % this.factionColors.length];
  }

  factionShape(factionNumber: number): FactionShape {
    return this.factionShapes[(factionNumber - 1) % this.factionShapes.length];
  }

  private calcHexCenters(hexOps: HexOps): Point[] {
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
    return [
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
  }

  private drawPatch(
    svgDrawer: SvgDrawer,
    hexOps: HexOps,
    imagePaths: Hexes,
    imageOpts?: { width: number; height: number; },
  ) {
    const hexCenters = this.calcHexCenters(hexOps);
    const hexagons: Point[][] = hexCenters.map(center => hexOps.hexPoints(center));

    this.drawHexagons(svgDrawer, hexagons);

    this.drawImagesOrText(svgDrawer, hexCenters, imagePaths, imageOpts);

    this.drawHexNumbers(svgDrawer, hexCenters);
  }

  private drawHexagons(
    svgDrawer: SvgDrawer,
    hexagons: Point[][],
  ) {
    for (let i = 0; i < hexagons.length; i++) {
      const n = i + 1;
      const hexagon = hexagons[i];
      svgDrawer.drawPolygon(hexagon);
    }
  }

  private drawImagesOrText(
    svgDrawer: SvgDrawer,
    hexCenters: Point[],
    imagePaths: Hexes,
    imageOpts?: { width: number; height: number; },
  ) {
    for (let i = 0; i < hexCenters.length; i++) {
      const n = i + 1;
      const center = hexCenters[i];
      const imagePath = imagePaths[n];
      if (!!imagePath) {
        svgDrawer.drawImageAtPoint(center, imagePath, imageOpts);
      }
      else {
        svgDrawer.drawTextAtPoint(center, imagePath, { fontSize: '15' });
      }
    }
  }

  private drawHexNumbers(
    svgDrawer: SvgDrawer,
    hexCenters: Point[],
  ) {
    for (let i = 0; i < hexCenters.length; i++) {
      const n = i + 1;
      const center = hexCenters[i];
      svgDrawer.drawTextAtPoint(
        { x: center.x, y: center.y - 25 },
        n,
        { fontSize: '20' }
      );
    }
  }

  onDrawSampleHexPatch() {
    this.resetPatch();
    this.drawSampleHexPatch();
    this.updateHexDetailList();
  }

  private drawSampleHexPatch() {
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

    const featureOpts = { width: 50, height: 50 };

    svgDrawer.drawImageAtPoint(center_01, '/assets/images/abbey.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_02, '/assets/images/castle.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_03, '/assets/images/city.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_04, '/assets/images/dungeon.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_05, '/assets/images/hamlet.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_06, '/assets/images/lair.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_07, '/assets/images/landmark.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_08, '/assets/images/tower.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_09, '/assets/images/village.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_11, '/assets/images/abbey.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_12, '/assets/images/castle.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_13, '/assets/images/city.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_14, '/assets/images/dungeon.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_15, '/assets/images/hamlet.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_16, '/assets/images/lair.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_17, '/assets/images/landmark.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_18, '/assets/images/tower.png', featureOpts);
    svgDrawer.drawImageAtPoint(center_19, '/assets/images/village.png', featureOpts);

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

  onResetPatch() {
    this.resetPatch();
  }

  private resetPatch() {
    this.hexesDetailed = null;
    this.biomes = null;
    this.contentDetails = {};
    this.lairs = {};
    this.factionResult = null;
    this.factionList.set([]);
    const svg = this.svgElement.nativeElement;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  private updateHexDetailList() {
    const hexDetailList = Object.keys(this.hexesDetailed || {}).map(key => {
      const hexNum = +(key);
      const details = this.hexesDetailed ? this.hexesDetailed[hexNum] : null;
      const content = this.contentDetails[hexNum];
      const biome = this.biomes ? this.biomes[hexNum] : null;
      const lair =
        this.lairs[hexNum] ??
        (details?.includes('Lair') && biome ? calcLair(biome) : null);
      const factions = this.factionResult
        ? this.factionResult.hexFactions[hexNum] ?? []
        : [];
      const contested = this.factionResult
        ? this.factionResult.contestedHexes.includes(hexNum)
        : false;
      return {
        hexNum,
        details,
        content: content
          ? {
              treasure:
                content.treasure.chance === null
                  ? 'Variable (chosen by the DM)'
                  : `${content.treasure.hasTreasure ? 'Yes' : 'No'}`,
              convey: content.convey ? content.convey.result : null,
            }
          : null,
        lair,
        factions,
        contested,
      };
    });
    this.hexDetailList.set(hexDetailList);
  }
}
