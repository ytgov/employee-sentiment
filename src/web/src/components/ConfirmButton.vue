<template>
  <v-dialog
    v-model="modelValue"
    max-width="500px"
  >
    <template #activator="{ props }">
      <v-btn
        :color="buttonColor"
        :size="buttonSize"
        :class="buttonClass"
        :variant="getButtonVariant()"
        text="Delete Tenant"
        v-bind="props"
        >{{ buttonText }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>{{ confirmTitle }}</v-card-title>
      <v-card-text class="px-4 pt-0">
        <v-alert
          density="compact"
          icon="mdi-alert-circle"
          :type="getType()"
          :text="confirmText"
        />

        <p
          v-if="extraText"
          class="mt-3"
        >
          {{ extraText }}
        </p>

        <div class="d-flex mt-6">
          <v-btn
            :color="getType()"
            :text="confirmButtonText"
            variant="flat"
            @click="confirmClick"
          />
          <v-label class="mx-4">or</v-label>
          <v-btn
            text="Cancel"
            color="info"
            class="mt-1"
            size="small"
            variant="outlined"
            @click="modelValue = false"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

const modelValue = ref(false)

const emit = defineEmits(["on-confirm"])
const props = defineProps({
  buttonText: {
    type: String,
    default: "Delete",
  },
  buttonSize: { type: String, default: "small" },
  buttonColor: { type: String, default: "red" },
  buttonVariant: { type: String, default: "outlined" },
  buttonClass: { type: String, default: "" },
  confirmTitle: { type: String, default: "" },
  confirmText: { type: String, default: "" },
  confirmVariant: { type: String, default: "warning" },
  confirmButtonText: { type: String, default: "Delete" },
  extraText: { type: String, default: "" },
})

function getType(): "warning" | "error" | "success" | "info" | undefined {
  if (props.confirmVariant === "error") return "error"
  if (props.confirmVariant === "success") return "success"
  if (props.confirmVariant === "info") return "info"
  if (props.confirmVariant === "warning") return "warning"
  return undefined
}
function getButtonVariant(): "outlined" | "flat" | "text" | "tonal" | undefined {
  if (props.buttonVariant === "outlined") return "outlined"
  if (props.buttonVariant === "flat") return "flat"
  if (props.buttonVariant === "tonal") return "tonal"
  return undefined
}

function confirmClick() {
  emit("on-confirm")
  modelValue.value = false
}
</script>
