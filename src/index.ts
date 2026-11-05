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

// Type-only re-exports from apexgantt (zero runtime cost)
export type {
  // Options
  GanttUserOptions,
  GanttTheme,
  ThemeMode,

  // Task model
  TaskInput,
  Task,
  TaskDependency,
  DependencyType,
  BaselineInput,
  BaselineOptions,
  ParsingConfig,
  ParsingValue,

  // Annotations
  Annotation,
  Orientation,

  // Toolbar
  ToolbarItem,
  ToolbarButton,
  ToolbarSelect,
  ToolbarSeparator,
  ToolbarContext,
  ColumnListItem,

  // Typed event map and detail interfaces (one per emitted event)
  GanttEventMap,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskUpdateErrorEventDetail,
  TaskValidationErrorEventDetail,
  TaskAddedEventDetail,
  TaskDeletedEventDetail,
  TaskMovedEventDetail,
  DependencyChangeEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  TaskProgressChangedEventDetail,
  SelectionChangeEventDetail,
  DependencyArrowUpdateDetail,
  HistoryChangeEventDetail,
  SortChangeEventDetail,
  FilterChangeEventDetail,
  GroupChangeEventDetail,
  ColumnResizeEventDetail,
  ColumnReorderEventDetail,

  // apexgantt 3.20 API types
  DependencyLink,
  TaskUpdateSource,
  GanttUpdateOptions,
  ScrollToTaskOptions,
  UpdateTaskOptions,
  TooltipTemplate,
  TooltipTemplateContext,
} from "apexgantt";

// Value re-exports (needed at runtime)
export {
  ApexGantt,
  TaskType,
  ColumnKey,
  ColumnList,
  GanttEvents,
  LightTheme,
  DarkTheme,
  getTheme,
  DataParser,
} from "apexgantt";
