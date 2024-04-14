import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


export default function Redirect({to}){
    const navigate = useNavigate();

    useEffect(() => navigate(to), []);

    const logout = useContext(AuthContext).logout;
    logout();

    return null;
}
