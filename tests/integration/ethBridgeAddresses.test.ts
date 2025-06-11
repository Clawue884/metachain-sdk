import { JsonRpcProvider } from '@ethersproject/providers'
import { expect } from 'chai'
import {
  EthBridge,
  getEthBridgeInformation,
  getL2Network,
} from '../../src/lib/dataEntities/networks'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Tests the getEthBridgeInformation function against the information
 * of metachain One network (42161)
 */
describe('Obtain deployed bridge addresses', () => {
  it('obtains deployed ETH Bridge addresses', async () => {
    const METAOneL2Network = await getL2Network(42161)
    const ethProvider = new JsonRpcProvider(
      process.env['MAINNET_RPC'] as string
    )

    // Obtain on-chain information
    const ethBridge: EthBridge = await getEthBridgeInformation(
      METAOneL2Network.ethBridge.rollup,
      ethProvider
    )

    // Obtained addresses should equal the addresses
    // available in metachain One's l2Network configuration
    expect(
      METAOneL2Network.ethBridge.bridge,
      'Bridge contract is not correct'
    ).to.eq(ethBridge.bridge)
    expect(
      METAOneL2Network.ethBridge.inbox,
      'Inbox contract is not correct'
    ).to.eq(ethBridge.inbox)
    expect(
      METAOneL2Network.ethBridge.sequencerInbox,
      'SequencerInbox contract is not correct'
    ).to.eq(ethBridge.sequencerInbox)
    expect(
      METAOneL2Network.ethBridge.outbox,
      'Outbox contract is not correct'
    ).to.eq(ethBridge.outbox)
  })
})
