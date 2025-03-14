export interface LoginRequest {
  password: string ;
  rememberMe: boolean;
  userName: string ;
}

export interface LoginResponse {
  accsesToken: string
  refreshToken: string
  userName: string
  userID: number
}

