#!/usr/bin/env node

const inquirer = require('inquirer')
const { spawn } = require('child_process')
const { promisify } = require('util')
const spawnAsync = promisify(spawn)

async function buildConfig() {
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Select one of the method to build 📦',
      choices: ['base', 'cloud', 'emqx'],
    },
  ])

  process.env.VUE_APP_BUILD_ENV = method
  if (method === 'emqx') {
    console.log('Please confirm that the upper directory contains emqx-enterprise-dashboard!')
    const build = spawn('vue-cli-service', ['build'], {
      stdio: 'inherit',
    })
    build.on('close', () => {
      spawn('./dist.sh', [''], {
        stdio: 'inherit',
      })
    })
  } else {
    await spawnAsync('vue-cli-service', ['build'], {
      stdio: 'inherit',
    })
  }
}

buildConfig()
