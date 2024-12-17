import { Types } from 'mongoose';

export interface UserToken {
  id: Types.ObjectId;
  email: string;
}
