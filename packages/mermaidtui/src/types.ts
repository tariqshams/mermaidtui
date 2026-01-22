export type NodeId = string;

export interface Node {
  id: NodeId;
  label: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export interface Edge {
  from: NodeId;
  to: NodeId;
}

export type Direction = "LR" | "RL" | "TB" | "BT";

export interface Graph {
  direction: Direction;
  nodes: Map<NodeId, Node>;
  edges: Edge[];
}

export interface RenderOptions {
  ascii?: boolean;
  maxWidth?: number;
}
