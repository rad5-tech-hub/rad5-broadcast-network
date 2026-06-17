import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/db';

interface AuditTrailAttributes {
  id?: string;
  email?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
}

class AuditTrail extends Model<AuditTrailAttributes> implements AuditTrailAttributes {
  public id?: string;
  public email?: string;
  public action!: string;
  public entityType!: string;
  public entityId?: string;
  public details?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuditTrail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'AuditTrails',
    modelName: 'AuditTrail',
  }
);

export default AuditTrail;
