import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./style.css";
import GNNVisualizer from "./GNNVisualizer";

const render = createRender(() => {
    // Bind to Python trait `graphData`
    const [graphData, setGraphData] = useModelState<any>("graphData");
    const [graphPath, setGraphPath] = useModelState<string>("graphPath");
    const [intmData, setIntmData] = useModelState<any>("intmData");
    const [isLoading, setIsLoading] = React.useState(true);

	console.log("GNNVisualizer received graphData =", graphData);

    return (
        <div className="gnn_vis_widgets">
            <GNNVisualizer
                graphData={graphData}
                graphPath={graphPath}
                onLoadComplete={() =>setIsLoading(false)}
                intmData={intmData}
            />
        </div>
    );
});

export default { render };
