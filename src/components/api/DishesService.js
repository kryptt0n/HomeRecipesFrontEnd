import { apiClient } from "./ApiClient";

export function retrieveDishes() {
    return apiClient.get("/dishes");
}

export function retrieveUserDishes(username) {
    return apiClient.get(`/users/${username}/dishes`);
}