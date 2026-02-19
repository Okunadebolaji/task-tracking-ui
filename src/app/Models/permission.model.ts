export interface Permission {
  id: number;
  name: string;        // e.g., "Users", "Projects"
  actions: string[];   // e.g., ["view","create","edit","delete"]
}

