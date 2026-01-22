import { renderMermaidToTui } from "../src/index.js";

describe("mermaidtui", () => {
  test("renders a simple LR flowchart", () => {
    const input = `flowchart LR
A[Start] --> B[End]`;
    const result = renderMermaidToTui(input);
    expect(result).toContain("Start");
    expect(result).toContain("End");
    expect(result).toContain("▶");
  });

  test("renders a simple TB flowchart", () => {
    const input = `flowchart TB
A[Start] --> B[End]`;
    const result = renderMermaidToTui(input);
    expect(result).toContain("Start");
    expect(result).toContain("End");
    expect(result).toContain("▼");
  });

  test("handles labels correctly", () => {
    const input = `flowchart LR
A[Node A] --> B[Node B]`;
    const result = renderMermaidToTui(input);
    expect(result).toContain("Node A");
    expect(result).toContain("Node B");
  });

  test("supports ASCII mode", () => {
    const input = `flowchart LR
A --> B`;
    const result = renderMermaidToTui(input, { ascii: true });
    expect(result).toContain("+---+");
    expect(result).toContain(">");
    expect(result).not.toContain("┌");
  });

  test("throws error for unsupported diagram type", () => {
    const input = `sequenceDiagram
A->B: hi`;
    const result = renderMermaidToTui(input);
    expect(result).toContain("Error: Line 1: Unsupported diagram type");
  });
});
