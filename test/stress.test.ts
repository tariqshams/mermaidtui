import { renderMermaidToTui } from "../src/index.js";

describe("Stress Tests", () => {
  test("handles a deep graph (10 layers)", () => {
    let input = "flowchart TB\n";
    for (let i = 0; i < 9; i++) {
        input += `node${i} --> node${i+1}\n`;
    }
    const result = renderMermaidToTui(input);
    expect(result).toContain("node0");
    expect(result).toContain("node9");
    expect((result.match(/│/g) || []).length).toBeGreaterThan(10);
  });

  test("handles a wide graph (10 nodes in one layer)", () => {
    let input = "flowchart TB\n";
    for (let i = 0; i < 10; i++) {
        input += `root --> leaf${i}\n`;
    }
    const result = renderMermaidToTui(input);
    expect(result).toContain("root");
    for (let i = 0; i < 10; i++) {
        expect(result).toContain(`leaf${i}`);
    }
    // Check for branching horizontal lines
    expect(result).toContain("─");
  });

  test("handles cycles (warns but renders)", () => {
    const input = `flowchart TB
    A --> B
    B --> C
    C --> A`;
    const result = renderMermaidToTui(input);
    // Just verify it renders something and doesn't crash
    expect(result.length).toBeGreaterThan(0);
  });
});
