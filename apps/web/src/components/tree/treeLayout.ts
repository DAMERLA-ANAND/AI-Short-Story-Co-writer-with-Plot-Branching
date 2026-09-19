import type { SceneDto, ChoiceDto } from '@plotweaver/shared';

export interface LayoutNode {
  id: string;
  scene: SceneDto;
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  isInActivePath: boolean;
  isRoot: boolean;
  unexploredChoicesCount: number;
}

export interface LayoutEdge {
  id: string;
  fromSceneId: string;
  toSceneId: string;
  choiceId: string;
  choiceText: string;
  archetype: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
}

export interface TreeLayoutResult {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  bounds: {
    width: number;
    height: number;
    minX: number;
    minY: number;
  };
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 76;
const HORIZONTAL_GAP = 90;
const VERTICAL_GAP = 40;

export function computeTreeLayout(
  scenes: SceneDto[],
  choices: ChoiceDto[],
  activeSceneId: string | null,
  activePathSceneIds: string[],
  rootSceneId: string | null
): TreeLayoutResult {
  if (scenes.length === 0) {
    return {
      nodes: [],
      edges: [],
      bounds: { width: 600, height: 400, minX: 0, minY: 0 },
    };
  }

  const sceneMap = new Map<string, SceneDto>();
  scenes.forEach((s) => sceneMap.set(s.id, s));

  // Find root
  const rootScene =
    (rootSceneId ? sceneMap.get(rootSceneId) : null) ||
    scenes.find((s) => !s.parentChoiceId || s.depth === 0) ||
    scenes[0];

  // Map choices: parentSceneId -> childSceneId
  const childrenMap = new Map<string, Array<{ childId: string; choice: ChoiceDto }>>();
  scenes.forEach((s) => childrenMap.set(s.id, []));

  choices.forEach((c) => {
    if (c.childSceneId && sceneMap.has(c.childSceneId)) {
      const existing = childrenMap.get(c.sourceSceneId) || [];
      existing.push({ childId: c.childSceneId, choice: c });
      childrenMap.set(c.sourceSceneId, existing);
    }
  });

  // Calculate layout using recursive subtree positioning
  // Each node gets a depth level (x) and a vertical slot index (y)
  const nodePositions = new Map<string, { x: number; y: number }>();
  let nextLeafY = 0;

  function layoutSubtree(sceneId: string, depth: number): number {
    const children = childrenMap.get(sceneId) || [];
    const x = 50 + depth * (NODE_WIDTH + HORIZONTAL_GAP);

    if (children.length === 0) {
      // Leaf node in explored tree
      const y = 50 + nextLeafY * (NODE_HEIGHT + VERTICAL_GAP);
      nextLeafY += 1;
      nodePositions.set(sceneId, { x, y });
      return y;
    }

    // Process children
    const childYs: number[] = [];
    for (const child of children) {
      const cy = layoutSubtree(child.childId, depth + 1);
      childYs.push(cy);
    }

    // Center parent relative to its children
    const minY = childYs[0];
    const maxY = childYs[childYs.length - 1];
    const y = (minY + maxY) / 2;
    nodePositions.set(sceneId, { x, y });
    return y;
  }

  layoutSubtree(rootScene.id, 0);

  // Fallback for any disconnected scenes (rare safety guard)
  scenes.forEach((s) => {
    if (!nodePositions.has(s.id)) {
      const x = 50 + s.depth * (NODE_WIDTH + HORIZONTAL_GAP);
      const y = 50 + nextLeafY * (NODE_HEIGHT + VERTICAL_GAP);
      nextLeafY += 1;
      nodePositions.set(s.id, { x, y });
    }
  });

  // Build active path set for O(1) lookups
  const activePathSet = new Set(activePathSceneIds);

  // Active path consecutive pairs for edge lighting
  const activeEdgePairs = new Set<string>();
  for (let i = 0; i < activePathSceneIds.length - 1; i++) {
    activeEdgePairs.add(`${activePathSceneIds[i]}->${activePathSceneIds[i + 1]}`);
  }

  // Build Layout Nodes
  const nodes: LayoutNode[] = scenes.map((scene) => {
    const pos = nodePositions.get(scene.id) || { x: 50, y: 50 };
    const unexploredChoices = (scene.choices || []).filter((c) => !c.childSceneId).length;

    return {
      id: scene.id,
      scene,
      x: pos.x,
      y: pos.y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      isActive: scene.id === activeSceneId,
      isInActivePath: activePathSet.has(scene.id),
      isRoot: scene.id === rootScene.id,
      unexploredChoicesCount: unexploredChoices,
    };
  });

  // Build Layout Edges
  const edges: LayoutEdge[] = [];
  choices.forEach((choice) => {
    if (choice.childSceneId && nodePositions.has(choice.sourceSceneId) && nodePositions.has(choice.childSceneId)) {
      const fromPos = nodePositions.get(choice.sourceSceneId)!;
      const toPos = nodePositions.get(choice.childSceneId)!;

      const isEdgeActive = activeEdgePairs.has(`${choice.sourceSceneId}->${choice.childSceneId}`);

      edges.push({
        id: choice.id,
        fromSceneId: choice.sourceSceneId,
        toSceneId: choice.childSceneId,
        choiceId: choice.id,
        choiceText: choice.text,
        archetype: choice.archetype,
        x1: fromPos.x + NODE_WIDTH,
        y1: fromPos.y + NODE_HEIGHT / 2,
        x2: toPos.x,
        y2: toPos.y + NODE_HEIGHT / 2,
        isActive: isEdgeActive,
      });
    }
  });

  // Calculate bounding box
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x + n.width);
    minY = Math.min(minY, n.y);
    maxY = Math.max(maxY, n.y + n.height);
  });

  if (minX === Infinity) {
    minX = 0;
    maxX = 600;
    minY = 0;
    maxY = 400;
  }

  return {
    nodes,
    edges,
    bounds: {
      minX: Math.max(0, minX - 40),
      minY: Math.max(0, minY - 40),
      width: Math.max(600, maxX - minX + 160),
      height: Math.max(400, maxY - minY + 160),
    },
  };
}
