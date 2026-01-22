import { Graph, Node, Edge, Direction, NodeId } from "../types";

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
    // Regex for: ID1[Label] --> ID2[Label]
    // (\w+) : ID1
    // (\[(.*?)\])? : Optional [Label1]
    // \s*-->\s* : Arrow
    // (\w+) : ID2
    // (\[(.*?)\])? : Optional [Label2]
    const edgeMatch = line.match(/^(\w+)(?:\[(.*?)\])?\s*-->\s*(\w+)(?:\[(.*?)\])?$/);
    
    if (edgeMatch) {
      const [, id1, label1, id2, label2] = edgeMatch;
      if (id1 && id2) {
        if (!nodes.has(id1)) {
          nodes.set(id1, { id: id1, label: label1 || id1, width: 0, height: 0 });
        }
        if (!nodes.has(id2)) {
          nodes.set(id2, { id: id2, label: label2 || id2, width: 0, height: 0 });
        }
        
        edges.push({ from: id1, to: id2 });
      }
    } else {
      // Check for single node declaration: ID1[Label]
      const nodeMatch = line.match(/^(\w+)(?:\[(.*?)\])?$/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        if (!nodes.has(id)) {
            nodes.set(id, { id, label: label || id, width: 0, height: 0 });
        } else if (label) {
            // Update label if it was previously undefined or used ID
            const existing = nodes.get(id)!;
            existing.label = label;
        }
      } else {
        throw new ParseError(i + 1, `Invalid syntax: "${line}"`, "Only 'A --> B' or 'A[Label]' are supported in v0.1");
      }
    }
  }

  return { direction, nodes, edges };
}
