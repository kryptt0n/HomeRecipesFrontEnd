import { apiClient } from "./ApiClient";
import { sha256 } from "js-sha256";

export function authenticate(token) {
    return apiClient.get("/dishes", {
        headers: {
            Authorization: token
        }
    })
}

export function getJwtToken(token) {
    return apiClient.post("/auth-jwt", {
        headers: {
            Authorization: token
        }
    })
}

export async function encodeSHA256(value) {
    return sha256(value);
}

export function createUserApi(user) {
    return apiClient.post("/users", user)
}
