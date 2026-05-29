import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Edit = () => {
  const [initial, setInitial] = useState();
  const navigate = useNavigate();

  const userinfo = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setInitial(data.result);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userinfo();
  }, []);

  const edit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const img = formData.get("img");
    const bio = formData.get("bio");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/edituser/${initial?._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: name,
            img: img,
            bio: bio,
          }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        toast.success(`🥳 ${data.msg} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full h-[98%] flex flex-col items-center">
      <div className="flex flex-col gap-3 items-center justify-center">
        <i
          onClick={() => navigate("/")}
          className="text-[#00aeff] mt-2 ml-3 self-start text-3xl fa-solid fa-arrow-left"
        ></i>

        <h1 className="text-5xl ml-3 font-bold text-[#00aeff]">
          <span className="text-white text-4xl">Don't like default by </span>
          Z.chat ?{" "}
        </h1>
        <div className="flex items-center">
          {" "}
          <img
            src="/crying.gif"
            style={{
              width: "200px",
              height: "170px",
            }}
            alt=""
          />
          <p className="text-4xl self-end mb-2 py-2 font-bold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            OK Edit
          </p>
        </div>
        <form
          className="flex flex-col w-[90%] items-center justify-center gap-7"
          onSubmit={edit}
        >
          <input
            type="text"
            defaultValue={initial?.username}
            minLength={4}
            name="name"
            placeholder="Type New UserName"
            className="text-[#000000] w-full rounded-[10px] font-bold px-4 py-2 outline-none text-2xl bg-[#b8e9ff]"
          />
          <input
            type="text"
            name="img"
            defaultValue={initial && initial.profileimg}
            placeholder="Paste Profile Url"
            className="text-black w-full rounded-[10px] font-bold px-4 py-2 outline-none text-2xl bg-[#b8e9ff]"
          />
          <input
            type="text"
            name="bio"
            defaultValue={initial ? initial.bio : "❤️GOD BLESS YOU❤️"}
            placeholder="Type New Bio"
            className="text-black w-full rounded-[10px] font-bold px-4 py-2 outline-none text-2xl bg-[#b8e9ff]"
          />
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
            <span className="relative z-10">Edit Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
