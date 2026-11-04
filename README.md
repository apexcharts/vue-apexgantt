# Vue Gantt Chart Component — vue-apexgantt

A Vue 3 Gantt chart component for interactive project timelines. Render tasks, dependencies, milestones, critical path, baselines, and annotations as a fully drag-and-drop schedule — with reactive props, typed emits, a `useGanttData` composable, template refs, and Composition API support.

📚 **Documentation:** [apexcharts.com/apexgantt/docs](https://apexcharts.com/apexgantt/docs/) · 🎬 **Live demos:** [apexcharts.com/apexgantt/demos](https://apexcharts.com/apexgantt/demos/) · 📦 **npm:** [vue-apexgantt](https://www.npmjs.com/package/vue-apexgantt) · 📖 **Guide:** [Vue Gantt Chart](https://apexcharts.com/vue-gantt-chart/) · 🌐 **Part of** [ApexGantt](https://apexcharts.com/apexgantt/) — one Gantt component for JavaScript, React, Angular, and Vue.

## Installation

```bash
npm install vue-apexgantt apexgantt
# or
yarn add vue-apexgantt apexgantt
# or
pnpm add vue-apexgantt apexgantt
```

## Licence Setup

ApexGantt is included in the Premium plan and above and has no free tier. Without a key it renders with a trial watermark for evaluation. Plans and keys are at [apexcharts.com/pricing](https://apexcharts.com/pricing/).

Set your licence key once at application start, before the first chart renders:

```ts
// main.ts
import { createApp } from 'vue';
import { setApexGanttLicense } from 'vue-apexgantt';
import App from './App.vue';

setApexGanttLicense('your-license-key-here');

createApp(App).mount('#app');
```

A key set after charts are on the page still removes the watermark from them; setting it first avoids a one-frame watermark.

## Quick Start

```vue
<template>
  <ApexGanttChart
    :tasks="tasks"
    :pixels-per-day="25.7"
    height="500px"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ApexGanttChart } from 'vue-apexgantt';
import type { TaskInput } from 'vue-apexgantt';

const tasks = ref<TaskInput[]>([
  {
    id: 'task-1',
    name: 'Project Planning',
    startTime: '01-01-2024',
    endTime: '01-08-2024',
    progress: 75,
  },
  {
    id: 'task-2',
    name: 'Development',
    startTime: '01-09-2024',
    endTime: '01-20-2024',
    progress: 40,
    dependency: 'task-1',
  },
]);
</script>
```

`pixelsPerDay` sets the zoom: `80` shows days, `25.7` weeks, `4.9` months, `1.6` quarters and `0.5` years. Any value in between works, and the header levels follow. Leave it out and the chart fits its zoom to the data span when it first renders.

## API Reference

### Component Props

| Prop           | Type                        | Default   | Description |
| -------------- | --------------------------- | --------- | ----------- |
| `tasks`        | `TaskInput[]`               | Required  | Tasks to display. A change replaces the chart's data (see [Prop changes and edits](#prop-changes-and-edits)) |
| `options`      | `Partial<GanttUserOptions>` | `{}`      | Any other ApexGantt option. Keys set here win over the matching props |
| `width`        | `string \| number`          | `'100%'`  | Chart width. A number is read as pixels |
| `height`       | `string \| number`          | `undefined` | Chart height. A number is read as pixels. Leave it out to size the chart from CSS on the component; with neither, it is 500px tall |
| `pixelsPerDay` | `number`                    | auto-fit  | Continuous zoom level (pixels per day). Header tier is auto-picked: `0.5` ≈ year, `1.6` ≈ quarter, `4.9` ≈ month, `25.7` ≈ week, `80` = day. When omitted, the chart fits its zoom to the data span on first render. Sent only when it changes to a number, so a zoom made from the toolbar survives other prop changes, and unsetting it keeps the current zoom |
| `theme`        | `'light' \| 'dark'`         | `'light'` | Colour theme |
| `className`    | `string`                    | `''`      | Class added to the chart container |
| `style`        | `CSSProperties`             | `{}`      | Inline styles added to the chart container |

### Component Events

The component re-emits every ApexGantt event under the core's name, with the core's detail object as the only argument. In a template, listen with the kebab-case form (`@task-update-success`). Every detail type is exported from `vue-apexgantt`.

| Event                   | Template listener          | Detail type                      | Fires when |
| ----------------------- | -------------------------- | -------------------------------- | ---------- |
| `taskUpdate`            | `@task-update`             | `TaskUpdateEventDetail`          | A task edit is committed, once per edit on every path: drag, resize, progress handle, task dialog, inline edit, keyboard and `updateTask()`. `detail.source` names the path. Not fired for undo/redo or a `silent` update |
| `taskUpdateSuccess`     | `@task-update-success`     | `TaskUpdateSuccessEventDetail`   | That edit completes. Same paths and `source` as `taskUpdate` |
| `taskValidationError`   | `@task-validation-error`   | `TaskValidationErrorEventDetail` | The task form fails validation |
| `taskUpdateError`       | `@task-update-error`       | `TaskUpdateErrorEventDetail`     | A task update fails |
| `taskAdded`             | `@task-added`              | `TaskAddedEventDetail`           | A task is added |
| `taskDeleted`           | `@task-deleted`            | `TaskDeletedEventDetail`         | A task is deleted (one event per removed task) |
| `taskMoved`             | `@task-moved`              | `TaskMovedEventDetail`           | A task is moved to a different parent |
| `dependencyAdded`       | `@dependency-added`        | `DependencyChangeEventDetail`    | A dependency link is added |
| `dependencyRemoved`     | `@dependency-removed`      | `DependencyChangeEventDetail`    | A dependency link is removed |
| `taskDragged`           | `@task-dragged`            | `TaskDraggedEventDetail`         | A bar is moved along the timeline and the change is accepted |
| `taskResized`           | `@task-resized`            | `TaskResizedEventDetail`         | A bar is resized and the change is accepted |
| `taskProgressChanged`   | `@task-progress-changed`   | `TaskProgressChangedEventDetail` | Progress is changed with the in-bar handle and the change is accepted |
| `selectionChange`       | `@selection-change`        | `SelectionChangeEventDetail`     | The selected tasks change (needs `enableSelection`) |
| `dependencyArrowUpdate` | `@dependency-arrow-update` | `DependencyArrowUpdateDetail`    | Internal arrow redraw signal, not a change notification. Use `dependencyAdded` and `dependencyRemoved` for link changes |
| `historyChange`         | `@history-change`          | `HistoryChangeEventDetail`       | The undo/redo history changes (record, undo, redo or clear) |
| `sortChange`            | `@sort-change`             | `SortChangeEventDetail`          | The active sort changes |
| `filterChange`          | `@filter-change`           | `FilterChangeEventDetail`        | The active filter changes |
| `groupChange`           | `@group-change`            | `GroupChangeEventDetail`         | The active grouping changes |
| `columnResize`          | `@column-resize`           | `ColumnResizeEventDetail`        | A task-list column is resized |
| `columnReorder`         | `@column-reorder`          | `ColumnReorderEventDetail`       | Task-list columns are reordered |

A drag fires `taskDragged` and also `taskUpdate` and `taskUpdateSuccess`, so an app that saves on both `taskDragged` and `taskUpdateSuccess` saves the same drag twice. Saving on `taskUpdateSuccess` alone covers every way a task is edited. To save the whole chart, links included, read it from the instance instead (see [Saving the Chart](#saving-the-chart)).

### Event Handling Example

```vue
<template>
  <ApexGanttChart
    :tasks="tasks"
    @task-dragged="handleTaskDragged"
    @task-resized="handleTaskResized"
    @task-update-success="handleTaskUpdateSuccess"
  />
</template>

<script setup lang="ts">
import type { 
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  TaskUpdateSuccessEventDetail 
} from 'vue-apexgantt';

const handleTaskDragged = (detail: TaskDraggedEventDetail) => {
  console.log('Task dragged:', detail);
  // save to backend, etc.
};

const handleTaskResized = (detail: TaskResizedEventDetail) => {
  console.log('Task resized:', detail);
};

const handleTaskUpdateSuccess = (detail: TaskUpdateSuccessEventDetail) => {
  console.log('Task updated:', detail);
};
</script>
```

### Exposed Methods

A template ref gives you these methods (typed as `ApexGanttChartExpose`):

| Method | Description |
| ------ | ----------- |
| `update(options)` | Passes `options` (`Partial<GanttUserOptions>`) straight to the chart's `update()`. Props are not merged in. Leave out `series` and `parsing` to keep the chart's data, edits included |
| `updateTask(taskId, updates, options?)` | Updates one task, with the same arguments as the chart's `updateTask()`. `{ silent: true }` skips `taskUpdate` and `taskUpdateSuccess`, for rollbacks and server echoes |
| `zoomIn()` | Zooms in one step |
| `zoomOut()` | Zooms out one step |
| `destroy()` | Removes the event listeners and destroys the chart. The component does this itself when it unmounts |
| `getInstance()` | The `ApexGantt` instance, or `null` before mount and after `destroy()`. Use it for every method not wrapped here: `getTask`, `getTasks`, `getDependencies`, `addTask`, `deleteTask`, `moveTask`, `expandTask`, `collapseTask`, `scrollToTask`, `undo`, `redo`, `sort`, `filter`, `groupBy`, `getState`, `setState`, `exportChart` and the rest |

```vue
<template>
  <ApexGanttChart
    ref="ganttRef"
    :tasks="tasks"
  />

  <button @click="ganttRef?.zoomIn()">Zoom In</button>
  <button @click="ganttRef?.zoomOut()">Zoom Out</button>
  <button @click="showTask('task-2')">Show task 2</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ApexGanttChart } from 'vue-apexgantt';

const ganttRef = ref<InstanceType<typeof ApexGanttChart> | null>(null);

const showTask = (id: string) => {
  // opens collapsed parents, then scrolls the row into view
  ganttRef.value?.getInstance()?.scrollToTask(id);
};
</script>
```

### Prop Changes and Edits

Edits made in the chart (dragging, resizing, the task dialog, inline editing, the keyboard, `updateTask`, `addTask`, `deleteTask`, `moveTask` and link changes) are stored in the chart. The component sends only what changed:

| Change | Sent to the chart's `update()` |
| ------ | ------------------------------ |
| `tasks` (a new array, or a change inside it) | `{ series }`, which replaces the chart's data: edits made in the chart are discarded and undo history is cleared |
| `pixelsPerDay` | `{ pixelsPerDay }`, or nothing when it is unset (the chart keeps its zoom) |
| `theme` | `{ theme }` plus your `options` (without `series`, `parsing` and `pixelsPerDay`). From apexgantt 3.20.0 a theme switch resets the colours the theme owns (`barBackgroundColor`, `rowBackgroundColors` and the rest) to the new theme's defaults unless the same update passes them, so resending `options` keeps your custom colours |
| `width`, `height` | `{ width }`, `{ height }` |
| `options` | Only the keys whose values changed. A key you remove falls back to the matching prop, or to the chart's default |

Any update that leaves out `series` and `parsing` keeps the chart's data, edits included, and keeps a zoom made from the toolbar unless `pixelsPerDay` is part of it.

To save task edits as they happen, listen to `taskUpdateSuccess` (and `taskAdded`, `taskDeleted` and `taskMoved` for structural changes). Writing them back into the array bound to `tasks` sends the whole array again as `series`, which re-renders the chart and clears undo history, so change `tasks` when you mean to replace the data.

### Saving the Chart

To save the chart as the user left it, read it from the instance: `getTasks()` returns every task with its edits, and `getDependencies()` returns every link as it is now (`{ fromId, toId, type, lag }`), including links added with `addDependency()` or drawn by the user, less any removed. A task's `dependency` holds only the link it was loaded with, so save both rather than rebuilding the links from `dependencyAdded` and `dependencyRemoved`. Both need apexgantt 3.20.0.

```ts
import type { DependencyLink } from 'apexgantt';

const save = () => {
  const gantt = ganttRef.value?.getInstance();
  if (gantt) saveChart({ tasks: gantt.getTasks(), links: gantt.getDependencies() });
};

// once the saved tasks are rendered (bound to `tasks`)
const restoreLinks = (links: DependencyLink[]) => {
  const gantt = ganttRef.value?.getInstance();
  if (!gantt) return;
  for (const { fromId, toId, type, lag } of links) {
    // the links the tasks carry are already there and are not accepted again
    if (gantt.canAddDependency(fromId, toId).ok) gantt.addDependency(fromId, toId, { type, lag });
  }
  gantt.clearHistory(); // so the restore cannot be undone
};
```

## Composables

### useGanttData

Parse external data into ApexGantt format:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ApexGanttChart, useGanttData } from 'vue-apexgantt';
import type { ParsingConfig } from 'vue-apexgantt';

// raw API data
const apiData = ref([
  {
    task_id: 'T1',
    task_name: 'Design Phase',
    start_date: '01-01-2024',
    end_date: '01-15-2024',
    completion: 0.75,
  },
  // ...more tasks
]);

// parsing configuration
const parsingConfig: ParsingConfig = {
  id: 'task_id',
  name: 'task_name',
  startTime: 'start_date',
  endTime: 'end_date',
  progress: {
    key: 'completion',
    transform: (value) => Number(value) * 100, // convert to percentage
  },
};

// parse data
const tasks = useGanttData({
  data: apiData,
  parsing: parsingConfig,
});
</script>

<template>
  <ApexGanttChart :tasks="tasks" />
</template>
```

### Nested Objects & Transforms

Use dot notation for nested properties:

```ts
const nestedData = ref([
  {
    project: {
      task: { id: 'T1', title: 'Design' },
      dates: { start: '01-01-2024', end: '01-15-2024' },
      status: { completion: 0.75 },
    },
  },
]);

const tasks = useGanttData({
  data: nestedData,
  parsing: {
    id: 'project.task.id',
    name: 'project.task.title',
    startTime: 'project.dates.start',
    endTime: 'project.dates.end',
    progress: {
      key: 'project.status.completion',
      transform: (value) => Number(value) * 100,
    },
  },
});
```

## Advanced Usage

### Custom Options

```vue
<template>
  <ApexGanttChart
    :tasks="tasks"
    :options="ganttOptions"
    :pixels-per-day="25.7"
    theme="dark"
  />
</template>

<script setup lang="ts">
import type { GanttUserOptions } from 'vue-apexgantt';

const ganttOptions: Partial<GanttUserOptions> = {
  enableTaskDrag: true,
  enableTaskResize: true,
  enableTaskEdit: true,
  barBackgroundColor: '#537CFA',
  rowBackgroundColors: ['#FFFFFF', '#F8F9FA'],
  // ...more options
};
</script>
```

### Dynamic Zoom

```vue
<template>
  <div>
    <select v-model.number="pixelsPerDay">
      <option :value="80">Day</option>
      <option :value="25.7">Week</option>
      <option :value="4.9">Month</option>
      <option :value="1.6">Quarter</option>
      <option :value="0.5">Year</option>
    </select>
    
    <ApexGanttChart
      :tasks="tasks"
      :pixels-per-day="pixelsPerDay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pixelsPerDay = ref(4.9);
</script>
```

### Theme Switching

```vue
<template>
  <div>
    <button @click="toggleTheme">
      {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
    </button>
    
    <ApexGanttChart
      :tasks="tasks"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ThemeMode } from 'vue-apexgantt';

const theme = ref<ThemeMode>('light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>
```

Switching the theme keeps the chart's data, edits and zoom.

## TypeScript Support

The package includes full TypeScript definitions. Import types as needed:

```ts
import type {
  // component
  ApexGanttChartProps,
  ApexGanttChartEmits,
  ApexGanttChartExpose,

  // options and tasks
  GanttUserOptions,
  ThemeMode,
  TaskInput,
  Task,
  TaskType,
  ParsingConfig,

  // event details, one per event in the table above
  TaskUpdateEventDetail,
  TaskDraggedEventDetail,
  HistoryChangeEventDetail,
  // ...more types
} from 'vue-apexgantt';
```

## Development

### Setup

```bash
# install dependencies
npm install

# run demo app
npm run dev

# build library
npm run build

# type check
npm run type-check
```

### Testing Examples Locally

The demo app is included in the repository:

```bash
npm install
npm run dev
```

The demo app will be available at `http://localhost:5173` and includes:

- **Basic Example**: Simple Gantt with zoom controls
- **Advanced Example**: Zoom level select, theme toggle, interaction controls
- **Events Example**: Interactive testing of drag, resize, and update events
- **Data Parsing Example**: Using `useGanttData` with nested data structures

## Browser Support

- Vue 3.3+ (Vue 2 is not supported)
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2020+ support

## Related

- [**ApexGantt — multi-framework hub**](https://apexcharts.com/apexgantt/) — overview across all supported frameworks
- **Other ApexGantt wrappers:** [`react-apexgantt`](https://www.npmjs.com/package/react-apexgantt) · [`ngx-apexgantt`](https://www.npmjs.com/package/ngx-apexgantt) (Angular) · [`apexgantt`](https://www.npmjs.com/package/apexgantt) (JavaScript core)
- **All ApexGantt demos:** [apexcharts.com/apexgantt/demos](https://apexcharts.com/apexgantt/demos/)

## License

See [LICENSE](LICENSE.md) for details. Commercial licenses available at [apexcharts.com/pricing](https://apexcharts.com/pricing/).

## About

A Vue 3 wrapper for [ApexGantt](https://github.com/apexcharts/apexgantt) — a JavaScript library to create interactive Gantt charts.
