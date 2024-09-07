interface IActivationToken {
  token: string;
  activationCode: string;
}

interface IRegistratingBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

interface IUpdateAvatar {
  avatar: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  isThirdPartyAccount: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

export {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegistratingBody,
  ISocialAuthBody,
  IUpdateAvatar,
  IUpdatePassword,
  IUpdateUserInfo,
  IUser,
};
