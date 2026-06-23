import type { TreeOriginalData, NodeType } from './tree.types';

export interface ClipboardContent {
  readonly type: NodeType;
  readonly id: string;
  readonly originalId: string | number;
  readonly parentId: string;
  readonly originalData: TreeOriginalData;
}
