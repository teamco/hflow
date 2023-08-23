import { readFileSync } from 'fs';

const {
  env: {
    DEBUG = true,
    NODE_ENV = 'development',
    CORPORATE_PROXY = false,
    HOME_ENV = false,
    VERSION = readFileSync('./VERSION', 'utf8')
  },
  versions: {
    node: NODE_VERSION
  },
  arch: ARCH,
  platform: OS_PLATFORM
} = process;

const isDevelopment = NODE_ENV === 'development';

const envs = {
  CORPORATE_PROXY,
  DEBUG,
  HOME_ENV,
  NODE_ENV,
  NODE_VERSION,
  ARCH,
  OS_PLATFORM,
  VERSION
}

if (isDevelopment) {
  console.log('\n\n==== ENV =====\n');
  console.log(envs);
  console.log('\n==== /ENV =====\n\n');
}

export default envs