import React, { useEffect, useState } from "react";
import GraphView from "./GraphView";
import MatrixView from "./MatrixView";
import type { HoverState, LinkDatum, NodeDatum } from "./dualViewTypes";
import { dualViewVisualizerStyle } from "../utils/const";
// import GraphEditor from "./GraphEditor";

interface Props {
  graphData: any;
  hubNodeA?: number;
  hubNodeB?: number;
  modelType?: string; // "node prediction" | "link prediction" | "graph"
  simulatedGraphData?: any;
  sandboxMode?: boolean;
  nodePositions?: { id: string; x: number; y: number }[];
  onNodePositionChange?: (positions: { id: string; x: number; y: number }[]) => void;
  handleSimulatedGraphChange: any,
  handleNodePositionsChange: any,
}

const elementMap: Record<number, string> = {
  0: "C",
  1: "N",
  2: "O",
  3: "F",
  4: "H",
  5: "S",
  6: "Cl",
};

const DualViews: React.FC<Props> = ({
  graphData,
  hubNodeA,
  hubNodeB,
  modelType,
  simulatedGraphData,
  sandboxMode = false,
  onNodePositionChange,
}) => {
  const [nodes, setNodes] = useState<NodeDatum[]>([]);
  const [links, setLinks] = useState<LinkDatum[]>([]);
  const [hover, setHover] = useState<HoverState>(null);

  const styles = dualViewVisualizerStyle;

  // load data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = graphData;
        console.log("DualViews received graphData =", graphData, data);

        if (cancelled) return;

        // const isTwitchData = typeof dataFile === "string" && dataFile.includes("twitch.json");

        // determine processed nodes
        let processed: number[] = [];
        if (modelType?.includes("link prediction")) {
          const sub = new Set<number>();
          if (hubNodeA != null) sub.add(hubNodeA);
          if (hubNodeB != null) sub.add(hubNodeB);
          if (data.edge_index) {
            for (let i = 0; i < data.edge_index[0].length; i++) {
              const s = data.edge_index[0][i];
              const t = data.edge_index[1][i];
              if (s === hubNodeA || s === hubNodeB) sub.add(t);
              if (t === hubNodeA || t === hubNodeB) sub.add(s);
            }
          }
          processed = Array.from(sub).sort((a, b) => a - b);
        } else {
          processed = data.x.map((_v: any, i: number) => i);
        }

        const nodeList: NodeDatum[] = processed.map((nodeId: number) => {
          let label = String(nodeId);
          if (!sandboxMode && modelType?.includes("node prediction")) {
            const feats = data.x[nodeId];
            const idx = Array.isArray(feats) ? feats.indexOf(1) : -1;
            if (idx !== -1 && elementMap[idx] != null) label = elementMap[idx];
            else if (data.train_nodes) label = data.train_nodes.includes(nodeId) ? "T" : "?";
            else if (data.y) label = String(data.y[nodeId]);
          }
          return { id: nodeId, element: label };
        });

        // filter links to processed nodes subset
        const setProcessed = new Set(processed);
        const linkList: LinkDatum[] = (data.edge_index?.[0] || []).reduce(
          (acc: LinkDatum[], s: number, i: number) => {
            const t = data.edge_index[1][i];
            if (setProcessed.has(s) && setProcessed.has(t)) {
              acc.push({ source: s, target: t, attr: data.edge_attr ? data.edge_attr[i] : null });
            }
            return acc;
          },
          []
        );

        setNodes(nodeList);
        setLinks(linkList);
      } catch (e) {
        console.error("Error loading graph data", e);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [graphData, modelType, sandboxMode, simulatedGraphData, hubNodeA, hubNodeB]);

  const onGraphPositions = (positions: { id: number; x: number; y: number }[]) => {
    if (!onNodePositionChange) return;
    onNodePositionChange(positions.map((p) => ({ id: String(p.id), x: p.x, y: p.y })));
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ display: "grid", gridTemplateColumns: "550px 550px", gap: 2 }}>
        <div style={{
          width: "67%",
          transform: "scale(0.67)",
          transformOrigin: "top left"
        }}>
          <GraphView
            nodes={nodes}
            links={links}
            linkPredictionMode={!!modelType?.includes("link prediction")}
            onNodePositionChange={onGraphPositions}
            onHover={setHover}
            hover={hover}
          />
        </div>
        <div style={{
          width: "67%",
          transform: "scale(0.67)",
          transformOrigin: "top left"
        }}>
          <MatrixView 
            nodes={nodes}
            links={links}
            onHover={setHover}
            hover={hover}
          />
        </div>
      </div>
    </>
  );
};

export default DualViews;
