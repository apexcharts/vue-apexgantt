// main component
export { default as ApexGanttChart } from "./components/ApexGanttChart.vue";

// component types
export type {
  ApexGanttChartProps,
  ApexGanttChartEmits,
  ApexGanttChartExpose,
} from "./components/ApexGanttChart.vue";

// composables
export { useGanttData } from "./composables/useGanttData";

// utilities
export { setApexGanttLicense } from "./utils/license";

// re-export types from apexgantt for convenience
export type {
  Annotation,
  GanttUserOptions,
  TaskInput,
  TaskType,
  ThemeMode,
  GanttTheme,
  ParsingConfig,
  ParsingValue,
  TaskUpdateEventDetail,
  TaskValidationErrorEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskUpdateErrorEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
} from "apexgantt";

export {
  ViewMode,
  ColumnKey,
  GanttEvents,
  LightTheme,
  DarkTheme,
  getTheme,
  DataParser,
} from "apexgantt";
