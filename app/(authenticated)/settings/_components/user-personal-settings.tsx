"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, AtSign, Tag } from "lucide-react";
import $api from "@/lib/api/client";
import { toast } from "sonner";
import { useUserSync } from "@/hooks/useUserSync";
import { EditableUserAvatar } from "@/components/editable-user-avatar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number")
    .nullable(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  categories: z
    .array(z.string())
    .max(5, "You can select up to 5 categories")
    .optional(),
});

export function UserPersonalSettings() {
  const userQuery = $api.useQuery("get", "/users/me");
  const user = userQuery?.data;
  const categoriesQuery = $api.useQuery("get", "/question-categories");
  const { syncUser } = useUserSync();

  const updateUserMutation = $api.useMutation("patch", "/users/me", {
    onSuccess: async (response) => {
      if (response) {
        syncUser(response);
      }
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating your profile");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? null,
      username: user?.username ?? "",
      categories: user?.categories ?? [],
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      phone: user?.phone ?? null,
      username: user?.username ?? "",
      categories: user?.categories ?? [],
    });
  }, [user, form]);

  const handleAddCategory = (selectedCategory: string) => {
    if (
      selectedCategory &&
      !form.getValues("categories")?.includes(selectedCategory)
    ) {
      const currentCategories = form.getValues("categories") || [];
      if (currentCategories.length < 5) {
        form.setValue("categories", [...currentCategories, selectedCategory], {
          shouldValidate: true,
        });
      }
    }
  };

  const handleRemoveCategory = (category: string) => {
    const currentCategories = form.getValues("categories") || [];
    form.setValue(
      "categories",
      currentCategories.filter((cat) => cat !== category),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await updateUserMutation.mutateAsync({ body: data });
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <EditableUserAvatar
          name={user?.name ?? undefined}
          image={user?.avatar ?? undefined}
          size="xl"
          className="mb-2"
        />
        <div className="text-lg font-semibold">{user?.name}</div>
        <div className="text-sm text-muted-foreground">@{user?.username}</div>
      </div>
      <div className="border-b border-border/40 mb-8" />

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  Phone Number
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
                  Optional: Used for account verification and security
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Interests (max 5)
                </FormLabel>
                <div className="flex gap-2">
                  <Select
                    disabled={field.value?.length === 5}
                    onValueChange={handleAddCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your interests" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categoriesQuery?.data as string[])?.map((category) => (
                        <SelectItem
                          disabled={field.value?.includes(category)}
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.value?.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  Help others discover you through shared interests
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={updateUserMutation.isPending}
              className="min-w-[120px]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
