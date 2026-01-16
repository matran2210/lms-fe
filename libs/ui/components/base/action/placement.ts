export type Placement =
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "left"
  | "leftTop"
  | "leftBottom"
  | "right"
  | "rightTop"
  | "rightBottom";

/**
 * Placement → animation axis + direction
 */
export const placementMotionMap: Record<
  Placement,
  { axis: "x" | "y"; dir: number }
> = {
  // TOP
  top: { axis: "y", dir: 1 },
  topLeft: { axis: "y", dir: 1 },
  topRight: { axis: "y", dir: 1 },

  // BOTTOM
  bottom: { axis: "y", dir: -1 },
  bottomLeft: { axis: "y", dir: -1 },
  bottomRight: { axis: "y", dir: -1 },

  // LEFT
  left: { axis: "x", dir: 1 },
  leftTop: { axis: "x", dir: 1 },
  leftBottom: { axis: "x", dir: 1 },

  // RIGHT
  right: { axis: "x", dir: -1 },
  rightTop: { axis: "x", dir: -1 },
  rightBottom: { axis: "x", dir: -1 },
};

/**
 * Placement → arrow position
 * Arrow LUÔN chỉ về trigger
 */
export const arrowClassMap: Record<Placement, string> = {
  // TOP → arrow ở DƯỚI
  top: "bottom-[-6px] left-1/2 -translate-x-1/2",
  topLeft: "bottom-[-6px] left-4",
  topRight: "bottom-[-6px] right-4",

  // BOTTOM → arrow ở TRÊN
  bottom: "top-[-6px] left-1/2 -translate-x-1/2",
  bottomLeft: "top-[-6px] left-4",
  bottomRight: "top-[-6px] right-4",

  // LEFT → arrow ở PHẢI
  left: "-right-[10px] top-1/2 -translate-y-1/2",
  leftTop: "-right-[10px] top-3",
  leftBottom: "-right-[10px] bottom-3",

  // RIGHT → arrow ở TRÁI
  right: "-left-[10px] top-1/2 -translate-y-1/2",
  rightTop: "-left-[10px] top-3",
  rightBottom: "-left-[10px] bottom-3",
};

export const arrowRotationMap: Record<Placement, string> = {
  // ===== TOOLTIP Ở TRÊN TRIGGER =====
  top: "rotate-0",
  topLeft: "rotate-0",
  topRight: "rotate-0",

  // ===== TOOLTIP Ở DƯỚI TRIGGER =====
  bottom: "rotate-180",
  bottomLeft: "rotate-180",
  bottomRight: "rotate-180",

  // ===== TOOLTIP Ở BÊN TRÁI TRIGGER =====
  left: "-rotate-90",
  leftTop: "-rotate-90",
  leftBottom: "-rotate-90",

  // ===== TOOLTIP Ở BÊN PHẢI TRIGGER =====
  right: "rotate-90",
  rightTop: "rotate-90",
  rightBottom: "rotate-90",
};

export const placementStartOffsetMap: Record<
  Placement,
  { x: number; y: number }
> = {
  // Tooltip ở trên → đi từ tâm icon lên
  top: { x: 0, y: 24 },
  topLeft: { x: 8, y: 24 },
  topRight: { x: -8, y: 24 },

  // Tooltip ở dưới
  bottom: { x: 0, y: -24 },
  bottomLeft: { x: 8, y: -24 },
  bottomRight: { x: -8, y: -24 },

  // Tooltip bên trái
  left: { x: 24, y: 0 },
  leftTop: { x: 24, y: 8 },
  leftBottom: { x: 24, y: -8 },

  // Tooltip bên phải
  right: { x: -24, y: 0 },
  rightTop: { x: -24, y: 8 },
  rightBottom: { x: -24, y: -8 },
};
