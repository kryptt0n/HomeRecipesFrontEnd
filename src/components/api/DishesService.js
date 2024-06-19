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
    return apiClient.put(`/dishes`, dish, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function addDishApi(dish) {
    return apiClient.post(`/dishes`, dish, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function retrieveUserByUsernameApi(username) {
    return apiClient.get(`/users/${username}`);
}

export function retrieveProductsForDish(id) {
    return apiClient.get(`/dishes/${id}/products`);
}

export function retrieveImageForDish(id) {
    return apiClient.get(`/dishes/${id}/image`, {
        responseType: 'blob'
    })
}

export function retrieveStepsForDish(id) {
    return apiClient.get(`/dishes/${id}/steps`);
}

export function retrieveRatingForDish(id) {
    return apiClient.get(`/dishes/${id}/rating`);
}

export function retrieveRatingForDishFromUser(username, id) {
    return apiClient.get(`/users/${username}/ratings/${id}`);
}

export function addRatingForDish(rating) {
    return apiClient.post(`/users/ratings`, rating);
}