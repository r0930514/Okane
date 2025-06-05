import axios from 'axios';
import ConfigService from './ConfigService';

class AuthService {
  static authInstance = axios.create({
    baseURL: `${ConfigService.baseURL}auth/`
  });
  
  static async verifyEmail(email, setIsLoading, nav) {
    setIsLoading(true);
      await this.authInstance.get(`verifyEmail/${email}`)
        .then(res =>{
          console.log(res);
          if (res.status == 200) {
            nav('password');
          }
          setIsLoading(false);
        })
        .catch(e =>{
          console.log(e);
          if (e.response.status == 404) {
            nav('register');
          }
        })
  }
  static async signin(email, password, setIsLoading, nav) {
    setIsLoading(true);
    await this.authInstance.post('signin', {
      email: email,
      password: password
    })
    .then(res =>{
      if (res.status == 201) {
        nav('/dashboard');
        localStorage.setItem('token', res.data.access_token);
      }else{
        throw new Error('Invalid Credentials');
      }
      setIsLoading(false);
    })
    .catch(e =>{
      console.log(e);
      alert(e)
      setIsLoading(false);
    })
  }
  static async signup(email, password, username, setIsLoading, nav) {
    setIsLoading(true);
    await this.authInstance.post('signup', {
      email: email,
      username: username,
      password: password
    })
    .then(res =>{
      if (res.status == 201) {
        nav('/');
      }
      setIsLoading(false);
    })
    .catch(e =>{
      console.log(e);
    })
  }
  static async checkToken() {
      await this.authInstance.get('verifyToken', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
  }
  static async logout(){
    localStorage.removeItem('token');
  }
}

export default AuthService;