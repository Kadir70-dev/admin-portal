// src/pages/auth/login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [mobileOrFile, setMobileOrFile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileOrFile, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      console.log("Login successful:", data.token);

      // Optional: store user details
      localStorage.setItem("user", JSON.stringify(data.user));


      // Redirect to home/dashboard
      await  router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Mobile No or File No"
          value={mobileOrFile}
          onChange={(e) => setMobileOrFile(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
