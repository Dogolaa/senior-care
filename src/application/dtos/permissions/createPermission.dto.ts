import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDTO {
  @IsNotEmpty()
  @IsString()
  permissionName: string;
}
