import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import BackButton from "../../assets/BackButton.svg";

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, password, firstname, role);

      if (result.success) {
        console.log("Signup successful:", result.user);

        setFirstname("");
        setEmail("");
        setPassword("");

        alert("Signup successful! Welcome to WorkWave!");

        if (result.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containerr flex items-center justify-center h-[80vh] bg-[#cec0ad]">
      <div className="border-[3px] rounded-se-[75px] rounded-es-[75px] rounded-ee-[75px] p-20 border-[#ad9676] bg-[#cec0ad] max-sm:m-[10px] max-sm:p-[50px]">
        <form
          onSubmit={handleSignup}
          className="flex flex-col justify-center items-center w-full bg-transparent"
        >
          <Link to={"/"}>
            <div className="absolute top-7 left-7 bg-transparent">
              <img
                src={BackButton}
                alt="BackButton"
                className="bg-transparent w-auto h-[65px]"
              />
            </div>
          </Link>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] text-center text-sm">
              {error}
            </div>
          )}

          {/* Role Selection Tiles */}
          <div className="flex flex-row gap-4 mb-4 w-full bg-transparent max-sm:gap-2">
            {/* Employee Tile */}
            <button
              type="button"
              onClick={() => setRole("employee")}
              disabled={isLoading}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-se-[20px] rounded-es-[20px] rounded-ee-[20px] border-[3px] transition-all duration-300 cursor-pointer
                ${role === "employee"
                  ? "border-[#8b6c3e] bg-[#ad9676] shadow-lg scale-[1.03]"
                  : "border-[#ad9676] bg-[#cec0ad] hover:border-[#9c815a] hover:bg-[#c4b49e]"
                }
                disabled:opacity-50 disabled:cursor-not-allowed max-sm:p-3`}
            >
              {/* Employee Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={role === "employee" ? "#cec0ad" : "#9c815a"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 bg-transparent transition-colors duration-300 max-sm:w-8 max-sm:h-8"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span
                className={`font-bold text-[16px] bg-transparent transition-colors duration-300 max-sm:text-[13px]
                  ${role === "employee" ? "text-[#cec0ad]" : "text-[#9c815a]"}`}
              >
                Employee
              </span>
            </button>

            {/* Admin Tile */}
            <button
              type="button"
              onClick={() => setRole("admin")}
              disabled={isLoading}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-se-[20px] rounded-es-[20px] rounded-ee-[20px] border-[3px] transition-all duration-300 cursor-pointer
                ${role === "admin"
                  ? "border-[#8b6c3e] bg-[#ad9676] shadow-lg scale-[1.03]"
                  : "border-[#ad9676] bg-[#cec0ad] hover:border-[#9c815a] hover:bg-[#c4b49e]"
                }
                disabled:opacity-50 disabled:cursor-not-allowed max-sm:p-3`}
            >
              {/* Admin Icon (shield with star) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={role === "admin" ? "#cec0ad" : "#9c815a"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 bg-transparent transition-colors duration-300 max-sm:w-8 max-sm:h-8"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8l1.5 3 3.5.5-2.5 2.5.5 3.5L12 16l-3 1.5.5-3.5L7 11.5l3.5-.5z" />
              </svg>
              <span
                className={`font-bold text-[16px] bg-transparent transition-colors duration-300 max-sm:text-[13px]
                  ${role === "admin" ? "text-[#cec0ad]" : "text-[#9c815a]"}`}
              >
                Admin
              </span>
            </button>
          </div>

          <input
            value={firstname}
            required
            onChange={(e) => setFirstname(e.target.value)}
            disabled={isLoading}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] text-[#8b6c3e] placeholder:text-opacity-70 font-bold bg-[#cec0ad] disabled:opacity-50"
            type="text"
            placeholder="Enter your Name"
          />

          <input
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] text-[#8b6c3e] placeholder:text-opacity-70 font-bold bg-[#cec0ad] disabled:opacity-50"
            type="email"
            placeholder="Enter your Email"
          />

          <input
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] text-[#8b6c3e] placeholder:text-opacity-70 font-bold bg-[#cec0ad] disabled:opacity-50"
            type="password"
            placeholder="Enter your password (min 6 characters)"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="border-none mt-10 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl text-[#cec0ad] font-bold w-full bg-[#ad9676] focus:bg-[#8b6c3e] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8b6c3e] transition-colors"
          >
            {isLoading ? "Creating Account..." : `Signup as ${role === "admin" ? "Admin" : "Employee"}`}
          </button>

          <div className="relative mt-[70px] w-[85%] bg-[#ad9676] h-[1px]">
            <Link to={"/login"}>
              <div className="absolute w-[55%] text-center text-[13px] text-[#ad9676] font-semibold left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cec0ad]">
                Already a user? <br /> Login Here
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;