import { useRef, useEffect, useCallback } from 'react';
import { BSTAlgorithmStep, BSTNode } from '../types';
import { SORTING_COLORS } from '../constants/colors';
import styles from './BSTCanvas.module.css';

interface BSTCanvasProps {
  step: BSTAlgorithmStep | null;
  tree: BSTNode | null;
  onNodeClick?: (value: number) => void;
}

const NODE_RADIUS = 20;
const HORIZONTAL_GAP = 30;
const VERTICAL_GAP = 60;
const PADDING = 40;

function getTreeHeight(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
}

function getTreeWidth(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + getTreeWidth(node.left) + getTreeWidth(node.right);
}

interface LayoutNode {
  x: number;
  y: number;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function computeLayout(root: BSTNode | null): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  if (!root) return nodes;

  const layout = (node: BSTNode | null, depth: number, leftOffset: number): number => {
    if (!node) return leftOffset;

    const leftWidth = getTreeWidth(node.left);
    const x = PADDING + (leftOffset + leftWidth + 1) * (NODE_RADIUS * 2 + HORIZONTAL_GAP);
    const y = PADDING + depth * VERTICAL_GAP + NODE_RADIUS;

    nodes.push({ x, y, value: node.value, left: node.left, right: node.right });
    layout(node.left, depth + 1, leftOffset);
    layout(node.right, depth + 1, leftOffset + leftWidth + 1);

    return leftOffset;
  };

  layout(root, 0, 0);
  return nodes;
}

export function BSTCanvas({ step, tree, onNodeClick }: BSTCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treeData = step?.tree ?? tree;
  const activeNode = step?.activeNode ?? null;
  const previousNode = step?.previousNode ?? null;

  const layoutNodes = computeLayout(treeData);
  const depth = getTreeHeight(treeData);
  const canvasWidth = Math.max(400, getTreeWidth(treeData) * (NODE_RADIUS * 2 + HORIZONTAL_GAP) + PADDING * 2);
  const canvasHeight = Math.max(300, depth * VERTICAL_GAP + PADDING * 2 + NODE_RADIUS);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodeMap = new Map(layoutNodes.map((n) => [n.value, n]));

    for (const node of layoutNodes) {
      if (node.left) {
        const left = nodeMap.get(node.left.value);
        if (left) {
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(left.x, left.y);
          ctx.stroke();
        }
      }
      if (node.right) {
        const right = nodeMap.get(node.right.value);
        if (right) {
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(right.x, right.y);
          ctx.stroke();
        }
      }
    }

    for (const node of layoutNodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);

      if (node.value === activeNode) {
        ctx.fillStyle = SORTING_COLORS.compared;
      } else if (node.value === previousNode) {
        ctx.fillStyle = SORTING_COLORS.swapped;
      } else {
        ctx.fillStyle = '#1e293b';
      }
      ctx.fill();

      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.value), node.x, node.y);
    }
  }, [layoutNodes, activeNode, previousNode]);

  const getClickedNode = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): number | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const node of layoutNodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        if (dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS) {
          return node.value;
        }
      }
      return null;
    },
    [layoutNodes],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onNodeClick) return;
      const value = getClickedNode(e);
      if (value !== null) onNodeClick(value);
    },
    [onNodeClick, getClickedNode],
  );

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className={styles.canvas}
        onClick={handleClick}
      />
    </div>
  );
}
