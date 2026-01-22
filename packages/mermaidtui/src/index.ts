import { parseMermaid } from "./parser";
import { computeLayout } from "./layout";
import { renderGraph } from "./renderer";
import { RenderOptions } from "./types";

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

export * from "./types";
export { parseMermaid } from "./parser";
export { computeLayout } from "./layout";
export { renderGraph } from "./renderer";
