export class Grid {
  public cells: string[][];
  public width: number = 0;
  public height: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () => Array(width).fill(" "));
  }

  set(x: number, y: number, char: string) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.cells[y][x] = char;
    }
  }

  toString(): string {
    return this.cells.map(row => row.join("")).join("\n");
  }
}
