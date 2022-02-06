const chokidar = require('chokidar');
const { join  }= require('path');
const fs = require('fs-extra');

const configs = join(process.env.HOME, 'PersonalConfigs/.config')

const path = f => join(process.env.HOME, f);

const watcher = chokidar.watch(configs, { 
  cwd: process.env.HOME, 
  ignoreInitial: true,
  ignored: '*.swp',
})

watcher.on('add', p => {
  const from = path(p);
  const to = path(p.replace('PersonalConfigs/', ''));

  console.log('linking', from, ' => ',to);

  fs.ensureSymlink(from, to).then(() => console.log(p + ' linked!')).catch(e => {
    console.error('could not link', p, e.message);
  })
})

watcher.on('unlink', p => {
  const oldLink = path(p.replace('PersonalConfigs/', ''));

  console.log('removing', oldLink);

  fs.remove(oldLink).then(() => console.log('removed' + oldLink)).catch(e => {
    console.error('could not remove', oldLink, e.message);
  });
})

console.log('watching');
