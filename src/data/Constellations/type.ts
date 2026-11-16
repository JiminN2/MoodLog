export type NodeDef = {
    data : {id: string; decorative?: boolean }; 
    position: {x: number; y: number }};
export type ConstellationData = {
    nodes: NodeDef[];
    paths: string[][];
}