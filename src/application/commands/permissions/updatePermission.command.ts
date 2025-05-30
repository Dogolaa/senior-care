export class UpdatePermissionCommand {
  constructor(
    public readonly id: string,
    public readonly permissionName: string,
  ) {}
}
