import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./style.css";
import GraphEditor from "./GraphEditor";

const render = createRender(() => {

    const [dataFile, setDataFile] = useModelState<string>("dataFile");
    const [nodePositions, setNodePositions] = React.useState<any[]>([]);

    const handleSimulatedGraphChange = (value: any) => {
        setDataFile(value);
        console.log("Simulated graph data updated:", value, dataFile);
    };

    const handleNodePositionsChange = (positions: { id: string; x: number; y: number }[]) => {
        setNodePositions(positions);
        console.log("Node positions updated:", positions);
    };
	
	return (
		<div className="graph_editor">
			<GraphEditor
                dataFile={dataFile}
                handleSimulatedGraphChange={handleSimulatedGraphChange}
                onNodePositionsChange={handleNodePositionsChange}
            />
		</div>
	);
});

export default { render };