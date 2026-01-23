import { parseMermaid } from "../src/parser/index.js";

describe("Parser Robustness", () => {
  test("parses chained edges correctly", () => {
    const input = `flowchart LR
    A --> B --> C --> D`;
    const graph = parseMermaid(input);
    expect(graph.edges.length).toBe(3);
    expect(graph.edges[0]).toEqual({ from: "A", to: "B" });
    expect(graph.edges[1]).toEqual({ from: "B", to: "C" });
    expect(graph.edges[2]).toEqual({ from: "C", to: "D" });
    expect(graph.nodes.size).toBe(4);
  });

  test("parses labels with spaces and special characters", () => {
    const input = `flowchart LR
    A[Start Here] --> B[Wait... what?]
    B --> C[Done!]`;
    const graph = parseMermaid(input);
    expect(graph.nodes.get("A")?.label).toBe("Start Here");
    expect(graph.nodes.get("B")?.label).toBe("Wait... what?");
    expect(graph.nodes.get("C")?.label).toBe("Done!");
  });

  test("handles single node declarations and updates", () => {
    const input = `flowchart LR
    A
    B[Label B]
    A --> B
    A[Label A]`;
    const graph = parseMermaid(input);
    expect(graph.nodes.get("A")?.label).toBe("Label A");
    expect(graph.nodes.get("B")?.label).toBe("Label B");
    expect(graph.edges.length).toBe(1);
  });

  test("throws ParseError for invalid syntax", () => {
    const input = `flowchart LR
    A --- B`;
    expect(() => parseMermaid(input)).toThrow("Invalid syntax");
  });
});
