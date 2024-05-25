import { useAuth } from "./AuthContext"

export default function Logout() {
    const auth = useAuth();

    auth.logout();
    return (
        <div>
            Hope to see you soon again!
        </div>
    )
}