<template>
  <div class="example-container">
    <div class="example-header">
      <h2>Basic Example</h2>
      <p>Simple Gantt chart with zoom controls</p>
    </div>

    <div class="controls">
      <button @click="handleZoomOut" class="control-button">
        Zoom Out
      </button>
      <button @click="handleZoomIn" class="control-button">
        Zoom In
      </button>
    </div>

    <div class="chart-wrapper">
      <ApexGanttChart
        ref="ganttRef"
        :tasks="tasks"
        :view-mode="viewMode"
        :theme="theme"
        height="500px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ApexGanttChart } from '../../src';
import type { TaskInput, ViewMode, ThemeMode } from '../../src';

const ganttRef = ref<InstanceType<typeof ApexGanttChart> | null>(null);
const viewMode = ref<ViewMode>('week');
const theme = ref<ThemeMode>('light');

const tasks = ref<TaskInput[]>([
  {
    id: 'task-1',
    startTime: '01-01-2024',
    endTime: '01-08-2024',
    name: 'Project Planning',
    progress: 75,
  },
  {
    id: 'task-2',
    startTime: '01-04-2024',
    endTime: '01-12-2024',
    name: 'Development Phase',
    progress: 50,
  },
  {
    id: 'task-2.1',
    startTime: '01-04-2024',
    endTime: '01-07-2024',
    name: 'Backend Development',
    parentId: 'task-2',
    progress: 60,
  },
  {
    id: 'task-2.2',
    startTime: '01-08-2024',
    endTime: '01-12-2024',
    name: 'Frontend Development',
    parentId: 'task-2',
    dependency: 'task-2.1',
    progress: 40,
  },
  {
    id: 'task-3',
    startTime: '01-13-2024',
    endTime: '01-15-2024',
    name: 'Testing & QA',
    dependency: 'task-2',
    progress: 25,
  },
  {
    id: 'task-4',
    startTime: '01-16-2024',
    endTime: '01-20-2024',
    name: 'Deployment',
    progress: 0,
  },
  {
    id: 'milestone-1',
    startTime: '01-21-2024',
    name: 'Project Launch',
    type: 'milestone',
    dependency: 'task-4',
  },
]);

const handleZoomIn = () => {
  ganttRef.value?.zoomIn();
};

const handleZoomOut = () => {
  ganttRef.value?.zoomOut();
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
  gap: 0.5rem;
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

.chart-wrapper {
  margin-top: 1rem;
}
</style>
