import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordInput } from "@/components/ui/password-input";

describe("PasswordInput", () => {
  it("renders as password type by default", () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles to text type when eye button is clicked", () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
  });

  it("toggles back to password type on second click", () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggle button has type=button to prevent form submission", () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveAttribute("type", "button");
  });

  it("toggle button has tabIndex -1 to skip tab navigation", () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveAttribute("tabindex", "-1");
  });

  it("passes additional props to the underlying input", () => {
    render(
      <PasswordInput
        placeholder="Password"
        disabled
        data-testid="pw-input"
      />
    );
    const input = screen.getByPlaceholderText("Password");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-testid", "pw-input");
  });

  it("applies custom className", () => {
    render(<PasswordInput className="custom-class" placeholder="pw" />);
    const input = screen.getByPlaceholderText("pw");
    expect(input.className).toContain("pr-10");
  });
});
