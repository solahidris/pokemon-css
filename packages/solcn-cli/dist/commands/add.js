"use strict";

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const COMPONENTS_REGISTRY = {
  '3d-card': {
    name: 'ThreeDCard',
    files: ['3d-card.js']
  }
};
async function add(componentName) {
  console.log(chalk.bold.cyan(`\n✨ Adding ${componentName}...\n`));
  const spinner = ora('Checking configuration...').start();
  try {
    const cwd = process.cwd();
    const configPath = path.join(cwd, 'solcn.json');

    // Check if solcn is initialized
    if (!(await fs.pathExists(configPath))) {
      spinner.fail(chalk.red('solcn.json not found'));
      console.log(chalk.yellow('\nRun'), chalk.white('npx solcn init'), chalk.yellow('first.\n'));
      process.exit(1);
    }
    const config = await fs.readJson(configPath);
    const component = COMPONENTS_REGISTRY[componentName];
    if (!component) {
      spinner.fail(chalk.red(`Component "${componentName}" not found`));
      console.log(chalk.yellow('\nAvailable components:'));
      Object.keys(COMPONENTS_REGISTRY).forEach(name => {
        console.log(chalk.white(`  - ${name}`));
      });
      console.log();
      process.exit(1);
    }
    spinner.text = `Adding ${component.name}...`;
    const componentsDir = path.join(cwd, config.componentsPath);
    await fs.ensureDir(componentsDir);

    // Copy component files
    for (const file of component.files) {
      const sourcePath = path.join(__dirname, '../../registry', file);
      const targetPath = path.join(componentsDir, file);
      await fs.copy(sourcePath, targetPath);
    }
    spinner.succeed(chalk.green(`✓ Added ${component.name}`));
    console.log(chalk.cyan('\n📁 Component location:'));
    console.log(chalk.white(`  ${path.join(config.componentsPath, component.files[0])}`));
    console.log(chalk.cyan('\n📖 Usage:'));
    console.log(chalk.white(`  import { ${component.name} } from '@/components/ui/3d-card';\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to add component'));
    console.error(error);
    process.exit(1);
  }
}
module.exports = {
  add
};