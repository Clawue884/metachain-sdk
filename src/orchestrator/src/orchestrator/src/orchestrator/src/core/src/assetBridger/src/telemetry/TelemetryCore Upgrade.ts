import { MetricsRegistry } from './Metrics'

export class TelemetryCore {
  metrics = new MetricsRegistry()

  track(event: string, data: any) {
    console.log(`[telemetry] ${event}`, data)
  }

  metric(name: string, value: number, labels?: any) {
    this.metrics.record(name, value, labels)
  }
}
