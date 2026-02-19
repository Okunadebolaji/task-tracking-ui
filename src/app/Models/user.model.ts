export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string; // optional, can be derived
  isActive: boolean;
  roleId?: number; // optional if you use role object
  roleName?: string; // optional if you use role object
  companyId: number;
  companyName?: string;
  role: {
    id: number;
    name: string;
    roleMenuPermissions?: RoleMenuPermission[];
  };
}

export interface RoleMenuPermission {
  menuId: number;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
}
