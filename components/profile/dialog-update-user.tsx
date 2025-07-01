"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { X } from "lucide-react";
import $api from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Define the zod schema
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

// Props for the dialog component
interface DialogUpdateUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogUpdateUser({
  open,
  onOpenChange,
}: DialogUpdateUserProps) {
  const queryClient = useQueryClient();
  const userQuery = $api.useQuery("get", "/users/me");
  const user = userQuery?.data;
  const categoriesQuery = $api.useQuery("get", "/question-categories");

  const updateUserMutation = $api.useMutation("patch", "/users/me", {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get", "/users/me", null],
        exact: true,
      });
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
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog
      aria-description="Update your profile data"
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        aria-description="Update your profile data"
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Update Profile Data</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1234567890"
                      {...field}
                      value={field.value || ""}
                      type="tel"
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories (max 5)</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      disabled={field.value?.length === 5}
                      onValueChange={handleAddCategory}
                      autoComplete="on"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(categoriesQuery?.data as string[])?.map(
                          (category) => (
                            <SelectItem
                              disabled={field.value?.includes(category)}
                              key={category}
                              value={category}
                            >
                              {category}
                            </SelectItem>
                          )
                        )}
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
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                loading={updateUserMutation.isPending}
                onClick={form.handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
