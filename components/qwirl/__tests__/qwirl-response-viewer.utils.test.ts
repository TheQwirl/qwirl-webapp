import { describe, expect, it } from "vitest";

import { mergeResponder } from "../qwirl-response-viewer.utils";
import { QwirlResponder } from "@/types/qwirl";

const makeResponder = (id: number, name: string): QwirlResponder => ({
  id,
  name,
  username: name.toLowerCase(),
  avatar: null,
  session_id: id * 100,
  status: "completed",
  started_at: new Date(0).toISOString(),
  completed_at: new Date(0).toISOString(),
  response_count: 0,
  wavelength: 0,
});

describe("mergeResponder", () => {
  it("adds responder to empty", () => {
    const r = makeResponder(1, "A");
    expect(mergeResponder(null, r)).toEqual([r]);
  });

  it("dedupes and promotes to front", () => {
    const a = makeResponder(1, "A");
    const b = makeResponder(2, "B");

    expect(mergeResponder([a, b], b)).toEqual([b, a]);
  });
});
