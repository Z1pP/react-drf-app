import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/reducers/authSlice";
export default function Logout() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
    },[])

    return (
        <Navigate to="/login" />
    )
}
