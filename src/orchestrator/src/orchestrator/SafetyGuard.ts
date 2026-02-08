import { BigNumber, Wallet, providers } from 'ethers'

export class SafetyGuard {
  async preflight(params: {
    amount: BigNumber
    signer: Wallet
    provider: providers.Provider
  }) {
    const balance = await params.signer.getBalance()

    if (balance.lt(params.amount)) {
      throw new Error('Insufficient balance for bridge operation')
    }

    const gasPrice = await params.provider.getGasPrice()
    if (gasPrice.gt(BigNumber.from('50000000000'))) {
      throw new Error('Gas price too high — aborting bridge')
    }
  }
}
