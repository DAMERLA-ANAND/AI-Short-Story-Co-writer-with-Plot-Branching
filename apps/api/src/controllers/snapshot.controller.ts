import { Request, Response, NextFunction } from 'express';
import {
  listStorySnapshots,
  getStorySnapshot,
  forkStorySnapshot,
  deleteStorySnapshot,
} from '../services/snapshot.service.js';

export async function handleListSnapshots(_req: Request, res: Response, next: NextFunction) {
  try {
    const snapshots = await listStorySnapshots();
    res.status(200).json(snapshots);
  } catch (err) {
    next(err);
  }
}

export async function handleGetSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const snapshotId = req.params.snapshotId as string;
    const workspace = await getStorySnapshot(snapshotId);
    res.status(200).json(workspace);
  } catch (err) {
    next(err);
  }
}

export async function handleForkSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const snapshotId = req.params.snapshotId as string;
    const result = await forkStorySnapshot(snapshotId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const snapshotId = req.params.snapshotId as string;
    await deleteStorySnapshot(snapshotId);
    res.status(200).json({ success: true, deletedSnapshotId: snapshotId });
  } catch (err) {
    next(err);
  }
}
