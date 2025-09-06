 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from '../pages/auth/UserLogin';
import UserRegister from '../pages/auth/UserRegister';
import PartnerLogin from '../pages/auth/PartnerLogin';
import PartnerRegister from '../pages/auth/PartnerRegister';
import Home from '../pages/general/Home';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import Saved from '../pages/user/Saved';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes(){
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  console.log(SERVER_URL);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home SERVER_URL={SERVER_URL} />} />
        
        {/* Protected routes for users */}
        <Route 
          path="/saved" 
          element={
            <ProtectedRoute requireUser={true}>
              <Saved SERVER_URL={SERVER_URL} />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected routes for food partners */}
        <Route 
          path="/create" 
          element={
            <ProtectedRoute requireFoodPartner={true}>
              <CreateFood SERVER_URL={SERVER_URL} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/food-partner/:id" 
          element={
            <ProtectedRoute requireFoodPartner={true}>
              <Profile SERVER_URL={SERVER_URL} />
            </ProtectedRoute>
          } 
        />
        
        {/* Public auth routes */}
        <Route path="/user/login" element={<UserLogin SERVER_URL={SERVER_URL} />} />
        <Route path="/user/register" element={<UserRegister SERVER_URL={SERVER_URL} />} />
        <Route path="/food-partner/login" element={<PartnerLogin SERVER_URL={SERVER_URL} />} />
        <Route path="/food-partner/register" element={<PartnerRegister SERVER_URL={SERVER_URL} />} />
      </Routes>
    </BrowserRouter>
  );
}