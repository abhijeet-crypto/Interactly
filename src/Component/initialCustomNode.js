import { Handle, Position } from 'reactflow';
const initialCustomNode = () => {
    return (
        <div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
};

export default initialCustomNode;