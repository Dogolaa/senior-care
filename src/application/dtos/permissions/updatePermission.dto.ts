import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePermissionDTO {
  @IsNotEmpty()
  @IsString()
  permissionName: string;
}
