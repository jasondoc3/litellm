import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FallbackGroupConfig } from "./FallbackGroupConfig";
import type { FallbackGroup } from "./FallbackGroupConfig";

const mockOnChange = vi.fn();
const AVAILABLE_MODELS = ["gpt-4", "gpt-3.5-turbo", "claude-3-opus"];

function renderConfig(group: FallbackGroup) {
  return render(
    <FallbackGroupConfig group={group} onChange={mockOnChange} availableModels={AVAILABLE_MODELS} maxFallbacks={10} />,
  );
}

describe("FallbackGroupConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should select an available primary model from the dropdown", async () => {
    const user = userEvent.setup();
    renderConfig({ id: "1", primaryModel: null, fallbackModels: [] });

    await user.click(screen.getAllByRole("combobox")[0]);
    await user.click(screen.getByTitle("gpt-4"));

    expect(mockOnChange).toHaveBeenCalledWith({ id: "1", primaryModel: "gpt-4", fallbackModels: [] });
  });

  it("should accept a typed primary model that is not in the available models", async () => {
    const user = userEvent.setup();
    renderConfig({ id: "1", primaryModel: null, fallbackModels: [] });

    await user.type(screen.getAllByRole("combobox")[0], "wildcard-routed-model");
    await user.click(screen.getByTitle("wildcard-routed-model"));

    expect(mockOnChange).toHaveBeenCalledWith({ id: "1", primaryModel: "wildcard-routed-model", fallbackModels: [] });
  });

  it("should accept a typed fallback model that is not in the available models", async () => {
    const user = userEvent.setup();
    renderConfig({ id: "1", primaryModel: "gpt-4", fallbackModels: [] });

    await user.type(screen.getAllByRole("combobox")[1], "vertex_ai/gemini-pro");
    await user.click(screen.getByTitle("vertex_ai/gemini-pro"));

    expect(mockOnChange).toHaveBeenCalledWith({
      id: "1",
      primaryModel: "gpt-4",
      fallbackModels: ["vertex_ai/gemini-pro"],
    });
  });
});
