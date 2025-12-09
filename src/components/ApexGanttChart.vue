<template>
  <div ref="chartContainer" :class="className" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import type { CSSProperties } from "vue";
import ApexGantt from "apexgantt";
import type {
  GanttUserOptions,
  TaskInput,
  ViewMode,
  ThemeMode,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskValidationErrorEventDetail,
  TaskUpdateErrorEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
} from "apexgantt";
import { GanttEvents } from "apexgantt";

export interface ApexGanttChartProps {
  tasks: TaskInput[];
  options?: Partial<GanttUserOptions>;
  width?: string | number;
  height?: string | number;
  viewMode?: ViewMode;
  theme?: ThemeMode;
  className?: string;
  style?: CSSProperties;
}

export interface ApexGanttChartEmits {
  (e: "taskUpdate", detail: TaskUpdateEventDetail): void;
  (e: "taskUpdateSuccess", detail: TaskUpdateSuccessEventDetail): void;
  (e: "taskValidationError", detail: TaskValidationErrorEventDetail): void;
  (e: "taskUpdateError", detail: TaskUpdateErrorEventDetail): void;
  (e: "taskDragged", detail: TaskDraggedEventDetail): void;
  (e: "taskResized", detail: TaskResizedEventDetail): void;
}

export interface ApexGanttChartExpose {
  update: (options: Partial<GanttUserOptions>) => void;
  updateTask: (taskId: string, taskData: Partial<TaskInput>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  destroy: () => void;
  getInstance: () => ApexGantt | null;
}

const props = withDefaults(defineProps<ApexGanttChartProps>(), {
  width: "100%",
  height: "500px",
  viewMode: "month" as ViewMode,
  theme: "light" as ThemeMode,
  className: "",
});

const emit = defineEmits<ApexGanttChartEmits>();

const chartContainer = ref<HTMLElement | null>(null);
const ganttInstance = ref<ApexGantt | null>(null);

// compute container styles
const containerStyle = computed(
  (): CSSProperties => ({
    width: typeof props.width === "number" ? `${props.width}px` : props.width,
    height:
      typeof props.height === "number" ? `${props.height}px` : props.height,
    ...props.style,
  })
);

// compute full options
const fullOptions = computed(
  (): GanttUserOptions => ({
    series: props.tasks,
    viewMode: props.viewMode,
    theme: props.theme,
    width: props.width,
    height: props.height,
    ...props.options,
  })
);

// event listeners
const setupEventListeners = (): void => {
  if (!chartContainer.value) return;

  const container = chartContainer.value;

  container.addEventListener(GanttEvents.TASK_UPDATE, ((
    e: CustomEvent<TaskUpdateEventDetail>
  ) => {
    emit("taskUpdate", e.detail);
  }) as EventListener);

  container.addEventListener(GanttEvents.TASK_UPDATE_SUCCESS, ((
    e: CustomEvent<TaskUpdateSuccessEventDetail>
  ) => {
    emit("taskUpdateSuccess", e.detail);
  }) as EventListener);

  container.addEventListener(GanttEvents.TASK_VALIDATION_ERROR, ((
    e: CustomEvent<TaskValidationErrorEventDetail>
  ) => {
    emit("taskValidationError", e.detail);
  }) as EventListener);

  container.addEventListener(GanttEvents.TASK_UPDATE_ERROR, ((
    e: CustomEvent<TaskUpdateErrorEventDetail>
  ) => {
    emit("taskUpdateError", e.detail);
  }) as EventListener);

  container.addEventListener(GanttEvents.TASK_DRAGGED, ((
    e: CustomEvent<TaskDraggedEventDetail>
  ) => {
    emit("taskDragged", e.detail);
  }) as EventListener);

  container.addEventListener(GanttEvents.TASK_RESIZED, ((
    e: CustomEvent<TaskResizedEventDetail>
  ) => {
    emit("taskResized", e.detail);
  }) as EventListener);
};

// initialize chart
const initChart = (): void => {
  if (!chartContainer.value) return;

  // cleanup existing instance
  if (ganttInstance.value) {
    ganttInstance.value.destroy();
  }

  ganttInstance.value = new ApexGantt(chartContainer.value, fullOptions.value);
  ganttInstance.value.render();
  setupEventListeners();
};

// expose public methods
const update = (options: Partial<GanttUserOptions>): void => {
  ganttInstance.value?.update({
    ...fullOptions.value,
    ...options,
  });
};

const updateTask = (taskId: string, taskData: Partial<TaskInput>): void => {
  ganttInstance.value?.updateTask(taskId, taskData);
};

const zoomIn = (): void => {
  ganttInstance.value?.zoomIn();
};

const zoomOut = (): void => {
  ganttInstance.value?.zoomOut();
};

const destroy = (): void => {
  ganttInstance.value?.destroy();
  ganttInstance.value = null;
};

const getInstance = (): ApexGantt | null => {
  return ganttInstance.value as ApexGantt | null;
};

defineExpose<ApexGanttChartExpose>({
  update,
  updateTask,
  zoomIn,
  zoomOut,
  destroy,
  getInstance,
});

// watch for prop changes and re-render
watch(
  () => props.tasks,
  () => {
    update({ series: props.tasks });
  },
  { deep: true }
);

watch(
  () => props.viewMode,
  (newMode: ViewMode) => {
    update({ viewMode: newMode });
  }
);

watch(
  () => props.theme,
  (newTheme: ThemeMode) => {
    update({ theme: newTheme });
  }
);

watch(
  () => props.options,
  (newOptions: Partial<GanttUserOptions> | undefined) => {
    update(newOptions || {});
  },
  { deep: true }
);

// lifecycle hooks
onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  destroy();
});
</script>
