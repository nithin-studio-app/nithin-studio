import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `layout-link${isActive ? " is-active" : ""}`;
}

export function Layout() {
  return (
    <div className="layout">
      <nav className="layout-nav">
        <span className="layout-title">nithin-studio</span>
        <div className="layout-links">
          <NavLink to="/dashboard" className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/apps" className={navLinkClassName}>
            Apps
          </NavLink>
          <NavLink to="/services" className={navLinkClassName}>
            Services
          </NavLink>
        </div>
      </nav>

      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}
