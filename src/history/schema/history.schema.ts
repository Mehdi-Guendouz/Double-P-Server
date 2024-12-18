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

  @Prop({ required: true, enum: Action_Type })
  actionType: string;

  @Prop({ required: false })
  word: string;

  @Prop({ required: false })
  number: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  isValid: boolean;

  @Prop({ required: false })
  nearestPerfectNumber: number;
}

export const HistorySchema = SchemaFactory.createForClass(History);
