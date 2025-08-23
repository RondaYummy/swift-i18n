import { describe, it, expect, vi, beforeEach } from "vitest";
import { SwiftI18n } from "../i18n";

describe("SwiftI18n", () => {
  let loader: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loader = vi.fn(async (lang: string) => {
      if (lang === "en")
        return {
          hello: "Hello",
          common: {
            items_one: "item",
            items_few: "items",
            items_many: "items",
            items_other: "items",
          },
        };
      if (lang === "ua") return { hello: "Привіт" };
      return {};
    });
  });

  it("should initialize with default language", () => {
    const i18n = new SwiftI18n({ loader, defaultLang: "en" });
    expect(i18n.lang).toBe("en");
    expect(i18n.allBundles).toEqual({});
  });

  it("init loads language and fallback", async () => {
    const i18n = new SwiftI18n({
      loader,
      defaultLang: "en",
      fallbackLang: "ua",
    });
    await i18n.init();
    expect(loader).toHaveBeenCalledWith("en");
    expect(loader).toHaveBeenCalledWith("ua");
    expect(i18n.allBundles).toHaveProperty("en");
    expect(i18n.allBundles).toHaveProperty("ua");
  });

  it("t() returns translation and fallback", async () => {
    const i18n = new SwiftI18n({
      loader,
      defaultLang: "en",
      fallbackLang: "ua",
    });
    await i18n.init();
    expect(i18n.t("hello")).toBe("Hello");
  });

  it("changeLanguage switches language and triggers event", async () => {
    const i18n = new SwiftI18n({ loader, defaultLang: "en" });
    const spy = vi.fn();
    i18n.on("languageChanged", spy);

    await i18n.changeLanguage("ua");
    expect(i18n.lang).toBe("ua");
    expect(spy).toHaveBeenCalledWith("ua");
  });

  it("resolveKey warns on missing key", () => {
    const i18n = new SwiftI18n({ loader, defaultLang: "en" });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const val = i18n.resolveKey({}, ["missing"]);
    expect(val).toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("plural returns correct form", async () => {
    const i18n = new SwiftI18n({ loader, defaultLang: "en", fallbackLang: 'en' });
    await i18n.init();
    expect(i18n.plural("common.items", 1)).toBe("item"); // one
    expect(i18n.plural("common.items", 2)).toBe("items"); // other
  });

  it("warnOnMissing false disables warnings", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const i18n = new SwiftI18n({
      loader,
      warnOnMissing: false,
      defaultLang: "en",
    });
    i18n.resolveKey({}, ["missing"]);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
