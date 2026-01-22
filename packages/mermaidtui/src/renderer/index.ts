import { Graph, Node, Edge, RenderOptions, Direction } from "../types";
import { Grid } from "../grid";

const UNICODE_CHARS = {
  tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│",
  arrR: "▶", arrL: "◀", arrD: "▼", arrU: "▲"
};

const ASCII_CHARS = {
  tl: "+", tr: "+", bl: "+", br: "+", h: "-", v: "|",
  arrR: ">", arrL: "<", arrD: "v", arrU: "^"
};

export function renderGraph(graph: Graph, options: RenderOptions = {}): string {
  const chars = options.ascii ? ASCII_CHARS : UNICODE_CHARS;
  
  // Find grid bounds
  let maxX = 0;
  let maxY = 0;
  for (const node of graph.nodes.values()) {
    maxX = Math.max(maxX, (node.x || 0) + node.width);
    maxY = Math.max(maxY, (node.y || 0) + node.height);
  }
  
  // Add some padding
  const grid = new Grid(maxX + 2, maxY + 2);

  // 1. Render Boxes
  for (const node of graph.nodes.values()) {
    drawBox(grid, node, chars);
  }

  // 2. Render Edges
  for (const edge of graph.edges) {
    drawEdge(grid, graph.nodes.get(edge.from)!, graph.nodes.get(edge.to)!, chars, graph.direction);
  }

  return grid.toString();
}

function drawBox(grid: Grid, node: Node, chars: typeof UNICODE_CHARS) {
  const { x = 0, y = 0, width, height, label } = node;

  // Corners
  grid.set(x, y, chars.tl);
  grid.set(x + width - 1, y, chars.tr);
  grid.set(x, y + height - 1, chars.bl);
  grid.set(x + width - 1, y + height - 1, chars.br);

  // Horizontal lines
  for (let i = 1; i < width - 1; i++) {
    grid.set(x + i, y, chars.h);
    grid.set(x + i, y + height - 1, chars.h);
  }

  // Vertical lines
  for (let i = 1; i < height - 1; i++) {
    grid.set(x, y + i, chars.v);
    grid.set(x + width - 1, y + i, chars.v);
  }

  // Label (centered)
  const labelX = x + Math.floor((width - label.length) / 2);
  const labelY = y + 1;
  for (let i = 0; i < label.length; i++) {
    grid.set(labelX + i, labelY, label[i]);
  }
}

function drawEdge(grid: Grid, from: Node, to: Node, chars: typeof UNICODE_CHARS, direction: Direction) {
  const fromX = from.x || 0;
  const fromY = from.y || 0;
  const toX = to.x || 0;
  const toY = to.y || 0;

  let startX: number, startY: number, endX: number, endY: number, arrowChar: string;

  if (direction === "LR") {
    startX = fromX + from.width;
    startY = fromY + 1;
    endX = toX;
    endY = toY + 1;
    arrowChar = chars.arrR;
  } else if (direction === "RL") {
    startX = fromX;
    startY = fromY + 1;
    endX = toX + to.width;
    endY = toY + 1;
    arrowChar = chars.arrL;
  } else if (direction === "TB") {
    startX = fromX + Math.floor(from.width / 2);
    startY = fromY + from.height;
    endX = toX + Math.floor(to.width / 2);
    endY = toY;
    arrowChar = chars.arrD;
  } else { // BT
    startX = fromX + Math.floor(from.width / 2);
    startY = fromY;
    endX = toX + Math.floor(to.width / 2);
    endY = toY + to.height;
    arrowChar = chars.arrU;
  }

  if (direction === "LR" || direction === "RL") {
    if (startY === endY) {
      const step = endX > startX ? 1 : -1;
      for (let x = startX; x !== endX; x += step) grid.set(x, startY, chars.h);
      grid.set(endX - (endX > startX ? 1 : -1), endY, arrowChar);
    } else {
      const midX = startX + Math.floor((endX - startX) / 2);
      
      // Horizontal from start to mid
      const xStep1 = midX > startX ? 1 : -1;
      for (let x = startX; x !== midX; x += xStep1) grid.set(x, startY, chars.h);
      
      // Corner or vertical
      grid.set(midX, startY, chars.v); 

      // Vertical from startY to endY
      const yDir = endY > startY ? 1 : -1;
      for (let y = startY + yDir; y !== endY; y += yDir) grid.set(midX, y, chars.v);
      
      // Horizontal from mid to end
      const xStep2 = endX > midX ? 1 : -1;
      for (let x = midX; x !== endX; x += xStep2) grid.set(x, endY, chars.h);
      grid.set(endX - (endX > midX ? 1 : -1), endY, arrowChar);
    }
  } else { // TB or BT
    if (startX === endX) {
      const step = endY > startY ? 1 : -1;
      for (let y = startY; y !== endY; y += step) grid.set(startX, y, chars.v);
      grid.set(endX, endY - (endY > startY ? 1 : -1), arrowChar);
    } else {
      const midY = startY + Math.floor((endY - startY) / 2);
      
      // Vertical from start to mid
      const yStep1 = midY > startY ? 1 : -1;
      for (let y = startY; y !== midY; y += yStep1) grid.set(startX, y, chars.v);
      
      // Corner or horizontal
      grid.set(startX, midY, chars.h);

      // Horizontal from startX to endX
      const xDir = endX > startX ? 1 : -1;
      for (let x = startX + xDir; x !== endX; x += xDir) grid.set(x, midY, chars.h);
      
      // Vertical from mid to end
      const yStep2 = endY > midY ? 1 : -1;
      for (let y = midY; y !== endY; y += yStep2) grid.set(endX, y, chars.v);
      grid.set(endX, endY - (endY > midY ? 1 : -1), arrowChar);
    }
  }
}
