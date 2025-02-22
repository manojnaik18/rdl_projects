import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const accessories = [
  { id: 1, name: "Smart Watch", price: 99, icon: "⌚" },
  { id: 2, name: "Headphones", price: 79, icon: "🎧" },
  { id: 3, name: "Sunglasses", price: 49, icon: "🕶️" },
  { id: 4, name: "Backpack", price: 89, icon: "🎒" },
  { id: 5, name: "Wireless Mouse", price: 29, icon: "🖱️" },
];

const App = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [showCharts, setShowCharts] = useState(false);

  const handleRegister = () => {
    if (!name || !password) {
      setError("Both fields are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((user) => user.name === name)) {
      setError("User already exists! Try a different name.");
      return;
    }

    users.push({ name, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    setIsRegistering(false);
    setName("");
    setPassword("");
    setError("");
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.name === name && user.password === password)) {
      localStorage.setItem("loggedInUser", JSON.stringify({ name }));
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials! Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setName("");
    setPassword("");
    setCart([]);
    setShowCharts(false);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  const chartData = cart.map((item) => ({ name: item.name, price: item.price }));
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="auth-box">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          {error && <p className="error">{error}</p>}
          <input className="fld" type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="fld" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {isRegistering ? <button onClick={handleRegister}>Register</button> : <button onClick={handleLogin}>Login</button>}
          <p className="fld fc" onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? "Already have an account? Login" : "New user? Register here"}</p>
        </div>
      ) : (
        <div className="shopping-cart">
          <div className="wlc">
          <h2>Welcome, {JSON.parse(localStorage.getItem("loggedInUser")).name}!</h2>
          <h3>Available Accessories</h3>
          </div>
          <div className="items">
            {accessories.map((item) => (
              <div key={item.id} className="item">
                <span className="icon">{item.icon}</span>
                <p>{item.name}</p>
                <p>${item.price}</p>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>

          <h3>Shopping Cart</h3>
          <div className="cart">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <p>{item.icon} {item.name} - ${item.price}</p>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </div>
              ))
            ) : (
              <p>Cart is empty</p>
            )}
          </div>
          <h3>Total: ${totalPrice}</h3>

          <button onClick={() => setShowCharts(!showCharts)} className="chart-btn">
            {showCharts ? "Hide Charts" : "Show Charts"}
          </button>

          {/* Show Charts Section */}
          {showCharts && cart.length > 0 && (
            <div className="charts">
              <h3>Charts</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="price" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={chartData} dataKey="price" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#ffc658">
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;