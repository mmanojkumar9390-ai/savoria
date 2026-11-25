import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ToastProvider } from './context/ToastContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetails from './pages/RecipeDetails'
import FindRecipes from './pages/FindRecipes'
import Categories from './pages/Categories'
import CookingMode from './pages/CookingMode'
import Favorites from './pages/Favorites'
import AddRecipe from './pages/AddRecipe'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import About from './pages/About'
import Admin from './pages/Admin'
import Contact from './pages/Contact'

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                <Route path="/find-recipes" element={<FindRecipes />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/cooking/:id" element={<CookingMode />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
