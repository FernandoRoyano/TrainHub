import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";

// Mock window.Image for preloading
let imageOnload: (() => void) | null = null;
let imageOnerror: (() => void) | null = null;
let imageSrc = "";

class MockImage {
  set onload(fn: () => void) {
    imageOnload = fn;
  }
  set onerror(fn: () => void) {
    imageOnerror = fn;
  }
  set src(val: string) {
    imageSrc = val;
  }
  get src() {
    return imageSrc;
  }
}

vi.stubGlobal("Image", MockImage);

const { ExerciseAnimation } = await import(
  "@/components/workout/exercise-animation"
);

describe("ExerciseAnimation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    imageOnload = null;
    imageOnerror = null;
    imageSrc = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders fallback icon when thumbnailUrl is null", () => {
    const { container } = render(<ExerciseAnimation thumbnailUrl={null} />);
    // Should render a div with the fallback icon, not an img
    const img = container.querySelector("img");
    expect(img).not.toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders fallback icon when thumbnailUrl is undefined", () => {
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={undefined} />
    );
    const img = container.querySelector("img");
    expect(img).not.toBeInTheDocument();
  });

  it("renders img tag with thumbnailUrl when provided", () => {
    const url =
      "https://cdn.example.com/exercises/Bench_Press/0.jpg";
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={url} alt="Bench Press" />
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Bench Press");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={null} className="w-20 h-20" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("w-20 h-20");
  });

  it("preloads second frame for valid exercise URL pattern", () => {
    const url =
      "https://cdn.example.com/exercises/Bench_Press/0.jpg";
    render(<ExerciseAnimation thumbnailUrl={url} />);

    // Should attempt to preload 1.jpg
    expect(imageSrc).toBe(
      "https://cdn.example.com/exercises/Bench_Press/1.jpg"
    );
  });

  it("preloads second frame for Supabase Storage URLs (mirror de imágenes)", () => {
    const url =
      "https://xyz.supabase.co/storage/v1/object/public/exercises/Bench_Press/0.jpg";
    render(<ExerciseAnimation thumbnailUrl={url} />);

    expect(imageSrc).toBe(
      "https://xyz.supabase.co/storage/v1/object/public/exercises/Bench_Press/1.jpg"
    );
  });

  it("alternates frames when second image loads successfully", () => {
    const url =
      "https://cdn.example.com/exercises/Bench_Press/0.jpg";
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={url} />
    );

    // Simulate successful preload of second frame
    act(() => {
      imageOnload?.();
    });

    const img = container.querySelector("img")!;
    // Initially should show frame 0
    expect(img.getAttribute("src")).toBe(
      "https://cdn.example.com/exercises/Bench_Press/0.jpg"
    );

    // Advance timer to trigger frame switch
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(img.getAttribute("src")).toBe(
      "https://cdn.example.com/exercises/Bench_Press/1.jpg"
    );

    // Advance again to switch back
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(img.getAttribute("src")).toBe(
      "https://cdn.example.com/exercises/Bench_Press/0.jpg"
    );
  });

  it("stays on original frame when second image fails to load", () => {
    const url =
      "https://cdn.example.com/exercises/Bench_Press/0.jpg";
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={url} />
    );

    // Simulate failed preload
    act(() => {
      imageOnerror?.();
    });

    const img = container.querySelector("img")!;

    // Advance timers - should NOT alternate since second frame failed
    act(() => {
      vi.advanceTimersByTime(2400);
    });

    // Should still show original URL
    expect(img.getAttribute("src")).toBe(url);
  });

  it("does not attempt animation for non-exercise URLs", () => {
    const url = "https://cdn.example.com/random-image.png";
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={url} />
    );

    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toBe(url);
  });

  it("applies default className when none provided", () => {
    const url =
      "https://cdn.example.com/exercises/Squat/0.jpg";
    const { container } = render(
      <ExerciseAnimation thumbnailUrl={url} />
    );
    const img = container.querySelector("img")!;
    expect(img.className).toContain("w-12 h-12");
    expect(img.className).toContain("shrink-0");
  });
});
