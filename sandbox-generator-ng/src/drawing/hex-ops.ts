import { Point } from './point';

export class HexOps {
  public readonly h: number;

  constructor(public readonly r: number) {
    this.h = r * Math.sin(Math.PI / 3);
  }

  up(center: Point) {
    return { x: center.x, y: center.y - 2 * this.h };
  }

  down(center: Point) {
    return { x: center.x, y: center.y + 2 * this.h };
  }

  right(center: Point) {
    return { x: center.x + 3 * this.r, y: center.y };
  }

  left(center: Point) {
    return { x: center.x - 3 * this.r, y: center.y };
  }

  upRight(center: Point) {
    return { x: center.x + (3 / 2) * this.r, y: center.y - this.h };
  }

  upLeft(center: Point) {
    return { x: center.x - (3 / 2) * this.r, y: center.y - this.h };
  }

  downRight(center: Point) {
    return { x: center.x + (3 / 2) * this.r, y: center.y + this.h };
  }

  downLeft(center: Point) {
    return { x: center.x - (3 / 2) * this.r, y: center.y + this.h };
  }

  hexPoints(center: Point): Point[] {
    const centerX = center.x;
    const centerY = center.y;
    const points: Point[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i; // 60 degrees in radians
      const x = centerX + this.r * Math.cos(angle);
      const y = centerY + this.r * Math.sin(angle);
      points.push({ x, y });
    }
    return points;
  }
}
