import type { EdgeDefinition, ElementsDefinition } from "cytoscape";
import type { ConstellationData } from "../data/Constellations/type";

// A...
function createPathEdges(pathIds: string[]): EdgeDefinition[] {
  return pathIds.slice(0, -1).map((source, i) => ({
    data: { id: `e_${source}_${pathIds[i + 1]}`, source, target: pathIds[i + 1] },
  }));
}

export function buildElements(data: ConstellationData): ElementsDefinition {
    return {
        nodes: data.nodes.map((n) => ({
            data: { id: n.data.id },
            position: { x: n.position.x, y: n.position.y },
        })),
        edges: data.paths.flatMap(createPathEdges),
    };
}