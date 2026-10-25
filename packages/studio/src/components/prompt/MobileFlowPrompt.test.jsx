import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileFlowPrompt from "./MobileFlowPrompt.jsx";

describe("MobileFlowPrompt", () => {
  it("renders the Flow prompt card and expandable options sheet", () => {
    const onOptionsOpenChange = vi.fn();
    const onMediaTypeChange = vi.fn();
    const onAspectRatioChange = vi.fn();
    const onQuantityChange = vi.fn();

    render(
      <MobileFlowPrompt
        mediaType="image"
        onMediaTypeChange={onMediaTypeChange}
        prompt=""
        onPromptChange={() => {}}
        aspectRatio="9:16"
        aspectRatios={["16:9", "1:1", "9:16"]}
        onAspectRatioChange={onAspectRatioChange}
        quantity={1}
        onQuantityChange={onQuantityChange}
        modelLabel="Test Model"
        creditText="0 AI credits"
        optionsOpen
        onOptionsOpenChange={onOptionsOpenChange}
        onGenerate={() => {}}
      />,
    );

    expect(screen.getByPlaceholderText("What do you want to make?")).toBeTruthy();
    expect(screen.getByText(/0 AI credits/i)).toBeTruthy();
    expect(screen.getByText("Test Model")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Video" }));
    expect(onMediaTypeChange).toHaveBeenCalledWith("video");

    fireEvent.click(screen.getByRole("button", { name: "1:1" }));
    expect(onAspectRatioChange).toHaveBeenCalledWith("1:1");

    fireEvent.click(screen.getByRole("button", { name: "x2" }));
    expect(onQuantityChange).toHaveBeenCalledWith(2);
  });

  it("hides the options sheet when collapsed", () => {
    render(
      <MobileFlowPrompt
        mediaType="video"
        prompt=""
        onPromptChange={() => {}}
        aspectRatio="16:9"
        aspectRatios={["16:9", "9:16"]}
        quantity={1}
        duration={8}
        durations={[4, 6, 8]}
        modelLabel="Veo"
        optionsOpen={false}
        onOptionsOpenChange={() => {}}
        onGenerate={() => {}}
      />,
    );

    expect(screen.queryByText(/Generating will use/i)).toBeNull();
    expect(document.querySelector("[data-ogi-mobile-flow-sheet]")).toBeNull();
  });
});
