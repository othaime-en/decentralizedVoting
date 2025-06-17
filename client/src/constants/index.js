import { dashboard, logout, payment, profile, withdraw } from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/app/home",
  },
  {
    name: "create instance",
    imgUrl: payment,
    link: "/app/create-instance",
  },
  {
    name: "analytics",
    imgUrl: withdraw,
    link: "/app/analytics",
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/app/profile",
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: true,
  },
];
