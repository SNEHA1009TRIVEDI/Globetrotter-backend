export interface User {
    id: number;
    username: string;
    score: number;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  