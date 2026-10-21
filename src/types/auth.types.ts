export interface FetchUserRequest {
  emailOrUsername?: string;
  password?: string;
}

export interface FetchUserResponse {
  message?: string;
  user?: User;
}

export interface User {
  id: number;
  email: string;
  fullname: string;
  dashBoard: DashBoard
}

export interface DashBoard {
  visitors? : number;
  certifications? : number,
  projects?: number;
  skills?: number
}
