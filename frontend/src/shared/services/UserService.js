import { jwtDecode } from "jwt-decode";

class UserService{
    static getUser(){
        const token = localStorage.getItem('token');
        if (!token) return null;
        return jwtDecode(token);
    }
  
}

export default UserService;
