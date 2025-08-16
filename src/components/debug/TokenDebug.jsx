// src/components/debug/TokenDebug.jsx - ENHANCED WITH localStorage TESTS
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../../store/auth-slice";

const TokenDebug = () => {
  const [localStorageToken, setLocalStorageToken] = useState(null);
  const [localStorageCheck, setLocalStorageCheck] = useState("");
  const [apiCallStatus, setApiCallStatus] = useState("Not called");
  const [manualTestToken, setManualTestToken] = useState("");
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // Test if localStorage is available
        const testKey = "test-ls";
        localStorage.setItem(testKey, "test");
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        if (testValue !== "test") {
          setLocalStorageCheck("❌ localStorage not working properly");
          return;
        }

        // Get the actual token
        const token = localStorage.getItem("authToken");
        setLocalStorageToken(token);
        setLocalStorageCheck("✅ localStorage working");
      } catch (error) {
        setLocalStorageCheck("❌ localStorage error: " + error.message);
        console.error("localStorage error:", error);
      }
    };

    checkLocalStorage();
    const interval = setInterval(checkLocalStorage, 1000);
    return () => clearInterval(interval);
  }, [authState]);

  // Manual test button
  const testCheckAuth = async () => {
    setApiCallStatus("🔄 Testing...");
    try {
      console.log("🧪 Manual checkAuth test started");
      const result = await dispatch(checkAuth()).unwrap();
      setApiCallStatus(
        "✅ Success: " + JSON.stringify(result).substring(0, 50) + "..."
      );
      console.log("🧪 Manual checkAuth result:", result);
    } catch (error) {
      setApiCallStatus("❌ Failed: " + error.message);
      console.error("🧪 Manual checkAuth error:", error);
    }
  };

  // Test localStorage manually
  const testLocalStorage = () => {
    try {
      const testToken = "test-token-" + Date.now();
      localStorage.setItem("authToken", testToken);
      const retrieved = localStorage.getItem("authToken");

      if (retrieved === testToken) {
        alert(
          "✅ localStorage test successful!\nStored: " +
            testToken +
            "\nRetrieved: " +
            retrieved
        );
      } else {
        alert(
          "❌ localStorage test failed!\nStored: " +
            testToken +
            "\nRetrieved: " +
            retrieved
        );
      }

      localStorage.removeItem("authToken");
    } catch (error) {
      alert("❌ localStorage error: " + error.message);
    }
  };

  // Manually set token
  const setManualToken = () => {
    if (manualTestToken.trim()) {
      try {
        localStorage.setItem("authToken", manualTestToken.trim());
        alert("✅ Token manually set in localStorage");
        setManualTestToken("");
      } catch (error) {
        alert("❌ Error setting token: " + error.message);
      }
    }
  };

  // Clear token
  const clearToken = () => {
    try {
      localStorage.removeItem("authToken");
      alert("✅ Token cleared from localStorage");
    } catch (error) {
      alert("❌ Error clearing token: " + error.message);
    }
  };

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.95)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "11px",
        zIndex: 9999,
        maxWidth: "380px",
        fontFamily: "monospace",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <strong>🔍 Auth Debug Panel</strong>
      </div>

      {/* localStorage Status */}
      <div style={{ marginBottom: "8px" }}>
        <div>{localStorageCheck}</div>
        <div>Token exists: {localStorageToken ? "✅" : "❌"}</div>
        <div>
          Token preview: {localStorageToken?.substring(0, 25) || "none"}...
        </div>
      </div>

      {/* Redux State */}
      <div
        style={{
          marginBottom: "8px",
          borderTop: "1px solid #333",
          paddingTop: "8px",
        }}
      >
        <div>
          <strong>Redux State:</strong>
        </div>
        <div>Loading: {authState.isLoading ? "✅" : "❌"}</div>
        <div>Authenticated: {authState.isAuthenticated ? "✅" : "❌"}</div>
        <div>User: {authState.user?.userName || "none"}</div>
        <div>Redux token: {authState.token?.substring(0, 20) || "none"}...</div>
      </div>

      {/* API Test */}
      <div
        style={{
          marginBottom: "8px",
          borderTop: "1px solid #333",
          paddingTop: "8px",
        }}
      >
        <div>
          <strong>API Test:</strong>
        </div>
        <button
          onClick={testCheckAuth}
          style={{
            background: "#0066cc",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "10px",
            marginBottom: "5px",
            marginRight: "5px",
          }}
        >
          Test checkAuth API
        </button>
        <div style={{ fontSize: "10px" }}>{apiCallStatus}</div>
      </div>

      {/* localStorage Tests */}
      <div
        style={{
          marginBottom: "8px",
          borderTop: "1px solid #333",
          paddingTop: "8px",
        }}
      >
        <div>
          <strong>localStorage Tests:</strong>
        </div>
        <button
          onClick={testLocalStorage}
          style={{
            background: "#cc6600",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "10px",
            marginBottom: "5px",
            marginRight: "5px",
          }}
        >
          Test localStorage
        </button>
        <button
          onClick={clearToken}
          style={{
            background: "#cc0000",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "10px",
            marginBottom: "5px",
          }}
        >
          Clear Token
        </button>

        <div style={{ marginTop: "5px" }}>
          <input
            type="text"
            value={manualTestToken}
            onChange={(e) => setManualTestToken(e.target.value)}
            placeholder="Manual token..."
            style={{
              width: "100%",
              padding: "2px 4px",
              fontSize: "10px",
              marginBottom: "5px",
              background: "#333",
              color: "white",
              border: "1px solid #555",
            }}
          />
          <button
            onClick={setManualToken}
            style={{
              background: "#006600",
              color: "white",
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
            }}
          >
            Set Manual Token
          </button>
        </div>
      </div>

      <div
        style={{
          fontSize: "9px",
          color: "#ccc",
          borderTop: "1px solid #333",
          paddingTop: "5px",
        }}
      >
        Check console for detailed logs
      </div>
    </div>
  );
};

export default TokenDebug;
