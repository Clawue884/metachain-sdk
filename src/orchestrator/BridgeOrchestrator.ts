import {
  EthBridger,
  Erc20Bridger,
  L1TransactionReceipt,
  L1ToL2MessageStatus,
  getL2Network
} from '@metachain/sdk'
import { utils, Wallet, providers, BigNumber } from 'ethers'
import { SafetyGuard } from './SafetyGuard'
import { MetricsEmitter } from './MetricsEmitter'

export class BridgeOrchestrator {
  constructor(
    private l1Signer: Wallet,
    private l2Provider: providers.Provider,
    private l1Provider: providers.Provider,
    private networkId: number
  ) {}

  private metrics = new MetricsEmitter()
  private guard = new SafetyGuard()

  async bridgeETH(amountEth: string) {
    const amount = utils.parseEther(amountEth)

    await this.guard.preflight({
      amount,
      signer: this.l1Signer,
      provider: this.l1Provider
    })

    const l2Network = await getL2Network(this.networkId)
    const ethBridger = new EthBridger(l2Network)

    this.metrics.emit('bridge_eth_start', { amount: amountEth })

    const tx = await ethBridger.deposit({
      amount,
      l1Signer: this.l1Signer,
      l2Provider: this.l2Provider
    })

    const receipt = await tx.wait()
    this.metrics.emit('bridge_eth_sent', { txHash: receipt.transactionHash })

    const l1Receipt = new L1TransactionReceipt(receipt)
    const [msg] = await l1Receipt.getL1ToL2Messages(this.l1Signer)

    return await this.waitAndRedeem(msg)
  }

  private async waitAndRedeem(msg: any) {
    let status = await msg.waitForStatus()

    this.metrics.emit('message_status', { status })

    if (status.status === L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2) {
      this.metrics.emit('redeem_start', {})
      const tx = await msg.redeem()
      const receipt = await tx.wait()
      this.metrics.emit('redeem_done', { txHash: receipt.transactionHash })
      return receipt
    }

    if (status.status === L1ToL2MessageStatus.REDEEMED) {
      return status
    }

    throw new Error(`Unexpected message status: ${status.status}`)
  }
}
