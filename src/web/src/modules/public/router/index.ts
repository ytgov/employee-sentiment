const routes = [
  {
    path: "",
    component: () => import("@/layouts/DefaultNoAuth.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "survey/:surveyId",
        component: () => import("../views/Survey.vue"),
      },
      {
        path: "survey/:surveyId/complete",
        component: () => import("../views/SurveyComplete.vue"),
      },
    ],
  },
];

export default routes;
