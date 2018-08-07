const fs = require('fs');
const path = require("path");

const _ = require('underscore');
const yaml = require('js-yaml');

const CONF_PATH = 'test/config';

module.exports = {
  loadAll () {
	// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
	var confs = []
	fs.readdirSync(CONF_PATH).forEach(file => {
	  var conf = yaml.safeLoad(fs.readFileSync(`${CONF_PATH}/${file}`));
	  confs.push(conf);
	})
	return confs;
  },
  clusterNames () {
	return _.map(this.loadAll(), (conf) => { return {name: conf.clusters[0].name}; })
  },
  loadConf (clusterName) {
	var conf = _.find(this.loadAll(), (conf) => { return conf.clusters[0].name == clusterName; })
	return yaml.safeDump(conf)
  },
  getPath (clusterName) {
	var ret = undefined;
	fs.readdirSync(CONF_PATH).forEach(file => {
	  var conf = yaml.safeLoad(fs.readFileSync(`${CONF_PATH}/${file}`));

	  if(!ret && conf.clusters[0].name == clusterName)
	  	ret = path.resolve(`${CONF_PATH}/${file}`);
	})

	return ret;
  }
}

