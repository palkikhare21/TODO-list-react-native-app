import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
export type Priority = 'low' | 'medium' | 'high';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ default: '', trim: true })
  description!: string;

  @Prop({ required: true })
  dateTime!: Date;

  @Prop({ required: true })
  deadline!: Date;

  @Prop({ required: true, enum: ['low', 'medium', 'high'], default: 'medium' })
  priority!: Priority;

  @Prop({ default: '', trim: true })
  category?: string;

  @Prop({ default: false })
  completed!: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
