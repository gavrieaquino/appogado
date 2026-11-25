import { describe, expect, it } from "vitest";
import { search } from "./directory";
import { lawyers } from "./data";

describe("directory order", () => {
  it("lists every lawyer by surname when no filter is set", () => {
    const out = search(lawyers, {}).map((l) => l.surname);
    expect(out).toEqual([...out].sort((a, b) => a.localeCompare(b, "en")));
    expect(out).toHaveLength(lawyers.length);
  });
  it("keeps only lawyers that meet every filter", () => {
    const out = search(lawyers, { area: "family", city: "Quezon City" });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((l) => l.practiceAreas.includes("family") && l.city === "Quezon City")).toBe(true);
  });
  it("has no plan or tier input to sort on", () => {
    expect(lawyers.every((l) => !("plan" in l) && !("tier" in l))).toBe(true);
  });
});
