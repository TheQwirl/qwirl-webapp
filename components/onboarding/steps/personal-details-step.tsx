"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Phone, AtSign } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { EditableUserAvatar } from "@/components/editable-user-avatar";

interface PersonalDetailsFormData {
  name: string;
  username: string;
  phone?: string | null | undefined;
}

interface PersonalDetailsStepProps {
  form: UseFormReturn<PersonalDetailsFormData>;
}

export function PersonalDetailsStep({ form }: PersonalDetailsStepProps) {
  const { user } = authStore();

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <EditableUserAvatar
          name={user?.name || form.getValues("name")}
          image={user?.avatar || undefined}
          size="xl"
          className="mb-2"
        />
        <p className="text-sm text-muted-foreground">
          Click to upload a profile picture
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your display name that others will see
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AtSign className="h-4 w-4" />
                  Username
                </FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>
                  Your unique username for sharing Qwirls
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+1234567890"
                  {...field}
                  value={field.value || ""}
                  type="tel"
                  maxLength={15}
                />
              </FormControl>
              <FormDescription>
                Used for account verification and security
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
