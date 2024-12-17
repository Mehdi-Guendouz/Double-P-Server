import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schema/users.schema';
import { Action_Type } from '../enums/enum.action';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ timestamps: true })
export class History {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  enum: [Action_Type.Palindrome, Action_Type.NumberParfait];
  action: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  description: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
