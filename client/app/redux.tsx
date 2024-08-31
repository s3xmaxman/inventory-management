import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "@/state";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 * @description windowオブジェクトが存在しない場合(SSRなど)に使用するnoopストレージを作成する関数
 * @returns {Storage} - noopストレージ
 */
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

/**
 * @description ブラウザ環境であればlocalStorage、そうでなければnoopストレージを使用する
 */
const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

/**
 * @description Redux Persistの設定
 */
const persistConfig = {
  key: "root", // ストレージのキー
  storage, // 使用するストレージ
  whitelist: ["global"], // 永続化するreducerのキー
};

/**
 * @description アプリケーション全体のルートreducer
 */
const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});

/**
 * @description 永続化されたルートreducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * @description Reduxストアを作成する関数
 * @returns {EnhancedStore} - Reduxストア
 */
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
/**
 * @description Reduxストアを提供するコンポーネント
 * @param {object} props - プロパティ
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element} - Reduxストアを提供するコンポーネント
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
