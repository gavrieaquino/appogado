import { describe, expect, it } from "vitest";
import { findSensitive, redact } from "./redact";
import { buildBrief, classify } from "./brief";

describe("redaction", () => {
  it("hides phones, emails, case numbers, addresses and titled names", () => {
    const out = redact("Tinawagan ako ni Mrs. Lydia Torres sa 0917 123 4567, email lydia@example.com, Civil Case No. 2025-114, nakatira sa #12 Mapagmahal St.");
    expect(out).not.toMatch(/Lydia|0917|example\.com|2025-114|Mapagmahal/);
    expect(out).toContain("[NAME]");
    expect(out).toContain("[PHONE]");
  });
  it("leaves plain text alone", () => {
    expect(findSensitive("My employer did not pay my final salary.")).toHaveLength(0);
  });
});

describe("names with titles (regression: 'Mr. Roberto Lim' became 'Mr.' / '[NAME]im')", () => {
  it("hides the whole surname, not just its first letter", () => {
    expect(redact("I texted the owner, Mr. Roberto Lim, twice.")).toBe("I texted the owner, Mr. [NAME], twice.");
    expect(redact("Kinausap ko si Juan D. Cruz kahapon.")).toBe("Kinausap ko si [NAME] kahapon.");
  });
});

describe("template brief", () => {
  it("does not split a fact after a title", () => {
    const b = buildBrief({ story: "I texted the owner, Mr. Roberto Lim, twice. He did not reply.", wants: "", otherParty: "", deadline: null, files: [], city: "Quezon City", language: "en", proBono: false });
    expect(b.facts).toEqual(["I texted the owner, Mr. [NAME], twice.", "He did not reply."]);
  });
  it("classifies common Filipino and English wording", () => {
    expect(classify("Hindi binigay ng amo ko ang final pay at sahod ko")).toBe("labor");
    expect(classify("The landlord gave me a notice to vacate")).toBe("land");
    expect(classify("Lending app collectors harass my relatives about my loan")).toBe("consumer");
  });
  it("marks a notice to vacate as urgent and redacts the facts", () => {
    const b = buildBrief({ story: "The landlord, Mrs. Ana Cruz, told me to vacate in 5 days. Call me at 09171234567.", wants: "More time", otherParty: "Landlord", deadline: null, files: [], city: "Quezon City", language: "en", proBono: false });
    expect(b.urgency).toBe("urgent");
    expect(b.facts.join(" ")).not.toMatch(/Ana Cruz|0917/);
    expect(b.demo).toBe(true);
  });
});
