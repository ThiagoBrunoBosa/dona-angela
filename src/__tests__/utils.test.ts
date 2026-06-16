import { scaleQuantity } from "@/lib/utils";

describe("scaleQuantity", () => {
  it("scales numeric quantities", () => {
    expect(scaleQuantity("2", 2)).toBe("4");
    expect(scaleQuantity("1,5", 2)).toBe("3");
  });

  it("returns original for non-numeric", () => {
    expect(scaleQuantity("a gosto", 2)).toBe("a gosto");
  });
});

describe("fridge search normalization", () => {
  it("matches ingredient terms case-insensitively", () => {
    const normalize = (t: string) =>
      t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    expect(normalize("Ovos")).toBe("ovos");
    expect(normalize("açúcar")).toBe("acucar");
  });
});
