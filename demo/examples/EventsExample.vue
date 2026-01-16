<template>
  <div class="example-container">
    <div class="example-header">
      <h2>Events Example</h2>
      <p>Interactive demo showing task drag, resize, and update events</p>
    </div>

    <div class="chart-wrapper">
      <ApexGanttChart
        :tasks="tasks"
        view-mode="week"
        :options="ganttOptions"
        height="400px"
        @task-dragged="handleTaskDragged"
        @task-resized="handleTaskResized"
        @task-update-success="handleTaskUpdateSuccess"
      />
    </div>

    <div class="event-log">
      <div class="event-log-header">
        <h3>Event Log</h3>
        <button @click="clearEventLog" class="clear-button">Clear Log</button>
      </div>

      <div class="event-log-content">
        <div v-if="events.length === 0" class="no-events">
          No events yet. Try dragging or resizing a task!
        </div>

        <div
          v-for="(event, index) in events"
          :key="index"
          :class="['event-item', event.type]"
        >
          <div class="event-time">{{ event.time }}</div>
          <div class="event-type">{{ event.type.toUpperCase() }} EVENT</div>
          <div class="event-details" v-html="event.details"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ApexGanttChart } from "../../src";
import type {
  TaskInput,
  GanttUserOptions,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  TaskUpdateSuccessEventDetail,
} from "../../src";

interface EventLog {
  type: string;
  time: string;
  details: string;
}

const tasks = ref<TaskInput[]>([
  {
    id: "task-1",
    startTime: "11-01-2024",
    endTime: "11-08-2024",
    name: "Project Planning",
    progress: 75,
  },
  {
    id: "task-2",
    startTime: "11-04-2024",
    endTime: "11-12-2024",
    name: "Development Phase",
    progress: 50,
  },
  {
    id: "task-2.1",
    startTime: "11-04-2024",
    endTime: "11-07-2024",
    name: "Backend Development",
    parentId: "task-2",
    progress: 60,
  },
  {
    id: "task-2.2",
    startTime: "11-08-2024",
    endTime: "11-12-2024",
    name: "Frontend Development",
    parentId: "task-2",
    dependency: "task-2.1",
    progress: 40,
  },
  {
    id: "task-3",
    startTime: "11-13-2024",
    endTime: "11-15-2024",
    name: "Testing & QA",
    dependency: "task-2",
    progress: 25,
  },
  {
    id: "task-4",
    startTime: "11-16-2024",
    endTime: "11-20-2024",
    name: "Deployment",
    progress: 0,
  },
  {
    id: "milestone-1",
    startTime: "11-21-2024",
    name: "Project Launch",
    type: "milestone",
    dependency: "task-4",
  },
]);

const ganttOptions: Partial<GanttUserOptions> = {
  enableTaskDrag: true,
  enableTaskResize: true,
  enableTaskEdit: true,
};

const events = ref<EventLog[]>([]);
const maxEvents = 50;

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString();
};

const handleTaskDragged = (detail: TaskDraggedEventDetail) => {
  console.log("Task Dragged:", detail);

  let detailsHtml = `
    <strong>Task ID:</strong> ${detail.taskId}<br>
    <strong>Days Moved:</strong> ${detail.daysMoved}<br>
    <strong>Old Dates:</strong> ${detail.oldStartTime} → ${detail.oldEndTime}<br>
    <strong>New Dates:</strong> ${detail.newStartTime} → ${detail.newEndTime}
  `;

  if (detail.affectedChildTasks && detail.affectedChildTasks.length > 0) {
    detailsHtml += `<br><strong>Affected Children:</strong> ${detail.affectedChildTasks.length} task(s)`;
  }

  addEvent("drag", detail.timestamp, detailsHtml);
};

const handleTaskResized = (detail: TaskResizedEventDetail) => {
  console.log("Task Resized:", detail);

  const detailsHtml = `
    <strong>Task ID:</strong> ${detail.taskId}<br>
    <strong>Handle:</strong> ${detail.resizeHandle}<br>
    <strong>Duration Change:</strong> ${detail.durationChange > 0 ? "+" : ""}${
    detail.durationChange
  } days<br>
    <strong>Old Dates:</strong> ${detail.oldStartTime} → ${
    detail.oldEndTime
  }<br>
    <strong>New Dates:</strong> ${detail.newStartTime} → ${detail.newEndTime}
  `;

  addEvent("resize", detail.timestamp, detailsHtml);
};

const handleTaskUpdateSuccess = (detail: TaskUpdateSuccessEventDetail) => {
  console.log("Task Updated:", detail);

  const detailsHtml = `
    <strong>Task ID:</strong> ${detail.taskId}<br>
    <strong>Task Name:</strong> ${detail.updatedTask.name}
  `;

  addEvent("update", detail.timestamp, detailsHtml);
};

const addEvent = (type: string, timestamp: number, details: string) => {
  events.value.unshift({
    type,
    time: formatTime(timestamp),
    details,
  });

  if (events.value.length > maxEvents) {
    events.value.pop();
  }
};

const clearEventLog = () => {
  events.value = [];
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

.instructions {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 4px;
  padding: 1rem;
  margin: 1.5rem 0;
  color: #1565c0;
}

.instructions ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.instructions li {
  margin: 0.3rem 0;
}

.chart-wrapper {
  margin: 1.5rem 0;
}

.event-log {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.event-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.event-log-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.clear-button {
  padding: 0.4rem 0.8rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
}

.clear-button:hover {
  background: #d32f2f;
}

.event-log-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-events {
  color: #999;
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.event-item {
  border-left: 3px solid #2196f3;
  padding: 0.75rem;
  background: white;
  border-radius: 0 4px 4px 0;
  font-size: 0.85rem;
}

.event-item.drag {
  border-left-color: #4caf50;
}

.event-item.resize {
  border-left-color: #ff9800;
}

.event-item.update {
  border-left-color: #9c27b0;
}

.event-time {
  color: #999;
  font-size: 0.75rem;
  margin-bottom: 0.3rem;
}

.event-type {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.event-details {
  color: #666;
  line-height: 1.5;
}

.event-details strong {
  color: #333;
}
</style>
