import "./App.css";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getRandomBackgroungImage } from "./services/random_background";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
function App() {
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRandomBackgroungImage();
      if (data) {
        setBackground(data);
      }
    };
    fetch();
  }, []);
  return (
    <>
      {background ? (
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage background={background} />} />
            <Route
              path="/signup"
              element={<SignupPage background={background} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard background={background} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
}

export default App;
