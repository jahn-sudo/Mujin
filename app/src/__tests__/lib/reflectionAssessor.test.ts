const mockCreate = jest.fn();

jest.mock("@anthropic-ai/sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

import { assessReflection } from "@/lib/ai/reflectionAssessor";

function mockResponse(result: "MEANINGFUL" | "NOT_MEANINGFUL") {
  mockCreate.mockResolvedValue({
    content: [{ type: "text", text: JSON.stringify({ result }) }],
  });
}

describe("assessReflection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns MEANINGFUL when Claude says MEANINGFUL", async () => {
    mockResponse("MEANINGFUL");
    const result = await assessReflection(
      "This month I learned about market fit and struggled with pricing strategy. Peers gave great feedback on our pitch."
    );
    expect(result).toBe("MEANINGFUL");
  });

  it("returns NOT_MEANINGFUL when Claude says NOT_MEANINGFUL", async () => {
    mockResponse("NOT_MEANINGFUL");
    const result = await assessReflection("ok good yes");
    expect(result).toBe("NOT_MEANINGFUL");
  });

  it("defaults to NOT_MEANINGFUL on invalid JSON response", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: "invalid json {{" }],
    });
    const result = await assessReflection("some text");
    expect(result).toBe("NOT_MEANINGFUL");
  });

  it("defaults to NOT_MEANINGFUL on API error", async () => {
    mockCreate.mockRejectedValue(new Error("Network error"));
    const result = await assessReflection("some text");
    expect(result).toBe("NOT_MEANINGFUL");
  });

  it("defaults to NOT_MEANINGFUL on unexpected result value", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({ result: "UNKNOWN" }) }],
    });
    const result = await assessReflection("some text");
    expect(result).toBe("NOT_MEANINGFUL");
  });

  it("defaults to NOT_MEANINGFUL on non-text content type", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "image", source: {} }],
    });
    const result = await assessReflection("some text");
    expect(result).toBe("NOT_MEANINGFUL");
  });
});
