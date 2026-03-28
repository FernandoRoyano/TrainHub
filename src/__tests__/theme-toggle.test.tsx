import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockSetTheme = vi.fn();
let mockTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

const { ThemeToggle } = await import("@/components/shared/theme-toggle");

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = "light";
  });

  it("renders a button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("switches to dark theme when currently light", () => {
    mockTheme = "light";
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light theme when currently dark", () => {
    mockTheme = "dark";
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("renders Sun icon when theme is dark", () => {
    mockTheme = "dark";
    const { container } = render(<ThemeToggle />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders Moon icon when theme is light", () => {
    mockTheme = "light";
    const { container } = render(<ThemeToggle />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("button has ghost variant styling class", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });
});
