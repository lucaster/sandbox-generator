import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HexPatch } from '../../components/hex-patch/hex-patch';

@Component({
  selector: 'app-hex-overall',
  imports: [HexPatch],
  templateUrl: './hex-overall.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexOverall {
  readonly importError = signal<string | null>(null);

  exportOverallPatch(patch: HexPatch) {
    const data = JSON.stringify(patch.exportOverallPatch(), null, 2);
    const file = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hex-overall.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importOverallPatch(event: Event, patch: HexPatch) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Overall patch import requires a file input.');
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.importError.set(null);
    try {
      patch.loadOverallPatch(JSON.parse(await file.text()));
    } catch (error) {
      this.importError.set(
        `Unable to import overall patch: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      input.value = '';
    }
  }
}
