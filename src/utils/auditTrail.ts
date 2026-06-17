import { AuditTrail } from '../models';
import { BaseError } from './customError';
import { NextFunction } from 'express';

interface AuditTrailData {
  email?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
}

export const recordAuditTrail = async (data: AuditTrailData, next: NextFunction) => {
  try {
    await AuditTrail.create(data);
  } catch (error: any) {
    next(new BaseError('Failed to record audit trail: ' + error.message));
  }
};
