import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcContent } from '../../../data/content';

@Component({
  selector: 'app-landmark-content',
  imports: [],
  templateUrl: './content.html',
  styleUrl: './content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandmarkContent implements OnInit {

  content?: ReturnType<typeof calcContent>;

  ngOnInit(): void {
    this.onCalcContent();
  }

  onCalcContent() {
    this.content = calcContent();
  }
}
