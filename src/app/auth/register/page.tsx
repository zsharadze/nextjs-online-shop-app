"use client";
import Link from "next/link";
import { useState } from "react";
import "./../../styles/register.css";
import { useRouter } from "next/navigation";
import axiosInstance from "./../../../axiosInterceptorInstance";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerAsAdmin, setRegisterAsAdmin] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match!");
      return;
    }

    let data = {
      email,
      password,
      registerAsAdmin,
    };
    try {
      const response = await axiosInstance.post("/api/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.dismiss();
      setRegisterSuccess(true);
      setTimeout(() => {
        response.status === 201 && router.push("/auth/login");
      }, 2100);
    } catch (error) {
      console.log("error on register", error);
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
          <h3 className="text-center">Register</h3>
          {registerSuccess && (
            <div className="registerSuccess text-center">
              Registration successfull. Redirecting to login...
            </div>
          )}
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
            <div className="mb-1">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label className="form-label">Confirm password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-check mb-2">
              <input
                id="registerAsAdmin"
                className="form-check-input"
                type="checkbox"
                checked={registerAsAdmin}
                onChange={() => setRegisterAsAdmin(!registerAsAdmin)}
              />
              <label
                className="form-check-label no-label-select"
                htmlFor="registerAsAdmin"
              >
                Register as admin
              </label>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
            <div className="form-group">
              <Link href="/auth/login">Need login?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
