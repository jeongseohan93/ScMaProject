/**
 * UserRefreshToken (Refresh Session)
 * - Refresh Token 자체가 아니라 "세션"을 저장한다.
 * - 원문 refresh token 저장 금지: tokenHash만 저장
 * - 조회 키: (userId, jti)
 */
module.exports = (sequelize, DataTypes) => {
  const UserRefreshToken = sequelize.define(
    "UserRefreshToken",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        field: "user_id",
        type: DataTypes.UUID,
        allowNull: false,
      },

      // JWT refresh payload에 들어가는 세션 ID
      jti: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },

      // sha256 hex(64 chars)
      tokenHash: {
        field: "token_hash",
        type: DataTypes.STRING(64),
        allowNull: false,
      },

      expiresAt: {
        field: "expires_at",
        type: DataTypes.DATE,
        allowNull: false,
      },

      revokedAt: {
        field: "revoked_at",
        type: DataTypes.DATE,
        allowNull: true,
      },

      // 로테이션 추적(선택)
      replacedByJti: {
        field: "replaced_by_jti",
        type: DataTypes.STRING(64),
        allowNull: true,
      },

      tokenVersionSnapshot: {
        field: "token_version_snapshot",
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      ip: { type: DataTypes.STRING(45), allowNull: true },

      userAgent: { field: "user_agent", type: DataTypes.TEXT, allowNull: true },

      deviceType: { field: "device_type", type: DataTypes.STRING(50), allowNull: true },
    },
    {
      tableName: "user_refresh_tokens",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["user_id"] },
        { unique: true, fields: ["user_id", "jti"] }, // 핵심
        { fields: ["token_hash"] },
        { fields: ["expires_at"] },
        { fields: ["revoked_at"] },
      ],
    }
  );

  UserRefreshToken.associate = (models) => {
    UserRefreshToken.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return UserRefreshToken;
};
