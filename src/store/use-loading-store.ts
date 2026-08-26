import { create } from "zustand";

interface LoadingState {
  apiCount: number;
  isLoading: boolean;
  startTime: number | null;
  hideTimer: ReturnType<typeof setTimeout> | null;
  showLoader: () => void;
  hideLoader: () => void;
  resetLoader: () => void;
}

const MIN_DISPLAY_DURATION_MS = 380; // Minimum time loader stays visible to prevent flickering on fast (6ms) APIs

export const useLoadingStore = create<LoadingState>((set, get) => ({
  apiCount: 0,
  isLoading: false,
  startTime: null,
  hideTimer: null,

  showLoader: () => {
    const { apiCount, hideTimer } = get();
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    const nextCount = apiCount + 1;
    const isInitialStart = apiCount === 0;

    set({
      apiCount: nextCount,
      isLoading: true,
      hideTimer: null,
      startTime: isInitialStart ? Date.now() : get().startTime || Date.now(),
    });
  },

  hideLoader: () => {
    const { apiCount, startTime, hideTimer } = get();
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    const nextCount = Math.max(0, apiCount - 1);

    if (nextCount > 0) {
      set({ apiCount: nextCount });
      return;
    }

    // All active API requests finished (apiCount === 0)
    const elapsed = Date.now() - (startTime || Date.now());
    const remainingTime = Math.max(0, MIN_DISPLAY_DURATION_MS - elapsed);

    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        set({
          apiCount: 0,
          isLoading: false,
          startTime: null,
          hideTimer: null,
        });
      }, remainingTime);

      set({ apiCount: 0, hideTimer: timer });
    } else {
      set({
        apiCount: 0,
        isLoading: false,
        startTime: null,
        hideTimer: null,
      });
    }
  },

  resetLoader: () => {
    const { hideTimer } = get();
    if (hideTimer) clearTimeout(hideTimer);
    set({
      apiCount: 0,
      isLoading: false,
      startTime: null,
      hideTimer: null,
    });
  },
}));
