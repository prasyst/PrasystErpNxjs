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
  Grid,
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
  Add as AddIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitScreenIcon,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Shape Node ──────────────────────────────────────────────────────────────
const ShapeNode = ({ node, isSelected, onDragStart, onDoubleClick, onHandleMouseDown, onHandleMouseUp, onResizeStart }) => {
  const { id, type, position, label, color, width, height } = node;

  const base = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: 'move',
    userSelect: 'none',
    border: `2px solid ${isSelected ? '#fff' : color}`,
    backgroundColor: isSelected ? `${color}30` : `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '13px',
    color: isSelected ? '#fff' : color,
    zIndex: isSelected ? 10 : 1,
    boxShadow: isSelected ? `0 0 0 2px ${color}, 0 8px 32px ${color}50` : `0 2px 8px rgba(0,0,0,0.18)`,
    transition: 'box-shadow 0.2s, border 0.2s',
    overflow: 'visible',
    letterSpacing: '0.02em',
  };

  const handle = {
    position: 'absolute',
    width: '13px',
    height: '13px',
    borderRadius: '50%',
    background: '#fff',
    border: `2.5px solid ${color}`,
    cursor: 'crosshair',
    zIndex: 11,
    boxShadow: `0 1px 4px ${color}60`,
    transition: 'transform 0.15s',
  };

  const resizeHandle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: '#fff',
    border: `2px solid ${color}`,
    zIndex: 12,
    cursor: 'se-resize',
    borderRadius: '2px',
    right: '-5px',
    bottom: '-5px',
  };

  const getStyle = () => {
    switch (type) {
      case 'rectangle':
        return { ...base, width: `${width}px`, height: `${height}px`, borderRadius: '10px', padding: '12px' };
      case 'square':
        return { ...base, width: `${width}px`, height: `${height}px`, borderRadius: '10px', padding: '12px' };
      case 'circle':
        return { ...base, width: `${width}px`, height: `${width}px`, borderRadius: '50%', padding: '12px' };
      case 'diamond':
        return { ...base, width: `${width}px`, height: `${width}px`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', padding: '20px' };
      default:
        return base;
    }
  };

  const points = type === 'circle'
    ? [
        { id: 'top', x: '50%', y: '0%' },
        { id: 'bottom', x: '50%', y: '100%' },
      ]
    : [
        { id: 'top', x: '50%', y: '0%' },
        { id: 'bottom', x: '50%', y: '100%' },
        { id: 'left', x: '0%', y: '50%' },
        { id: 'right', x: '100%', y: '50%' },
      ];

  return (
    <Box
      style={getStyle()}
      onMouseDown={(e) => onDragStart(e, node)}
      onDoubleClick={() => onDoubleClick(node)}
      onContextMenu={(e) => { e.preventDefault(); onDoubleClick(node); }}
    >
      {type === 'diamond'
        ? <Box style={{ transform: 'rotate(45deg)', width: '100%', textAlign: 'center' }}>{label}</Box>
        : label}

      {/* Connection handles */}
      {points.map((p) => (
        <Box
          key={`${id}-${p.id}`}
          style={{ ...handle, left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onHandleMouseDown(e, node, p.id); }}
          onMouseUp={(e) => { e.stopPropagation(); e.preventDefault(); onHandleMouseUp(e, node, p.id); }}
        />
      ))}

      {/* Resize handle */}
      {isSelected && type !== 'circle' && type !== 'diamond' && (
        <Box
          style={resizeHandle}
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onResizeStart(e, node); }}
        />
      )}
    </Box>
  );
};

// ─── Connection Line (STRAIGHT) ───────────────────────────────────────────────
const ConnectionLine = ({ connection, nodes, onDelete }) => {
  const { id, fromNodeId, fromPoint, toNodeId, toPoint } = connection;
  const fromNode = nodes.find(n => n.id === fromNodeId);
  const toNode = nodes.find(n => n.id === toNodeId);
  if (!fromNode || !toNode) return null;

  const pt = (node, pointId) => {
    const { position, width, height } = node;
    const h = node.type === 'circle' || node.type === 'diamond' ? width : height;
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
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const lineColor = fromNode.color;

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
    >
      <defs>
        <marker id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill={lineColor} />
        </marker>
      </defs>
      {/* Straight line */}
      <line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={lineColor} strokeWidth="2.5"
        markerEnd={`url(#arrow-${id})`}
        strokeDasharray="none"
      />
      {/* Delete button at midpoint */}
      <g
        style={{ pointerEvents: 'all', cursor: 'pointer' }}
        onClick={() => onDelete(id)}
      >
        <circle cx={mx} cy={my} r="9" fill="#1a1a2e" stroke={lineColor} strokeWidth="1.5" />
        <text x={mx} y={my + 4.5} textAnchor="middle" fontSize="11" fill="#ff4f6a" fontWeight="bold">×</text>
      </g>
    </svg>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const FlowDiagram = () => {
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
    { type: 'rectangle', label: 'Rect',    emoji: '▬', color: '#3b82f6', width: 140, height: 80  },
    { type: 'square',    label: 'Square',  emoji: '■', color: '#22c55e', width: 110, height: 110 },
    { type: 'circle',    label: 'Circle',  emoji: '●', color: '#ec4899', width: 110, height: 110 },
    { type: 'diamond',   label: 'Diamond', emoji: '◆', color: '#f59e0b', width: 110, height: 110 },
  ];

  const saveToHistory = useCallback((newNodes, newConns, action) => {
    const slice = history.slice(0, historyIndex + 1);
    slice.push({ nodes: JSON.parse(JSON.stringify(newNodes)), connections: JSON.parse(JSON.stringify(newConns)), action });
    setHistory(slice);
    setHistoryIndex(slice.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setNodes(prev.nodes); setConnections(prev.connections); setHistoryIndex(historyIndex - 1);
      setSnackbar({ open: true, message: `Undo: ${prev.action}`, severity: 'info' });
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setNodes(next.nodes); setConnections(next.connections); setHistoryIndex(historyIndex + 1);
      setSnackbar({ open: true, message: `Redo: ${next.action}`, severity: 'info' });
    }
  }, [history, historyIndex]);

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'Z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
      if (e.key === 'Delete' && selectedNode) handleDeleteNode(selectedNode.id);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleUndo, handleRedo, selectedNode]);

  useEffect(() => {
    const saved = localStorage.getItem('flowDiagram2');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.nodes) { setNodes(p.nodes); setConnections(p.connections || []); }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('flowDiagram2', JSON.stringify({ nodes, connections })), 1000);
    return () => clearTimeout(t);
  }, [nodes, connections]);

  const handleAddNode = (shape) => {
    const id = `${shape.type}_${Date.now()}`;
    const rect = canvasRef.current?.getBoundingClientRect();
    const bx = rect ? (rect.width / 2 - shape.width / 2) : 200;
    const by = rect ? (rect.height / 2 - shape.height / 2) : 200;
    const newNode = {
      id, type: shape.type,
      position: { x: (bx - panOffset.x) / zoom, y: (by - panOffset.y) / zoom },
      label: shape.label, color: shape.color, width: shape.width, height: shape.height || shape.width,
    };
    const nn = [...nodes, newNode];
    setNodes(nn);
    saveToHistory(nn, connections, `Add ${shape.label}`);
    setSnackbar({ open: true, message: `${shape.label} added`, severity: 'success' });
  };

  const handleDragStart = (e, node) => {
    if (isConnecting) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ox = (e.clientX - rect.left - panOffset.x) / zoom - node.position.x;
    const oy = (e.clientY - rect.top  - panOffset.y) / zoom - node.position.y;
    setDraggingNode(node); setDragOffset({ x: ox, y: oy }); setSelectedNode(node);
  };

  const handleResizeStart = (e, node) => {
    setResizingNode(node);
    setResizeStartState({ mouseX: e.clientX, mouseY: e.clientY, w: node.width, h: node.height });
  };

  const handleDrag = useCallback((e) => {
    if (draggingNode && canvasRef.current && !isConnecting) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, (e.clientX - rect.left - panOffset.x) / zoom - dragOffset.x);
      const y = Math.max(0, (e.clientY - rect.top  - panOffset.y) / zoom - dragOffset.y);
      setNodes(prev => prev.map(n => n.id === draggingNode.id ? { ...n, position: { x, y } } : n));
    }
    if (resizingNode && resizeStart) {
      const dx = (e.clientX - resizeStart.mouseX) / zoom;
      const dy = (e.clientY - resizeStart.mouseY) / zoom;
      const nw = Math.max(60, resizeStart.w + dx);
      const nh = Math.max(40, resizeStart.h + dy);
      setNodes(prev => prev.map(n => n.id === resizingNode.id ? { ...n, width: nw, height: nh } : n));
    }
    if (isPanning && canvasRef.current) {
      setPanOffset(prev => ({ x: prev.x + e.clientX - panStart.x, y: prev.y + e.clientY - panStart.y }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggingNode, dragOffset, isConnecting, resizingNode, resizeStart, isPanning, panStart, panOffset, zoom]);

  const handleDragEnd = () => {
    if (draggingNode) { saveToHistory(nodes, connections, `Move ${draggingNode.type}`); setDraggingNode(null); }
    if (resizingNode) { saveToHistory(nodes, connections, `Resize ${resizingNode.type}`); setResizingNode(null); setResizeStartState(null); }
    setIsPanning(false);
  };

  const handleHandleMouseDown = (e, node, pointId) => {
    e.stopPropagation(); e.preventDefault();
    setIsConnecting(true); setConnectionStart({ nodeId: node.id, pointId });
    setSnackbar({ open: true, message: `Dusre node ka handle pe drop karo`, severity: 'info' });
  };

  const handleHandleMouseUp = (e, node, pointId) => {
    if (!isConnecting || !connectionStart) return;
    e.stopPropagation(); e.preventDefault();
    if (connectionStart.nodeId !== node.id) {
      const nc = { id: `conn_${Date.now()}`, fromNodeId: connectionStart.nodeId, fromPoint: connectionStart.pointId, toNodeId: node.id, toPoint: pointId };
      const newC = [...connections, nc];
      setConnections(newC); saveToHistory(nodes, newC, 'Create Connection');
      setSnackbar({ open: true, message: 'Connected!', severity: 'success' });
    }
    setIsConnecting(false); setConnectionStart(null);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    return () => { document.removeEventListener('mousemove', handleDrag); document.removeEventListener('mouseup', handleDragEnd); };
  }, [handleDrag]);

  const handleCanvasMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault(); setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY });
    }
    if (e.target === canvasRef.current) setSelectedNode(null);
  };

  const handleDeleteNode = (nodeId) => {
    const del = nodes.find(n => n.id === nodeId);
    const nn = nodes.filter(n => n.id !== nodeId);
    const nc = connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
    setNodes(nn); setConnections(nc); saveToHistory(nn, nc, `Delete ${del?.type || 'Node'}`);
    if (selectedNode?.id === nodeId) setSelectedNode(null);
    setSnackbar({ open: true, message: 'Node deleted', severity: 'warning' });
  };

  const handleDeleteConnection = (id) => {
    const nc = connections.filter(c => c.id !== id);
    setConnections(nc); saveToHistory(nodes, nc, 'Delete Connection');
    setSnackbar({ open: true, message: 'Connection deleted', severity: 'warning' });
  };

  const handleEditNode = (node) => { setEditNodeId(node.id); setEditText(node.label); setEditDialogOpen(true); };

  const handleSaveEdit = () => {
    const nn = nodes.map(n => n.id === editNodeId ? { ...n, label: editText } : n);
    setNodes(nn); saveToHistory(nn, connections, 'Edit Text');
    setEditDialogOpen(false); setEditText(''); setEditNodeId(null);
    setSnackbar({ open: true, message: 'Text updated', severity: 'success' });
  };

  const handleClearDiagram = () => {
    if (window.confirm('Poora diagram clear karna hai?')) {
      setNodes([]); setConnections([]); setHistory([]); setHistoryIndex(-1);
      localStorage.removeItem('flowDiagram2'); setZoom(1); setPanOffset({ x: 0, y: 0 });
      setSnackbar({ open: true, message: 'Diagram cleared', severity: 'info' });
    }
  };

  const handleExportPDF = async () => {
    const el = canvasRef.current;
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#0f0f23', scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pw / canvas.width, (ph - 30) / canvas.height);
      const ix = (pw - canvas.width * ratio) / 2;
      pdf.setFillColor(15, 15, 35); pdf.rect(0, 0, pw, ph, 'F');
      pdf.addImage(imgData, 'PNG', ix, 30, canvas.width * ratio, canvas.height * ratio);
      pdf.setFontSize(16); pdf.setTextColor(99, 91, 255); pdf.text('Flow Diagram', pw / 2, 18, { align: 'center' });
      pdf.setFontSize(9); pdf.setTextColor(150, 150, 180); pdf.text(new Date().toLocaleString(), pw - 15, ph - 8, { align: 'right' });
      pdf.save(`flow-diagram-${Date.now()}.pdf`);
      setSnackbar({ open: true, message: 'PDF exported!', severity: 'success' });
    } catch { setSnackbar({ open: true, message: 'PDF export failed', severity: 'error' }); }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const panel = {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1.5, background: '#080818', gap: 1.5 }}>

      {/* ── Header ── */}
      <Paper elevation={0} sx={{ ...panel, p: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #635bff, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⬡</Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>FLOW BUILDER</Typography>
            <Typography sx={{ fontSize: '10px', color: '#635bff', letterSpacing: '0.12em' }}>DIAGRAM TOOL</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {[
            { tip: 'Undo (Ctrl+Z)', icon: <UndoIcon sx={{ fontSize: 16 }} />, fn: handleUndo, disabled: historyIndex <= 0 },
            { tip: 'Redo (Ctrl+Y)', icon: <RedoIcon sx={{ fontSize: 16 }} />, fn: handleRedo, disabled: historyIndex >= history.length - 1 },
            { tip: 'Zoom In',  icon: <ZoomInIcon sx={{ fontSize: 16 }} />, fn: () => setZoom(p => Math.min(p + 0.15, 3)) },
            { tip: 'Zoom Out', icon: <ZoomOutIcon sx={{ fontSize: 16 }} />, fn: () => setZoom(p => Math.max(p - 0.15, 0.1)) },
            { tip: 'Fit',      icon: <FitScreenIcon sx={{ fontSize: 16 }} />, fn: () => { setZoom(1); setPanOffset({ x: 0, y: 0 }); } },
          ].map(({ tip, icon, fn, disabled }) => (
            <Tooltip title={tip} key={tip}>
              <span>
                <IconButton onClick={fn} disabled={disabled} size="small"
                  sx={{ color: disabled ? '#333' : '#8888aa', '&:hover': { color: '#fff', background: 'rgba(99,91,255,0.15)' }, width: 30, height: 30 }}>
                  {icon}
                </IconButton>
              </span>
            </Tooltip>
          ))}

          <Box sx={{ width: '1px', height: 24, background: 'rgba(255,255,255,0.1)', mx: 0.5 }} />

          <Button onClick={handleExportPDF} size="small" startIcon={<PdfIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ fontSize: '11px', fontWeight: 700, px: 1.5, py: 0.5, background: 'linear-gradient(135deg, #635bff, #3b82f6)', color: '#fff', borderRadius: '8px', textTransform: 'none', letterSpacing: '0.04em', '&:hover': { background: 'linear-gradient(135deg, #5548d9, #2563eb)' }, minWidth: 0 }}>
            Export PDF
          </Button>
          <Button onClick={handleClearDiagram} size="small" startIcon={<ClearIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ fontSize: '11px', fontWeight: 700, px: 1.5, py: 0.5, border: '1px solid #ff4f6a44', color: '#ff4f6a', borderRadius: '8px', textTransform: 'none', '&:hover': { background: '#ff4f6a15' }, minWidth: 0 }}>
            Clear
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, gap: 1.5, overflow: 'hidden' }}>

        {/* ── Left Panel ── */}
        <Paper elevation={0} sx={{ ...panel, width: 100, p: '12px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={{ fontSize: '9px', fontWeight: 800, color: '#635bff', letterSpacing: '0.15em', textAlign: 'center', mb: 0.5 }}>SHAPES</Typography>

          {shapes.map((shape) => (
            <Box key={shape.type} onClick={() => handleAddNode(shape)}
              sx={{
                cursor: 'pointer', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)',
                background: `${shape.color}12`, p: '7px 4px', textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': { background: `${shape.color}25`, border: `1px solid ${shape.color}60`, transform: 'scale(1.04)', boxShadow: `0 4px 16px ${shape.color}30` },
              }}>
              <Typography sx={{ fontSize: '20px', lineHeight: 1.2, color: shape.color }}>{shape.emoji}</Typography>
              <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em', mt: '2px' }}>{shape.label.toUpperCase()}</Typography>
            </Box>
          ))}

          {/* Stats */}
          <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[{ label: 'Nodes', val: nodes.length }, { label: 'Links', val: connections.length }].map(({ label, val }) => (
              <Box key={label} sx={{ textAlign: 'center', mb: 0.5 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#635bff', lineHeight: 1 }}>{val}</Typography>
                <Typography sx={{ fontSize: '9px', color: '#666', letterSpacing: '0.1em' }}>{label.toUpperCase()}</Typography>
              </Box>
            ))}
          </Box>

          {/* Zoom */}
          <Box sx={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', pt: 1 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#635bff' }}>{Math.round(zoom * 100)}%</Typography>
            <Typography sx={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em' }}>ZOOM</Typography>
          </Box>
        </Paper>

        {/* ── Canvas ── */}
        <Paper elevation={0} sx={{ ...panel, flex: 1, position: 'relative', overflow: 'hidden', p: 0 }}>
          <Box
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            sx={{
              width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
              background: '#080818',
              cursor: isPanning ? 'grabbing' : isConnecting ? 'crosshair' : 'default',
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(99,91,255,0.18) 1px, transparent 0)
              `,
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
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '48px', opacity: 0.15 }}>⬡</Typography>
                <Typography sx={{ fontSize: '14px', color: '#333', fontWeight: 600, letterSpacing: '0.05em' }}>Click shapes to start</Typography>
                <Typography sx={{ fontSize: '11px', color: '#222', mt: 0.5 }}>Alt+drag to pan • Double-click to edit</Typography>
              </Box>
            )}
          </Box>

          {/* Selected node info */}
          {selectedNode && (
            <Paper elevation={0} sx={{ ...panel, position: 'absolute', top: 12, left: 12, p: '10px 14px', minWidth: 170 }}>
              <Typography sx={{ fontSize: '9px', fontWeight: 800, color: '#635bff', letterSpacing: '0.15em', mb: 1 }}>SELECTED</Typography>
              <Typography sx={{ fontSize: '12px', color: '#ccc' }}><span style={{ color: '#666' }}>Type: </span>{selectedNode.type}</Typography>
              <Typography sx={{ fontSize: '12px', color: '#ccc', mb: 1 }}><span style={{ color: '#666' }}>Label: </span>{selectedNode.label}</Typography>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <Button size="small" startIcon={<EditIcon sx={{ fontSize: '12px !important' }} />}
                  onClick={() => handleEditNode(selectedNode)}
                  sx={{ fontSize: '10px', px: 1, py: 0.3, textTransform: 'none', color: '#3b82f6', border: '1px solid #3b82f620', borderRadius: '6px', '&:hover': { background: '#3b82f615' }, minWidth: 0 }}>
                  Edit
                </Button>
                <Button size="small" startIcon={<DeleteIcon sx={{ fontSize: '12px !important' }} />}
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  sx={{ fontSize: '10px', px: 1, py: 0.3, textTransform: 'none', color: '#ff4f6a', border: '1px solid #ff4f6a20', borderRadius: '6px', '&:hover': { background: '#ff4f6a15' }, minWidth: 0 }}>
                  Delete
                </Button>
              </Box>
            </Paper>
          )}

          {/* Hint bar */}
          <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            borderRadius: '20px', px: 2, py: 0.5, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography sx={{ fontSize: '10px', color: '#555', letterSpacing: '0.08em' }}>
              Drag handles to connect · Double-click to edit · Delete key · Alt+drag to pan · Corner handle to resize
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { ...panel, color: '#fff' } }}>
        <DialogTitle sx={{ fontSize: '14px', fontWeight: 800, color: '#fff', pb: 0 }}>Edit Node Label</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Label" fullWidth value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            variant="outlined"
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#635bff' } }, '& .MuiInputLabel-root': { color: '#666' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#666', textTransform: 'none', fontSize: '12px' }}>Cancel</Button>
          <Button onClick={handleSaveEdit} sx={{ background: 'linear-gradient(135deg, #635bff, #3b82f6)', color: '#fff', textTransform: 'none', fontSize: '12px', borderRadius: '8px', px: 2, '&:hover': { background: 'linear-gradient(135deg, #5548d9, #2563eb)' } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}
          sx={{ background: '#1a1a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', '& .MuiAlert-icon': { color: '#635bff' } }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlowDiagram;