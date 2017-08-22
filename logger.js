'use strict';
const fs = require('fs');
const chalk = require('chalk');

/** Just a simple log interface wrapper */

module.exports = (config) => {
  const ERROR = 4;
  const WARN = 3;
  const NOTICE = 2;
  const INFO = 1;
  const DEBUG = 0;
  const LEVEL_TEXTS = [
    ' DEBUG  ',
    ' INFO   ',
    ' NOTICE ',
    ' WARN   ',
    ' ERR    '
  ];

  const defaults  = {
    level:DEBUG,
    color:true,
    timestamp:true,
    logString: "[TSTAMP] [LEVEL] [TAG] [TEXT] \n",
    of:null,
  };

  var cfg = Object.assign(defaults, config);

  function log(level, text, tag, terminal = false) {
    let output = '';
    if (cfg.timestamp)
      output = cfg.logString.replace('[TSTAMP]', chalk.gray(new Date().toISOString()));

    if (cfg.of !== null || terminal === true)  {
      output = output.replace('[LEVEL]', () => {
        switch(level) {
          case ERROR:
            return chalk.bgRed.bold(LEVEL_TEXTS[level]);
          break;

          case WARN:
            return chalk.magenta.bold(LEVEL_TEXTS[level]);
          break;

          case INFO:
            return chalk.blue(LEVEL_TEXTS[level]);
          break;

          case NOTICE:
            return chalk.cyan(LEVEL_TEXTS[level]);
          break;

          default:
            return chalk.yellow(LEVEL_TEXTS[level]);
        }
      });

      output = output.replace('[TAG]', chalk.gray(`[ ${tag} ]`));
      output = output.replace('[TEXT]', chalk.white(`  ${text}`));
    } else {
      output = output.replace('[LEVEL]',LEVEL_TEXTS[level]);
      output = output.replace('[TAG]', `[${tag}]`);
      output = output.replace('[TEXT]', `  ${text}`);
    }

    if (cfg.of === null || terminal === true) {
      console.log(output);
    } else {
      fs.writeFile(cfg.of , output + "\n", {encoding:'utf8', flag:"a"}, (err) => { if (err) throw err });
    }
  }

  function terminal(text, tag = 'GENERAL') {
    log(INFO, text, tag, true);
  }

  function error(text, tag = 'GENERAL') {
    log(ERROR, text, tag);
  }

  function warn(text, tag = 'GENERAL') {
    if (cfg.level > WARN)
      return false;

    log(WARN, text, tag);
  }

  function notice(text, tag = 'GENERAL') {
    if (cfg.level > NOTICE)
      return false;

    log(NOTICE, text, tag);
  }

  function info(text, tag = 'GENERAL') {
    if (cfg.level > INFO)
      return false;

    log(INFO, text, tag);
  }

  function debug(text, tag = 'GENERAL') {
    if (cfg.level > DEBUG)
      return false;

    log(DEBUG, text, tag);
  }

  return {
    d:debug,
    i:info,
    w:warn,
    e:error,
    n:notice,
    t:terminal,
  }
}
