// Create this as a temporary component: src/components/AuthTest.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/auth-slice";

const AuthTest = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const testAuth = () => {
    console.log("🧪 Testing auth manually...");
    dispatch(checkAuth());
  };

  const checkCookies = () => {
    console.log("🍪 All cookies:", document.cookie);

    // Try to get token cookie specifically
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    console.log("🎫 Token cookie:", tokenCookie);
  };

  useEffect(() => {
    console.log("🎯 AuthTest mounted");
    checkCookies();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        zIndex: 9999,
        fontSize: "12px",
      }}
    >
      <h3>Auth Debug</h3>
      <p>Loading: {isLoading ? "Yes" : "No"}</p>
      <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
      <p>User: {user?.userName || "None"}</p>
      <button onClick={testAuth}>Test Auth</button>
      <button onClick={checkCookies}>Check Cookies</button>
    </div>
  );
};

export default AuthTest;
