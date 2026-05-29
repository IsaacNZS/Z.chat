import { Routes, Route, Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Chat from "../pages/Chat";
import Call from "../pages/Call";
import Home from "../pages/Home";
import Footer from "./components/Footer";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Message from "../pages/Message";
import UserProvider from "../Context";
import Edit from "../pages/Edit";

function MainLayout() {
  return (
    <div className="w-full h-screen">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Call" element={<Call />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/message/:id" element={<Message />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
