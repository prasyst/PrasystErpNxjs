'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Clear as ClearIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitScreenIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Shape Node ───────────────────────────────────────────────────────────────
const ShapeNode = ({ node, isSelected, onDragStart, onDoubleClick, onHandleMouseDown, onHandleMouseUp, onResizeStart }) => {
  const { id, type, position, label, color, width, height } = node;

  const handleDot = {
    position: 'absolute',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#fff',
    border: `2.5px solid ${color}`,
    cursor: 'crosshair',
    zIndex: 15,
    boxShadow: `0 1px 6px ${color}70`,
  };

 const resizeCorner = isSelected ? (
  <Box
    style={{
      position: 'absolute',
      width: '12px',
      height: '12px',
      background: '#fff',
      border: `2px solid ${color}`,
      borderRadius: '3px',
      right: '-6px',
      bottom: '-6px',
      cursor: 'se-resize',
      zIndex: 20,
    }}
    onMouseDown={(e) => { 
      e.stopPropagation(); 
      e.preventDefault(); 
      onResizeStart(e, node); 
    }}
  />
) : null;

  const allPoints = [
    { id: 'top',    x: '50%', y: '0%'    },
    { id: 'bottom', x: '50%', y: '100%'  },
    { id: 'left',   x: '0%',  y: '50%'  },
    { id: 'right',  x: '100%',y: '50%'  },
  ];

  const renderHandles = () => allPoints.map((p) => (
    <Box
      key={`${id}-${p.id}`}
      style={{ ...handleDot, left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}
      onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onHandleMouseDown(e, node, p.id); }}
      onMouseUp={(e) => { e.stopPropagation(); e.preventDefault(); onHandleMouseUp(e, node, p.id); }}
    />
  ));

  const glow = isSelected
    ? `0 0 0 2px ${color}, 0 8px 32px ${color}60`
    : `0 2px 10px rgba(0,0,0,0.3)`;

  const base = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: 'move',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '12px',
    color: isSelected ? '#fff' : color,
    zIndex: isSelected ? 10 : 1,
    overflow: 'visible',
    boxSizing: 'border-box',
    letterSpacing: '0.02em',
  };

  // Rectangle
  if (type === 'rectangle' || type === 'square') {
    return (
      <Box
        style={{ ...base, width: `${width}px`, height: `${height}px`, borderRadius: '10px', padding: '10px',
          border: `2px solid ${isSelected ? '#fff' : color}`, backgroundColor: isSelected ? `${color}30` : `${color}18`, boxShadow: glow }}
        onMouseDown={(e) => onDragStart(e, node)}
        onDoubleClick={() => onDoubleClick(node)}
        onContextMenu={(e) => { e.preventDefault(); onDoubleClick(node); }}
      >
        {label}{renderHandles()}{resizeCorner}
      </Box>
    );
  }

  // Circle
  if (type === 'circle') {
    return (
      <Box
        style={{ ...base, width: `${width}px`, height: `${height}px`, borderRadius: '50%', padding: '10px',
          border: `2px solid ${isSelected ? '#fff' : color}`, backgroundColor: isSelected ? `${color}30` : `${color}18`, boxShadow: glow }}
        onMouseDown={(e) => onDragStart(e, node)}
        onDoubleClick={() => onDoubleClick(node)}
        onContextMenu={(e) => { e.preventDefault(); onDoubleClick(node); }}
      >
        {label}{renderHandles()}{resizeCorner}
      </Box>
    );
  }

  if (type === 'diamond') {
  return (
    <Box
      style={{ 
        ...base, 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={(e) => onDragStart(e, node)}
      onDoubleClick={() => onDoubleClick(node)}
      onContextMenu={(e) => { e.preventDefault(); onDoubleClick(node); }}
    >
      {/* Diamond shape container */}
      <Box
        style={{
          width: '100%',
          height: '100%',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          backgroundColor: isSelected ? `${color}35` : `${color}20`,
          border: `2px solid ${isSelected ? '#fff' : color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: glow,
        }}
      >
        <Box style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: isSelected ? '#fff' : color, 
          maxWidth: '70%', 
          textAlign: 'center',
          wordBreak: 'break-word'
        }}>
          {label}
        </Box>
      </Box>
      {renderHandles()}
      {resizeCorner}
    </Box>
  );
}

 if (type === 'condition') {
  return (
    <Box
      style={{ 
        ...base, 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={(e) => onDragStart(e, node)}
      onDoubleClick={() => onDoubleClick(node)}
      onContextMenu={(e) => { e.preventDefault(); onDoubleClick(node); }}
    >
      {/* Parallelogram shape container */}
      <Box
        style={{
          width: '100%',
          height: '100%',
          clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
          backgroundColor: isSelected ? `${color}35` : `${color}20`,
          border: `2px solid ${isSelected ? '#fff' : color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: glow,
        }}
      >
        <Box style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: isSelected ? '#fff' : color, 
          maxWidth: '70%', 
          textAlign: 'center',
          wordBreak: 'break-word'
        }}>
          {label}
        </Box>
      </Box>
      {renderHandles()}
      {resizeCorner}
    </Box>
  );
}

  return null;
};

