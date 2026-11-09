import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HexPatch, type HexPatchMode } from '../../components/hex-patch/hex-patch';
import type { Hexes } from '../../../data/data';

const patchTitles: Record<Exclude<HexPatchMode, 'sample'>, string> = {
  biome: 'Biome',
  feature: 'Feature',
  faction: 'Faction',
  content: 'Content',
};

function isPatchMode(mode: unknown): mode is keyof typeof patchTitles {
  return typeof mode === 'string' && Object.hasOwn(patchTitles, mode);
}

@Component({
  selector: 'app-hex-patch-page',
  imports: [HexPatch],
  templateUrl: './hex-patch-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexPatchPage {
  private readonly route = inject(ActivatedRoute);
  readonly mode = this.readMode(this.route.snapshot.data['mode']);
  readonly title = patchTitles[this.mode];
  readonly importError = signal<string | null>(null);

  private readMode(mode: unknown): keyof typeof patchTitles {
    if (!isPatchMode(mode)) {
      throw new Error(`Invalid hex patch page mode: ${String(mode)}`);
    }
    return mode;
  }

  exportBiomePatch(patch: HexPatch) {
    const data = JSON.stringify(patch.exportBiomePatch(), null, 2);
    const file = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'biome-patch.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importBiomePatch(event: Event, patch: HexPatch) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Biome patch import requires a file input.');
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.importError.set(null);
    try {
      const imported = this.parseBiomePatch(JSON.parse(await file.text()));
      patch.loadBiomePatch(imported);
    } catch (error) {
      this.importError.set(
        `Unable to import biome patch: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      input.value = '';
    }
  }

  private parseBiomePatch(value: unknown): Hexes {
    const biomes = ['Grassland', 'Forest', 'Hills', 'Marsh', 'Mountains'];
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('Expected a JSON object mapping hex numbers to biomes.');
    }

    const entries = Object.entries(value);
    if (entries.length !== 19) {
      throw new Error('Expected exactly 19 hex entries.');
    }

    const result: Hexes = {};
    for (const [hex, biome] of entries) {
      const hexNumber = Number(hex);
      if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
        throw new Error(`Invalid hex number: ${hex}.`);
      }
      if (typeof biome !== 'string' || !biomes.includes(biome)) {
        throw new Error(`Invalid biome for hex ${hex}.`);
      }
      result[hexNumber] = biome;
    }

    if (Object.keys(result).length !== 19) {
      throw new Error('Expected each hex number from 1 to 19 exactly once.');
    }
    return result;
  }
}
