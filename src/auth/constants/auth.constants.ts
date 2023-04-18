export const AuthConfig = {
  tokenExpiresIn: {
    verificationToken: '180d',
    accessToken: '1800s',
    refreshToken: '90d',
    forgotPasswordToken: '1800s',
  },
};

export const PasswordConfig = {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export const HASH_ROUNDS = 12;

export const ROLE_KEY = 'role';
