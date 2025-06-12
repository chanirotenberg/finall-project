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

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Failed:", error);
      throw error;
    }
  }
}


export default ApiService;
