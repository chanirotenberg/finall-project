class ApiService {
  static async request({ url, method = "GET", body = null, headers = {} }) {
    try {
      const token = localStorage.getItem("token");

      const defaultHeaders = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      };

      const options = {
        method,
        headers: defaultHeaders,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (response.status === 204) return null;

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const error = new Error(data?.message || data || "Request failed");
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      console.error("API Request Failed:", error);
      throw error;
    }
  }
}

export default ApiService;
