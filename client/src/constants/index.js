import { dashboard, logout, payment, profile, withdraw } from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "create instance",
    imgUrl: payment,
    link: "/create-instance",
  },
  {
    name: "analytics",
    imgUrl: withdraw,
    link: "/analytics",
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: true,
  },
];
