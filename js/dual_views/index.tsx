import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./style.css";
import DualViews from "./DualViews";

const render = createRender(() => {
	const [dataFile, setDataFile] = useModelState<string>("dataFile");
	return (
		<div className="gnn_vis_widgets">
			<DualViews
				dataFile={dataFile.toString()}
				handleSimulatedGraphChange={() => {}}
				handleNodePositionsChange={() => {}}
			/>
		</div>
	);
});

export default { render };
