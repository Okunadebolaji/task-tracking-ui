export interface Menu {
  menuId: number;
  name: string;
  route?: string | null;
  icon?: string | null;
  parentMenuId?: number | null;
  permissions?: {
    canView: boolean;
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canApprove?: boolean;
    canReject?: boolean;
  };
  children?: Menu[];
  expanded?: boolean; // for UI
}
