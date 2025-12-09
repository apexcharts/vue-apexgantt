<template>
  <div class="example-container">
    <div class="example-header">
      <h2>Data Parsing Example</h2>
      <p>Using useGanttData composable to parse external data formats</p>
    </div>

    <div class="data-info">
      <h3>Raw API Data Structure:</h3>
      <pre class="code-block">{{
        JSON.stringify(rawData.slice(0, 2), null, 2)
      }}</pre>

      <h3>Parsing Configuration:</h3>
      <pre class="code-block">{{ JSON.stringify(parsingConfig, null, 2) }}</pre>
    </div>

    <div class="chart-wrapper">
      <ApexGanttChart :tasks="parsedTasks" view-mode="month" height="500px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ApexGanttChart, useGanttData } from "../../src";
import type { ParsingConfig } from "../../src";

// simulated API data with nested structure
const rawData = ref([
  {
    project: {
      task: {
        id: "T1",
        details: {
          title: "Design Phase",
          dates: {
            start: "01-01-2024",
            end: "01-15-2024",
          },
        },
      },
      metadata: {
        completion_percentage: 0.75,
        category: "design",
      },
      styling: {
        colors: {
          bar: "#4A90E2",
          row: "#F0F4F8",
        },
      },
    },
  },
  {
    project: {
      task: {
        id: "T2",
        details: {
          title: "Development Phase",
          dates: {
            start: "01-16-2024",
            end: "02-28-2024",
          },
        },
      },
      metadata: {
        completion_percentage: 0.45,
        category: "task",
      },
      styling: {
        colors: {
          bar: "#50C878",
          row: "#F0F8F0",
        },
      },
    },
  },
  {
    project: {
      task: {
        id: "T3",
        details: {
          title: "Testing Phase",
          dates: {
            start: "03-01-2024",
            end: "03-15-2024",
          },
        },
      },
      metadata: {
        completion_percentage: 0.2,
        category: "task",
      },
      styling: {
        colors: {
          bar: "#FFD700",
          row: "#FFFACD",
        },
      },
    },
  },
  {
    project: {
      task: {
        id: "T4",
        details: {
          title: "Deployment",
          dates: {
            start: "03-16-2024",
            end: "03-22-2024",
          },
        },
      },
      metadata: {
        completion_percentage: 0,
        category: "task",
      },
      styling: {
        colors: {
          bar: "#FF6B6B",
          row: "#FFE5E5",
        },
      },
    },
  },
]);

const parsingConfig: ParsingConfig = {
  id: "project.task.id",
  name: "project.task.details.title",
  startTime: "project.task.details.dates.start",
  endTime: "project.task.details.dates.end",
  progress: {
    key: "project.metadata.completion_percentage",
    transform: (value: number) => value * 100, // convert to percentage
  },
  barBackgroundColor: "project.styling.colors.bar",
  rowBackgroundColor: "project.styling.colors.row",
};

// use the composable to parse data
const parsedTasks = useGanttData({
  data: rawData,
  parsing: parsingConfig,
});
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

.data-info {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.data-info h3 {
  margin: 1rem 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.data-info h3:first-child {
  margin-top: 0;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.chart-wrapper {
  margin-top: 1.5rem;
}
</style>
