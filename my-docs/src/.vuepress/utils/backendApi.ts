export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface UserInfo {
  uid: number;
  username: string;
  userPwd: string;
  nickName: string;
}

export interface ReplyItem {
  id: number;
  postId: number;
  userId: number;
  username: string;
  nickName: string;
  content: string;
  createTime: string;
}

export interface PostItem {
  id: number;
  userId: number;
  username: string;
  nickName: string;
  textContent?: string | null;
  imageUrl?: string | null;
  codeLanguage?: string | null;
  codeContent?: string | null;
  likeCount: number;
  commentCount: number;
  createTime: string;
  updateTime: string;
  liked?: boolean;
}

export interface PageInfo<T> {
  pageData: T[];
  pageNum: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
}

export interface UserManagePageData {
  pageInfo: PageInfo<UserInfo>;
}

export interface PublicPostPageData {
  pageInfo: PageInfo<PostItem>;
}

export interface PostDetailData {
  post: PostItem;
  liked?: boolean;
  replies: ReplyItem[];
}

export interface PublishPostPayload {
  textContent?: string;
  imageUrl?: string;
  imageFile?: File | null;
  codeLanguage?: string;
  codeContent?: string;
  codeFile?: File | null;
}

export interface UserManageUpdatePayload {
  username?: string;
  userPwd?: string;
  nickName?: string;
}

export const TOKEN_STORAGE_KEY = "zhize-user-token";

const STATUS_TEXT_MAP: Record<number, string> = {
  200: "success",
  501: "用户名有误",
  503: "密码有误",
  504: "notLogin",
  505: "用户名占用",
  506: "参数错误",
  507: "操作失败",
  508: "数据不存在",
};

const isClient = (): boolean => typeof window !== "undefined";

const getRuntimeApiBase = (): string => {
  if (!isClient()) return "http://127.0.0.1:8080";
  const host = window.location.hostname || "127.0.0.1";
  if (window.location.port === "4399") return "/api";
  return `http://${host}:8080`;
};

export const getApiBase = (): string => getRuntimeApiBase();

export const getStatusTextByCode = (code: number, fallback = "请求失败"): string => {
  return STATUS_TEXT_MAP[code] || fallback;
};

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  token?: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: FormData | Record<string, unknown>;
  signal?: AbortSignal;
}

