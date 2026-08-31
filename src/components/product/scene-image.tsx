import type { CSSProperties } from "react";

import { cx, framePath } from "@/lib/utils";
import type { Scene } from "@/content/product";

export type SceneImageProps = {
  scene: Scene;
  alt?: string;
  /** `contain` keeps the whole silhouette; `cover` crops into the focal point. */
  fit?: "cover" | "contain";
  className?: string;
  eager?: boolean;
};

/**
 * A still borrowed from the sequence.
 *
 * Zoom is anchored to the same focal point as the crop, so pushing in holds
 * the product in place instead of drifting toward the container's centre.
 */
export function SceneImage({
  scene,
  alt = "",
  fit = "cover",
  className,
  eager = false,
}: SceneImageProps) {
  return (
    <img
      src={framePath(scene.frame)}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cx("scene-img", `is-${fit}`, className)}
      style={
        {
          // object-position frames the product; the scale then happens about
          // the panel's centre, so zooming pushes in rather than drifting.
          objectPosition: `${scene.focusX}% ${scene.focusY}%`,
          "--zoom": scene.zoom,
        } as CSSProperties
      }
    />
  );
}
