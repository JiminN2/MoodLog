import {useEffect, useRef} from "react";
import cytoscape, {type Core} from "cytoscape";
import type { ConstellationData } from "@/data/Constellations/type";
import {buildElements} from "@/utils/cytoscapeHelpers";



type Props = {
    data : ConstellationData;
    nodeColors: Record<string, string>;
    onNodeTap: (id: string) => void;
    interactive?: boolean; // fasle면 장식용 (이벤트 없음)
}
//onNodetap 역할:

export default function ConstellationGraph({ data, nodeColors, onNodeTap, interactive = true } : Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cyRef = useRef<Core | null>(null);

    // onNodeTap 의존성 넣지 않고 최신 함수 호출
    const onNodeTapRef = useRef(onNodeTap);
    useEffect(() => { onNodeTapRef.current = onNodeTap; }, [onNodeTap]);


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
                        label: (ele: any) => String(ele.id()).replace(/^n/, ""),
                        events: interactive ? "yes" : "no",
                    },
                },
                {
                    selector : "node[?decorative]",
                    style : {
                        events: "no",
                    }
                }
            ],
            layout: { name: "preset" },
            zoomingEnabled: false,
            userZoomingEnabled: false,
            //배경 드래그로 화면 움직이지 않게
            
            autounselectify: !interactive,
            wheelSensitivity: 0,
            minZoom: 1,
            maxZoom: 1,
        });

        if (interactive) {
            cy.on("tap", "node[!decorative]", (e) => {
                console.log("node tapped:", e.target.id());
                onNodeTapRef.current?. (e.target.id());
            });
            cy.on("tap", (e) => { if (e.target === cy) onNodeTapRef.current?.(''); });

        }

        cy.on("position", "node", (e) => {
            if (!e.target.grabbed()) return;
            console.log("node positions:", cy.nodes().map((node) => ({
                data: node.data(),
                position: node.position(),
            })));
        });

        cyRef.current = cy; 
        return () => {
            cy.destroy();
            cyRef.current = null;
              console.log("decorative  nodes:", cy.nodes("[?decorative").length);
  console.log("sample:", cy.getElementById("n14").data());
        };
        }, [data, interactive]); //data(월) 바꾸면 재초기화

        useEffect(() => {
            const cy = cyRef.current;
            if (!cy) return;
            Object.entries(nodeColors).forEach(([id, color]) => {
                cy.getElementById(id).style("background-color", color)
            });
        }, [nodeColors, data, interactive]);
        //nodeColors 바뀌면 색상 업데이트, data 바뀌면 재초기화되므로 같이 넣음
        //interactive 바뀌면 이벤트 on/off 되므로 같이 넣음
 
        
        return <div ref={containerRef} style={{ width: "100%", height: "100%", pointerEvents: interactive ? "auto" : "none" }} />;
}