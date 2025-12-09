<template>
  <div class="example-container">
    <div class="example-header">
      <h2>Advanced Example</h2>
      <p>View mode switching, theme toggle, and custom options</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>View Mode:</label>
        <select v-model="viewMode" class="control-select">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div class="control-group">
        <label>Theme:</label>
        <button @click="toggleTheme" class="control-button">
          {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
        </button>
      </div>

      <div class="control-group">
        <label>Interactions:</label>
        <label class="checkbox-label">
          <input v-model="enableDrag" type="checkbox" />
          Enable Drag
        </label>
        <label class="checkbox-label">
          <input v-model="enableResize" type="checkbox" />
          Enable Resize
        </label>
      </div>
    </div>

    <div class="chart-wrapper">
      <ApexGanttChart
        ref="ganttRef"
        :tasks="tasks"
        :view-mode="viewMode"
        :theme="theme"
        :options="ganttOptions"
        height="600px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ApexGanttChart } from '../../src';
import type { TaskInput, ViewMode, ThemeMode, GanttUserOptions } from '../../src';

const ganttRef = ref<InstanceType<typeof ApexGanttChart> | null>(null);
const viewMode = ref<ViewMode>('month');
const theme = ref<ThemeMode>('light');
const enableDrag = ref(true);
const enableResize = ref(true);

const tasks = ref<TaskInput[]>([
  {
    id: 'planning',
    startTime: '01-08-2025',
    endTime: '01-17-2025',
    name: '📋 Project Planning Phase',
    progress: 100,
  },
  {
    id: 'requirements',
    startTime: '01-08-2025',
    endTime: '01-12-2025',
    name: '📝 Requirements Gathering',
    parentId: 'planning',
    progress: 100,
  },
  {
    id: 'architecture',
    startTime: '01-13-2025',
    endTime: '01-17-2025',
    name: '🏗️ System Architecture',
    parentId: 'planning',
    dependency: 'requirements',
    progress: 100,
  },
  {
    id: 'frontend',
    startTime: '01-20-2025',
    endTime: '02-14-2025',
    name: '💻 Frontend Development',
    progress: 75,
  },
  {
    id: 'ui-components',
    startTime: '01-20-2025',
    endTime: '01-31-2025',
    name: '🎨 UI Components',
    parentId: 'frontend',
    progress: 90,
  },
  {
    id: 'backend',
    startTime: '01-20-2025',
    endTime: '02-21-2025',
    name: '⚙️ Backend Development',
    progress: 65,
  },
  {
    id: 'testing',
    startTime: '02-22-2025',
    endTime: '03-07-2025',
    name: '🧪 Testing Phase',
    progress: 25,
  },
  {
    id: 'deployment',
    startTime: '03-08-2025',
    endTime: '03-14-2025',
    name: '🚀 Deployment & Launch',
    progress: 0,
  },
]);

const ganttOptions = computed<Partial<GanttUserOptions>>(() => ({
  enableTaskDrag: enableDrag.value,
  enableTaskResize: enableResize.value,
  enableTaskEdit: true,
}));

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>

<style scoped>
.example-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.example-header h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.example-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.controls {
  margin: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: #555;
}

.control-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.control-button {
  padding: 0.5rem 1rem;
  background: #537CFA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.control-button:hover {
  background: #4169e8;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.chart-wrapper {
  margin-top: 1rem;
}
</style>
