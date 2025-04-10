import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    if(!password) {
      setError("Please enter the password!");
      return;
    }

    setError("");

    // Login API call
    
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please Enter your Account to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="abc@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="********"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p> }

          <button type='submit' className='btn-primary'>Login</button>

          <p className="text-slate-800 mt-3 text-[13px]">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login;
