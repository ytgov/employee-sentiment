import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/DefaultNoAuth.vue"),
    children: [
      {
        path: "/",
        component: () => import("../views/Home.vue"),
      },
    ],
  },
];

export default routes;
