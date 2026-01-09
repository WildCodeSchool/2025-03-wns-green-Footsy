import { describe, expect, it } from "vitest";
import { formatDateForDisplay, toISODateString } from "../dateUtils";

describe("dateUtils", () => {
  describe("toISODateString", () => {
    it("should convert Date object to ISO string", () => {
      const date = new Date("2026-01-12");
      expect(toISODateString(date)).toBe("2026-01-12");
    });

    it("should convert ISO string to ISO string", () => {
      expect(toISODateString("2026-01-12")).toBe("2026-01-12");
    });

    it("should handle localized date strings", () => {
      // Note: This might vary based on environment
      const date = "1/12/2026";
      const result = toISODateString(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return empty string for null", () => {
      expect(toISODateString(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(toISODateString(undefined)).toBe("");
    });

    it("should return empty string for invalid date", () => {
      expect(toISODateString("invalid")).toBe("");
    });
  });

  describe("formatDateForDisplay", () => {
    it("should format date in French locale", () => {
      const date = "2026-01-12";
      const result = formatDateForDisplay(date, "fr-FR");
      expect(result).toBe("12/01/2026");
    });

    it("should format date in US English locale", () => {
      const date = "2026-01-12";
      const result = formatDateForDisplay(date, "en-US");
      expect(result).toBe("01/12/2026");
    });

    it("should handle Date object", () => {
      const date = new Date("2026-01-12");
      const result = formatDateForDisplay(date, "fr-FR");
      expect(result).toBe("12/01/2026");
    });

    it("should return empty string for null", () => {
      expect(formatDateForDisplay(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatDateForDisplay(undefined)).toBe("");
    });

    it("should return empty string for invalid date", () => {
      expect(formatDateForDisplay("invalid")).toBe("");
    });

    it("should accept custom format options", () => {
      const date = "2026-01-12";
      const result = formatDateForDisplay(date, "fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      expect(result).toContain("janvier");
      expect(result).toContain("2026");
    });
  });
});
