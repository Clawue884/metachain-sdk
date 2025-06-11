import { ethers } from 'ethers'
import { setupNetworks, config, getSigner } from './testSetup'
import * as fs from 'fs'

async function main() {
  const ethProvider = new ethers.providers.JsonRpcProvider(config.ethUrl)
  const METAProvider = new ethers.providers.JsonRpcProvider(config.METAUrl)

  const ethDeployer = getSigner(ethProvider, config.ethKey)
  const METADeployer = getSigner(METAProvider, config.METAKey)

  const { l1Network, l2Network } = await setupNetworks(
    ethDeployer,
    METADeployer,
    config.ethUrl,
    config.METAUrl
  )

  fs.writeFileSync(
    'localNetwork.json',
    JSON.stringify({ l1Network, l2Network }, null, 2)
  )
  console.log('localnetwork.json updated')
}

main()
  .then(() => console.log('Done.'))
  .catch(console.error)
