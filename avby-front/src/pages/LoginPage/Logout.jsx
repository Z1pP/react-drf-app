import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
export default function Logout() {
    const {logout} = useContext(AuthContext);

    useEffect(() => {
        logout();
    },[])

    return (
        <Navigate to="/login" />
    )
}
