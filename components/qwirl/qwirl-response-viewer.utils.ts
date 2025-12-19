import { QwirlResponder } from "@/types/qwirl";

/**
 * Merge a responder into the selected responder list.
 * - No duplicates
 * - Most-recent promoted to front
 */
export function mergeResponder(
  prev: QwirlResponder[] | null | undefined,
  responder: QwirlResponder
): QwirlResponder[] {
  const existing = prev ?? [];
  const without = existing.filter((r) => r.id !== responder.id);
  return [responder, ...without];
}
