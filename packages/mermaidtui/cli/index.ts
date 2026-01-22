#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import { renderMermaidToTui } from "../src/index";

const program = new Command();

program
  .name("mermaidtui")
  .description("Render Mermaid diagrams as ASCII/Unicode in the terminal")
  .version("0.1.0")
  .argument("[file]", "Mermaid file to render (reads from stdin if not provided)")
  .option("-a, --ascii", "Use ASCII characters only", false)
  .option("-w, --width <number>", "Max width for rendering", (val: string) => parseInt(val, 10))
  .action((file: string | undefined, options: { ascii: boolean; width?: number }) => {
    let input = "";
    if (file) {
      try {
        input = fs.readFileSync(file, "utf-8");
        const result = renderMermaidToTui(input, {
          ascii: options.ascii,
          maxWidth: options.width,
        });
        console.log(result);
      } catch (err) {
        console.error(`Error reading file: ${file}`);
        process.exit(1);
      }
    } else {
      process.stdin.on("data", (data) => {
        input += data.toString();
      });
      process.stdin.on("end", () => {
        const result = renderMermaidToTui(input, {
          ascii: options.ascii,
          maxWidth: options.width,
        });
        console.log(result);
      });
    }
  });

program.parse(process.argv);
