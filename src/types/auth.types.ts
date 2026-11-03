export interface FetchUserRequest {
  emailOrUsername?: string;
  password?: string;
}

export interface FetchUserResponse {
  message?: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  createdAt?: string | null;
  firstName?: string;
  lastName?: string;
  fullname?: string;
  role: "owner" | "guest" | null;
  dashBoard?: DashBoard;
}

export interface DashBoard {
  visitors? : number;
  certifications? : number,
  projects?: number;
  skills?: number
}