const toQueryString = (query?: Record<string, string | number | boolean | null | undefined>): string => {
  if (!query) return "";

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.append(key, String(value));
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const resolveUrl = (path: string, query?: Record<string, string | number | boolean | null | undefined>): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${normalizedPath}${toQueryString(query)}`;
};

export const requestApi = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> => {
  const { method = "GET", token, query, body, signal } = options;
  const url = resolveUrl(path, query);

  const headers = new Headers();
  if (token) headers.set("token", token);

  let finalBody: BodyInit | undefined;
  if (body instanceof FormData) {
    finalBody = body;
  } else if (body) {
    headers.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: finalBody,
      signal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "网络请求失败";
    throw new Error(`接口请求失败: ${message}`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`响应解析失败: ${response.status}`);
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(`响应格式异常: ${response.status}`);
  }

  const parsed = payload as Partial<ApiResponse<T>>;
  if (typeof parsed.code !== "number") {
    throw new Error("响应缺少 code 字段");
  }

  return {
    code: parsed.code,
    message: typeof parsed.message === "string" ? parsed.message : "",
    data: (parsed.data as T) ?? ({} as T),
  };
};

export const apiLogin = (username: string, userPwd: string): Promise<ApiResponse<{ token: string }>> => {
  return requestApi<{ token: string }>("/user/login", {
    method: "POST",
    body: {
      username,
      userPwd,
    },
  });
};

export const apiGetUserInfo = (token: string): Promise<ApiResponse<{ loginUser: UserInfo }>> => {
  return requestApi<{ loginUser: UserInfo }>("/user/getUserInfo", {
    method: "GET",
    token,
  });
};

export const apiManageCheckUserName = (username: string): Promise<ApiResponse<Record<string, never>>> => {
  return requestApi<Record<string, never>>("/user/manage/checkUserName", {
    method: "POST",
    query: { username },
  });
};

export const apiManageRegisterUser = (
  payload: {
    username: string;
    userPwd: string;
    nickName: string;
  },
): Promise<ApiResponse<Record<string, never>>> => {
  return requestApi<Record<string, never>>("/user/manage/register", {
    method: "POST",
    body: payload,
  });
};

export const apiCheckLogin = (token: string): Promise<ApiResponse<Record<string, never>>> => {
  return requestApi<Record<string, never>>("/user/checkLogin", {
    method: "GET",
    token,
  });
};

export const apiGetUserManagePage = (params: {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
} = {}): Promise<ApiResponse<UserManagePageData>> => {
  return requestApi<UserManagePageData>("/user/manage/page", {
    method: "GET",
    query: {
      pageNum: params.pageNum ?? 1,
      pageSize: params.pageSize ?? 10,
      keyword: params.keyword ?? "",
    },
  });
};

export const apiGetUserManageDetail = (uid: number): Promise<ApiResponse<{ user: UserInfo }>> => {
  return requestApi<{ user: UserInfo }>(`/user/manage/${uid}`, {
    method: "GET",
  });
};

export const apiUpdateUserManage = (
  uid: number,
  payload: UserManageUpdatePayload,
): Promise<ApiResponse<{ user: UserInfo }>> => {
  return requestApi<{ user: UserInfo }>(`/user/manage/${uid}`, {
    method: "PUT",
    body: payload,
  });
};

export const apiDeleteUserManage = (uid: number): Promise<ApiResponse<Record<string, never>>> => {
  return requestApi<Record<string, never>>(`/user/manage/${uid}`, {
    method: "DELETE",
  });
};

export const apiPublishPost = (
  token: string,
  payload: PublishPostPayload,
): Promise<ApiResponse<{ postId: number }>> => {
  const formData = new FormData();
  if (payload.textContent?.trim()) formData.append("textContent", payload.textContent.trim());
  if (payload.imageUrl?.trim()) formData.append("imageUrl", payload.imageUrl.trim());
  if (payload.imageFile) formData.append("imageFile", payload.imageFile);
  if (payload.codeLanguage?.trim()) formData.append("codeLanguage", payload.codeLanguage.trim());
  if (payload.codeContent?.trim()) formData.append("codeContent", payload.codeContent.trim());
  if (payload.codeFile) formData.append("codeFile", payload.codeFile);

  return requestApi<{ postId: number }>("/post/publish", {
    method: "POST",
    token,
    body: formData,
  });
};

export const apiGetPublicPosts = (params: {
  pageNum?: number;
  pageSize?: number;
  token?: string;
} = {}): Promise<ApiResponse<PublicPostPageData>> => {
  return requestApi<PublicPostPageData>("/post/public", {
    method: "GET",
    token: params.token,
    query: {
      pageNum: params.pageNum ?? 1,
      pageSize: params.pageSize ?? 10,
    },
  });
};

export const apiGetMyPosts = (
  token: string,
  params: { pageNum?: number; pageSize?: number } = {},
): Promise<ApiResponse<PublicPostPageData>> => {
  return requestApi<PublicPostPageData>("/post/my", {
    method: "GET",
    token,
    query: {
      pageNum: params.pageNum ?? 1,
      pageSize: params.pageSize ?? 10,
    },
  });
};

export const apiGetPostDetail = (
  postId: number,
  token?: string,
): Promise<ApiResponse<PostDetailData>> => {
  return requestApi<PostDetailData>(`/post/${postId}`, {
    method: "GET",
    token,
  });
};

export const apiLikePost = (
  token: string,
  postId: number,
): Promise<ApiResponse<Record<string, never>>> => {
  return requestApi<Record<string, never>>(`/post/${postId}/like`, {
    method: "POST",
    token,
  });
};

export const apiUnlikePost = (
  token: string,
  postId: number,
): Promise<ApiResponse<Record<string, never>>> => {
  return requestApi<Record<string, never>>(`/post/${postId}/unlike`, {
    method: "POST",
    token,
  });
};

export const apiReplyPost = (
  token: string,
  postId: number,
  content: string,
): Promise<ApiResponse<{ replyId: number }>> => {
  return requestApi<{ replyId: number }>(`/post/${postId}/reply`, {
    method: "POST",
    token,
    body: { content },
  });
};
