import { parseMermaid } from "./parser/index.js";
import { computeLayout } from "./layout/index.js";
import { renderGraph } from "./renderer/index.js";
import { RenderOptions } from "./types.js";

export function renderMermaidToTui(input: string, options: RenderOptions = {}): string {
  try {
    const graph = parseMermaid(input);
    computeLayout(graph);
    return renderGraph(graph, options);
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "An unknown error occurred";
  }
}

export * from "./types.js";
export { parseMermaid } from "./parser/index.js";
export { computeLayout } from "./layout/index.js";
export { renderGraph } from "./renderer/index.js";
