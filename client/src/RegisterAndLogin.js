import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.js";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    try {
      const url = isLoginOrRegister === "register" ? "register" : "login";
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Incorrect username or password."
      );
    }
  }

  function toggleLoginRegister() {
    setIsLoginOrRegister((prev) =>
      prev === "register" ? "login" : "register"
    );
    setErrorMessage("");
  }

  return (
    <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 min-h-screen flex items-center justify-center p-6">
      <form
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          {isLoginOrRegister === "register" ? "Create Account" : "Welcome Back"}
        </h2>
        {errorMessage && (
          <div className="text-red-600 mb-4 text-center font-semibold">
            {errorMessage}
          </div>
        )}
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="Enter your username"
          className="block w-full p-4 mb-5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="Enter your password"
          className="block w-full p-4 mb-5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <button className="bg-indigo-600 text-white w-full py-4 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
          {isLoginOrRegister === "register" ? "Sign Up" : "Log In"}
        </button>
        <div className="text-center mt-6">
          {isLoginOrRegister === "register" ? (
            <span className="text-gray-600">
              Already have an account?{" "}
              <button
                className="text-indigo-600 font-semibold hover:underline"
                onClick={toggleLoginRegister}
              >
                Login here
              </button>
            </span>
          ) : (
            <span className="text-gray-600">
              New to Chat-o-Philic?{" "}
              <button
                className="text-indigo-600 font-semibold hover:underline"
                onClick={toggleLoginRegister}
              >
                Sign up now
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
