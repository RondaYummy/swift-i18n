import { describe, it, expect, vi, beforeEach } from "vitest";
import { SwiftI18n } from "../i18n";
import { createReactI18n, useI18n, createSwiftI18n } from "./react-plugin";

let cleanup: Function | null = null;

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useState: (init: any) => [init, vi.fn()],
    useEffect: (fn: any) => {
      cleanup = fn();
    },
    useContext: () => ({
      i18n: new SwiftI18n({ loader: async () => ({ hello: "Hello" }), defaultLang: 'en' }),
      lang: "en",
      bundles: {},
    }),
  };
});

describe("React plugin", () => {
  let loader: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loader = vi.fn(async (lang: string) => {
      if (lang === "en") return { hello: "Hello" };
      if (lang === "ua") return { hello: "Привіт" };
      return {};
    });
  });

  it("createReactI18n returns a function (I18nProvider)", () => {
    const i18n = new SwiftI18n({ loader, defaultLang: "en" });
    const Provider = createReactI18n(i18n);
    expect(typeof Provider).toBe("function");

    const result = Provider({ children: null });
    expect(result.props).toHaveProperty("value");
    expect(result.props.value.lang).toBe("en");
    expect(result.props.value.bundles).toEqual({});
  });

  it("createSwiftI18n returns I18nProvider with loaded bundles", async () => {
    const Provider = await createSwiftI18n({ loader, defaultLang: "en" });
    expect(typeof Provider).toBe("function");
  
    const i18n = new SwiftI18n({ loader, defaultLang: "en" });
    await i18n.init();
  
    const result = Provider({ children: null });
    expect(result.props.value.lang).toBe("en");
    expect(result.props.value.bundles).toEqual(i18n.allBundles);
  });

  it("useI18n returns i18n helpers", () => {
    const ctx = useI18n();
    expect(ctx).toHaveProperty("t");
    expect(ctx).toHaveProperty("plural");
    expect(ctx).toHaveProperty("changeLanguage");
    expect(ctx).toHaveProperty("lang");
    expect(ctx).toHaveProperty("bundles");
  });

  it("I18nProvider updates state on languageChanged", async () => {
    const i18n = new SwiftI18n({ loader, defaultLang: "en" });
    await i18n.init();
  
    const Provider = createReactI18n(i18n);
    const result = Provider({ children: null });
    await i18n.changeLanguage('uk')
  
    expect(i18n.lang).toBe("uk");
    expect(result.props.value.bundles).toBe(i18n.allBundles);
  });

  it("I18nProvider removes languageChanged listener on unmount", () => {
    const handlerMap = new Map<string, Function>();
    const i18n: any = new SwiftI18n({ loader, defaultLang: "en" });
  
    i18n.on = vi.fn((event: string, fn: Function) => {
      handlerMap.set(event, fn);
    });
    i18n.removeListener = vi.fn();
  
    const Provider = createReactI18n(i18n);
    Provider({ children: null });
  
    cleanup?.();
  
    expect(i18n.removeListener).toHaveBeenCalledWith(
      "languageChanged",
      handlerMap.get("languageChanged")
    );
  });
});
