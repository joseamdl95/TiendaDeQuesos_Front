import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>

          <Navbar />

          <AppRouter />
          
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;