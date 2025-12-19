function drawPolygon(svg, points) {
  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  polygon.setAttribute("points", points.map((p) => p.join(",")).join(" "));
  polygon.setAttribute("fill", "beige");
  polygon.setAttribute("stroke", "black");
  polygon.setAttribute("stroke-width", "2");
  svg.appendChild(polygon);
}

function drawTextAtPoint(svg, point, textContent, options = {}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", point.x);
  text.setAttribute("y", point.y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-size", options.fontSize || "30");
  text.setAttribute("font-weight", options.fontWeight || "bold");

  // Fill color
  text.setAttribute("fill", options.fill || "white");

  // Outline/stroke
  text.setAttribute("stroke", options.stroke || "black");
  text.setAttribute("stroke-width", options.strokeWidth || "1");
  text.setAttribute("stroke-linejoin", "round");
  text.setAttribute("stroke-linecap", "round");

  text.textContent = textContent;
  svg.appendChild(text);
}

function drawImageAtPoint(svg, point, imageUrl, options = {}) {

  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");

  const width = options.width || 50;
  const height = options.height || 50;
  const anchorX = options.anchorX || "center"; // "left", "center", "right"
  const anchorY = options.anchorY || "center"; // "top", "center", "bottom"

  // Calculate x and y based on anchor point
  let x = point.x;
  let y = point.y;

  if (anchorX === "center") {
    x -= width / 2;
  } else if (anchorX === "right") {
    x -= width;
  }

  if (anchorY === "center") {
    y -= height / 2;
  } else if (anchorY === "bottom") {
    y -= height;
  }

  image.setAttribute("href", imageUrl);
  image.setAttribute("x", x);
  image.setAttribute("y", y);
  image.setAttribute("width", width);
  image.setAttribute("height", height);

  // Optional: preserve aspect ratio
  if (options.preserveAspectRatio !== undefined) {
    image.setAttribute("preserveAspectRatio", options.preserveAspectRatio);
  }

  svg.appendChild(image);
}

function hexPoints(center, radius) {
  const centerX = center.x;
  const centerY = center.y;
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees in radians
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

const r = 50;
const h = r * Math.sin(Math.PI / 3);

function up(center) {
  return { x: center.x, y: center.y - 2 * h };
}

function down(center) {
  return { x: center.x, y: center.y + 2 * h };
}

function right(center) {
  return { x: center.x + 3 * r, y: center.y };
}

function left(center) {
  return { x: center.x - 3 * r, y: center.y };
}

function upRight(center) {
  return { x: center.x + (3 / 2) * r, y: center.y - h };
}

function upLeft(center) {
  return { x: center.x - (3 / 2) * r, y: center.y - h };
}

function downRight(center) {
  return { x: center.x + (3 / 2) * r, y: center.y + h };
}

function downLeft(center) {
  return { x: center.x - (3 / 2) * r, y: center.y + h };
}

const svg = document.getElementById("svg");


const center_01 = { x: 250, y: 250 };
const center_02 = up(center_01);
const center_03 = upRight(center_01);
const center_04 = downRight(center_01);
const center_05 = down(center_01);
const center_06 = downLeft(center_01);
const center_07 = upLeft(center_01);
const center_08 = up(center_02);
const center_09 = downRight(center_08);
const center_10 = upRight(center_03);
const center_11 = down(center_10);
const center_12 = downRight(center_04);
const center_13 = downLeft(center_12);
const center_14 = down(center_05);
const center_15 = upLeft(center_14);
const center_16 = downLeft(center_06);
const center_17 = up(center_16);
const center_18 = upLeft(center_07);
const center_19 = upRight(center_18);

const points_01 = hexPoints(center_01, r);
const points_02 = hexPoints(center_02, r);
const points_03 = hexPoints(center_03, r);
const points_04 = hexPoints(center_04, r);
const points_05 = hexPoints(center_05, r);
const points_06 = hexPoints(center_06, r);
const points_07 = hexPoints(center_07, r);
const points_08 = hexPoints(center_08, r);
const points_09 = hexPoints(center_09, r);
const points_10 = hexPoints(center_10, r);
const points_11 = hexPoints(center_11, r);
const points_12 = hexPoints(center_12, r);
const points_13 = hexPoints(center_13, r);
const points_14 = hexPoints(center_14, r);
const points_15 = hexPoints(center_15, r);
const points_16 = hexPoints(center_16, r);
const points_17 = hexPoints(center_17, r);
const points_18 = hexPoints(center_18, r);
const points_19 = hexPoints(center_19, r);

drawPolygon(svg, points_01);
drawPolygon(svg, points_02);
drawPolygon(svg, points_03);
drawPolygon(svg, points_04);
drawPolygon(svg, points_05);
drawPolygon(svg, points_06);
drawPolygon(svg, points_07);
drawPolygon(svg, points_08);
drawPolygon(svg, points_09);
drawPolygon(svg, points_10);
drawPolygon(svg, points_11);
drawPolygon(svg, points_12);
drawPolygon(svg, points_13);
drawPolygon(svg, points_14);
drawPolygon(svg, points_15);
drawPolygon(svg, points_16);
drawPolygon(svg, points_17);
drawPolygon(svg, points_18);
drawPolygon(svg, points_19);


const biomeOpts = { width: 2.45 * h, height: 2.45 * h };
drawImageAtPoint(svg, center_01, "forest.png", biomeOpts);
drawImageAtPoint(svg, center_02, "grassland.png", biomeOpts);
drawImageAtPoint(svg, center_03, "hills.png", biomeOpts);
drawImageAtPoint(svg, center_04, "marsh.png", biomeOpts);
drawImageAtPoint(svg, center_05, "mountains.png", biomeOpts);
drawImageAtPoint(svg, center_06, "forest.png", biomeOpts);
drawImageAtPoint(svg, center_07, "grassland.png", biomeOpts);
drawImageAtPoint(svg, center_08, "hills.png", biomeOpts);
drawImageAtPoint(svg, center_09, "marsh.png", biomeOpts);
drawImageAtPoint(svg, center_10, "mountains.png", biomeOpts);
drawImageAtPoint(svg, center_11, "forest.png", biomeOpts);
drawImageAtPoint(svg, center_12, "grassland.png", biomeOpts);
drawImageAtPoint(svg, center_13, "hills.png", biomeOpts);
drawImageAtPoint(svg, center_14, "marsh.png", biomeOpts);
drawImageAtPoint(svg, center_15, "mountains.png", biomeOpts);
drawImageAtPoint(svg, center_16, "forest.png", biomeOpts);
drawImageAtPoint(svg, center_17, "grassland.png", biomeOpts);
drawImageAtPoint(svg, center_18, "hills.png", biomeOpts);
drawImageAtPoint(svg, center_19, "marsh.png", biomeOpts);

drawImageAtPoint(svg, center_01, "abbey.png");
drawImageAtPoint(svg, center_02, "castle.png");
drawImageAtPoint(svg, center_03, "city.png");
drawImageAtPoint(svg, center_04, "dungeon.png");
drawImageAtPoint(svg, center_05, "hamlet.png");
drawImageAtPoint(svg, center_06, "lair.png");
drawImageAtPoint(svg, center_07, "landmark.png");
drawImageAtPoint(svg, center_08, "tower.png");
drawImageAtPoint(svg, center_09, "village.png");
drawImageAtPoint(svg, center_11, "abbey.png");
drawImageAtPoint(svg, center_12, "castle.png");
drawImageAtPoint(svg, center_13, "city.png");
drawImageAtPoint(svg, center_14, "dungeon.png");
drawImageAtPoint(svg, center_15, "hamlet.png");
drawImageAtPoint(svg, center_16, "lair.png");
drawImageAtPoint(svg, center_17, "landmark.png");
drawImageAtPoint(svg, center_18, "tower.png");
drawImageAtPoint(svg, center_19, "village.png");

drawTextAtPoint(svg, center_01, 1);
drawTextAtPoint(svg, center_02, 2);
drawTextAtPoint(svg, center_03, 3);
drawTextAtPoint(svg, center_04, 4);
drawTextAtPoint(svg, center_05, 5);
drawTextAtPoint(svg, center_06, 6);
drawTextAtPoint(svg, center_07, 7);
drawTextAtPoint(svg, center_08, 8);
drawTextAtPoint(svg, center_09, 9);
drawTextAtPoint(svg, center_10, 10);
drawTextAtPoint(svg, center_11, 11);
drawTextAtPoint(svg, center_12, 12);
drawTextAtPoint(svg, center_13, 13);
drawTextAtPoint(svg, center_14, 14);
drawTextAtPoint(svg, center_15, 15);
drawTextAtPoint(svg, center_16, 16);
drawTextAtPoint(svg, center_17, 17);
drawTextAtPoint(svg, center_18, 18);
drawTextAtPoint(svg, center_19, 19);
