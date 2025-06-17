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
      const errorBody = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/"; // הפנייה לעמוד הבית
  }

  const error = new Error(errorBody.error || `Error: ${response.status} ${response.statusText}`);
  error.status = response.status;
  error.body = errorBody;
  throw error;
}



      return await response.json();
    } catch (error) {
      console.error("API Request Failed:", error);
      throw error;
    }
  }
}

export default ApiService;