import { Injectable } from '@angular/core';

/** Key lưu trong localStorage. `theme` phải khớp với script inline trong index.html. */
export const STORAGE_KEYS = {
  theme: 'thth.theme',
  session: 'thth.session.v1',
} as const;

/**
 * Bọc localStorage: mọi thao tác đều try/catch vì storage có thể bị chặn
 * (tab ẩn danh, Safari Lockdown, hết dung lượng). Lỗi thì coi như không có dữ liệu.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: string, isValid: (value: unknown) => value is T): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      const value: unknown = JSON.parse(raw);
      return isValid(value) ? value : null;
    } catch {
      return null;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Bỏ qua: app vẫn chạy được, chỉ là không lưu.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Bỏ qua.
    }
  }
}
