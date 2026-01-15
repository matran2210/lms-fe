import { ComingSoonIcon } from "@lms/assets";
import TabLayout from "./TabLayout";

const Settings = () => {
  return (
    <div className="mb-6 mt-0 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-2 md:mb-0 md:mt-8 md:min-h-[352px]  lg:mt-10">
      <ComingSoonIcon className="h-[112px] w-[140px]" />
      <div className="text-small text-gray-400">Coming Soon!</div>
    </div>
  );
};

export default Settings;
