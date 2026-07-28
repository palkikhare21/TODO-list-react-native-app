import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { Priority } from '../task.schema';

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  description!: string;

  @IsDateString()
  dateTime!: string;

  @IsDateString()
  deadline!: string;

  @IsIn(['low', 'medium', 'high'])
  priority!: Priority;

  @IsOptional()
  @IsString()
  category?: string;
}
