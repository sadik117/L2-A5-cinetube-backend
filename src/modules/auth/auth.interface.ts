
export interface IRegisterData {
  name?: string;
  email: string;
  password: string;
  image?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}