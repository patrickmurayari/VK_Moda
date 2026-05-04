console.log('Testing Node.js');
console.log('Current directory:', process.cwd());
try {
  const { spawn } = require('child_process');
  const child = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true 
  });
} catch (error) {
  console.error('Error:', error);
}
