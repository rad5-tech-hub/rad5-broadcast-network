import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db';

class Course extends Model {
  public id!: string;
  public courseName!: string;
  public price!: number;
  public createdBy!: string;
  public courseDuration!: string;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    courseDuration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Admin', // table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'Courses',
    modelName: 'Course',
  },
);

export default Course;
