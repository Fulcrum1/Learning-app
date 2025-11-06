const path = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@prisma': path.resolve(__dirname, 'src/prisma'),
  '@app': path.resolve(__dirname, 'src'),
});
