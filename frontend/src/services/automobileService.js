import { request } from "./httpClient";

export function getAutomobiles() {
  return request("/api/automobiles");
}

export function createAutomobile(automobile) {
  return request("/api/automobiles", { method: "POST", body: automobile });
}

export function updateAutomobile(id, automobile) {
  return request(`/api/automobiles/${id}`, { method: "PUT", body: automobile });
}

export function deleteAutomobile(id) {
  return request(`/api/automobiles/${id}`, { method: "DELETE" });
}
