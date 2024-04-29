import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  DataTypes,
  type CreationOptional,
  type Sequelize,
  ValidationError,
  ValidationErrorItem
} from 'sequelize'

class BasketItem extends Model<
InferAttributes<BasketItem>,
InferCreationAttributes<BasketItem>
> {
  declare ProductId: number
  declare BasketId: number
  declare id: CreationOptional<number>
  declare quantity: number

  // Custom validation to ensure quantity is positive
  static validateQuantity(value: number) {
    if (value < 0) {
      throw new Error('Quantity must be positive');
    }
  }
}

const BasketItemModelInit = (sequelize: Sequelize) => {
  BasketItem.init(
    {
      ProductId: {
        type: DataTypes.INTEGER
      },
      BasketId: {
        type: DataTypes.INTEGER
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          customValidator(value: number) {
            BasketItem.validateQuantity(value)
          }
        }
      }
    },
    {
      tableName: 'BasketItems',
      sequelize
    }
  )
}

export { BasketItem as BasketItemModel, BasketItemModelInit }
