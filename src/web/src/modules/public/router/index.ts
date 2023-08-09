const routes = [
  {
    path: "",
    component: () => import("@/layouts/DefaultNoAuth.vue"),
    children: [
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
      {
        path: "inspire/:surveyId",
        component: () => import("../views/Inspire.vue"),
      },
      {
        path: "results/:surveyId",
        component: () => import("../views/Results.vue"),
      },
    ],
  },
];

export default routes;
