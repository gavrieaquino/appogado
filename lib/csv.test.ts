import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "./csv";

describe("csv", () => {
  it("neutralises formula injection", () => {
    for (const bad of ["=SUM(A1)", "+1", "-2", "@cmd"]) expect(csvCell(bad).startsWith("'")).toBe(true);
  });
  it("quotes commas, quotes and newlines", () => {
    expect(csvCell('a,"b"')).toBe('"a,""b"""');
    expect(toCsv([["x", 1], ["y\nz", null]])).toBe('x,1\r\n"y\nz",');
  });
});
