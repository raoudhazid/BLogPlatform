import { User } from '../models/user'; 
export interface Comment {
  _id: string;
  content: string;
  article: string;
  author: User;
  parentComment: string | null;
  createdAt: string;
  updatedAt: string;
}