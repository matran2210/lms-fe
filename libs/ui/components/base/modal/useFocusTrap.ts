"use client";
import { RefObject, useEffect } from "react";

// ── Focusable selectors ────────────────────────────────────────────────
// Matches all interactive elements that can receive keyboard focus,
// excluding elements with tabIndex="-1" (programmatic-only focus).
export const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// ── Types ──────────────────────────────────────────────────────────────

export interface UseFocusTrapOptions {
  /** When false, the hook does nothing — no focus management. */
  enabled: boolean;
  /** Ref to the container element that should trap focus. */
  containerRef: RefObject<HTMLElement>;
}

// ── Hook ───────────────────────────────────────────────────────────────

/**
 * `useFocusTrap` — Accessibility focus trap hook.
 *
 * Responsibilities:
 * - Saves `document.activeElement` on mount (to restore on unmount).
 * - Focuses the first focusable element in the container, or the container
 *   root itself (with `tabIndex={-1}`) if no focusable elements exist.
 * - Handles `Tab` and `Shift+Tab` to cycle focus within the container.
 * - Restores focus to the previously focused element on unmount.
 *
 * When `enabled` is false, the hook is a no-op.
 */
function useFocusTrap({ enabled, containerRef }: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Save the currently focused element so we can restore it on unmount
    const previousFocus = document.activeElement as HTMLElement | null;

    // Focus the first focusable element, or fall back to the container root
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
    );

    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      // Fallback: focus the container itself (requires tabIndex={-1} on the element)
      container.focus();
    }

    // ── Tab / Shift+Tab cycling ──
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // Re-query on each keydown to handle dynamic content changes
      const currentFocusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      );

      if (currentFocusables.length === 0) {
        // No focusable elements — keep focus on the container root
        e.preventDefault();
        container.focus();
        return;
      }

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: move backwards — wrap from first to last
        if (
          document.activeElement === first ||
          document.activeElement === container
        ) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: move forwards — wrap from last to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Listen on the document so we catch Tab regardless of which element is focused
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the element that was focused before the modal opened
      previousFocus?.focus();
    };
  }, [enabled, containerRef]);
}

export default useFocusTrap;
