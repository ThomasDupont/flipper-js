import { Command } from 'commander'
import chalk from 'chalk'
import Flipper from './flipper'
import { featureSchema } from './@types/options.type'

const program = new Command()

program
  .name('flipper')
  .description('CLI for feature management')
  .version('1.0.0')

program
  .command('list')
  .description('List all features and their statuses')
  .action(async () => {
    try {
      await Flipper.init()
      console.log(chalk.blueBright('Feature statuses:'))
      const list = await Flipper.list()
      for (const [feature, status] of Object.entries(list)) {
        console.log(`Feature: ${chalk.blueBright(feature)}, Status: ${status ? chalk.green('enabled') : chalk.red('disabled')}`)
      }
      process.exit(0)
    } catch (e) {
      console.error(chalk.red((e as Error).message))
      process.exit(1)
    }
  })

program
  .command('enable <feature>')
  .description('Enable a feature')
  .action(async (feature: string) => {
    try {
      featureSchema.parse(feature)
      await Flipper.init()
      await Flipper.enable(feature)
      console.log(chalk.green(`${feature} enabled`))
      process.exit(0)
    } catch (e) {
      console.error(chalk.red((e as Error).message))
      process.exit(1)
    }
  })

program
  .command('disable <feature>')
  .description('Disable a feature')
  .action(async (feature: string) => {
    try {
      featureSchema.parse(feature)
      await Flipper.init()
      await Flipper.disable(feature)
      console.log(chalk.red(`${feature} disabled`))
      process.exit(0)
    } catch (e) {
      console.error(chalk.red((e as Error).message))
      process.exit(1)
    }
  })

program
  .command('add <feature>')
  .description('Add a new feature (enabled by default)')
  .action(async (feature: string) => {
    try {
      featureSchema.parse(feature)
      await Flipper.init()
      await Flipper.enable(feature)
      console.log(chalk.green(`${feature} added and enabled by default`))
      process.exit(0)
    } catch (e) {
      console.error(chalk.red((e as Error).message))
      process.exit(1)
    }
  })

program.parse(process.argv)
