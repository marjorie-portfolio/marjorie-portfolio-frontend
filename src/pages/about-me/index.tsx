import Authenticated from "./Authenticated";
import Guest from "./Guest";

import useAuthState from "../../store/useAuthStore";

export default function AboutMe(){

    const {isAuthenticated} = useAuthState()

    console.log("isAuthenticated", isAuthenticated)

    return isAuthenticated? <Authenticated/>:<Guest/>
}