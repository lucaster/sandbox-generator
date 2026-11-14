import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HexPatch } from '../../components/hex-patch/hex-patch';

@Component({
  selector: 'app-hex-overall',
  imports: [HexPatch],
  templateUrl: './hex-overall.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexOverall {}
