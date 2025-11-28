"use client";

import type { components } from "@/lib/api/v1-client-side";
import type { MyUser } from "@/components/profile/types";

export type ActivityResponse = components["schemas"]["ActivityResponse"];
export type WavelengthUserResponse =
  components["schemas"]["WavelengthUserResponse"];
export type QwirlCoverResponse = components["schemas"]["QwirlCoverResponse"];
export type QwirlResponseStats = components["schemas"]["QwirlResponseStats"];

export type { MyUser };

export const numberFormatter = new Intl.NumberFormat();
