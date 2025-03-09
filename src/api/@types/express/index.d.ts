namespace Express {
  export interface Request {
    user?: any;
    auth?: any;

    isAuthenticated(): boolean;
  }
}
