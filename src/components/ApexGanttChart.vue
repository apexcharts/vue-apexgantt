<template>
  <div ref="chartContainer" :class="className" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import {
  ref,
  shallowRef,
  toRaw,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import type { CSSProperties } from "vue";
import ApexGantt, { GanttEvents } from "apexgantt";
import type {
  GanttUserOptions,
  GanttEventMap,
  TaskInput,
  ThemeMode,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskValidationErrorEventDetail,
  TaskUpdateErrorEventDetail,
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
} from "apexgantt";
import { diffOptions, snapshot } from "../utils/diff";

export interface ApexGanttChartProps {
  /**
   * The tasks to draw. A new array, or a change inside this one, is sent to
   * the chart as `series`, which replaces its data and clears undo history.
   */
  tasks: TaskInput[];
  /**
   * Any other ApexGantt option. When it changes, only the keys whose values
   * changed are sent to the chart. Keys set here win over the matching props.
   */
  options?: Partial<GanttUserOptions>;
  /** Chart width. A number is read as pixels. @default '100%' */
  width?: string | number;
  /**
   * Chart height. A number is read as pixels. Leave it out to size the chart
   * from CSS on the component (apexgantt 3.20+ fills a container that has a
   * height of its own); with neither, the chart is 500px tall.
   */
  height?: string | number;
  /**
   * Continuous zoom level, in pixels-per-day. The header tier
   * (year/quarter/month/week/day/hour/minute) is auto-picked from this value.
   * Reference points: `0.5` ≈ year, `1.6` ≈ quarter, `4.9` ≈ month,
   * `25.7` ≈ week, `80` = day. Leave it out and the chart fits its zoom to
   * the data span on first render. Sent to the chart only when this prop
   * changes to a number, so a zoom made from the toolbar survives other prop
   * changes, and unsetting it keeps the current zoom.
   */
  pixelsPerDay?: number;
  /** Colour theme. @default 'light' */
  theme?: ThemeMode;
  /** Class added to the chart container. @default '' */
  className?: string;
  /** Inline styles added to the chart container. */
  style?: CSSProperties;
}

export interface ApexGanttChartEmits {
  /** A task edit was committed. */
  (e: "taskUpdate", detail: TaskUpdateEventDetail): void;
  /** A task edit completed. */
  (e: "taskUpdateSuccess", detail: TaskUpdateSuccessEventDetail): void;
  /** The task form failed validation. */
  (e: "taskValidationError", detail: TaskValidationErrorEventDetail): void;
  /** A task edit failed. */
  (e: "taskUpdateError", detail: TaskUpdateErrorEventDetail): void;
  /** A task was added. */
  (e: "taskAdded", detail: TaskAddedEventDetail): void;
  /** A task was deleted (one event per removed task). */
  (e: "taskDeleted", detail: TaskDeletedEventDetail): void;
  /** A task was moved to a new parent. */
  (e: "taskMoved", detail: TaskMovedEventDetail): void;
  /** A dependency link was added. */
  (e: "dependencyAdded", detail: DependencyChangeEventDetail): void;
  /** A dependency link was removed. */
  (e: "dependencyRemoved", detail: DependencyChangeEventDetail): void;
  /** A task bar was moved along the timeline. */
  (e: "taskDragged", detail: TaskDraggedEventDetail): void;
  /** A task bar was resized. */
  (e: "taskResized", detail: TaskResizedEventDetail): void;
  /** A task's progress was changed with the in-bar handle. */
  (e: "taskProgressChanged", detail: TaskProgressChangedEventDetail): void;
  /** The set of selected tasks changed. */
  (e: "selectionChange", detail: SelectionChangeEventDetail): void;
  /** Internal arrow redraw signal; not a change notification. */
  (e: "dependencyArrowUpdate", detail: DependencyArrowUpdateDetail): void;
  /** The undo/redo history changed. */
  (e: "historyChange", detail: HistoryChangeEventDetail): void;
  /** The active sort changed. */
  (e: "sortChange", detail: SortChangeEventDetail): void;
  /** The active filter changed. */
  (e: "filterChange", detail: FilterChangeEventDetail): void;
  /** The active grouping changed. */
  (e: "groupChange", detail: GroupChangeEventDetail): void;
  /** A task-list column was resized. */
  (e: "columnResize", detail: ColumnResizeEventDetail): void;
  /** Task-list columns were reordered. */
  (e: "columnReorder", detail: ColumnReorderEventDetail): void;
}

export interface ApexGanttChartExpose {
  /**
   * Passes `options` straight to the chart's `update()`. Props are not merged
   * in. Leaving out `series` and `parsing` keeps the chart's current data,
   * edits included (apexgantt 3.20.0 and later).
   */
  update: (options: Partial<GanttUserOptions>) => void;
  /** Updates one task. Takes the same arguments as the chart's `updateTask()`. */
  updateTask: (...args: Parameters<ApexGantt["updateTask"]>) => void;
  /** Zooms in one step. */
  zoomIn: () => void;
  /** Zooms out one step. */
  zoomOut: () => void;
  /** Removes the event listeners and destroys the chart. */
  destroy: () => void;
  /** The ApexGantt instance, for every method not wrapped here. */
  getInstance: () => ApexGantt | null;
}

type GanttEventName = (typeof GanttEvents)[keyof typeof GanttEvents];

type EventDetail<K extends keyof GanttEventMap> =
  GanttEventMap[K] extends CustomEvent<infer D> ? D : never;

/** Options the component also supplies from its props. */
type PropBackedKey = "series" | "pixelsPerDay" | "theme" | "width" | "height";

const props = withDefaults(defineProps<ApexGanttChartProps>(), {
  width: "100%",
  // no pixelsPerDay default: the core fits the zoom to the data when it is left out
  theme: "light" as ThemeMode,
  className: "",
});

const emit = defineEmits<ApexGanttChartEmits>();

const chartContainer = ref<HTMLElement | null>(null);
// shallow: a deep ref would wrap the chart instance in a reactive proxy
const ganttInstance = shallowRef<ApexGantt | null>(null);

/**
 * One row per core event, re-emitted under the same name. The mapped type
 * fails the type-check if a row is missing for an event in `GanttEvents` or
 * names one that is not there, and each row's `emit` call is checked against
 * `ApexGanttChartEmits`.
 */
const EVENT_TABLE: { [K in GanttEventName]: (detail: EventDetail<K>) => void } = {
  taskUpdate: (detail) => emit("taskUpdate", detail),
  taskUpdateSuccess: (detail) => emit("taskUpdateSuccess", detail),
  taskValidationError: (detail) => emit("taskValidationError", detail),
  taskUpdateError: (detail) => emit("taskUpdateError", detail),
  taskAdded: (detail) => emit("taskAdded", detail),
  taskDeleted: (detail) => emit("taskDeleted", detail),
  taskMoved: (detail) => emit("taskMoved", detail),
  dependencyAdded: (detail) => emit("dependencyAdded", detail),
  dependencyRemoved: (detail) => emit("dependencyRemoved", detail),
  taskDragged: (detail) => emit("taskDragged", detail),
  taskResized: (detail) => emit("taskResized", detail),
  taskProgressChanged: (detail) => emit("taskProgressChanged", detail),
  selectionChange: (detail) => emit("selectionChange", detail),
  dependencyArrowUpdate: (detail) => emit("dependencyArrowUpdate", detail),
  historyChange: (detail) => emit("historyChange", detail),
  sortChange: (detail) => emit("sortChange", detail),
  filterChange: (detail) => emit("filterChange", detail),
  groupChange: (detail) => emit("groupChange", detail),
  columnResize: (detail) => emit("columnResize", detail),
  columnReorder: (detail) => emit("columnReorder", detail),
};

// compute container styles
const containerStyle = computed(
  (): CSSProperties => ({
    width: typeof props.width === "number" ? `${props.width}px` : props.width,
    // Left unset so a height from CSS reaches the chart, which fills it.
    ...(props.height === undefined
      ? {}
      : {
          height:
            typeof props.height === "number"
              ? `${props.height}px`
              : props.height,
        }),
    ...props.style,
  }),
);

// event listeners, kept so they can be removed again
let removeListeners: (() => void) | null = null;

const addListeners = (container: HTMLElement): void => {
  removeListeners?.();
  const names = Object.keys(EVENT_TABLE) as GanttEventName[];
  const listeners = names.map((name) => {
    const forward = EVENT_TABLE[name] as (detail: unknown) => void;
    const listener = (event: Event): void => {
      forward((event as CustomEvent).detail);
    };
    container.addEventListener(name, listener);
    return [name, listener] as const;
  });
  removeListeners = () => {
    for (const [name, listener] of listeners) {
      container.removeEventListener(name, listener);
    }
    removeListeners = null;
  };
};

// the last `options` sent, to work out what changed
let lastOptions: Partial<GanttUserOptions> = {};

const propValues = (): Pick<GanttUserOptions, PropBackedKey> => ({
  series: toRaw(props.tasks),
  // left out when unset, so the core auto-fits the zoom on first render
  ...(props.pixelsPerDay === undefined
    ? {}
    : { pixelsPerDay: props.pixelsPerDay }),
  theme: props.theme,
  width: props.width,
  height: props.height,
});

/**
 * `options` without the keys that replace data (`series`, `parsing`), reset
 * the zoom (`pixelsPerDay`) or pick the theme.
 */
const carriedOptions = (): Partial<GanttUserOptions> => {
  const {
    series: _series,
    parsing: _parsing,
    pixelsPerDay: _pixelsPerDay,
    theme: _theme,
    ...rest
  } = toRaw(props.options ?? {});
  return rest;
};

// apexgantt 3.20.0 types update() as taking a Partial; older type files
// still require `series`, hence the cast
const send = (delta: Partial<GanttUserOptions>): void => {
  const gantt = ganttInstance.value;
  if (!gantt || Object.keys(delta).length === 0) return;
  gantt.update(delta as GanttUserOptions);
};

// initialize chart
const initChart = (): void => {
  if (!chartContainer.value) return;

  // cleanup existing instance
  destroy();

  lastOptions = snapshot(props.options ?? {});
  ganttInstance.value = new ApexGantt(chartContainer.value, {
    ...propValues(),
    ...toRaw(props.options ?? {}),
  });
  ganttInstance.value.render();
  addListeners(chartContainer.value);
};

// expose public methods
const update = (options: Partial<GanttUserOptions>): void => {
  ganttInstance.value?.update(options as GanttUserOptions);
};

const updateTask = (...args: Parameters<ApexGantt["updateTask"]>): void => {
  ganttInstance.value?.updateTask(...args);
};

const zoomIn = (): void => {
  ganttInstance.value?.zoomIn();
};

const zoomOut = (): void => {
  ganttInstance.value?.zoomOut();
};

const destroy = (): void => {
  removeListeners?.();
  ganttInstance.value?.destroy();
  ganttInstance.value = null;
};

const getInstance = (): ApexGantt | null => ganttInstance.value;

defineExpose<ApexGanttChartExpose>({
  update,
  updateTask,
  zoomIn,
  zoomOut,
  destroy,
  getInstance,
});

// each watcher sends only what changed

watch(
  () => props.tasks,
  (tasks) => {
    send({ series: toRaw(tasks) });
  },
  { deep: true },
);

// unsetting the prop sends nothing, so the chart keeps its current zoom
watch(
  () => props.pixelsPerDay,
  (pixelsPerDay) => {
    if (pixelsPerDay !== undefined) send({ pixelsPerDay });
  },
);

// A theme change resets every option the core does not carry over to the new
// theme's default, so the user's options go with it (data and zoom stay put).
watch(
  () => props.theme,
  (theme) => {
    send({ ...carriedOptions(), theme });
  },
);

// post: the container has its new size by the time the chart measures it
watch(
  () => props.width,
  (width) => {
    send({ width });
  },
  { flush: "post" },
);

watch(
  () => props.height,
  (height) => {
    send({ height });
  },
  { flush: "post" },
);

watch(
  () => props.options,
  (options) => {
    const next = options ?? {};
    const delta = diffOptions(lastOptions, next) as Partial<GanttUserOptions>;
    lastOptions = snapshot(next);

    // a key dropped from `options` falls back to its prop
    const fallback = propValues();
    for (const key of Object.keys(delta) as (keyof GanttUserOptions)[]) {
      if (delta[key] === undefined && key in fallback) {
        Object.assign(delta, { [key]: fallback[key as PropBackedKey] });
      }
    }

    send("theme" in delta ? { ...carriedOptions(), ...delta } : delta);
  },
  { deep: true },
);

// lifecycle hooks
onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  destroy();
});
</script>
