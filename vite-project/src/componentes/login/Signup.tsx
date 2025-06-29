import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së përdoruesve:", err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("Ju lutem plotësoni të gjitha fushat.");
      return;
    }
    if (
      users.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      setMessage("Ky email është regjistruar tashmë.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/users", {
        name,
        email,
        password,
        role: "user", // Roli i caktohet automatikisht "user"
      });
      if (res.status === 201) {
        setMessage("Regjistrimi u krye me sukses!");
        setName("");
        setEmail("");
        setPassword("");
        fetchUsers();
      } else {
        setMessage("Gabim gjatë regjistrimit.");
      }
    } catch (err: any) {
      console.error("Gabim gjatë lidhjes me serverin:", err.message || err);
      setMessage("Gabim gjatë lidhjes me serverin.");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        marginTop: "60px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#eee",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1E1E1E",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontWeight: "700",
            fontSize: "1.8rem",
          }}
        >
          Regjistrimi
        </h2>
        {message && (
          <p
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: message.includes("sukses") ? "#4CAF50" : "#F44336",
              fontWeight: "600",
            }}
          >
            {message}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Emri:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                marginTop: "6px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#2C2C2C",
                color: "#eee",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3F51B5")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                marginTop: "6px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#2C2C2C",
                color: "#eee",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3F51B5")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Fjalëkalimi:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                marginTop: "6px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#2C2C2C",
                color: "#eee",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3F51B5")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: "12px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#3F51B5",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#303F9F")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3F51B5")
            }
          >
            Regjistrohu
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <Link
            to="/login"
            style={{
              color: "#7986CB",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "color 0.3s, text-decoration 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#C5CAE9";
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#7986CB";
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Ke një llogari? Kyçu tani
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;