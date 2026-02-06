/**
 * User 모델
 * - 회원 기본 정보 + 인증/권한 + 프로필 + 보안 요약 + refreshToken 버전 관리
 * - created_at / updated_at / deleted_at 자동 생성됨 (timestamps + paranoid + underscored)
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      /**
       * PK (Primary Key)
       * - 기본 정수 AUTO_INCREMENT
       * - UNSIGNED: 음수 허용 X, 더 넓은 양수 범위
       */
      id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        
      },

      // ------------------------------------------
      // 🔹 기본 정보 관련
      // ------------------------------------------

      /**
       * 이메일
       * unique: 중복 불가
       * validate: isEmail → Sequelize가 이메일 형식 검증
       */
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },

      /**
       * 비밀번호
       * - 해시 값 저장
       */
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      /**
       * 실명
       */
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      /**
       * 닉네임 (서비스용)
       */
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      /**
       * 전화번호
       * field 옵션: DB 컬럼명 = phone_number (snake_case)
       */
      phoneNumber: {
        field: 'phone_number',
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      // ------------------------------------------
      // 🔹 인증/권한 관련
      // ------------------------------------------

      /**
       * 이메일 인증 여부
       * defaultValue = false
       * DB 컬럼명: is_email_verified
       */
      isEmailVerified: {
        field: 'is_email_verified',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      /**
       * 권한(ROLE)
       * - USER | ADMIN
       */
      role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER',
      },

      /**
       * 계정 상태
       * - ACTIVE: 정상
       * - INACTIVE: 비활성화(휴면 등)
       * - BANNED: 정지
       */
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },

      /**
       * 로그인 제공자
       * - LOCAL: 이메일 로그인
       * - GOOGLE / KAKAO / APPLE: 소셜 로그인
       */
      provider: {
        type: DataTypes.ENUM('LOCAL', 'KAKAO'),
        allowNull: false,
        defaultValue: 'LOCAL',
      },

      /**
       * 소셜 로그인 고유 ID
       * DB 컬럼명: provider_id
       */
      providerId: {
        field: 'provider_id',
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      // ------------------------------------------
      // 🔹 프로필 / 선호 정보
      // ------------------------------------------

      /**
       * 생년월일
       */
      birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      /**
       * 성별
       */
      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: true,
      },

      /**
       * 기본 언어
       * - ko / en / ja
       * default = 'ko'
       */
      preferredLanguage: {
        field: 'preferred_language',
        type: DataTypes.ENUM('ko', 'en', 'ja'),
        allowNull: false,
        defaultValue: 'ko',
      },

      /**
       * 타임존 (스케줄 기능 핵심 요소)
       * - ex) Asia/Seoul, America/New_York
       */
      timeZone: {
        field: 'time_zone',
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Asia/Seoul',
      },

      // ------------------------------------------
      // 🔹 로그인 / 보안 요약
      // ------------------------------------------

      /**
       * 마지막 로그인 시각
       */
      lastLoginAt: {
        field: 'last_login_at',
        type: DataTypes.DATE,
        allowNull: true,
      },

      /**
       * 로그인 실패 횟수
       * - 보안 정책 / 무차별 대입 방지용
       */
      loginFailCount: {
        field: 'login_fail_count',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      /**
       * 마지막 로그인 실패 시각
       */
      lastFailedLoginAt: {
        field: 'last_failed_login_at',
        type: DataTypes.DATE,
        allowNull: true,
      },

      /**
       * 가입 IP
       */
      signupIp: {
        field: 'signup_ip',
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      /**
       * 마지막 로그인 IP
       */
      lastLoginIp: {
        field: 'last_login_ip',
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      // ------------------------------------------
      // 🔹 RefreshToken 무효화 버전 관리
      // ------------------------------------------

      /**
       * tokenVersion
       * - refreshToken에는 tokenVersion이 박혀 있음
       * - user.tokenVersion을 증가시키면 예전 리프레시 토큰 전부 무효화됨
       */
      tokenVersion: {
        field: 'token_version',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },

    // ------------------------------------------
    // 🔹 모델 옵션
    // ------------------------------------------
    {
      tableName: 'users',

      /**
       * timestamps: true → created_at, updated_at 자동 생성
       */
      timestamps: true,

      /**
       * paranoid: true → deleted_at 자동 생성 (Soft Delete)
       */
      paranoid: true,

      /**
       * underscored: true → snake_case 컬럼 자동 적용
       * createdAt → created_at
       * updatedAt → updated_at
       * deletedAt → deleted_at
       */
      underscored: true,

      /**
       * 인덱스 설정
       */
      indexes: [
        { unique: true, fields: ['email'] },              // 이메일 유니크 인덱스
        { fields: ['provider', 'provider_id'] },          // 소셜 로그인 조회 빠르게
        { fields: ['status'] },                           // 상태별 조회 빠르게
      ],
    }
  );

  // ------------------------------------------
  // 🔹 모델 간 관계 설정 (Associations)
  // ------------------------------------------
  User.associate = (models) => {
    /**
     * User(1) : UserLoginLog(N)
     * - 유저 1명이 여러 로그인 로그를 가진다
     */
    User.hasMany(models.UserLoginLog, {
      foreignKey: 'userId',
      as: 'loginLogs',
    });

    /**
     * User(1) : UserRefreshToken(N)
     * - 유저 1명이 여러 리프레시 토큰(각 기기별)을 가진다
     */
    User.hasMany(models.UserRefreshToken, {
      foreignKey: 'userId',
      as: 'refreshTokens',
    });
  };

  return User;
};