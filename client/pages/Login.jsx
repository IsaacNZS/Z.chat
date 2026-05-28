import React from "react";
import Auth from "../src/components/Auth";

const Login = () => {
  return (
    <Auth
      header={"Login"}
      url={"/auth/register"}
      footer={"Don't have an account?"}
    />
  );
};

export default Login;
