import { IsOptional, IsString } from 'class-validator';

export class EditDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  link?: string;
}
