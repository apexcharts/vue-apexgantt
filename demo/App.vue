<template>
  <div class="demo-app">
    <header class="demo-header">
      <h1>Vue ApexGantt - Demo</h1>
      <p>Interactive examples showcasing the Vue wrapper</p>
    </header>

    <nav class="demo-nav">
      <button 
        v-for="example in examples" 
        :key="example.id"
        :class="['nav-button', { active: currentExample === example.id }]"
        @click="currentExample = example.id"
      >
        {{ example.title }}
      </button>
    </nav>

    <main class="demo-content">
      <component :is="currentExampleComponent" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BasicExample from './examples/BasicExample.vue';
import AdvancedExample from './examples/AdvancedExample.vue';
import EventsExample from './examples/EventsExample.vue';
import DataParsingExample from './examples/DataParsingExample.vue';

const examples = [
  { id: 'basic', title: 'Basic', component: BasicExample },
  { id: 'advanced', title: 'Advanced', component: AdvancedExample },
  { id: 'events', title: 'Events', component: EventsExample },
  { id: 'parsing', title: 'Data Parsing', component: DataParsingExample },
];

const currentExample = ref('basic');

const currentExampleComponent = computed(() => {
  const example = examples.find(e => e.id === currentExample.value);
  return example?.component || BasicExample;
});
</script>

<style scoped>
.demo-app {
  min-height: 100vh;
  background: #f5f5f5;
}

.demo-header {
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.demo-header p {
  margin: 0;
  color: #666;
}

.demo-nav {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-button:hover {
  border-color: #537CFA;
  color: #537CFA;
}

.nav-button.active {
  background: #537CFA;
  color: white;
  border-color: #537CFA;
}

.demo-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
