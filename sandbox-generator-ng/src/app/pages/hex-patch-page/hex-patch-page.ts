import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HexPatch, type HexPatchMode } from '../../components/hex-patch/hex-patch';

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

  private readMode(mode: unknown): keyof typeof patchTitles {
    if (!isPatchMode(mode)) {
      throw new Error(`Invalid hex patch page mode: ${String(mode)}`);
    }
    return mode;
  }
}
