import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  calcHexesBiome,
  calcHexesDetailedFeature,
  fromHexesDetailedToImagePathHexes,
  fromHexesToHexesDetailed,
  type Hexes,
  type HexesDetailed,
} from '../../../data/data';
import {
  calcWildernessEncounter,
  type WildernessEncounter,
} from '../../../data/encounters';
import { calcFactions, type FactionResult } from '../../../data/factions';
import { calcLair } from '../../../data/lairs';
import { SvgDrawer, type FactionShape } from '../../../drawing/hex';
import { HexOps } from '../../../drawing/hex-ops';
import { type Point } from '../../../drawing/point';

@Component({
  selector: 'app-encounters',
  imports: [],
  templateUrl: './encounters.html',
  styleUrl: './encounters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Encounters implements OnInit, AfterViewInit {
  readonly width = 500;
  readonly height = 500;
  @ViewChild('svg') svgElement!: ElementRef<SVGElement>;
  readonly hexes = Array.from({ length: 19 }, (_, index) => index + 1);
  readonly hex = signal(1);
  readonly biomes = signal<Hexes>({});
  readonly features = signal<HexesDetailed>({});
  readonly factions = signal<FactionResult | null>(null);
  readonly encounter = signal<WildernessEncounter | null>(null);
  readonly history = signal<WildernessEncounter[]>([]);
  private readonly factionShapes: FactionShape[] = [
    'circle',
    'square',
    'triangle',
    'diamond',
    'hexagon',
    'star',
  ];
  private readonly factionColors: string[] = [
    '#2f6f9f',
    '#a34a28',
    '#3f7a3f',
    '#7a3f8f',
    '#9a7b1f',
    '#3f5f7f',
    '#8f3f4f',
    '#4f6f3f',
  ];

  ngOnInit(): void {
    this.generateMap();
  }

  ngAfterViewInit(): void {
    this.renderMap();
  }

  generateMap() {
    const biomes = calcHexesBiome();
    const features = calcHexesDetailedFeature();

    const lairInhabitants: { [hex: number]: string } = {};
    for (const key of Object.keys(features)) {
      const hex = Number(key);
      if (features[hex].includes('Lair')) {
        lairInhabitants[hex] = calcLair(biomes[hex]).inhabitants;
      }
    }

    this.biomes.set(biomes);
    this.features.set(features);
    this.factions.set(calcFactions(features, { lairInhabitants }));
    this.encounter.set(null);
    this.history.set([]);
    this.renderMap();
  }

  onHexChange(event: Event) {
    this.hex.set(Number((event.target as HTMLSelectElement).value));
    this.renderMap();
  }

  onRollEncounter() {
    const factions = this.factions();
    if (!factions) {
      return;
    }

    const hex = this.hex();
    const encounter = calcWildernessEncounter({
      hex,
      biome: this.biomes()[hex],
      hexFactions: factions.hexFactions,
    });
    this.encounter.set(encounter);
    this.history.update((history) => [encounter, ...history]);
  }

  private renderMap() {
    if (!this.svgElement) {
      return;
    }

    const svg = this.svgElement.nativeElement;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const hexOps = new HexOps(50);
    const svgDrawer = new SvgDrawer(svg);
    const hexCenters = this.calcHexCenters(hexOps);

    for (const center of hexCenters) {
      svgDrawer.drawPolygon(hexOps.hexPoints(center));
    }

    const biomeImages = fromHexesDetailedToImagePathHexes(
      fromHexesToHexesDetailed(this.biomes())
    );
    const biomeOpts = { width: 2.45 * hexOps.h, height: 2.45 * hexOps.h };
    const featureImages = fromHexesDetailedToImagePathHexes(this.features());
    const featureOpts = { width: 50, height: 50 };

    for (let i = 0; i < hexCenters.length; i++) {
      const hexNum = i + 1;
      const center = hexCenters[i];
      const biomeImage = biomeImages[hexNum];
      if (biomeImage) {
        svgDrawer.drawImageAtPoint(center, biomeImage, biomeOpts);
      }
      const featureImage = featureImages[hexNum];
      if (featureImage) {
        svgDrawer.drawImageAtPoint(center, featureImage, featureOpts);
      }
    }

    this.drawFactionSymbols(svgDrawer, hexCenters);

    const selected = this.hex();
    if (selected >= 1 && selected <= hexCenters.length) {
      svgDrawer.drawPolygon(hexOps.hexPoints(hexCenters[selected - 1]), {
        fill: 'none',
        stroke: '#c00',
        strokeWidth: '4',
      });
    }

    for (let i = 0; i < hexCenters.length; i++) {
      svgDrawer.drawTextAtPoint(
        { x: hexCenters[i].x, y: hexCenters[i].y - 25 },
        i + 1,
        { fontSize: '20' }
      );
    }
  }

  private drawFactionSymbols(svgDrawer: SvgDrawer, hexCenters: Point[]) {
    const hexFactions = this.factions()?.hexFactions;
    if (!hexFactions) {
      return;
    }

    for (let i = 0; i < hexCenters.length; i++) {
      const factionNumbers = hexFactions[i + 1] ?? [];
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

  private factionColor(factionNumber: number): string {
    return this.factionColors[(factionNumber - 1) % this.factionColors.length];
  }

  private factionShape(factionNumber: number): FactionShape {
    return this.factionShapes[(factionNumber - 1) % this.factionShapes.length];
  }

  private calcHexCenters(hexOps: HexOps): Point[] {
    const center_01 = { x: this.width / 2, y: this.height / 2 };
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

  featureLabel(hex: number): string {
    const details = this.features()[hex];
    return details ? details[details.length - 1] : '—';
  }

  factionLabel(hex: number): string {
    const factions = this.factions();
    if (!factions) {
      return '—';
    }
    const numbers = factions.hexFactions[hex] ?? [];
    return numbers.length ? numbers.join(', ') : 'none';
  }
}
