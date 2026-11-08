import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HexPatch } from '../../components/hex-patch/hex-patch';

@Component({
  selector: 'app-hex-draw-patch',
  imports: [HexPatch, RouterLink],
  templateUrl: './hex-draw-patch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexDrawPatch {}
