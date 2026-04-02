export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}
