import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import BackButton from "../../assets/BackButton.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        console.log("Login successful:", result.user);
        
        // Clear form
        setEmail("");
        setPassword("");

        // Navigate based on role
        if (result.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containerr flex items-center justify-center h-[80vh] bg-[#cec0ad]">
      <div className="border-[3px] rounded-se-[75px] rounded-es-[75px] rounded-ee-[75px] p-20 border-[#ad9676] bg-[#cec0ad] max-sm:m-[10px]">
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col justify-center items-center w-full bg-transparent"
        >
          <Link to={"/"}>
            <div className="absolute top-7 left-7 bg-transparent max-sm:top-10 max-sm:left-5">
              <img
                src={BackButton}
                alt="BackButton"
                className="bg-transparent w-auto h-[65px]"
              />
            </div>
          </Link>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] text-center">
              {error}
            </div>
          )}

          <input
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] font-bold text-[#8b6c3e] placeholder:text-opacity-70 placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] bg-[#cec0ad] disabled:opacity-50"
            type="email"
            placeholder="Enter your Email"
          />
          <input
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] font-bold text-[#8b6c3e] placeholder:text-opacity-70 placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] bg-[#cec0ad] disabled:opacity-50"
            type="password"
            placeholder="Enter your password"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="border-none mt-10 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl text-[#cec0ad] font-bold w-full bg-[#ad9676] focus:bg-[#8b6c3e] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8b6c3e] transition-colors"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <div className="relative mt-[70px] w-[85%] bg-[#ad9676] h-[1px]">
            <Link to="/signup">
              <div className="absolute w-[55%] text-center text-[13px] text-[#ad9676] font-semibold left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cec0ad]">
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