#!/usr/bin/env node
"use strict";

const {
  Command
} = require('commander');
const chalk = require('chalk');
const {
  init
} = require('./commands/init');
const {
  add
} = require('./commands/add');
const packageJson = require('../package.json');
const program = new Command();
program.name('solcn').description('Add beautiful 3D components to your project').version(packageJson.version);
program.command('init').description('Initialize solcn in your project').action(init);
program.command('add <component>').description('Add a component to your project').action(add);
program.parse(process.argv);