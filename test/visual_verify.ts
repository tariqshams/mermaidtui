import { renderMermaidToTui } from "../src/index.js";

const diagrams = [
  {
    name: "Simple LR",
    mmd: `flowchart LR
    A[Start] --> B[Process]
    B --> C[End]`
  },
  {
    name: "Complex LR (Turning Edges)",
    mmd: `flowchart LR
    A[Root] --> B[Top Node]
    A --> C[Bottom Node]
    B --> D[Final]
    C --> D`
  },
  {
    name: "Simple TB",
    mmd: `flowchart TB
    A[Start] --> B[Process]
    B --> C[End]`
  },
  {
    name: "Complex TB (Turning Edges)",
    mmd: `flowchart TB
    A[Root] --> B[Left Node]
    A --> C[Right Node]
    B --> D[Final]
    C --> D`
  },
  {
    name: "Chained Edges",
    mmd: `flowchart LR
    A --> B --> C --> D`
  },
  {
    name: "Labels with spaces and special chars",
    mmd: `flowchart LR
    A[Start Here] --> B[Wait... what?]
    B --> C[Done!]`
  }
];

console.log("\x1b[1m\x1b[36m=== VISUAL TEST DUMP ===\x1b[0m\n");

for (const diag of diagrams) {
  console.log(`\x1b[32m[TEST CASE: ${diag.name}]\x1b[0m`);
  console.log("\x1b[90m-- INPUT --\x1b[0m");
  console.log(diag.mmd);
  console.log("\x1b[90m-- OUTPUT --\x1b[0m");
  console.log(renderMermaidToTui(diag.mmd));
  console.log("\x1b[90m" + "-".repeat(40) + "\x1b[0m\n");
}
