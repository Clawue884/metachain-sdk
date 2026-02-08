type Metric = { name: string; value: number; labels?: Record<string,string> }

export class MetricsRegistry {
  private store: Metric[] = []

  record(name: string, value: number, labels?: Record<string,string>) {
    this.store.push({ name, value, labels })
  }

  exportPrometheus(): string {
    return this.store.map(m => {
      const lbl = m.labels
        ? '{' + Object.entries(m.labels).map(([k,v])=>`${k}="${v}"`).join(',') + '}'
        : ''
      return `${m.name}${lbl} ${m.value}`
    }).join('\n')
  }
}
