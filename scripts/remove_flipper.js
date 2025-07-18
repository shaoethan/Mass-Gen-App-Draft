const fs = require('fs');
const path = require('path');

module.exports = function () {
  const podfilePath = path.join(__dirname, '..', 'ios', 'Podfile');
  if (!fs.existsSync(podfilePath)) return;

  let podfile = fs.readFileSync(podfilePath, 'utf8');

  // Remove FlipperConfiguration lines completely
  podfile = podfile.replace(/^.*FlipperConfiguration.*\n?/gm, '');
  podfile = podfile.replace(/:flipper_configuration\s*=>\s*flipper_config,?\s*/gm, '');

  fs.writeFileSync(podfilePath, podfile);
  console.log('✅ Successfully removed Flipper references from Podfile');
};
