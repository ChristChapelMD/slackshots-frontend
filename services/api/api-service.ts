export abstract class APIService {
  protected baseApiUrl: string;
  protected static accessToken: string | null = null;

  constructor() {
    this.baseApiUrl =
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
        ? "/api/demo/api"
        : `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}/api`;
  }

  static setAccessToken(token: string | null) {
    APIService.accessToken = token;
  }

  protected getEndpointUrl(endpoint: string): string {
    return `${this.baseApiUrl}/${endpoint}`;
  }

  protected async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = this.getEndpointUrl(endpoint);
    const headers = new Headers(options.headers);

    if (APIService.accessToken) {
      headers.append("Authorization", `Bearer ${APIService.accessToken}`);
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  }
}
