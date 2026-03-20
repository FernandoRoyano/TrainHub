import { describe, it, expect } from "vitest";

/**
 * Tests for subscription tier limits and feature gating logic.
 * Extracted from useSubscription hook.
 */

const TIER_LIMITS = {
  free: 3,
  pro: 25,
  elite: Infinity,
} as const;

type Tier = keyof typeof TIER_LIMITS;

function calculateSubscriptionData(tier: Tier, activeClientCount: number) {
  const clientLimit = TIER_LIMITS[tier];
  const canAddClient = activeClientCount < clientLimit;
  return { tier, clientLimit, canAddClient, activeClientCount };
}

describe("Subscription tier limits", () => {
  describe("Free tier", () => {
    it("allows up to 3 clients", () => {
      expect(calculateSubscriptionData("free", 0).canAddClient).toBe(true);
      expect(calculateSubscriptionData("free", 1).canAddClient).toBe(true);
      expect(calculateSubscriptionData("free", 2).canAddClient).toBe(true);
    });

    it("blocks at 3 clients", () => {
      expect(calculateSubscriptionData("free", 3).canAddClient).toBe(false);
    });

    it("blocks above 3 clients", () => {
      expect(calculateSubscriptionData("free", 5).canAddClient).toBe(false);
    });

    it("has limit of 3", () => {
      expect(calculateSubscriptionData("free", 0).clientLimit).toBe(3);
    });
  });

  describe("Pro tier", () => {
    it("allows up to 25 clients", () => {
      expect(calculateSubscriptionData("pro", 0).canAddClient).toBe(true);
      expect(calculateSubscriptionData("pro", 24).canAddClient).toBe(true);
    });

    it("blocks at 25 clients", () => {
      expect(calculateSubscriptionData("pro", 25).canAddClient).toBe(false);
    });

    it("has limit of 25", () => {
      expect(calculateSubscriptionData("pro", 0).clientLimit).toBe(25);
    });
  });

  describe("Elite tier", () => {
    it("allows unlimited clients", () => {
      expect(calculateSubscriptionData("elite", 0).canAddClient).toBe(true);
      expect(calculateSubscriptionData("elite", 100).canAddClient).toBe(true);
      expect(calculateSubscriptionData("elite", 1000).canAddClient).toBe(true);
    });

    it("has Infinity limit", () => {
      expect(calculateSubscriptionData("elite", 0).clientLimit).toBe(Infinity);
    });
  });

  describe("Tier transitions", () => {
    it("downgrade from pro to free blocks existing clients above limit", () => {
      // Trainer had 10 clients on Pro, downgrades to Free
      const result = calculateSubscriptionData("free", 10);
      expect(result.canAddClient).toBe(false);
      expect(result.clientLimit).toBe(3);
    });

    it("upgrade from free to pro unlocks more clients", () => {
      // Trainer had 3 clients on Free, upgrades to Pro
      const result = calculateSubscriptionData("pro", 3);
      expect(result.canAddClient).toBe(true);
    });
  });
});

describe("Webhook tier mapping", () => {
  function getWebhookTier(
    metadata: { tier?: string },
    isCanceled: boolean
  ): string {
    if (isCanceled) return "free";
    return metadata.tier || "pro";
  }

  it("returns tier from metadata", () => {
    expect(getWebhookTier({ tier: "elite" }, false)).toBe("elite");
    expect(getWebhookTier({ tier: "pro" }, false)).toBe("pro");
  });

  it("defaults to pro when no tier in metadata", () => {
    expect(getWebhookTier({}, false)).toBe("pro");
  });

  it("returns free when canceled regardless of metadata", () => {
    expect(getWebhookTier({ tier: "elite" }, true)).toBe("free");
    expect(getWebhookTier({ tier: "pro" }, true)).toBe("free");
  });
});
