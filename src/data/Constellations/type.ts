export type NodeDef = {
    data : {id: string}; 
    position: {x: number; y: number }};
export type ConstellationData = {
    nodes: NodeDef[];
    paths: string[][];
}