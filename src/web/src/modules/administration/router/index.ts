import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "/administration",
        component: () => import("../views/Administration.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/users",
        component: () => import("../modules/users/views/UserList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/moderation",
        component: () => import("../modules/response/views/ResponseList.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
