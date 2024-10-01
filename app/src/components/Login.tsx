import React, { useState } from "react";

interface LoginProps {
  handleLogin: (emailAddress: string) => void;
}

const Login = ({ handleLogin }: LoginProps) => {
  const [emailAddress, setEmailAddress] = useState("");

  return (
    <div className="flex flex-col items-center min-h-screen mt-16">
      <div className="w-96">
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-2 border rounded text-center"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        <div className="flex flex-col items-center">
          <button
            className="w-36 bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => handleLogin(emailAddress)}
          >
            Go ahead
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
