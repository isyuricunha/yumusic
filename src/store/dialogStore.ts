import { create } from 'zustand';

export interface DialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface DialogStore {
  isOpen: boolean;
  options: DialogOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
  openDialog: (options: DialogOptions) => Promise<boolean>;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  isOpen: false,
  options: null,
  onConfirm: () => {},
  onCancel: () => {},

  openDialog: (options: DialogOptions) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        options,
        onConfirm: () => {
          set({ isOpen: false });
          resolve(true);
        },
        onCancel: () => {
          set({ isOpen: false });
          resolve(false);
        },
      });
    });
  },

  closeDialog: () => {
    set((state) => {
      state.onCancel();
      return { isOpen: false };
    });
  },
}));
