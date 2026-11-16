import type { ConstellationData } from "./type";

export const february: ConstellationData = {
    nodes: [
        { data: { id: "n1" }, position: { x: 455, y: 88 } },
        { data: { id: "n2" }, position: { x: 368, y: 147 } },
        { data: { id: "n3" }, position: { x: 280, y: 205 } },
        { data: { id: "n4" }, position: { x: 376, y: 272 } },
        { data: { id: "n5" }, position: { x: 473, y: 238 } },
        { data: { id: "n6" }, position: { x: 282, y: 278 } },
        { data: { id: "n7" }, position: { x: 247, y: 277 } },
        { data: { id: "n8" }, position: { x: 245, y: 322 } },
        { data: { id: "n9" }, position: { x: 314, y: 478 } },
        { data: { id: "n10" }, position: { x: 352, y: 411 } },
        { data: { id: "n11" }, position: { x: 424, y: 386 } },
        { data: { id: "n12" }, position: { x: 454, y: 428 } },
        { data: { id: "n13" }, position: { x: 529, y: 454 } },

        { data: { id: "n14", decorative: true}, position: { x: 863, y: 205 } },
        { data: { id: "n15" }, position: { x: 864, y: 271 } },
        { data: { id: "n16" ,decorative: true}, position: { x: 907, y: 351 } },
        { data: { id: "n17" }, position: { x: 925, y: 452 } },
        { data: { id: "n18" }, position: { x: 892, y: 505 } },
        { data: { id: "n19" }, position: { x: 848, y: 509 } },
        { data: { id: "n20" }, position: { x: 779, y: 537 } },
        { data: { id: "n21" }, position: { x: 677, y: 505 } },
        { data: { id: "n22" }, position: { x: 634, y: 540 } },
        { data: { id: "n23" }, position: { x: 605, y: 587 } },
        { data: { id: "n24" }, position: { x: 665, y: 627 } },
        { data: { id: "n25" }, position: { x: 843, y: 697 } },
        { data: { id: "n26" }, position: { x: 877, y: 752 } },
        { data: { id: "n27" }, position: { x: 914, y: 718 } },
        { data: { id: "n28" }, position: { x: 886, y: 685 } },

      ],
      paths : [
        ["n1", "n2", "n3", "n6", "n7", "n8", "n9", "n10", "n11", "n12", "n13"],
        ["n3", "n4", "n5"],
        ["n14", "n15", "n16", "n17", "n18", "n19", "n20", "n21", "n22", "n23", "n24", "n25", "n26", "n27", "n28" ],
        ["n25", "n28"]
]
}