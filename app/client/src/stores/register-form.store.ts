import { create } from "zustand";

export interface FormStore {
  organization_id: string | null;
  setOrganizationId: (id: string) => void;
  clearStore: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  organization_id: null,
  setOrganizationId: (id) => set({ organization_id: id }),
  clearStore: () => set({ organization_id: null }),
}));
