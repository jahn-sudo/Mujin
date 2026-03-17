import { computeAutoScore } from "@/lib/pl/autoScore";

describe("computeAutoScore", () => {
  it("all fields + receipts (expenses >= 50k) → 100", () => {
    expect(
      computeAutoScore({
        revenue: 200000,
        expenses: 80000,
        notes: "Great month overall",
        receiptUrls: ["https://r2.example.com/receipt1.pdf"],
      })
    ).toBe(100);
  });

  it("all fields, expenses < 50k (receipts not required) → 100", () => {
    expect(
      computeAutoScore({
        revenue: 100000,
        expenses: 30000,
        notes: "Steady growth",
        receiptUrls: [],
      })
    ).toBe(100);
  });

  it("revenue + expenses only, no notes, expenses < 50k → 75", () => {
    expect(
      computeAutoScore({
        revenue: 50000,
        expenses: 20000,
        notes: null,
        receiptUrls: [],
      })
    ).toBe(75);
  });

  it("revenue + expenses + notes, expenses >= 50k, no receipts → 75", () => {
    expect(
      computeAutoScore({
        revenue: 200000,
        expenses: 60000,
        notes: "Big spend this month",
        receiptUrls: [],
      })
    ).toBe(75);
  });

  it("revenue + expenses only, expenses >= 50k, no receipts, no notes → 50", () => {
    expect(
      computeAutoScore({
        revenue: 200000,
        expenses: 60000,
        notes: null,
        receiptUrls: [],
      })
    ).toBe(50);
  });

  it("nothing filled → 0 (expenses >= 50k, no receipts)", () => {
    expect(
      computeAutoScore({
        revenue: null,
        expenses: 60000,
        notes: null,
        receiptUrls: [],
      })
    ).toBe(25); // expenses filled = +25, receipts missing = 0, rest 0
  });

  it("only revenue filled, expenses < 50k → 50", () => {
    expect(
      computeAutoScore({
        revenue: 10000,
        expenses: null,
        notes: null,
        receiptUrls: [],
      })
    ).toBe(50); // revenue +25, receipts free +25 (expenses null < 50k threshold not triggered)
  });

  it("empty notes string → not counted", () => {
    expect(
      computeAutoScore({
        revenue: 100000,
        expenses: 20000,
        notes: "   ",
        receiptUrls: [],
      })
    ).toBe(75); // revenue + expenses + free receipts, no notes
  });
});
