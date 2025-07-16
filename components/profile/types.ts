import { components } from "@/lib/api/v1-client-side";

export type MyUser = components["schemas"]["api__user__schemas__UserResponse"];
export type OtherUser = components["schemas"]["UserWithRelationshipResponse"];

export type TabItemProp = {
  user: MyUser | OtherUser | undefined;
};
