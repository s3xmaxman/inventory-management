import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * アプリケーション全体のグローバル状態。
 * @interface InitialStateType
 */
export interface InitialStateType {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

const initialState: InitialStateType = {
  isSidebarCollapsed: false,
  isDarkMode: false,
};

/**
 * グローバル状態のスライス。
 * @constant globalSlice
 */
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    /**
     * サイドバーの折り畳み状態を切り替え。
     * @function setIsSidebarCollapsed
     */
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    /**
     * ダークモードを切り替え。
     * @function setIsDarkMode
     */
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;

export default globalSlice.reducer;
