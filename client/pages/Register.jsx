import React from "react";
import Auth from "../src/components/Auth";

const Register = () => {
  return (
    <Auth
      header={"Register"}
      url={"/auth/login"}
      footer={"Already have an account?"}
    />
  );
};

export default Register;
