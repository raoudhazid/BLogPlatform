import { User } from '../models/user'; 
export interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
}