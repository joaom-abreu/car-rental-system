import { request } from "./httpClient";

export function getRentalRequests(status) {
  const query = status ? `?status=${status}` : "";
  return request(`/api/rental-requests${query}`);
}

export function createRentalRequest(rentalRequest) {
  return request("/api/rental-requests", { method: "POST", body: rentalRequest });
}

export function getRentalRequest(id) {
  return request(`/api/rental-requests/${id}`);
}

export function updateRentalRequest(id, rentalRequest) {
  return request(`/api/rental-requests/${id}`, { method: "PUT", body: rentalRequest });
}

export function cancelRentalRequest(id) {
  return request(`/api/rental-requests/${id}/cancel`, { method: "PATCH" });
}
