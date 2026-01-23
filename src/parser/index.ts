import { Graph, Node, Edge, Direction, NodeId } from "../types.js";

export class ParseError extends Error {
  constructor(public line: number, message: string, public suggestion?: string) {
    super(`Line ${line}: ${message}${suggestion ? ` (Suggestion: ${suggestion})` : ""}`);
    this.name = "ParseError";
  }
}

export function parseMermaid(input: string): Graph {
  const lines = input.split("\n").map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith("%%"));

  if (lines.length === 0) {
    throw new Error("Empty input");
  }

  const firstLine = lines[0];
  const firstLineMatch = firstLine.match(/^flowchart\s+(LR|RL|TB|BT)$/i);
  if (!firstLineMatch) {
    throw new ParseError(1, "Unsupported diagram type or missing direction", "Use 'flowchart LR', 'flowchart RL', 'flowchart TB', or 'flowchart BT'");
  }

  const direction = firstLineMatch[1]!.toUpperCase() as Direction;
  const nodes = new Map<NodeId, Node>();
  const edges: Edge[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Split by arrows
    const segments = line.split("-->").map(s => s.trim());
    
    if (segments.length > 1) {
      // It's an edge (or chain of edges)
      let prevId: NodeId | null = null;
      
      for (const segment of segments) {
        // Parse node part: ID1[Label]
        const nodeMatch = segment.match(/^(\w+)(?:\[(.*?)\])?$/);
        if (!nodeMatch) {
          throw new ParseError(i + 1, `Invalid node syntax in edge: "${segment}"`, "Use 'ID' or 'ID[Label]'");
        }
        
        const [, id, label] = nodeMatch;
        if (!nodes.has(id!)) {
          nodes.set(id!, { id: id!, label: label || id!, width: 0, height: 0 });
        } else if (label) {
          nodes.get(id!)!.label = label;
        }
        
        if (prevId) {
          edges.push({ from: prevId, to: id! });
        }
        prevId = id!;
      }
    } else {
      // Check for single node declaration: ID1[Label]
      const nodeMatch = line.match(/^(\w+)(?:\[(.*?)\])?$/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        if (!nodes.has(id!)) {
          nodes.set(id!, { id: id!, label: label || id!, width: 0, height: 0 });
        } else if (label) {
          nodes.get(id!)!.label = label;
        }
      } else {
        throw new ParseError(i + 1, `Invalid syntax: "${line}"`, "Only 'A --> B' or 'A[Label]' are supported");
      }
    }
  }

  return { direction, nodes, edges };
}
