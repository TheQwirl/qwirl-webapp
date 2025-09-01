import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";

const QwirlRespondLoading = () => (
  <div className="rounded-2xl border-2 p-4">
    <div>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-background text-foreground w-full p-3 rounded-xl border"
          >
            <Skeleton
              className={clsx("h-6", {
                "w-3/4": index % 2 === 0,
                "w-1/2": index % 2 !== 0,
              })}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default QwirlRespondLoading;
