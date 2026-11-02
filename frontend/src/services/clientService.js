import { request } from "./httpClient";

export function createClient(client) {
  return request("/api/clients", { method: "POST", body: client });
}

export function getClient(id) {
  return request(`/api/clients/${id}`);
}

export function updateClient(id, client) {
  return request(`/api/clients/${id}`, { method: "PUT", body: client });
}

export function deleteClient(id) {
  return request(`/api/clients/${id}`, { method: "DELETE" });
}

export function searchClients(search) {
  return request(`/api/clients?search=${encodeURIComponent(search)}`);
}
