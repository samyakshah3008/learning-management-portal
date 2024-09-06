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

export {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegistratingBody,
  ISocialAuthBody,
  IUpdateAvatar,
  IUpdatePassword,
  IUpdateUserInfo,
};
