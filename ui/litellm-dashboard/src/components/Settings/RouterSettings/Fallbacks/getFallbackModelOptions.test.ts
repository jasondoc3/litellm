import { describe, expect, it } from "vitest";
import { getFallbackModelOptions } from "./getFallbackModelOptions";

describe("getFallbackModelOptions", () => {
  it("adds the bare name for models expanded from a provider wildcard", () => {
    expect(
      getFallbackModelOptions([
        { model_group: "openai/*", providers: ["openai"] },
        { model_group: "openai/gpt-4o", providers: ["openai"] },
      ]),
    ).toEqual(["gpt-4o", "openai/*", "openai/gpt-4o"]);
  });

  it("does not add bare names when the wildcard prefix is not the provider", () => {
    expect(
      getFallbackModelOptions([
        { model_group: "custom/*", providers: ["openai"] },
        { model_group: "custom/gpt-4o", providers: ["openai"] },
      ]),
    ).toEqual(["custom/*", "custom/gpt-4o"]);
  });

  it("does not add bare names for prefixed groups without a wildcard", () => {
    expect(getFallbackModelOptions([{ model_group: "openai/gpt-4o", providers: ["openai"] }])).toEqual([
      "openai/gpt-4o",
    ]);
  });

  it("returns concrete groups unchanged", () => {
    expect(
      getFallbackModelOptions([{ model_group: "my-gpt", providers: ["openai"] }, { model_group: "gemini-flash" }]),
    ).toEqual(["gemini-flash", "my-gpt"]);
  });
});
