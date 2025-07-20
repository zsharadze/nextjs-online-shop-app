"use client";
import Link from "next/link";
import { useState } from "react";
import "./../../styles/changePassword.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChangePasswordDTO } from "@/app/dtos/changePasswordDTO";
import { changeUserPassword } from "@/app/services/auth.service";
import { showToastError } from "@/app/helpers/toastService";
import { signOut } from "next-auth/react";

export default function ChangePassword() {
  const [changePassword, setChangePassword] = useState<ChangePasswordDTO>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.dismiss();
      showToastError("Passwords do not match!");
      return;
    }
    const changePasswordResult = await changeUserPassword(changePassword);
    if (!changePasswordResult[0]) {
      toast.dismiss();
      showToastError(changePasswordResult[1]);
    } else {
      toast.dismiss();
      setPasswordChangeSuccess(true);
      signOut({redirect: false});
      setTimeout(() => {
        router.push("/auth/login");
      }, 2100);
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
          <h3 className="text-center">Change password</h3>
          {passwordChangeSuccess && (
            <div className="changeSuccess text-center">
              Change password successful. Redirecting to login...
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label className="form-label">Old password:</label>
              <input
                type="password"
                className="form-control"
                value={changePassword.oldPassword}
                onChange={(e) => {
                  setChangePassword((p) => ({
                    ...p,
                    oldPassword: e.target.value,
                  }));
                }}
                required
              />
            </div>
            <div className="mb-1">
              <label className="form-label">New password:</label>
              <input
                type="password"
                className="form-control"
                value={changePassword.newPassword}
                onChange={(e) => {
                  setChangePassword((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }));
                }}
                required
              />
            </div>
            <div className="mb-1">
              <label className="form-label">Confirm new password:</label>
              <input
                type="password"
                className="form-control"
                value={changePassword.confirmPassword}
                onChange={(e) => {
                  setChangePassword((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }));
                }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Change password
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
