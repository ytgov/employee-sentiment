<template>
  <div class="text-center mt-10">
    <h1>404 - Not Found</h1>
    <h2 class="mb-5 text-h5">
      Sorry, the path <strong>{{ $route.fullPath }}</strong> was not found
    </h2>
    <p>Please return <router-link to="/">home</router-link></p>
  </div>
</template>
