import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import InputNode from './components/InputNode';
import ResultNode from './components/ResultNode';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const initialNodes = [
    {
        id: 'input-1',
        type: 'inputNode',
        position: { x: 100, y: 200 },
        data: { value: '', onChange: null }
    },
    {
        id: 'result-1',
        type: 'resultNode',
        position: { x: 600, y: 200 },
        data: { value: '', loading: false, error: null }
    }
];


const initialEdges = [
    {
        id: 'e1-2',
        source: 'input-1',
        target: 'result-1',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
    }
];

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [inputValue, setInputValue] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');


    const nodeTypes = useMemo(() => ({
        inputNode: InputNode,
        resultNode: ResultNode
    }), []);


    const handleInputChange = useCallback((value) => {
        setInputValue(value);
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'input-1') {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            value,
                            onChange: handleInputChange
                        }
                    };
                }
                return node;
            })
        );
    }, [setNodes]);


    React.useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'input-1') {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            onChange: handleInputChange
                        }
                    };
                }
                return node;
            })
        );
    }, [handleInputChange, setNodes]);


    const handleRunFlow = async () => {
        if (!inputValue.trim()) {
            alert('Please enter a prompt first!');
            return;
        }

        setIsRunning(true);
        setSaveStatus('');


        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'result-1') {
                    return {
                        ...node,
                        data: { value: '', loading: true, error: null }
                    };
                }
                return node;
            })
        );

        try {
            const response = await axios.post(`${API_BASE_URL}/ask-ai`, {
                prompt: inputValue
            });

            const aiResponse = response.data.response;


            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === 'result-1') {
                        return {
                            ...node,
                            data: { value: aiResponse, loading: false, error: null }
                        };
                    }
                    return node;
                })
            );

        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorMessage = error.response?.data?.error || 'Failed to get AI response. Check if the backend server is running.';

            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === 'result-1') {
                        return {
                            ...node,
                            data: { value: '', loading: false, error: errorMessage }
                        };
                    }
                    return node;
                })
            );
        } finally {
            setIsRunning(false);
        }
    };


    const handleSave = async () => {
        const resultNode = nodes.find(n => n.id === 'result-1');
        const resultValue = resultNode?.data?.value;

        if (!inputValue.trim() || !resultValue) {
            alert('Please run the flow first to generate a response before saving!');
            return;
        }

        setSaveStatus('saving');

        try {
            await axios.post(`${API_BASE_URL}/save`, {
                prompt: inputValue,
                response: resultValue
            });

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);

        } catch (error) {
            console.error('Error saving interaction:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>AI Flow Application</h1>
                <p>Connect your prompts to AI-powered responses</p>
            </header>

            <div className="controls-panel">
                <button
                    onClick={handleRunFlow}
                    disabled={isRunning}
                    className="btn btn-primary"
                >
                    {isRunning ? 'Running...' : 'Run Flow'}
                </button>

                <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="btn btn-secondary"
                >
                    {saveStatus === 'saving' ? 'Saving...' :
                        saveStatus === 'saved' ? 'Saved!' :
                            saveStatus === 'error' ? 'Error' :
                                'Save'}
                </button>
            </div>

            <div className="flow-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                >
                    <Background color="#aaa" gap={16} />
                    <Controls />
                    <MiniMap
                        nodeColor={(node) => {
                            if (node.type === 'inputNode') return '#6366f1';
                            if (node.type === 'resultNode') return '#8b5cf6';
                            return '#fff';
                        }}
                    />
                </ReactFlow>
            </div>
        </div>
    );
}

export default App;
