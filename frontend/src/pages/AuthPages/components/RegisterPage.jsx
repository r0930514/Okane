import { Link } from "react-router-dom";
import EmailIcon from "../../../assets/svgs/email";
import PropTypes from "prop-types";
import AuthService from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage({ email }) {
  RegisterPage.propTypes = {
    email: PropTypes.string.isRequired
  }
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return <div className="card-body pt-4 space-y-4 ">
    <div className='flex items-center gap-3 justify-center'>

      <div className="flex flex-col gap-6 w-screen xl:w-10/12">
        {/* Email Input Field */}
        <label className="input input-bordered flex items-center gap-2">
          <EmailIcon />
          <input type="text" className="grow" placeholder="Email" value={email} />
        </label>
        {/* Username Input Field */}
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="使用者名稱" value={username} onChange={
            (e) => setUsername(e.target.value)
          } />
        </label>
        {/* Password Input Field */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd" />
          </svg>
          <input type="password" className="grow" placeholder="密碼" value={password} onChange={
            (e) => setPassword(e.target.value)
          } />
        </label>
        {/* Check Password Input Field */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd" />
          </svg>
          <input type="password" className="grow" placeholder="確認密碼" value={confirmPassword} onChange={
            (e) => setConfirmPassword(e.target.value)
          }/>
        </label>
      </div>
    </div>

    <div className="card-actions justify-center space-x-4">
      <Link to="/login">
        <button className="btn btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Link>
      <button className="btn btn-primary" onClick={() => {
        if( password !== confirmPassword ) {
          alert("密碼不一致！");
          return;
        }
        AuthService.signup(email, password, username, setIsLoading, nav);
      }}>
        {isLoading ? <span className="loading loading-spinner"></span> : '註冊'}
      </button>
    </div>
    <div className="toast">

      <div className="alert alert-warning">
        <span>您尚未註冊！請在此處註冊你的帳號 😃</span>
      </div>
    </div>

  </div>;
}