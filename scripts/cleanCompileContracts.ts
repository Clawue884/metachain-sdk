import { getPackagePath } from './util'
// this breaks on browsers, we can instead do a dynamic require to surface the error cleanly?
import { execSync } from 'child_process'

const cleanCompileContracts = async () => {
  const METAosPath = getPackagePath('METAos-precompiles')
  const ethBridgePath = getPackagePath('META-bridge-eth')
  const peripheralsPath = getPackagePath('META-bridge-eth')

  console.log('Clean building METAos')
  execSync(`cd ${METAosPath} && yarn clean:build`)

  console.log('Clean building ethbridge')
  execSync(`cd ${ethBridgePath} && yarn clean:build`)

  console.log('Clean building peripherals')
  execSync(`cd ${peripheralsPath} && yarn clean:build`)

  console.log('All clean and all built.')
}

cleanCompileContracts()
  .then(() => process.exit(process.exitCode))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
