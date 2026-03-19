import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("trails", "routes/trails.tsx"),
  route("community", "routes/community.tsx"),
  route("about", "routes/about.tsx"),
  route("challenges", "routes/challenges.tsx"),
] satisfies RouteConfig;
