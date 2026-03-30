import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TierBadge } from "@/components/service-tiers/tier-badge";

describe("TierBadge", () => {
  it("renders name text", () => {
    render(<TierBadge name="Pro" color="#3b82f6" />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("applies color as background", () => {
    render(<TierBadge name="Elite" color="#ef4444" />);
    const badge = screen.getByText("Elite");
    expect(badge).toHaveStyle({ backgroundColor: "#ef4444" });
  });

  it("uses fallback color when color is empty", () => {
    render(<TierBadge name="Basic" color="" />);
    const badge = screen.getByText("Basic");
    expect(badge).toHaveStyle({ backgroundColor: "#6b7280" });
  });

  it("applies sm size classes by default", () => {
    render(<TierBadge name="Default" color="#000" />);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("text-xs");
  });

  it("applies sm size classes when size=sm", () => {
    render(<TierBadge name="Small" color="#000" size="sm" />);
    const badge = screen.getByText("Small");
    expect(badge.className).toContain("text-xs");
  });

  it("applies md size classes when size=md", () => {
    render(<TierBadge name="Medium" color="#000" size="md" />);
    const badge = screen.getByText("Medium");
    expect(badge.className).toContain("text-sm");
  });

  it("has rounded-full class", () => {
    render(<TierBadge name="Round" color="#000" />);
    const badge = screen.getByText("Round");
    expect(badge.className).toContain("rounded-full");
  });

  it("has text-white class", () => {
    render(<TierBadge name="White" color="#000" />);
    const badge = screen.getByText("White");
    expect(badge.className).toContain("text-white");
  });
});
