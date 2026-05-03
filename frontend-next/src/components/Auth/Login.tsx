'use client';

import React, { useState, useContext, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/context/AuthProvider";
import styles from "./Auth.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const router = useRouter();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        setEmail("");
        setPassword("");

        if (result.user?.role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/employee-dashboard");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <form
          onSubmit={submitHandler}
          className={styles.form}
        >
          <Link href="/">
            <div className={styles.backButtonWrap}>
              <Image
                src="/assets/BackButton.svg"
                alt="BackButton"
                width={65}
                height={65}
                className={styles.backButtonImg}
              />
            </div>
          </Link>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <input
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={styles.input}
            type="email"
            placeholder="Enter your Email"
          />
          <input
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={styles.input}
            type="password"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <div className={styles.divider}>
            <Link href="/signup">
              <div className={styles.switchLink}>
                New to WorkWave? <br /> Sign Up Here
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
