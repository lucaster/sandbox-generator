import { Point } from './point';

export type FactionShape =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'star';

export class SvgDrawer {
  constructor(private svg: SVGElement) {}

  drawPolygon(points: Point[]) {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points.map((p) => [p.x, p.y].join(',')).join(' '));
    polygon.setAttribute('fill', 'beige');
    polygon.setAttribute('stroke', 'black');
    polygon.setAttribute('stroke-width', '2');
    this.svg.appendChild(polygon);
  }

  drawImageAtPoint(point: Point, imageUrl: string, options: ImageOptions = {}) {
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    const width = options.width || 50;
    const height = options.height || 50;
    const anchorX = options.anchorX || 'center'; // "left", "center", "right"
    const anchorY = options.anchorY || 'center'; // "top", "center", "bottom"

    // Calculate x and y based on anchor point
    let x = point.x;
    let y = point.y;

    if (anchorX === 'center') {
      x -= width / 2;
    } else if (anchorX === 'right') {
      x -= width;
    }

    if (anchorY === 'center') {
      y -= height / 2;
    } else if (anchorY === 'bottom') {
      y -= height;
    }

    image.setAttribute('href', imageUrl);
    image.setAttribute('x', '' + x);
    image.setAttribute('y', '' + y);
    image.setAttribute('width', '' + width);
    image.setAttribute('height', '' + height);

    // Optional: preserve aspect ratio
    if (options.preserveAspectRatio !== undefined) {
      image.setAttribute('preserveAspectRatio', options.preserveAspectRatio);
    }

    this.svg.appendChild(image);
  }

  drawTextAtPoint(point: Point, textContent: string | number, options: TextOptions = {}) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '' + point.x);
    text.setAttribute('y', '' + point.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', options.fontSize || '30');
    text.setAttribute('font-weight', options.fontWeight || 'bold');

    // Fill color
    text.setAttribute('fill', options.fill || 'white');

    // Outline/stroke
    text.setAttribute('stroke', options.stroke || 'black');
    text.setAttribute('stroke-width', options.strokeWidth || '1');
    text.setAttribute('stroke-linejoin', 'round');
    text.setAttribute('stroke-linecap', 'round');

    text.textContent = '' + textContent;
    this.svg.appendChild(text);
  }

  drawSymbolAtPoint(point: Point, shape: FactionShape, options: SymbolOptions = {}) {
    const size = options.size ?? 12;
    const element = this.symbolElement(shape, point, size);
    element.setAttribute('fill', options.fill ?? 'white');
    element.setAttribute('stroke', options.stroke ?? 'black');
    element.setAttribute('stroke-width', options.strokeWidth ?? '1.5');
    this.svg.appendChild(element);

    if (options.text !== undefined) {
      this.drawTextAtPoint(point, options.text, {
        fontSize: options.fontSize ?? '12',
        fill: options.textFill ?? 'white',
        stroke: options.textStroke ?? 'black',
        strokeWidth: options.textStrokeWidth ?? '0.5',
      });
    }
  }

  private symbolElement(shape: FactionShape, point: Point, size: number): SVGElement {
    const svgNamespace = 'http://www.w3.org/2000/svg';
    if (shape === 'circle') {
      const circle = document.createElementNS(svgNamespace, 'circle');
      circle.setAttribute('cx', '' + point.x);
      circle.setAttribute('cy', '' + point.y);
      circle.setAttribute('r', '' + size);
      return circle;
    }
    if (shape === 'square') {
      const rect = document.createElementNS(svgNamespace, 'rect');
      rect.setAttribute('x', '' + (point.x - size));
      rect.setAttribute('y', '' + (point.y - size));
      rect.setAttribute('width', '' + size * 2);
      rect.setAttribute('height', '' + size * 2);
      return rect;
    }
    const polygon = document.createElementNS(svgNamespace, 'polygon');
    polygon.setAttribute('points', this.symbolPoints(shape, point, size));
    return polygon;
  }

  private symbolPoints(shape: FactionShape, point: Point, size: number): string {
    switch (shape) {
      case 'triangle':
        return regularPolygonPoints(point, size, 3);
      case 'diamond':
        return regularPolygonPoints(point, size, 4);
      case 'hexagon':
        return regularPolygonPoints(point, size, 6);
      case 'star':
        return starPolygonPoints(point, size, 5);
      case 'circle':
      case 'square':
        return '';
    }
  }
}

function regularPolygonPoints(point: Point, radius: number, sides: number): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    points.push(
      `${point.x + radius * Math.cos(angle)},${point.y + radius * Math.sin(angle)}`
    );
  }
  return points.join(' ');
}

function starPolygonPoints(point: Point, radius: number, points: number): string {
  const result: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const pointRadius = i % 2 === 0 ? radius : radius * 0.45;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    result.push(
      `${point.x + pointRadius * Math.cos(angle)},${point.y + pointRadius * Math.sin(angle)}`
    );
  }
  return result.join(' ');
}

interface SymbolOptions {
  readonly size?: number;
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: string;
  readonly text?: string | number;
  readonly textFill?: string;
  readonly textStroke?: string;
  readonly textStrokeWidth?: string;
  readonly fontSize?: string;
}

interface ImageOptions {
  readonly width?: number;
  readonly height?: number;
  readonly anchorX?: 'left' | 'center' | 'right';
  readonly anchorY?: 'top' | 'center' | 'bottom';
  readonly preserveAspectRatio?: string;
}

interface TextOptions {
  readonly fontSize?: string;
  readonly fontWeight?: string;
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: string;
}
