import React from "react";

const Badge = ({ badge, className }: { badge: string; className: string }) => {
  return (
    <div
      className={`mb-3 flex w-fit items-center justify-center rounded px-2 py-0.5 text-sm ${className}`}
    >
      {badge}
    </div>
  );
};

export default Badge;
