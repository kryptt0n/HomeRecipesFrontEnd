import { apiClient } from "./ApiClient";

export function retrieveDishes() {
    return apiClient.get("/dishes");
}

export function retrieveDishById(id) {
    return apiClient.get(`/dishes/${id}`);
}

export function retrieveUserDishes(username) {
    return apiClient.get(`/users/${username}/dishes`);
}

export function deleteDishApi(id) {
    return apiClient.delete(`/dishes/${id}`);
}

export function updateDishApi(dish) {
    return apiClient.post(`/dishes`, dish);
}