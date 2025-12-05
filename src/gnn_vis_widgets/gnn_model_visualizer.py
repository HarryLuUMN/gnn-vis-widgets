import pathlib
import anywidget
import traitlets
from .utils.data_loader import load_json
from .utils.subgraph_sampling import subgraph_hoop_sampling, multiple_subgraph_hoop_sampling

ROOT = pathlib.Path(__file__).resolve().parents[2]

DIST = ROOT / "dist"

class GNNVisualizer(anywidget.AnyWidget):
    graphData = traitlets.Dict().tag(sync=True)  
    graphPath = traitlets.Unicode("").tag(sync=True)
    intmData = traitlets.Dict().tag(sync=True)

    _esm = DIST / "gnn_visualizer" / "index.js"
    _css = DIST / "gnn_visualizer" / "index.css"

    value = traitlets.Int(0).tag(sync=True)