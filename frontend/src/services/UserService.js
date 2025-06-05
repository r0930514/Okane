import { jwtDecode } from "jwt-decode";

class UserService{
  static getUser(){
    return jwtDecode(localStorage.getItem('token'));
  }
  
}

export default UserService;