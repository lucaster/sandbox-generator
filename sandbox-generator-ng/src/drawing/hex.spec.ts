import { SvgDrawer } from './hex';

describe('SvgDrawer', () => {
  it('stores image URLs relative to the page base', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const drawer = new SvgDrawer(svg);

    drawer.drawImageAtPoint({ x: 10, y: 10 }, '/assets/images/lair.png');

    const image = svg.querySelector('image');
    expect(image?.getAttribute('href')).toBe('assets/images/lair.png');
  });
});
