import React, { useCallback, useEffect, useRef } from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { UserAvatar } from "@/components/user-avatar";
import { QwirlResponder } from "@/types/qwirl";

interface ResponderSelectorProps {
  responders: QwirlResponder[];
  onResponderToggle: (id: number) => void;

  search: string;
  onSearchChange: (value: string) => void;

  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;

  isLoading?: boolean;
}

const ResponderSelector: React.FC<ResponderSelectorProps> = ({
  responders,
  onResponderToggle,
  search,
  onSearchChange,
  hasMore = false,
  isFetchingNextPage = false,
  fetchNextPage,
  isLoading = false,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries?.[0]?.isIntersecting &&
          hasMore &&
          !isFetchingNextPage &&
          fetchNextPage
        ) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, isFetchingNextPage, fetchNextPage]
  );

  // When search changes, ensure we don't keep observing stale nodes.
  useEffect(() => {
    return () => observer.current?.disconnect();
  }, [search]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between sm:w-64"
          disabled={isLoading}
          icon={ChevronsUpDown}
          iconPlacement="right"
        >
          Select responder
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search responders..."
            value={search}
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading responders..." : "No responders found."}
            </CommandEmpty>
            <CommandGroup>
              {responders.map((user, index) => {
                const isLast = index === responders.length - 1;

                return (
                  <div key={user.id} ref={isLast ? lastItemRef : undefined}>
                    <CommandItem
                      value={user.id.toString()}
                      onSelect={() => onResponderToggle(user.id)}
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          image={user.avatar ?? ""}
                          name={user.name ?? undefined}
                          size="sm"
                          rounded={true}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm leading-tight">
                            {user.name}
                          </span>
                          {user.username ? (
                            <span className="text-xs text-muted-foreground leading-tight">
                              @{user.username}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </CommandItem>
                  </div>
                );
              })}
            </CommandGroup>

            {isFetchingNextPage ? (
              <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                Loading more...
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ResponderSelector;
