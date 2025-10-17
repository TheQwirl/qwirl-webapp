import { Skeleton } from "../../ui/skeleton";
import { PollOptionLoading } from "../poll-option";

const QwirlRespondLoading = () => (
  <div className="rounded-2xl border-2 p-4">
    <div>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <PollOptionLoading key={index} optionNumber={index + 1} />
        ))}
      </div>
    </div>
  </div>
);

export default QwirlRespondLoading;
