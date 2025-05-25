const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function generateProtobuf() {
  const protoPath = path.resolve(__dirname, 'static/trade.proto');
  const outputDir = path.resolve(__dirname, 'generated');
  const outputPath = path.resolve(outputDir, 'trade_pb.js');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    execSync(
      `npx pbjs -t static-module -w commonjs -o "${outputPath}" "${protoPath}"`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    process.exit(1);
  }
}

module.exports = { generateProtobuf };
