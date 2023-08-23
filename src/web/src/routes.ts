import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/router";
import adminstrationRoutes from "@/modules/administration/router";
import authenticationRoutes from "@/modules/authentication/router";
import publicRoutes from "@/modules/public/router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",

    children: [
      ...homeRoutes,
      ...publicRoutes,
      ...authenticationRoutes,
      ...adminstrationRoutes,

      {
        path: "/NotAuthorized",
        component: () => import("@/layouts/DefaultNoAuth.vue"),
        children: [
          {
            path: "",
            component: () => import("@/views/NotAuthorized.vue"),
          },
        ],
      },
      {
        path: "/NotAvailable",
        component: () => import("@/layouts/DefaultNoAuth.vue"),
        children: [
          {
            path: "",
            component: () => import("@/views/NotAvailable.vue"),
          },
        ],
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("@/layouts/DefaultNoAuth.vue"),
        children: [
          {
            path: "",
            component: () => import("@/views/NotFound.vue"),
          },
        ],
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
