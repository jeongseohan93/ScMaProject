/**
 * UserLoginLog 모델
 * - 유저의 모든 로그인(성공/실패) 시도를 기록하는 테이블
 * - 변경(update)이나 삭제(delete)가 발생하지 않는 append-only 구조
 * - login_at 하나로 로그 발생 시간을 100% 커버할 수 있으므로
 *   created_at / updated_at 을 두지 않는다.
 */
module.exports = (sequelize, DataTypes) => {
  const UserLoginLog = sequelize.define(
    'UserLoginLog',
    {
      /**
       * PK
       * - 자동 증가 정수
       */
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      /**
       * 유저 FK
       * - User(1) : UserLoginLog(N)
       * - DB 컬럼명: user_id
       */
      userId: {
        field: 'user_id',
        type: DataTypes.UUID,
        allowNull: false,
      },

      /**
       * 로그인 발생 시각
       * - 실제 로그인 이벤트 시간
       * - defaultValue NOW() → 자동 기록
       */
      loginAt: {
        field: 'login_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      /**
       * 로그인에 사용된 IP 주소
       * - IPv6까지 지원 (45자)
       */
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      /**
       * 로그인에 사용된 플랫폼
       * - WEB
       * - IOS
       * - ANDROID
       */
      loginType: {
        field: 'login_type',
        type: DataTypes.ENUM('WEB', 'IOS', 'ANDROID'),
        allowNull: true,
      },

      /**
       * 디바이스 정보
       * - 예: “Chrome on macOS”, “iPhone 14” 등
       */
      deviceType: {
        field: 'device_type',
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      /**
       * 로그인 결과
       * - SUCCESS
       * - FAILED
       */
      status: {
        type: DataTypes.ENUM('SUCCESS', 'FAILED'),
        allowNull: false,
      },

      /**
       * 실패 이유
       * - WRONG_PASSWORD
       * - EMAIL_NOT_FOUND
       * - BANNED
       * - TOO_MANY_ATTEMPTS
       */
      failReason: {
        field: 'fail_reason',
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },

    /**
     * 모델 옵션
     * - timestamps 제거 → created_at, updated_at 생성 X
     * - underscored → snake_case 자동 매핑
     */
    {
      tableName: 'user_login_logs',
      timestamps: false,  // ⛔ created_at & updated_at 제거
      underscored: true,
    }
  );

  /**
   * UserLoginLog(N) : User(1)
   * - 유저가 삭제되면 해당 유저의 로그인 로그 전체 삭제
   */
  UserLoginLog.associate = (models) => {
    UserLoginLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return UserLoginLog;
};
