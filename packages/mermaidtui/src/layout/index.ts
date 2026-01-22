import { Graph, Node, NodeId, Direction } from "../types";

const MIN_NODE_WIDTH = 5;
const NODE_HEIGHT = 3;
const HORIZONTAL_GAP = 4;
const VERTICAL_GAP = 2;

export function computeLayout(graph: Graph) {
  // 1. Compute node sizes
  for (const node of graph.nodes.values()) {
    node.width = Math.max(node.label.length + 2, MIN_NODE_WIDTH);
    node.height = NODE_HEIGHT;
  }

  // 2. Topological Layering (Longest path from source)
  const layers = assignLayers(graph);
  
  // 3. Position assignment based on direction
  assignCoordinates(graph, layers);
}

function assignLayers(graph: Graph): Map<NodeId, number> {
  const nodeLayers = new Map<NodeId, number>();
  const inDegree = new Map<NodeId, number>();
  
  for (const node of graph.nodes.keys()) {
    inDegree.set(node, 0);
    nodeLayers.set(node, 0);
  }
  
  for (const edge of graph.edges) {
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  }
  
  const queue: NodeId[] = [];
  for (const [id, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(id);
    }
  }
  
  let processed = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    processed++;
    
    // Find all neighbors
    const neighbors = graph.edges.filter(e => e.from === u).map(e => e.to);
    for (const v of neighbors) {
      nodeLayers.set(v, Math.max(nodeLayers.get(v)!, nodeLayers.get(u)! + 1));
      inDegree.set(v, inDegree.get(v)! - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  if (processed < graph.nodes.size) {
    console.warn("Cycle detected in graph. Layout may be imperfect.");
  }
  
  return nodeLayers;
}

function assignCoordinates(graph: Graph, nodeLayers: Map<NodeId, number>) {
  const direction = graph.direction;
  const layersMap: Map<number, NodeId[]> = new Map();
  
  let maxLayer = 0;
  for (const [id, layer] of nodeLayers.entries()) {
    if (!layersMap.has(layer)) layersMap.set(layer, []);
    layersMap.get(layer)!.push(id);
    maxLayer = Math.max(maxLayer, layer);
  }

  const layerWidths = new Map<number, number>();
  const layerHeights = new Map<number, number>();
  
  // Calculate layer dimensions
  for (let l = 0; l <= maxLayer; l++) {
    const nodesInLayer = layersMap.get(l) || [];
    let maxW = 0;
    let maxH = 0;
    let totalW = 0;
    let totalH = 0;
    
    for (const id of nodesInLayer) {
      const node = graph.nodes.get(id)!;
      maxW = Math.max(maxW, node.width);
      maxH = Math.max(maxH, node.height);
      totalW += node.width + HORIZONTAL_GAP;
      totalH += node.height + VERTICAL_GAP;
    }
    
    if (direction === "LR" || direction === "RL") {
      layerWidths.set(l, maxW);
      layerHeights.set(l, totalH - VERTICAL_GAP);
    } else {
      layerWidths.set(l, totalW - HORIZONTAL_GAP);
      layerHeights.set(l, maxH);
    }
  }

  const maxTotalWidth = Math.max(...Array.from(layerWidths.values()));
  const maxTotalHeight = Math.max(...Array.from(layerHeights.values()));

  if (direction === "LR" || direction === "RL") {
    let currentX = 0;
    for (let l = 0; l <= maxLayer; l++) {
      const layerIdx = direction === "LR" ? l : maxLayer - l;
      const nodesInLayer = layersMap.get(layerIdx) || [];
      const layerH = layerHeights.get(layerIdx) || 0;
      let startY = Math.floor((maxTotalHeight - layerH) / 2);
      
      for (const id of nodesInLayer) {
        const node = graph.nodes.get(id)!;
        node.x = currentX;
        node.y = startY;
        startY += node.height + VERTICAL_GAP;
      }
      currentX += (layerWidths.get(layerIdx) || 0) + HORIZONTAL_GAP;
    }
  } else {
    let currentY = 0;
    for (let l = 0; l <= maxLayer; l++) {
      const layerIdx = direction === "TB" ? l : maxLayer - l;
      const nodesInLayer = layersMap.get(layerIdx) || [];
      const layerW = layerWidths.get(layerIdx) || 0;
      let startX = Math.floor((maxTotalWidth - layerW) / 2);
      
      for (const id of nodesInLayer) {
        const node = graph.nodes.get(id)!;
        node.x = startX;
        node.y = currentY;
        startX += node.width + HORIZONTAL_GAP;
      }
      currentY += (layerHeights.get(layerIdx) || 0) + VERTICAL_GAP;
    }
  }
}
