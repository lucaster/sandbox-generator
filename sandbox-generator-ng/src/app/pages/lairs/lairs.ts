import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcLair } from '../../../data/lairs';

@Component({
  selector: 'app-lairs',
  imports: [JsonPipe, NgTemplateOutlet],
  templateUrl: './lairs.html',
  styleUrl: './lairs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lairs implements OnInit {

  lairs: ReturnType<typeof calcLair>[] = [];

  ngOnInit(): void {
    this.onCalcLairs();
  }

  onCalcLairs() {
    const biomes = ['Grassland', 'Hills', 'Marsh', 'Forest', 'Mountains'];
    this.lairs = biomes.map(calcLair);
  }
}
