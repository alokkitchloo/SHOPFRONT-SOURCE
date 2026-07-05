import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SizeButtons } from "../src/components/SizeButtons";
import { Variant } from "../src/types";

const variants: Variant[] = [
  { color: "Black", size: "S", stock: 12, stockLevel: "in-stock" },
  { color: "Black", size: "M", stock: 2, stockLevel: "low-stock" },
  { color: "Black", size: "L", stock: 0, stockLevel: "sold-out" },
];

describe("SizeButtons", () => {
  it("disables a size button whose variant is sold out", () => {
    render(
      <SizeButtons sizes={["S", "M", "L"]} selected="S" onSelect={vi.fn()} variantsForColor={variants} />
    );
    expect(screen.getByRole("radio", { name: "L" })).toBeDisabled();
  });

  it("does not disable in-stock or low-stock sizes", () => {
    render(
      <SizeButtons sizes={["S", "M", "L"]} selected="S" onSelect={vi.fn()} variantsForColor={variants} />
    );
    expect(screen.getByRole("radio", { name: "S" })).toBeEnabled();
    expect(screen.getByRole("radio", { name: "M" })).toBeEnabled();
  });

  it("calls onSelect only for a selectable size, not the sold-out one", async () => {
    const onSelect = vi.fn();
    render(
      <SizeButtons sizes={["S", "M", "L"]} selected="S" onSelect={onSelect} variantsForColor={variants} />
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "L" }));
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByRole("radio", { name: "M" }));
    expect(onSelect).toHaveBeenCalledWith("M");
  });

  it("marks the currently selected size as checked", () => {
    render(
      <SizeButtons sizes={["S", "M", "L"]} selected="M" onSelect={vi.fn()} variantsForColor={variants} />
    );
    expect(screen.getByRole("radio", { name: "M" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "S" })).toHaveAttribute("aria-checked", "false");
  });
});
