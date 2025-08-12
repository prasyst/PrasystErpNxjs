import detect from 'detect-port';
import { exec } from 'child_process';

const DEFAULT_PORT = process.env.PORT || 4000;

try {
  const availablePort = await detect(DEFAULT_PORT);

  if (DEFAULT_PORT === availablePort) {
    console.log(`✅ Port ${DEFAULT_PORT} is free`);
  } else {
    console.log(`⚠️ Port ${DEFAULT_PORT} in use, switching to ${availablePort}`);
  }

  const command = `next dev --turbopack -p ${availablePort}`;
  const child = exec(command, { stdio: 'inherit' });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
} catch (err) {
  console.error('Error detecting port:', err);
  process.exit(1);
}
