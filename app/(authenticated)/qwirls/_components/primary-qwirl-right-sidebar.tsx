import HorizontalBarGraph from "@/components/ui/horizontal-bar-graph";
import { RadialProgress } from "@/components/ui/radial-progress";
import { QwirlItem } from "@/types/qwirl";
import React from "react";

const MAX_POLL_COUNT = 15;

const PrimaryQwirlRightSidebar = ({
  polls,
}: {
  polls: QwirlItem[] | undefined;
}) => {
  return (
    <div className="hidden lg:block lg:sticky  lg:top-1 lg:col-span-3 py-7">
      <div className="col-span-full max-h-fit lg:col-span-4 lg:sticky lg:top-4 flex flex-col gap-6">
        <div className="flex p-4 rounded-2xl  border flex-col items-center justify-center">
          <div className="text-lg font-semibold text-center">
            Qwirl Completed
          </div>
          <RadialProgress current={polls?.length ?? 0} total={MAX_POLL_COUNT} />
        </div>
        <div className=" flex p-4 rounded-2xl border flex-col items-center justify-center">
          <div className="text-lg font-semibold text-center">Qwirl Split</div>
          <HorizontalBarGraph />
        </div>
      </div>
    </div>
  );
};

export default PrimaryQwirlRightSidebar;