// ─── Straight Connection Line ─────────────────────────────────────────────────
const ConnectionLine = ({ connection, nodes, onDelete }) => {
  const { id, fromNodeId, fromPoint, toNodeId, toPoint } = connection;
  const fromNode = nodes.find(n => n.id === fromNodeId);
  const toNode   = nodes.find(n => n.id === toNodeId);
  if (!fromNode || !toNode) return null;

  const pt = (node, pointId) => {
    const { position, width, height } = node;
    const h = height || width;
    switch (pointId) {
      case 'top':    return { x: position.x + width / 2, y: position.y };
      case 'bottom': return { x: position.x + width / 2, y: position.y + h };
      case 'left':   return { x: position.x,             y: position.y + h / 2 };
      case 'right':  return { x: position.x + width,     y: position.y + h / 2 };
      default:       return { x: position.x + width / 2, y: position.y + h / 2 };
    }
  };

  const from = pt(fromNode, fromPoint);
  const to   = pt(toNode, toPoint);
  const mx   = (from.x + to.x) / 2;
  const my   = (from.y + to.y) / 2;
  const lineColor = fromNode.color;

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      <defs>
        <marker id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill={lineColor} />
        </marker>
      </defs>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={lineColor} strokeWidth="2.5" markerEnd={`url(#arrow-${id})`} />
      <g style={{ pointerEvents: 'all', cursor: 'pointer' }} onClick={() => onDelete(id)}>
        <circle cx={mx} cy={my} r="9" fill="#0f0f23" stroke={lineColor} strokeWidth="1.5" />
        <text x={mx} y={my + 4.5} textAnchor="middle" fontSize="12" fill="#ff4f6a" fontWeight="bold">×</text>
      </g>
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FlowDiagram = () => {
  const router = useRouter();

  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [editNodeId, setEditNodeId] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingNode, setResizingNode] = useState(null);
  const [resizeStart, setResizeStartState] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const shapes = [
    { type: 'rectangle', label: 'Process',   emoji: '▬', color: '#3b82f6', width: 150, height: 80  },
    { type: 'square',    label: 'Step',      emoji: '■', color: '#22c55e', width: 110, height: 110 },
    { type: 'circle',    label: 'Terminal',  emoji: '●', color: '#ec4899', width: 110, height: 110 },
    { type: 'diamond',   label: 'Decision',  emoji: '◆', color: '#f59e0b', width: 120, height: 120 },
    { type: 'condition', label: 'If / Else', emoji: '⌥', color: '#a855f7', width: 150, height: 70  },
  ];

  const saveToHistory = useCallback((nn, nc, action) => {
    setHistory(prev => {
      const slice = prev.slice(0, historyIndex + 1);
      slice.push({ nodes: JSON.parse(JSON.stringify(nn)), connections: JSON.parse(JSON.stringify(nc)), action });
      return slice;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const p = history[historyIndex - 1];
      setNodes(p.nodes); setConnections(p.connections); setHistoryIndex(historyIndex - 1);
      setSnackbar({ open: true, message: `Undo: ${p.action}`, severity: 'info' });
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const n = history[historyIndex + 1];
      setNodes(n.nodes); setConnections(n.connections); setHistoryIndex(historyIndex + 1);
      setSnackbar({ open: true, message: `Redo: ${n.action}`, severity: 'info' });
    }
  }, [history, historyIndex]);

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(prev => {
      const nn = prev.filter(n => n.id !== nodeId);
      setConnections(pc => {
        const nc = pc.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
        return nc;
      });
      return nn;
    });
    setSelectedNode(s => s?.id === nodeId ? null : s);
    setSnackbar({ open: true, message: 'Node deleted', severity: 'warning' });
  }, []);

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'Z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
      if (e.key === 'Delete' && selectedNode) handleDeleteNode(selectedNode.id);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleUndo, handleRedo, selectedNode, handleDeleteNode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('flowDiagram_v3');
      if (saved) { const p = JSON.parse(saved); if (p.nodes) { setNodes(p.nodes); setConnections(p.connections || []); } }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('flowDiagram_v3', JSON.stringify({ nodes, connections })), 1000);
    return () => clearTimeout(t);
  }, [nodes, connections]);

  const handleAddNode = (shape) => {
    const id = `${shape.type}_${Date.now()}`;
    const rect = canvasRef.current?.getBoundingClientRect();
    const bx = rect ? (rect.width / 2 - shape.width / 2) : 200;
    const by = rect ? (rect.height / 2 - shape.height / 2) : 200;
    const newNode = {
      id, type: shape.type, label: shape.label, color: shape.color,
      width: shape.width, height: shape.height,
      position: { x: (bx - panOffset.x) / zoom, y: (by - panOffset.y) / zoom },
    };
    const nn = [...nodes, newNode];
    setNodes(nn);
    saveToHistory(nn, connections, `Add ${shape.label}`);
    setSnackbar({ open: true, message: `${shape.label} added`, severity: 'success' });
  };

  const handleDragStart = (e, node) => {
    if (isConnecting) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNode(node);
    setDragOffset({
      x: (e.clientX - rect.left - panOffset.x) / zoom - node.position.x,
      y: (e.clientY - rect.top  - panOffset.y) / zoom - node.position.y,
    });
    setSelectedNode(node);
  };

 const handleResizeStart = (e, node) => {
  e.stopPropagation();
  e.preventDefault();
  setResizingNode(node);
  setResizeStartState({ 
    mouseX: e.clientX, 
    mouseY: e.clientY, 
    w: node.width, 
    h: node.height,
    nodeId: node.id 
  });
};

