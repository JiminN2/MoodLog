import {useEffect, useRef} from "react";
import cytoscape, {type Core} from "cytoscape";
import type { ConstellationData } from "@/data/Constellations/type";
import {buildElements} from "@/utils/cytoscapeHelpers";



type Props = {
    data : ConstellationData;
    nodeColors: Record<string, string>;
    onNodeTap: (id: string) => void;
}
//onNodetap 역할:

export default function ConstellationGraph({ data, nodeColors, onNodeTap } : Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cyRef = useRef<Core | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const cy = cytoscape({
            container: containerRef.current,
            elements: buildElements(data),
            style: [
                {
                    selector: "node",
                    style: {
                        shape : "ellipse",
                        "background-color": "white",
                        color: "white",
                        width: 20,
                        height: 20,
                        label: "data(id)",
                    },
                },
            ],
            layout: { name: "preset" },
            zoomingEnabled: false,
            userZoomingEnabled: false,
            wheelSensitivity: 0,
            minZoom: 1,
            maxZoom: 1,
        });

        cy.on("tap", "node", (e) => onNodeTap(e.target.id()));
        cy.on("tap", (e) => { if (e.target === cy) onNodeTap(null); });

        cyRef.current = cy; 
        return () => {
            cy.destroy();
            cyRef.current = null;
        };
        }, [data]); //data(월) 바꾸면 재초기화

        useEffect(() => {
            const cy = cyRef.current;
            if (!cy) return;
            Object.entries(nodeColors).forEach(([id, color]) => {
                cy.getElementById(id).style("background-color", color)
            });
        }, [nodeColors]);


        // test
        console.log("data:", data);

        return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}