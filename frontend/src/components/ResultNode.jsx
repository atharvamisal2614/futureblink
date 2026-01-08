import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ResultNode = memo(({ data }) => {
    return (
        <div className="result-node">
            <div className="node-header">
                <span className="node-icon"></span>
                <h3>AI Response</h3>
            </div>
            <div className="node-content">
                {data.loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Thinking...</p>
                    </div>
                ) : data.error ? (
                    <div className="error">
                        <span className="error-icon">⚠️</span>
                        <p>{data.error}</p>
                    </div>
                ) : data.value ? (
                    <div className="result-text">{data.value}</div>
                ) : (
                    <div className="placeholder">
                        Click "Run Flow" to see the AI response here
                    </div>
                )}
            </div>
            <Handle type="target" position={Position.Left} id="input" />
        </div>
    );
});

ResultNode.displayName = 'ResultNode';

export default ResultNode;
