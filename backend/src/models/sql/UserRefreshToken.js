/**
 * UserRefreshToken 모델
 * - 리프레시 토큰을 기기별로 저장하는 테이블
 * - 기기별 로그인 유지, 강제 로그아웃, 토큰 롤링 등에 활용됨
 */
module.exports = (sequelize, DataTypes) => {
  const UserRefreshToken = sequelize.define(
    'UserRefreshToken',
    {
      /**
       * PK
       */
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      /**
       * FK: 소유자 유저 ID
       * DB 컬럼명: user_id
       */
      userId: {
        field: 'user_id',
        type: DataTypes.UUID,
        allowNull: false,
      },

      /**
       * 리프레시 토큰 문자열
       *
       * ⚠️ 운영에서는 보안 위해 token 해싱해서 저장 권장
       * ex) crypto.createHash('sha256').update(token).digest('hex')
       */
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      /**
       * refreshToken 만료 시각
       * - 보통 7일 / 14일 / 30일로 설정
       */
      expiresAt: {
        field: 'expires_at',
        type: DataTypes.DATE,
        allowNull: false,
      },

      /**
       * 토큰 강제 폐기 시각
       * - 로그아웃 또는 관리자에 의한 강제 로그아웃 시 설정됨
       */
      revokedAt: {
        field: 'revoked_at',
        type: DataTypes.DATE,
        allowNull: true,
      },

      /**
       * 발급 당시 User.tokenVersion 값을 스냅샷으로 저장
       *
       * WHY?
       * - User.tokenVersion++ 하면 기존 모든 refreshToken 무효화됨
       * - refreshToken.payload.tokenVersion와 비교하여 유효성 검증
       */
      tokenVersionSnapshot: {
        field: 'token_version_snapshot',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      /**
       * 발급/사용 IP
       */
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      /**
       * User-Agent
       * - 예: Mozilla/5.0 (Macintosh...) Chrome/120.0
       */
      userAgent: {
        field: 'user_agent',
        type: DataTypes.TEXT,
        allowNull: true,
      },

      /**
       * 기기 종류
       * - ex) MAC, WINDOWS, ANDROID, IPHONE
       */
      deviceType: {
        field: 'device_type',
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },

    /**
     * 모델 옵션
     */
    {
      tableName: 'user_refresh_tokens',

      /**
       * created_at / updated_at 자동 생성
       */
      timestamps: true,

      /**
       * snake_case 컬럼 자동 생성
       */
      underscored: true,

      /**
       * 인덱스
       * - user_id: 유저별 토큰 조회
       * - token: 특정 토큰 찾기
       * - expires_at: 만료된 토큰 정리할 때 빠름
       */
      indexes: [
        { fields: ['user_id'] },
        { fields: ['token'] },
        { fields: ['expires_at'] },
      ],
    }
  );

  /**
   * 관계 설정
   * UserRefreshToken(N) : User(1)
   */
  UserRefreshToken.associate = (models) => {
    UserRefreshToken.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE', // 유저 삭제 시 해당 토큰도 삭제
    });
  };

  return UserRefreshToken;
};
