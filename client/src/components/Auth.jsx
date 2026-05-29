import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = ({ header, footer, url }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [open, setOpen] = useState(false);

  const register = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username,
            password: password,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(`🥳 ${data.msg}Please Login. 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
        navigate("/auth/login");
      } else {
        toast.error(` ${data.msg} 😭😭`, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: username,
            password: password,
          }),
        },
      );
      const data = await res.json();
      setUser(data.result);
      if (res.ok) {
        toast.success(`🥳 ${data.msg} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
        navigate("/");
      } else {
        toast.error(` ${data.msg} 😭😭`, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const controller = (event) => {
    if (header === "Login") {
      login(event);
    } else {
      register(event);
    }
  };

  return (
    <div className="w-full h-[98%] flex flex-col items-center">
      <div className="flex flex-col gap-1 items-center justify-center">
        <img
          src="/logo.png"
          style={{
            width: "200px",
            height: "200px",
          }}
          alt=""
        />
        <h1 className="text-5xl font-bold text-[#00aeff]">
          <span className="text-white text-4xl">Welcome to </span>Z.chat
        </h1>
        <p className="text-4xl mb-2 py-2 font-bold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {header} Form
        </p>
        <form
          className="flex flex-col w-full items-center justify-center gap-7"
          onSubmit={controller}
        >
          <input
            type="text"
            minLength={4}
            name="username"
            placeholder="Type UserName"
            className="text-[#000000] w-full rounded-[10px] font-bold px-4 py-2 outline-none text-xl bg-[#b8e9ff]"
          />
          <div className="relative w-full">
            {" "}
            <input
              type={open ? "text" : "password"}
              minLength={6}
              name="password"
              placeholder="Type Password"
              className="text-black w-full rounded-[10px] font-bold px-4 py-2 outline-none text-xl bg-[#b8e9ff]"
            />
            {open ? (
              <i
                onClick={() => {
                  setOpen(!open);
                }}
                className="fa-solid top-3 right-5 text-[#00aeff] absolute fa-eye text-[23px]"
              ></i>
            ) : (
              <i
                onClick={() => {
                  setOpen(!open);
                }}
                className="fa-solid top-3 right-5 text-[#00aeff] absolute fa-eye-slash text-[23px]"
              ></i>
            )}
          </div>
          <Link to={url} className="text-lg text-white mr-[42%]">
            {footer}
          </Link>
          <button
            type="submit"
            className="
    relative
    px-6 py-3
    rounded-xl
    bg-black
    text-xl
    font-bold
    text-white
    bg-clip-text
    bg-linear-to-r
    from-indigo-500
    via-purple-500
    to-pink-500
    overflow-hidden

    before:absolute
    before:inset-0
    before:rounded-xl
    before:p-0.5
    before:bg-[linear-gradient(90deg,#6366f1,#a855f7,#ec4899,#6366f1)]
    before:bg-size-[300%_300%]
    before:animate-[borderMove_4s_linear_infinite]

    after:absolute
    after:inset-0.5
    after:bg-black
    after:rounded-xl

  "
          >
            <span className="relative z-10">{header} Account</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
