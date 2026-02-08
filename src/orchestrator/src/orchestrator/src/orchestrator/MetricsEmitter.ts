export class MetricsEmitter {
  emit(event: string, data: any) {
    console.log(`[BridgeMetrics] ${event}`, data)
    // later: hook to Prometheus / OpenTelemetry
  }
}
