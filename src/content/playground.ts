import type { PlaygroundItem } from "./types";

/*
 * Graphic and motion experiments that are not full case studies.
 * Empty the array to hide the section and its nav item.
 * Put files in /public/images/playground/ and set `media.src`.
 */
export const playground: PlaygroundItem[] = [
  { id: "pg-01", title: "Poster series", discipline: "Graphic", media: { label: "poster", ratio: "4 / 5" } },
  { id: "pg-02", title: "Logo motion", discipline: "Motion", media: { label: "logo-loop", ratio: "1 / 1" } },
  { id: "pg-03", title: "Type study", discipline: "Graphic", media: { label: "type-study", ratio: "4 / 5" } },
  { id: "pg-04", title: "Micro-interaction", discipline: "Motion", media: { label: "interaction", ratio: "1 / 1" } },
  { id: "pg-05", title: "Social banner", discipline: "Graphic", media: { label: "banner", ratio: "4 / 5" } },
  { id: "pg-06", title: "3D icon set", discipline: "Motion", media: { label: "icons", ratio: "1 / 1" } },
];
