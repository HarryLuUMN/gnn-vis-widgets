export async function loadSimGraphData(dataFile: string) {
    const response = await fetch(dataFile);
    const jsonData = await response.json();

    if (!jsonData.x || !jsonData.edge_index) {
        throw new Error("Invalid graph JSON: missing fields");
    }

    const ret = {
        x: jsonData.x,
        edge_index: jsonData.edge_index,
        edge_attr: jsonData.edge_attr ?? [],
        y: jsonData.y ?? [],
        batch: jsonData.batch ?? [],
    };

    console.log("Loaded graph data - from utils:", ret);

    return ret;
}

export function processDataFromVisualizerToEditor(input: {
  x: number[][],
  edge_index: number[][],
  edge_attr: number[][],
  y: number[],
  batch: number[]
}) {
  const { x, edge_index, edge_attr } = input;

  const nodes = x.map((features, index) => ({
    id: `N${index}`,
    group: 1 
  }));


  const links = edge_index[0].map((sourceIdx, i) => {
    const targetIdx = edge_index[1][i];
    return {
      source: `N${sourceIdx}`,
      target: `N${targetIdx}`,
      value: edge_attr[i]?.[0] ?? 1  
    };
  });

  return { nodes, links };
}

export function processDataFromEditorToVisualizer(input: {
  nodes: { id: string; group: number }[];
  links: { source: any; target: any; value: number }[];
}) {
  const edgeIndexPair1: number[] = [];
  const edgeIndexPair2: number[] = [];

  const pairSet = new Set<string>();
  const edgeAttr: number[][] = [];

  for (let i = 0; i < input.links.length; i++) {
    const link = input.links[i];
    const source = link.source.index;
    const target = link.target.index;

    const key1 = `${source},${target}`;
    const key2 = `${target},${source}`;

    if (!pairSet.has(key1)) {
      edgeIndexPair1.push(source);
      edgeIndexPair2.push(target);
      edgeAttr.push([link.value]);
      pairSet.add(key1);
    }

    if (!pairSet.has(key2)) {
      edgeIndexPair1.push(target);
      edgeIndexPair2.push(source);
      edgeAttr.push([link.value]); 
      pairSet.add(key2);
    }
  }

  const node_num = input.nodes.length;
  const x: number[][] = [];

  for (let i = 0; i < node_num; i++) {
    const row: number[] = [];
    for (let j = 0; j < 5; j++) {
      const val = Math.random() * 3 - 1.5;
      row.push(val);
    }
    x.push(row);
  }

  const y = [0];
  const batch = Array(node_num).fill(0);

  return {
    edge_index: [edgeIndexPair1, edgeIndexPair2],
    edge_attr: edgeAttr,
    x,
    y,
    batch
  };
}
