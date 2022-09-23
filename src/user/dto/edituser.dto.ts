import { IsOptional, IsString } from 'class-validator';

export class EditDto {
  @IsString()
  @IsOptional()
  password: string;
  @IsString()
  @IsOptional()
  firstName: string;
  @IsString()
  @IsOptional()
  lastName: string;
}
