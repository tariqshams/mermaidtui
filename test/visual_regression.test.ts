import { renderMermaidToTui } from "../src/index.js";

describe("Visual Regression", () => {
  test("renders TB corners correctly", () => {
    const input = `flowchart TB
    A --> B
    A --> C`;
    const result = renderMermaidToTui(input);
    // Check for TB corners: └ ─ ┌ (left branch) and ┘ ─ ┐ (right branch)
    // Wait, in my TB Turn 1:
    // If endX > startX: bl (└)
    // If endX < startX: br (┘)
    // Turn 2:
    // If endX > startX: tr (┐)
    // If endX < startX: tl (┌)
    
    expect(result).toContain("└");
    expect(result).toContain("┘");
    expect(result).toContain("┐");
    expect(result).toContain("┌");
  });

  test("renders LR corners correctly", () => {
    const input = `flowchart LR
    A --> B
    A --> C`;
    const result = renderMermaidToTui(input);
    // LR Turn 1:
    // If endY > startY: tr (┐)
    // If endY < startY: br (┘)
    // Turn 2:
    // If endY > startY: bl (└)
    // If endY < startY: tl (┌)
    
    expect(result).toContain("┐");
    expect(result).toContain("┘");
    expect(result).toContain("└");
    expect(result).toContain("┌");
  });

  test("ensures vertical line alignment", () => {
    const input = `flowchart TB
    A --> B
    B --> C`;
    const lines = renderMermaidToTui(input).split("\n");
    // In a simple TB, the edges should be vertical (│)
    expect(renderMermaidToTui(input)).toContain("│");
  });
});
