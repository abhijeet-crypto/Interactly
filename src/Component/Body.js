import React, { useRef, useState } from "react";
import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { initialEdges, initialNodes } from "./initialNodes";
import { useReactFlow } from "reactflow";

import { CustomNode, initialCustomNode } from "./CustomNode";

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const nodeTypes = {
  initialCustom: initialCustomNode,
  custom: CustomNode,
};

const Body = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");
  const [nodeIdCounter, setNodeIdCounter] = useState(initialNodes.length);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useReactFlow(reactFlowWrapper);

  const onConnect = useCallback(
    (params) => {
      setEdges((edge) => addEdge(params, edge));
    },
    [setEdges]
  );

  const connectionLineStyle = {
    stroke: "gray",
    strokeWidth: 2,
  };

  const addNewNode = () => {
    if (name.length === 0) return;
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const newNodePosition = {
      x: x + 100 / zoom + Math.random() * zoom,
      y: y + 100 / zoom + Math.random() * zoom,
    };

    const newId = nodeIdCounter;
    setNodeIdCounter(nodeIdCounter + 1);

    setNodes((nds) =>
      nds.concat({
        id: (nds.length + 1).toString(),
        data: { id: newId - 1, label: name },
        position: newNodePosition,
      })
    );

    setName("");
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleEdgeClick = (event, edge) => {
    console.log("ege selected");
    setSelectedEdge(edge);
    const { clientX, clientY } = event;
    console.log("Mouse position:", clientX, clientY);
    setHoveredEdge({ ...edge, position: { x: clientX, y: clientY } });
  };

  const handleNodeClick = (event, node) => {
    console.log("node clicked");
    setSelectedNode(node);
    const { clientX, clientY } = event;
    setHoveredNode({ ...node, pos: { x: clientX, y: clientY } });
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes((oldNodes) =>
        oldNodes.filter((node) => node.id !== selectedNode.id)
      );
      setHoveredNode(null);
      setSelectedNode(null);
    }
  };

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      setEdges((oldEdges) =>
        oldEdges.filter((edge) => edge.id !== selectedEdge.id)
      );
      setHoveredEdge(null);
      setSelectedEdge(null);
    }
  };

  const defaultEdgeOptions = { style: connectionLineStyle, type: "New Node" };
  return (
    <div className="w-full h-[90vh] ">
      <div className="flex flex-row mt-6 ml-10 justify-start gap-2 items-center ">
        <input
          onKeyDown={(event) => {
            if (event.key === "Enter") addNewNode();
          }}
          type="text"
          name="title"
          value={name}
          placeholder="New Node"
          onChange={handleChange}
          className="bg-slate-200 rounded-md border-none focus:outline-none px-5 py-2"
        ></input>
        <button
          onClick={addNewNode}
          className="rounded-xl bg-blue-500 text-white font-bold justify-center items-center py-2 w-fit px-5 flex cursor-pointer"
        >
          Create Node
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onLoad={onLoad}
        onEdgeClick={handleEdgeClick}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
      >
        {/* <MiniMap></MiniMap> */}
        <Controls></Controls>
        <Background gap={12} size={1}></Background>
      </ReactFlow>

      {hoveredEdge && (
        <button
          onClick={handleDeleteEdge}
          style={{
            position: "absolute",
            borderRadius: "50%",
            padding: "2px 8px",
            top: hoveredEdge.position?.y,
            left: hoveredEdge.position?.x,
            transform: "translate(-50%, -50%)",
            background: "red",
            color: "white",
            font: "bold", // Adjusting the position to center the button
          }}
        >
          X
        </button>
      )}

      {hoveredNode && (
        <button
          onClick={handleDeleteNode}
          style={{
            position: "absolute",
            borderRadius: "50%",
            padding: "2px 8px",
            top: hoveredNode.pos?.y,
            left: hoveredNode.pos?.x,
            transform: "translate(-50%, -50%)",
            background: "red",
            color: "white",
            font: "bold", // Adjusting the position to center the button
          }}
        >
          X
        </button>
      )}
    </div>
  );
};

export default Body;
