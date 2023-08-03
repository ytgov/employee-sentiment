<template>
  <div></div>
</template>

<script lang="ts">
export default {
  setup() {},
  name: "Home",
  data() {
    return {};
  },
  mounted() {
    if (!this.authIsLoading) {
      if (this.$auth.isAuthenticated.value) {
        this.$router.push("/dashboard");
      } else {
        this.$router.push("/sign-in");
      }
    }
  },
  watch: {
    authIsLoading(oldV, newV) {
      if (newV == true) {
        if (this.$auth.isAuthenticated.value) {
          this.$router.push("/dashboard");
        } else {
          this.$router.push("/sign-in");
        }
      }
    },
  },
  computed: {
    authIsLoading(): boolean {
      return this.$auth.isLoading.value;
    },
  },
  methods: {},
};
</script>
