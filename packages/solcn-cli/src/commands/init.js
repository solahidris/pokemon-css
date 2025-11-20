const prompts = require('prompts');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

async function init() {
  console.log(chalk.bold.cyan('\n✨ Welcome to solcn!\n'));

  const response = await prompts([
    {
      type: 'text',
      name: 'componentsPath',
      message: 'Where would you like to add your components?',
      initial: './components/ui'
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'This will create the directory structure. Continue?',
      initial: true
    }
  ]);

  if (!response.confirm) {
    console.log(chalk.yellow('\n❌ Setup cancelled.\n'));
    return;
  }

  const spinner = ora('Setting up solcn...').start();

  try {
    const cwd = process.cwd();
    const componentsDir = path.join(cwd, response.componentsPath);

    // Create components directory
    await fs.ensureDir(componentsDir);

    // Create solcn config file
    const config = {
      componentsPath: response.componentsPath,
      version: '1.0.0'
    };

    await fs.writeJson(path.join(cwd, 'solcn.json'), config, { spaces: 2 });

    spinner.succeed(chalk.green('✓ Setup complete!'));
    
    console.log(chalk.cyan('\n📁 Components directory:'), chalk.white(response.componentsPath));
    console.log(chalk.cyan('📝 Config file:'), chalk.white('solcn.json'));
    console.log(chalk.bold.cyan('\n✨ You can now add components with:'));
    console.log(chalk.white('  npx solcn add 3d-card\n'));

  } catch (error) {
    spinner.fail(chalk.red('Setup failed'));
    console.error(error);
    process.exit(1);
  }
}

module.exports = { init };

