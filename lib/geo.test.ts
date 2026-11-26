import { describe, expect, it } from "vitest";
import { byDistance, distanceKm, fmtKm, inBounds } from "./geo";
import { search } from "./directory";
import { lawyers, officeById, offices, pilotArea, places } from "./data";

const cubao = { lat: 14.6197, lng: 121.0536 };
const fairview = { lat: 14.7307, lng: 121.0592 };

describe("distance", () => {
  it("Cubao to Fairview is about 12 km in a straight line", () => {
    expect(distanceKm(cubao, fairview)).toBeGreaterThan(12);
    expect(distanceKm(cubao, fairview)).toBeLessThan(13);
  });
  it("is zero to itself and symmetric", () => {
    expect(distanceKm(cubao, cubao)).toBe(0);
    expect(distanceKm(cubao, fairview)).toBeCloseTo(distanceKm(fairview, cubao), 9);
  });
  it("formats metres and kilometres", () => {
    expect(fmtKm(0.34)).toBe("350 m");
    expect(fmtKm(1.234)).toBe("1.2 km");
    expect(fmtKm(12.6)).toBe("13 km");
  });
});

describe("Quezon City pilot area", () => {
  it("contains every sample office and place", () => {
    expect(offices.every((o) => inBounds(o, pilotArea.bounds))).toBe(true);
    expect(places.every((p) => inBounds(p, pilotArea.bounds))).toBe(true);
  });
  it("excludes a point in Makati", () => {
    expect(inBounds({ lat: 14.5547, lng: 121.0244 }, pilotArea.bounds)).toBe(false);
  });
  it("puts every sample lawyer in a known QC office", () => {
    expect(lawyers.every((l) => officeById(l.officeId)?.city === "Quezon City")).toBe(true);
  });
});

describe("ordering with distance", () => {
  it("nearest office from Cubao is the one in Cubao", () => {
    expect(byDistance(offices, cubao)[0].barangay).toBe("Cubao");
  });
  it("orders filter match first, then distance, and ignores distance between non-matching groups", () => {
    const km = (l: (typeof lawyers)[number]) => distanceKm(fairview, officeById(l.officeId)!);
    const fam = search(lawyers, { area: "family" }, km);
    expect(fam.every((l) => l.practiceAreas.includes("family"))).toBe(true);
    const d = fam.map(km);
    expect(d).toEqual([...d].sort((a, b) => a - b));
    expect(fam[0].surname).toBe("Fernandez"); // the Fairview family lawyer
  });
  it("falls back to surname order when two lawyers share an office", () => {
    const km = (l: (typeof lawyers)[number]) => distanceKm(cubao, officeById(l.officeId)!);
    const firm = search(lawyers, {}, km).filter((l) => l.officeId === "o-grn").map((l) => l.surname);
    expect(firm).toEqual([...firm].sort((a, b) => a.localeCompare(b, "en")));
  });
});
