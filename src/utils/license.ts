import ApexGantt from 'apexgantt';

/**
 * set the ApexGantt license key
 * call this once at app initialization before rendering any charts
 * 
 * @example
 * ```ts
 * import { setApexGanttLicense } from 'vue-apexgantt';
 * 
 * setApexGanttLicense('your-license-key-here');
 * ```
 */
export function setApexGanttLicense(key: string): void {
  if (typeof ApexGantt.setLicense === 'function') {
    ApexGantt.setLicense(key);
  } else {
    console.warn('ApexGantt.setLicense is not available. Please ensure you are using a compatible version of apexgantt.');
  }
}
