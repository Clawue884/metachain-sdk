import { GuardianClient } from '../guardian/GuardianClient'
import { TelemetryCore } from '../telemetry/TelemetryCore'

export class GuardedAction {
  constructor(
    private guardian: GuardianClient,
    private telemetry: TelemetryCore
  ) {}

  async run(action: string, payload: any, exec: Function) {
    const start = Date.now()

    await this.guardian.preflight(action, payload)

    this.telemetry.track(`${action}.preflight.ok`, payload)

    const res = await exec()

    this.telemetry.track(`${action}.executed`, { tx: res?.hash })
    this.telemetry.metric(`sdk.${action}.latency_ms`, Date.now() - start)

    return res
  }
}
