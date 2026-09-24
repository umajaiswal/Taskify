// All communication with the FastAPI backend lives in this file.
const API_BASE_URL = "http://127.0.0.1:8000";
const TOKEN_KEY = "taskify_token";

// The JWT is the only thing we keep in the browser.
function getToken() { return localStorage.getItem(TOKEN_KEY); }
function saveToken(token) { localStorage.setItem(TOKEN_KEY, token); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

// FastAPI errors look like {"detail": "text"} or, for 422, {"detail": [{loc, msg}, ...]}
function getErrorMessage(data) {
  if (!data || !data.detail) return "Something went wrong. Please try again.";
  if (typeof data.detail === "string") return data.detail.trim();
  return data.detail.map(item => item.loc[item.loc.length - 1] + ": " + item.msg).join(", ");
}

// One helper for every request: adds JSON headers and the auth token, handles errors.
async function apiRequest(path, method = "GET", body = null, needsAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (needsAuth) headers["Authorization"] = "Bearer " + getToken();

  let response;
  try {
    response = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  } catch (error) {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  // Token missing, expired or invalid: send the user back to login.
  if (response.status === 401 && needsAuth) {
    clearToken();
    window.location.href = "login.html";
    throw new Error("Your session has expired. Please log in again.");
  }

  if (response.status === 204) return null; // delete returns no body

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
}

// One function per backend endpoint.
const api = {
  register: (user) => apiRequest("/user/register", "POST", user, false),
  login: (credentials) => apiRequest("/user/login", "POST", credentials, false),
  getCurrentUser: () => apiRequest("/user/is_auth"),
  getTasks: () => apiRequest("/tasks/all_tasks"),
  createTask: (task) => apiRequest("/tasks/create", "POST", task),
  updateTask: (id, task) => apiRequest("/tasks/update_task/" + id, "PUT", task),
  deleteTask: (id) => apiRequest("/tasks/delete_task/" + id, "DELETE"),
};
