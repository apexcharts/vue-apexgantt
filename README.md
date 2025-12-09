# Vue ApexGantt

Vue 3 wrapper for [ApexGantt](https://github.com/apexcharts/apexgantt) - A JavaScript library to create interactive Gantt charts.

## Installation

```bash
npm install vue-apexgantt apexgantt
# or
yarn add vue-apexgantt apexgantt
# or
pnpm add vue-apexgantt apexgantt
```

## License Setup

If you have a commercial license, set it once at app initialization before rendering any charts:

```ts
import { setApexGanttLicense } from 'vue-apexgantt';

// call this at the top of your app
setApexGanttLicense('your-license-key-here');
```

**Example with Vue app entry point:**

```ts
// main.ts
import { createApp } from 'vue';
import { setApexGanttLicense } from 'vue-apexgantt';
import App from './App.vue';

// set license before rendering
setApexGanttLicense('your-license-key-here');

createApp(App).mount('#app');
```

## Quick Start

```vue
<template>
  <ApexGanttChart
    :tasks="tasks"
    view-mode="week"
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

## API Reference

### Component Props

| Prop        | Type                       | Default   | Description                                          |
| ----------- | -------------------------- | --------- | ---------------------------------------------------- |
| `tasks`     | `TaskInput[]`              | Required  | Array of tasks to display                            |
| `options`   | `Partial<GanttUserOptions>`| `{}`      | ApexGantt configuration options                      |
| `width`     | `string \| number`         | `'100%'`  | Chart width                                          |
| `height`    | `string \| number`         | `'500px'` | Chart height                                         |
| `viewMode`  | `ViewMode`                 | `'month'` | View mode: 'day', 'week', 'month', 'quarter', 'year' |
| `theme`     | `'light' \| 'dark'`        | `'light'` | Color theme                                          |
| `className` | `string`                   | `''`      | CSS class name                                       |
| `style`     | `CSSProperties`            | `{}`      | Inline styles                                        |

### Component Events

| Event                 | Payload Type                      | Description                        |
| --------------------- | --------------------------------- | ---------------------------------- |
| `taskUpdate`          | `TaskUpdateEventDetail`           | Fired when a task is being updated |
| `taskUpdateSuccess`   | `TaskUpdateSuccessEventDetail`    | Fired after successful task update |
| `taskValidationError` | `TaskValidationErrorEventDetail`  | Fired when validation fails        |
| `taskUpdateError`     | `TaskUpdateErrorEventDetail`      | Fired when update fails            |
| `taskDragged`         | `TaskDraggedEventDetail`          | Fired when a task is dragged       |
| `taskResized`         | `TaskResizedEventDetail`          | Fired when a task is resized       |

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

### Template Ref Methods

Access chart methods using template ref:

```vue
<template>
  <ApexGanttChart
    ref="ganttRef"
    :tasks="tasks"
  />
  
  <button @click="handleZoomIn">Zoom In</button>
  <button @click="handleZoomOut">Zoom Out</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ApexGanttChart } from 'vue-apexgantt';

const ganttRef = ref<InstanceType<typeof ApexGanttChart> | null>(null);

const handleZoomIn = () => {
  ganttRef.value?.zoomIn();
};

const handleZoomOut = () => {
  ganttRef.value?.zoomOut();
};

// available methods:
// ganttRef.value?.update(options)
// ganttRef.value?.updateTask(taskId, data)
// ganttRef.value?.zoomIn()
// ganttRef.value?.zoomOut()
// ganttRef.value?.destroy()
// ganttRef.value?.getInstance() // get raw ApexGantt instance
</script>
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
    transform: (value) => value * 100, // convert to percentage
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
      transform: (value) => value * 100,
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
    view-mode="week"
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

### Dynamic View Mode

```vue
<template>
  <div>
    <select v-model="viewMode">
      <option value="day">Day</option>
      <option value="week">Week</option>
      <option value="month">Month</option>
      <option value="quarter">Quarter</option>
      <option value="year">Year</option>
    </select>
    
    <ApexGanttChart
      :tasks="tasks"
      :view-mode="viewMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ViewMode } from 'vue-apexgantt';

const viewMode = ref<ViewMode>('month');
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

## TypeScript Support

The package includes full TypeScript definitions. Import types as needed:

```ts
import type {
  TaskInput,
  TaskType,
  ViewMode,
  ThemeMode,
  GanttUserOptions,
  ParsingConfig,
  TaskUpdateEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
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
- **Advanced Example**: View mode switching, theme toggle, interaction controls
- **Events Example**: Interactive testing of drag, resize, and update events
- **Data Parsing Example**: Using `useGanttData` with nested data structures

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2020+ support

## License

See LICENSE file for details.

## Credits

This is a Vue 3 wrapper for [ApexGantt](https://github.com/apexcharts/apexgantt).
