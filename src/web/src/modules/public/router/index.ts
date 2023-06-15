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
        path: "question/:surveyId",
        component: () => import("../views/Survey.vue"),
      },
      {
        path: "question/complete",
        component: () => import("../views/SurveyComplete.vue"),
      },
      {
        path: "rating/:surveyId",
        component: () => import("../views/Rating.vue"),
      },
      {
        path: "rating/complete",
        component: () => import("../views/RatingComplete.vue"),
      },
    ],
  },
];

export default routes;
