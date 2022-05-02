import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="">
      <div onClick={() => navigate(-1)}>go back</div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
