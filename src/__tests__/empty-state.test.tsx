import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/empty-state";
import { Dumbbell } from "lucide-react";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <EmptyState title="Empty" description="Nothing to show here" />
    );
    expect(screen.getByText("Nothing to show here")).toBeInTheDocument();
  });

  it("renders icon", () => {
    const { container } = render(
      <EmptyState title="Empty" icon={Dumbbell} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders action button with label", () => {
    render(
      <EmptyState
        title="Empty"
        actionLabel="Add item"
        onAction={() => {}}
      />
    );
    expect(screen.getByText("Add item")).toBeInTheDocument();
  });

  it("renders action link when actionHref provided", () => {
    render(
      <EmptyState
        title="Empty"
        actionLabel="Go somewhere"
        actionHref="/somewhere"
      />
    );
    const link = screen.getByText("Go somewhere");
    expect(link.closest("a")).toHaveAttribute("href", "/somewhere");
  });

  it("does not render action button without label", () => {
    const { container } = render(<EmptyState title="Empty" />);
    const button = container.querySelector("button");
    expect(button).not.toBeInTheDocument();
  });
});
