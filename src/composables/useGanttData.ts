import { computed, type Ref } from "vue";
import { DataParser, type ParsingConfig } from "apexgantt";

/**
 * composable for parsing external data into ApexGantt format
 *
 * @example
 * ```ts
 * const tasks = useGanttData({
 *   data: apiData,
 *   parsing: {
 *     id: 'task_id',
 *     name: 'task_name',
 *     startTime: 'start_date',
 *     endTime: 'end_date',
 *   }
 * });
 * ```
 */
export function useGanttData(options: {
  data: Ref<any[]> | any[];
  parsing: ParsingConfig;
}) {
  const dataRef = computed(() => {
    const data = Array.isArray(options.data)
      ? options.data
      : options.data.value;

    if (!data || data.length === 0) {
      return [];
    }

    try {
      return DataParser.parse(data, options.parsing);
    } catch (error) {
      console.error("Error parsing gantt data:", error);
      return [];
    }
  });

  return dataRef;
}
