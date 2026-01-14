module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      // 예시 컬럼
      userId: {
        field: "user_id",
        type: DataTypes.UUID,
        allowNull: false,
      },
      friendId: {
        field: "friend_id",
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "friends",
      timestamps: true,
      underscored: true,
    }
  );

  Friend.associate = (models) => {
    // 필요하면 관계 설정
    // Friend.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Friend;
};
