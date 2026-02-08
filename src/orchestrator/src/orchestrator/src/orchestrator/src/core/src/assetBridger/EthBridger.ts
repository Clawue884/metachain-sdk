import { GuardedAction } from '../core/GuardedAction'

export class EthBridger {
  constructor(
    private l2Network: any,
    private guarded?: GuardedAction
  ) {}

  async deposit(args: any) {
    if (!this.guarded) return this._deposit(args)

    return this.guarded.run('eth.deposit', args, () => this._deposit(args))
  }

  private async _deposit(args: any) {
    // existing logic
  }

  async withdraw(args: any) {
    if (!this.guarded) return this._withdraw(args)
    return this.guarded.run('eth.withdraw', args, () => this._withdraw(args))
  }

  private async _withdraw(args: any) {
    // existing logic
  }
}
