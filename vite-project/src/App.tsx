import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import DefaultPage from "./Pages/DefaultPage";
import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import ProductList from "./componentes/products/ProductList";
import LoginPage from "./componentes/login/Login";
import SignUpPage from "./componentes/login/Signup";
import AdminDashboard from "./componentes/admin/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import RatingForm from "./componentes/admin/RatingForm";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<DefaultPage />}>
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="products" element={<ProductList />} />
            <Route path="admindashboard" element={<AdminDashboard />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage/>} />
            <Route path="ratingForm" element={<RatingForm/>} />


          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
