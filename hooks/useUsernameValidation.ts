import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import $api from "@/lib/api/client";
import { useDebounce } from "./useDebounce";

interface UseUsernameValidationOptions<T extends FieldValues> {
  username: string;
  currentUsername?: string;
  form: UseFormReturn<T>;
  minLength?: number;
  fieldName?: Path<T>;
}

export function useUsernameValidation<T extends FieldValues>({
  username,
  currentUsername,
  form,
  minLength = 3,
  fieldName = "username" as Path<T>,
}: UseUsernameValidationOptions<T>) {
  const [debouncedUsername] = useDebounce(username, 500);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "available" | "unavailable" | "error"
  >("idle");

  // Check if username has actually changed from the user's current username
  const hasUsernameChanged = currentUsername !== username;

  const usernameCheckQuery = $api.useQuery(
    "get",
    "/users/check-username/{username}",
    {
      params: {
        path: {
          username: debouncedUsername,
        },
      },
    },
    {
      enabled:
        !!debouncedUsername &&
        debouncedUsername.length >= minLength &&
        hasUsernameChanged,
      retry: false,
    }
  );

  useEffect(() => {
    // If username hasn't changed or is empty/too short, don't check
    if (
      !hasUsernameChanged ||
      !debouncedUsername ||
      debouncedUsername.length < minLength
    ) {
      setUsernameStatus("idle");
      setIsCheckingUsername(false);
      return;
    }

    // Show loading state when debouncing
    if (username !== debouncedUsername) {
      setIsCheckingUsername(true);
      setUsernameStatus("idle");
      return;
    }

    // Handle query results
    if (usernameCheckQuery.isLoading || usernameCheckQuery.isFetching) {
      setIsCheckingUsername(true);
      setUsernameStatus("idle");
    } else if (usernameCheckQuery.isError) {
      setIsCheckingUsername(false);
      setUsernameStatus("error");
      form.setError(fieldName, {
        type: "manual",
        message: "Unable to verify username availability",
      });
    } else if (usernameCheckQuery.data) {
      setIsCheckingUsername(false);
      const isAvailable = usernameCheckQuery.data.available;
      setUsernameStatus(isAvailable ? "available" : "unavailable");

      if (!isAvailable) {
        form.setError(fieldName, {
          type: "manual",
          message: "This username is already taken",
        });
      } else {
        form.clearErrors(fieldName);
      }
    }
  }, [
    debouncedUsername,
    username,
    usernameCheckQuery.data,
    usernameCheckQuery.isLoading,
    usernameCheckQuery.isFetching,
    usernameCheckQuery.isError,
    hasUsernameChanged,
    form,
    minLength,
    fieldName,
  ]);

  return {
    isCheckingUsername,
    usernameStatus,
    hasUsernameChanged,
    isValid:
      !hasUsernameChanged ||
      (usernameStatus === "available" && !isCheckingUsername),
  };
}
