import { Router } from 'express';
import {
  handleListSnapshots,
  handleGetSnapshot,
  handleForkSnapshot,
  handleDeleteSnapshot,
} from '../controllers/snapshot.controller.js';

export const snapshotRouter = Router();

snapshotRouter.get('/', handleListSnapshots);
snapshotRouter.get('/:snapshotId', handleGetSnapshot);
snapshotRouter.post('/:snapshotId/fork', handleForkSnapshot);
snapshotRouter.delete('/:snapshotId', handleDeleteSnapshot);
