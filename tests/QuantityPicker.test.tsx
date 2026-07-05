import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityPicker } from "../src/components/QuantityPicker";

describe("QuantityPicker", () => {
  it("disables the increase button once quantity reaches max stock", () => {
    render(<QuantityPicker quantity={3} max={3} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
  });

  it("disables the decrease button at quantity 1", () => {
    render(<QuantityPicker quantity={1} max={5} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();
  });

  it("never calls onChange with a value above max", async () => {
    const onChange = vi.fn();
    render(<QuantityPicker quantity={2} max={2} onChange={onChange} />);
    const user = userEvent.setup();
    const increase = screen.getByRole("button", { name: "Increase quantity" });
    expect(increase).toBeDisabled();
    await user.click(increase);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange with quantity - 1 when decrease is clicked", async () => {
    const onChange = vi.fn();
    render(<QuantityPicker quantity={2} max={5} onChange={onChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
