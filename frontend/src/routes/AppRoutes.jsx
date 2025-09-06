 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from '../pages/auth/UserLogin';
import UserRegister from '../pages/auth/UserRegister';
import PartnerLogin from '../pages/auth/PartnerLogin';
import PartnerRegister from '../pages/auth/PartnerRegister';
import Home from '../pages/general/Home';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import Saved from '../pages/user/Saved';

export default function AppRoutes(){
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home SERVER_URL={SERVER_URL} />} />
        <Route path="/saved" element={<Saved SERVER_URL={SERVER_URL} />} />
        <Route path="/create" element={<CreateFood SERVER_URL={SERVER_URL} />} />
        <Route path="/user/login" element={<UserLogin SERVER_URL={SERVER_URL} />} />
        <Route path="/user/register" element={<UserRegister SERVER_URL={SERVER_URL} />} />
        <Route path="/food-partner/login" element={<PartnerLogin SERVER_URL={SERVER_URL} />} />
        <Route path="/food-partner/register" element={<PartnerRegister SERVER_URL={SERVER_URL} />} />
        <Route path="/food-partner/:id" element={<Profile SERVER_URL={SERVER_URL} />} />
      </Routes>
    </BrowserRouter>
  );
}
