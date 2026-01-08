import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const InputNode = memo(({ data }) => {
    return (
        <div className="input-node">
            <div className="node-header">
                <span className="node-icon"></span>
                <h3>Input Prompt</h3>
            </div>
            <div className="node-content">
                <textarea
                    value={data.value || ''}
                    onChange={(e) => data.onChange(e.target.value)}
                    placeholder="Enter your prompt here... (e.g., What is the capital of France?)"
                    className="input-textarea"
                    rows={4}
                />
            </div>
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    );
});

InputNode.displayName = 'InputNode';

export default InputNode;
