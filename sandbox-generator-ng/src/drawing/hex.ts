import { Point } from './point';

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
