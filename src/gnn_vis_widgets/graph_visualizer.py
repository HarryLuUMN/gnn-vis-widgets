import pathlib
import anywidget
import traitlets
from .utils.data_loader import load_json

ROOT = pathlib.Path(__file__).resolve().parents[2]

DIST = ROOT / "dist"

class GraphVisualizer(anywidget.AnyWidget):
    graphData = traitlets.Dict().tag(sync=True)  

    _esm = DIST / "dual_views" / "index.js"
    _css = DIST / "dual_views" / "index.css"

    value = traitlets.Int(0).tag(sync=True)

    def add_data(self, dataFile):
        self.graphData = load_json(self=self,file_path=dataFile, root=ROOT)
