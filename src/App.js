import "./App.css";
import Body from "./Component/Body";
import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <div className="">
      <ReactFlowProvider>
        <Body></Body>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
