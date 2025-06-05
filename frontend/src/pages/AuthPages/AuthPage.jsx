import { Route } from "react-router-dom";
import MyIcon from "../../assets/svgs/MyIcon";
import LoginPage from "../AuthPages/components/LoginPage";
import RegisterPage from "../AuthPages/components/RegisterPage";
import PasswordPage from "../AuthPages/components/PasswordPage";
import { Routes } from "react-router-dom";
import { useState } from "react";
export default function AuthPage() {
    const [email, setEmail] = useState('');
    return (
        <div className="f flex h-screen justify-center items-center bg-base-200">
            <div className="card bg-base-100 shadow-md h-fit w-10/12 md:w-1/3 transition-all">
                <figure className='flex-col px-10 pt-10 justify-center'>
                    <MyIcon />
                    <h2 className="card-title justify-center text-2xl">Okane</h2>
                </figure>
                <Routes>
                    <Route index element={<LoginPage inPage setEmail={setEmail} email={email}></LoginPage>}></Route>
                    <Route path="register" element={<RegisterPage email={email}></RegisterPage>}></Route>
                    password
                    <Route path="password" element={<PasswordPage email={email}></PasswordPage>}></Route>
                </Routes>
            </div>
            
        </div >
    )
}