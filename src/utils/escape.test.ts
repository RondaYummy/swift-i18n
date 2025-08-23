import { describe, it, expect } from "vitest";
import { escapeHtml, escapeParams } from "./escape";

describe("escapeHtml", () => {
  it("escapes <, >, \", and ' characters", () => {
    const raw = `<div class="test">It's cool</div>`;
    const escaped = escapeHtml(raw);
    expect(escaped).toBe("&lt;div class=&quot;test&quot;&gt;It&apos;s cool&lt;/div&gt;");
  });

  it("does not change string without special chars", () => {
    const raw = "Hello World";
    expect(escapeHtml(raw)).toBe(raw);
  });

  it("escapes multiple occurrences", () => {
    const raw = `"<div>'<div>"`;
    const escaped = escapeHtml(raw);
    expect(escaped).toBe("&quot;&lt;div&gt;&apos;&lt;div&gt;&quot;");
  });
});

describe("escapeParams", () => {
  it("escapes all string values in object", () => {
    const vars = {
      name: `<Alice>`,
      message: `"Hello" & 'Bye'`,
      count: 5,
    };
    const escaped = escapeParams(vars);
    expect(escaped).toEqual({
      name: "&lt;Alice&gt;",
      message: "&quot;Hello&quot; & &apos;Bye&apos;",
      count: 5,
    });
  });

  it("leaves non-string values unchanged", () => {
    const vars = { a: 1, b: true, c: null, d: { nested: "<x>" } };
    const escaped = escapeParams(vars);
    expect(escaped).toEqual(vars);
  });

  it("handles empty object", () => {
    expect(escapeParams({})).toEqual({});
  });
});