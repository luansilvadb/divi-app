<script setup lang="ts">
interface Props {
  template?: 'default' | 'compact' | 'expanded'
}

withDefaults(defineProps<Props>(), {
  template: 'default',
})
</script>

<template>
  <div class="premium-layout" :class="`premium-layout--${template}`">
    <div class="premium-layout__grid">
      <!-- Header Area -->
      <div
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 0, duration: 500 } }"
        class="premium-layout__area premium-layout__area--header"
      >
        <slot name="header" />
      </div>

      <!-- Summary Cards Area -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 50, duration: 500 } }"
        class="premium-layout__area premium-layout__area--summary"
      >
        <slot name="summary" />
      </div>

      <!-- Main Chart Area -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 500 } }"
        class="premium-layout__area premium-layout__area--main-chart"
      >
        <slot name="main-chart" />
      </div>

      <!-- Side Stats Area -->
      <div
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0, transition: { delay: 150, duration: 500 } }"
        class="premium-layout__area premium-layout__area--side-stats"
      >
        <slot name="side-stats" />
      </div>

      <!-- Recent Activity Area -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
        class="premium-layout__area premium-layout__area--recent-activity"
      >
        <slot name="recent-activity" />
      </div>

      <!-- Footer Area -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { delay: 250, duration: 500 } }"
        class="premium-layout__area premium-layout__area--footer"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-layout {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--space-6);
  container-type: inline-size;
}

/* Default template grid */
.premium-layout--default .premium-layout__grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(12, 1fr);
  grid-template-areas:
    "header header header header header header header header header header header header"
    "summary summary summary summary summary summary summary summary summary summary summary summary"
    "main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart side-stats side-stats side-stats side-stats"
    "recent-activity recent-activity recent-activity recent-activity recent-activity recent-activity recent-activity recent-activity side-stats side-stats side-stats side-stats"
    "footer footer footer footer footer footer footer footer footer footer footer footer";
}

/* Compact template */
.premium-layout--compact .premium-layout__grid {
  grid-template-areas:
    "header header header header header header header header header header header header"
    "summary summary summary summary summary summary summary summary summary summary summary summary"
    "main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart"
    "side-stats side-stats side-stats side-stats side-stats side-stats recent-activity recent-activity recent-activity recent-activity recent-activity recent-activity"
    "footer footer footer footer footer footer footer footer footer footer footer footer";
}

/* Expanded template - more space for main chart */
.premium-layout--expanded .premium-layout__grid {
  grid-template-areas:
    "header header header header header header header header header header header header"
    "summary summary summary summary summary summary summary summary summary summary summary summary"
    "main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart side-stats side-stats side-stats"
    "main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart main-chart recent-activity recent-activity recent-activity"
    "footer footer footer footer footer footer footer footer footer footer footer footer";
}

/* Area assignments */
.premium-layout__area--header { grid-area: header; }
.premium-layout__area--summary { grid-area: summary; }
.premium-layout__area--main-chart { grid-area: main-chart; }
.premium-layout__area--side-stats { grid-area: side-stats; }
.premium-layout__area--recent-activity { grid-area: recent-activity; }
.premium-layout__area--footer { grid-area: footer; }

/* Summary area - subgrid for stat cards */
.premium-layout__area--summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

/* Tablet breakpoint (6 columns) */
@container (max-width: 1024px) {
  .premium-layout--default .premium-layout__grid,
  .premium-layout--compact .premium-layout__grid,
  .premium-layout--expanded .premium-layout__grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      "header header header header header header"
      "summary summary summary summary summary summary"
      "main-chart main-chart main-chart main-chart main-chart main-chart"
      "side-stats side-stats side-stats recent-activity recent-activity recent-activity"
      "footer footer footer footer footer footer";
    gap: var(--space-5);
  }

  .premium-layout__area--summary {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }
}

/* Mobile breakpoint (single column) */
@container (max-width: 768px) {
  .premium-layout--default .premium-layout__grid,
  .premium-layout--compact .premium-layout__grid,
  .premium-layout--expanded .premium-layout__grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "summary"
      "main-chart"
      "side-stats"
      "recent-activity"
      "footer";
    gap: var(--space-4);
  }

  .premium-layout__area--summary {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .premium-layout {
    padding: var(--space-4);
  }
}

/* Large screens - increase gap */
@container (min-width: 1440px) {
  .premium-layout__grid {
    gap: var(--space-8);
  }

  .premium-layout__area--summary {
    gap: var(--space-8);
  }
}
</style>
