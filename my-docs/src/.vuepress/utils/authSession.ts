import { reactive } from "vue";

import {
  TOKEN_STORAGE_KEY,
  apiCheckLogin,
  apiGetUserInfo,
  apiLogin,
  type ApiResponse,
  type UserInfo,
} from "./backendApi";

interface AuthState {
  ready: boolean;
  loading: boolean;
  token: string;
  user: UserInfo | null;
}

export const authState = reactive<AuthState>({
  ready: false,
  loading: false,
  token: "",
  user: null,
});

let initTask: Promise<void> | null = null;

const isClient = (): boolean => typeof window !== "undefined";

const readTokenFromStorage = (): string => {
  if (!isClient()) return "";
  return (window.localStorage.getItem(TOKEN_STORAGE_KEY) || "").trim();
};

const writeTokenToStorage = (token: string): void => {
  if (!isClient()) return;
  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const emitAuthChanged = (): void => {
  if (!isClient()) return;
  window.dispatchEvent(new CustomEvent("zhize-auth-changed"));
};

export const isLoggedIn = (): boolean => Boolean(authState.token);

const setSession = (token: string, user: UserInfo | null): void => {
  authState.token = token;
  authState.user = user;
  writeTokenToStorage(token);
  emitAuthChanged();
};

export const logoutSession = (): void => {
  setSession("", null);
};

export const refreshCurrentUser = async (): Promise<ApiResponse<{ loginUser: UserInfo }> | null> => {
  if (!authState.token) return null;
  const userInfoResult = await apiGetUserInfo(authState.token);
  if (userInfoResult.code === 200 && userInfoResult.data?.loginUser) {
    setSession(authState.token, userInfoResult.data.loginUser);
  }
  return userInfoResult;
};

export const validateLogin = async (): Promise<ApiResponse<Record<string, never>> | null> => {
  if (!authState.token) return null;
  const checkResult = await apiCheckLogin(authState.token);
  if (checkResult.code !== 200) {
    logoutSession();
  }
  return checkResult;
};

const syncSessionByToken = async (token: string): Promise<void> => {
  if (!token) {
    logoutSession();
    return;
  }

  authState.token = token;
  const checkResult = await apiCheckLogin(token);
  if (checkResult.code !== 200) {
    logoutSession();
    return;
  }

  const userInfoResult = await apiGetUserInfo(token);
  if (userInfoResult.code === 200 && userInfoResult.data?.loginUser) {
    setSession(token, userInfoResult.data.loginUser);
    return;
  }

  setSession(token, null);
};

export const initAuthSession = async (): Promise<void> => {
  if (!isClient()) {
    authState.ready = true;
    return;
  }
  if (authState.ready) return;
  if (initTask) {
    await initTask;
    return;
  }

  initTask = (async () => {
    authState.loading = true;
    try {
      const storedToken = readTokenFromStorage();
      if (!storedToken) {
        logoutSession();
      } else {
        await syncSessionByToken(storedToken);
      }
    } catch (error) {
      logoutSession();
    } finally {
      authState.loading = false;
      authState.ready = true;
      initTask = null;
    }
  })();

  await initTask;
};

export const loginByPassword = async (
  username: string,
  userPwd: string,
): Promise<ApiResponse<{ token: string }>> => {
  const loginResult = await apiLogin(username, userPwd);
  if (loginResult.code !== 200 || !loginResult.data?.token) {
    return loginResult;
  }

  authState.loading = true;
  try {
    await syncSessionByToken(loginResult.data.token);
  } finally {
    authState.loading = false;
    authState.ready = true;
  }

  return loginResult;
};