const handleMouseMove = useCallback((e) => {
  if (draggingNode && canvasRef.current && !isConnecting) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, (e.clientX - rect.left - panOffset.x) / zoom - dragOffset.x);
    const y = Math.max(0, (e.clientY - rect.top  - panOffset.y) / zoom - dragOffset.y);
    setNodes(prev => prev.map(n => n.id === draggingNode.id ? { ...n, position: { x, y } } : n));
  }
  
  if (resizingNode && resizeStart && resizeStart.nodeId === resizingNode.id) {
    const dx = (e.clientX - resizeStart.mouseX) / zoom;
    const dy = (e.clientY - resizeStart.mouseY) / zoom;
    const nw = Math.max(60, resizeStart.w + dx);
    const nh = Math.max(40, resizeStart.h + dy);
    
    setNodes(prev => prev.map(n => 
      n.id === resizingNode.id ? { ...n, width: nw, height: nh } : n
    ));
  }
  
  if (isPanning) {
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  }
}, [draggingNode, dragOffset, isConnecting, resizingNode, resizeStart, isPanning, panStart, panOffset, zoom]);

const handleMouseUp = useCallback(() => {
  if (draggingNode) { 
    setDraggingNode(null); 
  }
  if (resizingNode) { 
    // Save to history after resize
    saveToHistory(nodes, connections, 'Resize Node');
    setResizingNode(null); 
    setResizeStartState(null); 
  }
  setIsPanning(false);
}, [draggingNode, resizingNode, nodes, connections, saveToHistory]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  const handleCanvasMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault(); setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY });
    }
    if (e.target === canvasRef.current || e.target === e.currentTarget) setSelectedNode(null);
  };

  const handleHandleMouseDown = (e, node, pointId) => {
    e.stopPropagation(); e.preventDefault();
    setIsConnecting(true); setConnectionStart({ nodeId: node.id, pointId });
    setSnackbar({ open: true, message: 'Dusre node ke handle pe drop karo', severity: 'info' });
  };

  const handleHandleMouseUp = (e, node, pointId) => {
    if (!isConnecting || !connectionStart) return;
    e.stopPropagation(); e.preventDefault();
    if (connectionStart.nodeId !== node.id) {
      const nc = { id: `conn_${Date.now()}`, fromNodeId: connectionStart.nodeId, fromPoint: connectionStart.pointId, toNodeId: node.id, toPoint: pointId };
      const newC = [...connections, nc];
      setConnections(newC);
      saveToHistory(nodes, newC, 'Connect');
      setSnackbar({ open: true, message: 'Nodes connected!', severity: 'success' });
    }
    setIsConnecting(false); setConnectionStart(null);
  };

  const handleDeleteConnection = (id) => {
    const nc = connections.filter(c => c.id !== id);
    setConnections(nc);
    saveToHistory(nodes, nc, 'Delete Connection');
    setSnackbar({ open: true, message: 'Connection deleted', severity: 'warning' });
  };

  const handleEditNode = (node) => { setEditNodeId(node.id); setEditText(node.label); setEditDialogOpen(true); };

  const handleSaveEdit = () => {
    const nn = nodes.map(n => n.id === editNodeId ? { ...n, label: editText } : n);
    setNodes(nn);
    saveToHistory(nn, connections, 'Edit Label');
    setEditDialogOpen(false);
    setSnackbar({ open: true, message: 'Label updated', severity: 'success' });
  };

  const handleClearDiagram = () => {
    if (window.confirm('Do You want to Clear the diagram?')) {
      setNodes([]); setConnections([]); setHistory([]); setHistoryIndex(-1);
      localStorage.removeItem('flowDiagram_v3'); setZoom(1); setPanOffset({ x: 0, y: 0 });
      setSnackbar({ open: true, message: 'Diagram cleared', severity: 'info' });
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, { backgroundColor: '#080818', scale: 2, useCORS: true });
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pw / canvas.width, (ph - 30) / canvas.height);
      const ix = (pw - canvas.width * ratio) / 2;
      pdf.setFillColor(8, 8, 24); pdf.rect(0, 0, pw, ph, 'F');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', ix, 30, canvas.width * ratio, canvas.height * ratio);
      pdf.setFontSize(16); pdf.setTextColor(99, 91, 255); pdf.text('Flow Diagram', pw / 2, 18, { align: 'center' });
      pdf.setFontSize(9); pdf.setTextColor(120, 120, 160); pdf.text(new Date().toLocaleString(), pw - 15, ph - 8, { align: 'right' });
      pdf.save(`flow-diagram-${Date.now()}.pdf`);
      setSnackbar({ open: true, message: 'PDF exported!', severity: 'success' });
    } catch { setSnackbar({ open: true, message: 'PDF export failed', severity: 'error' }); }
  };

  const panel = {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
  };

  return (
    <Box sx={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      p: 1.5,
      gap: 1.5,
      background: '#080818',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <Paper elevation={0} sx={{
        ...panel,
        p: '10px 16px',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Go To Dashboard">
            <IconButton
              onClick={() => router.push('/dashboard')}
              size="small"
              sx={{
                color: '#777',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                width: 34, height: 34,
                '&:hover': { color: '#fff', background: 'rgba(99,91,255,0.2)', borderColor: '#635bff' },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: '1px', height: 26, background: 'rgba(255,255,255,0.08)' }} />

          <Box sx={{
            width: 34, height: 34, borderRadius: '9px',
            background: 'linear-gradient(135deg, #635bff, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
          }}>⬡</Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#fff', letterSpacing: '0.06em', lineHeight: 1 }}>FLOW BUILDER</Typography>
            <Typography sx={{ fontSize: '9px', color: '#635bff', letterSpacing: '0.15em' }}>DIAGRAM TOOL</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {[
            { tip: 'Undo (Ctrl+Z)', icon: <UndoIcon sx={{ fontSize: 17 }} />, fn: handleUndo, disabled: historyIndex <= 0 },
            { tip: 'Redo (Ctrl+Y)', icon: <RedoIcon sx={{ fontSize: 17 }} />, fn: handleRedo, disabled: historyIndex >= history.length - 1 },
            { tip: 'Zoom In',       icon: <ZoomInIcon sx={{ fontSize: 17 }} />, fn: () => setZoom(p => Math.min(p + 0.15, 3)) },
            { tip: 'Zoom Out',      icon: <ZoomOutIcon sx={{ fontSize: 17 }} />, fn: () => setZoom(p => Math.max(p - 0.15, 0.1)) },
            { tip: 'Fit to Screen', icon: <FitScreenIcon sx={{ fontSize: 17 }} />, fn: () => { setZoom(1); setPanOffset({ x: 0, y: 0 }); } },
          ].map(({ tip, icon, fn, disabled }) => (
            <Tooltip title={tip} key={tip}>
              <span>
                <IconButton onClick={fn} disabled={disabled} size="small" sx={{
                  color: disabled ? '#2a2a44' : '#7070aa',
                  '&:hover': { color: '#fff', background: 'rgba(99,91,255,0.15)' },
                  width: 32, height: 32,
                }}>
                  {icon}
                </IconButton>
              </span>
            </Tooltip>
          ))}

          <Box sx={{ width: '1px', height: 24, background: 'rgba(255,255,255,0.08)', mx: 0.5 }} />

          <Button onClick={handleExportPDF} size="small" startIcon={<PdfIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ fontSize: '11px', fontWeight: 700, px: 1.5, py: 0.6, background: 'linear-gradient(135deg, #635bff, #3b82f6)', color: '#fff', borderRadius: '8px', textTransform: 'none', '&:hover': { background: 'linear-gradient(135deg, #5548d9, #2563eb)' }, minWidth: 0 }}>
            Export PDF
          </Button>

          <Button onClick={handleClearDiagram} size="small" startIcon={<ClearIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ fontSize: '11px', fontWeight: 700, px: 1.5, py: 0.6, border: '1px solid #ff4f6a33', color: '#ff4f6a', borderRadius: '8px', textTransform: 'none', '&:hover': { background: '#ff4f6a10' }, minWidth: 0 }}>
            Clear
          </Button>
        </Box>
      </Paper>

      {/* ── Body ── */}
      <Box sx={{ display: 'flex', flex: 1, gap: 1.5, overflow: 'hidden', minHeight: 0 }}>

        {/* ── Left Sidebar ── */}
        <Paper elevation={0} sx={{
          ...panel,
          width: 115,
          flexShrink: 0,
          p: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
        }}>
          <Typography sx={{ fontSize: '9px', fontWeight: 800, color: '#635bff', letterSpacing: '0.18em', textAlign: 'center' }}>SHAPES</Typography>

          {shapes.map((shape) => (
            <Box key={shape.type} onClick={() => handleAddNode(shape)}
              sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: `${shape.color}12`,
                p: '10px 6px',
                textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  background: `${shape.color}28`,
                  border: `1px solid ${shape.color}70`,
                  transform: 'scale(1.05)',
                  boxShadow: `0 6px 20px ${shape.color}35`,
                },
              }}>
              <Typography sx={{ fontSize: '28px', lineHeight: 1.3, color: shape.color }}>{shape.emoji}</Typography>
              <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#aaa', letterSpacing: '0.06em', mt: '3px', lineHeight: 1.2 }}>
                {shape.label.toUpperCase()}
              </Typography>
            </Box>
          ))}

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', mt: 'auto', pt: '10px' }}>
            {[{ label: 'Nodes', val: nodes.length }, { label: 'Links', val: connections.length }, { label: 'Zoom', val: `${Math.round(zoom * 100)}%` }].map(({ label, val }) => (
              <Box key={label} sx={{ textAlign: 'center', mb: '6px' }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#635bff', lineHeight: 1 }}>{val}</Typography>
                <Typography sx={{ fontSize: '8px', color: '#555', letterSpacing: '0.1em' }}>{label.toUpperCase()}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* ── Canvas ── */}
        <Paper elevation={0} sx={{ ...panel, flex: 1, position: 'relative', overflow: 'hidden', p: 0, minWidth: 0 }}>
          <Box
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            sx={{
              width: '100%', height: '100%',
              position: 'relative', overflow: 'hidden',
              background: '#080818',
              cursor: isPanning ? 'grabbing' : isConnecting ? 'crosshair' : 'default',
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,91,255,0.22) 1px, transparent 0)`,
              backgroundSize: '28px 28px',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {connections.map(conn => (
              <ConnectionLine key={conn.id} connection={conn} nodes={nodes} onDelete={handleDeleteConnection} />
            ))}
            {nodes.map(node => (
              <ShapeNode key={node.id} node={node} isSelected={selectedNode?.id === node.id}
                onDragStart={handleDragStart} onDoubleClick={handleEditNode}
                onHandleMouseDown={handleHandleMouseDown} onHandleMouseUp={handleHandleMouseUp}
                onResizeStart={handleResizeStart}
              />
            ))}

            {nodes.length === 0 && (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <Typography sx={{ fontSize: '60px', opacity: 0.07, lineHeight: 1 }}>⬡</Typography>
                <Typography sx={{ fontSize: '14px', color: '#282840', fontWeight: 700, letterSpacing: '0.06em', mt: 1 }}>Click shapes to start building</Typography>
                <Typography sx={{ fontSize: '11px', color: '#1c1c30', mt: 0.5 }}>Alt+drag to pan • Double-click to edit • Del to delete</Typography>
              </Box>
            )}
          </Box>

          {/* Selected Node Panel */}
          {selectedNode && (
            <Paper elevation={0} sx={{ ...panel, position: 'absolute', top: 12, left: 12, p: '10px 14px', minWidth: 185 }}>
              <Typography sx={{ fontSize: '9px', fontWeight: 800, color: '#635bff', letterSpacing: '0.16em', mb: 0.75 }}>SELECTED NODE</Typography>
              <Typography sx={{ fontSize: '11px', color: '#888', mb: 0.25 }}>Type: <span style={{ color: '#ccc' }}>{selectedNode.type}</span></Typography>
              <Typography sx={{ fontSize: '11px', color: '#888', mb: 1 }}>Label: <span style={{ color: '#ccc' }}>{selectedNode.label}</span></Typography>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <Button size="small" startIcon={<EditIcon sx={{ fontSize: '12px !important' }} />}
                  onClick={() => handleEditNode(selectedNode)}
                  sx={{ fontSize: '10px', px: 1, py: 0.3, textTransform: 'none', color: '#3b82f6', border: '1px solid #3b82f625', borderRadius: '6px', '&:hover': { background: '#3b82f615' }, minWidth: 0 }}>
                  Edit
                </Button>
                <Button size="small" startIcon={<DeleteIcon sx={{ fontSize: '12px !important' }} />}
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  sx={{ fontSize: '10px', px: 1, py: 0.3, textTransform: 'none', color: '#ff4f6a', border: '1px solid #ff4f6a25', borderRadius: '6px', '&:hover': { background: '#ff4f6a15' }, minWidth: 0 }}>
                  Delete
                </Button>
              </Box>
            </Paper>
          )}

          {/* Hint Bar */}
          <Box sx={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(8,8,24,0.85)', backdropFilter: 'blur(8px)',
            borderRadius: '20px', px: 2, py: '5px',
            border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap',
          }}>
            <Typography sx={{ fontSize: '10px', color: '#3a3a5a', letterSpacing: '0.06em' }}>
              🔵 Handle = connect &nbsp;|&nbsp; ◼ Corner = resize &nbsp;|&nbsp; Alt+drag = pan &nbsp;|&nbsp; Del = delete node
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ── Edit Dialog ── */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { ...panel, color: '#fff' } }}>
        <DialogTitle sx={{ fontSize: '14px', fontWeight: 800, color: '#fff', pb: 0 }}>Node Label Edit Karo</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Label" fullWidth value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            variant="outlined"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                '&:hover fieldset': { borderColor: '#635bff' },
                '&.Mui-focused fieldset': { borderColor: '#635bff' },
              },
              '& .MuiInputLabel-root': { color: '#555' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#635bff' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#555', textTransform: 'none', fontSize: '12px' }}>Cancel</Button>
          <Button onClick={handleSaveEdit}
            sx={{ background: 'linear-gradient(135deg, #635bff, #3b82f6)', color: '#fff', textTransform: 'none', fontSize: '12px', borderRadius: '8px', px: 2, fontWeight: 700, '&:hover': { background: 'linear-gradient(135deg, #5548d9, #2563eb)' } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ background: '#1a1a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', '& .MuiAlert-icon': { color: '#635bff' } }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlowDiagram;