"use client";
import React, { useState } from "react";
import './styles.css';

const SignUpLoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isSignUp ? "http://localhost:3005/api/v1/sign-up" : "http://localhost:3005/api/v1/sign-in";
        const data = isSignUp ? { username, email, password } : { email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(`Success: ${result.message}`);
            } else {
                setMessage(`Error: ${result.message}`);
            }
        } catch (error) {
            console.log(error)
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="form-container">
            <h1>{isSignUp ? "Sign Up" : "Login"}</h1>
            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
                <p onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </p>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default SignUpLoginPage;
