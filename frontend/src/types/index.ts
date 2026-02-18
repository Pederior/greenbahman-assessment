export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
