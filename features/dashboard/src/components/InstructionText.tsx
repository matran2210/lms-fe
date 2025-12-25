export const InstructionText = ({ onClick }: { onClick: () => void }) => (
  <>
    <span className="font-normal">Click on</span>{" "}
    <span className="cursor-pointer font-semibold underline" onClick={onClick}>
      Course Content
    </span>{" "}
    <span className="font-normal">to resume your lessons.</span>
  </>
);
