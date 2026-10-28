 import type { ConstellationData } from "./type";
 import { january } from "./January";
 import { february } from "./February.ts";
 import { march } from "./March";
 import { april } from "./April";
//  import { may } from "./May";
//  import { june } from "./June";
//  import { july } from "./July";
//  import { august } from "./August";
//  import { september } from "./September";
//  import { october } from "./October";
//  import { november } from "./November";
//  import { december } from "./December";

 export const constellationsByMonth: Record<number, ConstellationData> = {
  1: january,
  2: february,
  3: march,
  4: april,
//   5: may,
//   6: june,
//   7: july,
//   8: august,
//   9: september,
//   10: october,
//   11: november,
//   12: december
 }