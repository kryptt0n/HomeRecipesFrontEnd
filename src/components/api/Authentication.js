import { apiClient } from "./ApiClient";

export function authenticate(token) {
    return apiClient.get("/dishes", {
        headers: {
            Authorization: token
        }
    })
}