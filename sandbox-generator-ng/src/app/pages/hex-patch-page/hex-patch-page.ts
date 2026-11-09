import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  HexPatch,
  type FeaturePatchExport,
  type FactionPatchExport,
  type HexPatchMode,
} from '../../components/hex-patch/hex-patch';
import type { HexRolls, HexRollSequences } from '../../../data/data';

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

  exportFeaturePatch(patch: HexPatch) {
    const data = JSON.stringify(patch.exportFeaturePatch(), null, 2);
    const file = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feature-patch.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importFeaturePatch(event: Event, patch: HexPatch) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Feature patch import requires a file input.');
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.importError.set(null);
    try {
      const imported = this.parseFeaturePatch(JSON.parse(await file.text()));
      patch.loadFeaturePatch(imported);
    } catch (error) {
      this.importError.set(
        `Unable to import feature patch: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      input.value = '';
    }
  }

  exportFactionPatch(patch: HexPatch) {
    const data = JSON.stringify(patch.exportFactionPatch(), null, 2);
    const file = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'faction-patch.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importFactionPatch(event: Event, patch: HexPatch) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Faction patch import requires a file input.');
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.importError.set(null);
    try {
      const imported = this.parseFactionPatch(JSON.parse(await file.text()));
      patch.loadFactionPatch(imported);
    } catch (error) {
      this.importError.set(
        `Unable to import faction patch: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      input.value = '';
    }
  }

  private parseBiomePatch(value: unknown): HexRolls {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('Expected a JSON object mapping hex numbers to rolls.');
    }

    const entries = Object.entries(value);
    if (entries.length !== 19) {
      throw new Error('Expected exactly 19 hex entries.');
    }

    const result: HexRolls = {};
    for (const [hex, roll] of entries) {
      const hexNumber = Number(hex);
      if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
        throw new Error(`Invalid hex number: ${hex}.`);
      }
      if (typeof roll !== 'number' || !Number.isInteger(roll) || roll < 1 || roll > 10) {
        throw new Error(`Invalid biome roll for hex ${hex}.`);
      }
      result[hexNumber] = roll;
    }

    if (Object.keys(result).length !== 19) {
      throw new Error('Expected each hex number from 1 to 19 exactly once.');
    }
    return result;
  }

  private parseFeaturePatch(value: unknown): FeaturePatchExport {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('Expected a JSON object containing feature, biome, and lair rolls.');
    }

    const featurePatch = value as Record<string, unknown>;
    if (
      !Object.hasOwn(featurePatch, 'featureRolls') ||
      !Object.hasOwn(featurePatch, 'biomeRolls') ||
      !Object.hasOwn(featurePatch, 'lairRolls')
    ) {
      throw new Error('Feature patch JSON must contain featureRolls, biomeRolls, and lairRolls.');
    }

    const entries = Object.entries(featurePatch['featureRolls'] ?? {});
    if (entries.length !== 19) {
      throw new Error('Expected exactly 19 hex entries.');
    }

    const result: HexRollSequences = {};
    for (const [hex, rolls] of entries) {
      const hexNumber = Number(hex);
      if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
        throw new Error(`Invalid hex number: ${hex}.`);
      }
      if (
        !Array.isArray(rolls) ||
        rolls.length === 0 ||
        !rolls.every((roll) => typeof roll === 'number' && Number.isInteger(roll))
      ) {
        throw new Error(`Feature rolls for hex ${hex} must be a non-empty array of integers.`);
      }
      result[hexNumber] = rolls;
    }

    if (Object.keys(result).length !== 19) {
      throw new Error('Expected each hex number from 1 to 19 exactly once.');
    }

    const biomeRolls =
      featurePatch['biomeRolls'] === null
        ? null
        : this.parseBiomePatch(featurePatch['biomeRolls']);
    if (
      typeof featurePatch['lairRolls'] !== 'object' ||
      featurePatch['lairRolls'] === null ||
      Array.isArray(featurePatch['lairRolls'])
    ) {
      throw new Error('Lair rolls must be a JSON object mapping hex numbers to roll sequences.');
    }
    const lairRolls: { [hex: number]: number[] } = {};
    for (const [hex, rolls] of Object.entries(featurePatch['lairRolls'])) {
      const hexNumber = Number(hex);
      if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
        throw new Error(`Invalid lair hex number: ${hex}.`);
      }
      if (
        !Array.isArray(rolls) ||
        !rolls.every((roll) => typeof roll === 'number' && Number.isInteger(roll))
      ) {
        throw new Error(`Lair rolls for hex ${hex} must be an array of integers.`);
      }
      lairRolls[hexNumber] = rolls;
    }
    return { featureRolls: result, biomeRolls, lairRolls };
  }

  private parseFactionPatch(value: unknown): FactionPatchExport {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('Expected a JSON object containing faction rolls.');
    }
    const factionPatch = value as Record<string, unknown>;
    if (!Array.isArray(factionPatch['factionRolls'])) {
      throw new Error('Faction rolls must be an array of integers.');
    }
    const factionRolls: number[] = [];
    for (const roll of factionPatch['factionRolls']) {
      if (typeof roll !== 'number' || !Number.isInteger(roll)) {
        throw new Error('Faction rolls must be an array of integers.');
      }
      factionRolls.push(roll);
    }
    return {
      ...this.parseFeaturePatch(value),
      factionRolls,
    };
  }
}
