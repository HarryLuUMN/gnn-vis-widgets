import pathlib
import anywidget
import traitlets

ROOT = pathlib.Path(__file__).resolve().parents[2]

DIST = ROOT / "dist"

class GraphEditor(anywidget.AnyWidget):
    dataFile = traitlets.Unicode("/files/test_data/karate_dataset.json").tag(sync=True)

    _esm = DIST / "graph_editor" / "index.js"
    _css = DIST / "graph_editor" / "index.css"

    value = traitlets.Int(0).tag(sync=True)
