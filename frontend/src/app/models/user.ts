export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Writer' | 'Reader';
  createdAt: string;
  updatedAt: string;
}