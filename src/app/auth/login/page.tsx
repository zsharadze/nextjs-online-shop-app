"use client";
import { doCredentialLogin } from "@/app/actions";
import { showLoader } from "@/app/helpers/loader";
import { showToastError } from "@/app/helpers/toastService";
import Link from "next/link";
import "./../../styles/login.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableLoginButton, setDisableLoginButton] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setDisableLoginButton(true);
      showLoader(true);
      const response = await doCredentialLogin({
        email: email,
        password: password,
      });

      if (response.error) {
        setDisableLoginButton(false);
        showLoader(false);
        showToastError(response.error);
      } else {
        showLoader(false);
        toast.dismiss();
        window.location.href = "/"; //with this header will be updated with new session to show user info on profile click
      }
    } catch (err) {
      console.error("login error", err);
    }
  };

  return (
    <div className="container-fluid login-register-form mt-5">
      <div className="row ">
        <div className="col-md-12">
          <div className="text-center">
            <i
              className="fa fa-lock fa-2x login-fa-lock"
              aria-hidden="true"
            ></i>
          </div>
          <h3 className="text-center test">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={disableLoginButton}
            >
              Login
            </button>
            <div className="form-group">
              <Link href="/auth/register">Need registration?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
