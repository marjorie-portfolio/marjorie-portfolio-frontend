export interface FetchUserRequest {
 emailOrUsername?:  string,
 password?: string
}

export interface FetchUserResponse {
     message: string,
      user: {
        id: number,
        email: string,
        fullname: string,
      },
}