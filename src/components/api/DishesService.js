import { apiClient } from "./ApiClient";

export function retrieveDishes() {
    return apiClient.get("/dishes");
}