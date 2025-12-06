#!/usr/bin/env node

import { cleanUnusedDeps } from '../src/index.js';

cleanUnusedDeps().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
