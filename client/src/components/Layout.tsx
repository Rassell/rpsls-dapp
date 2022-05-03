import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import "./Layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className={`layout ${!isHome && "layout-header"}`}>
      {!isHome && (
        <div className="layout-button">
          <IconButton
            aria-label="Go Home"
            onClick={() => navigate("/")}
            size="lg"
            icon={<ArrowBackIcon />}
          />
        </div>
      )}
      <Outlet />
    </div>
  );
}
