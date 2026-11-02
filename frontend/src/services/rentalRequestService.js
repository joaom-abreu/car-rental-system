import { request } from "./httpClient";

export function getRentalRequests(status) {
  const query = status ? `?status=${status}` : "";
  return request(`/api/rental-requests${query}`);
}

export function createRentalRequest(rentalRequest) {
  return request("/api/rental-requests", { method: "POST", body: rentalRequest });
}
