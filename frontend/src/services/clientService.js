import { request } from "./httpClient";

export function createClient(client) {
  return request("/api/clients", { method: "POST", body: client });
}
