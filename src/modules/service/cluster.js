const fs = require('fs');
const path = require("path");

const _ = require('underscore');
const yaml = require('js-yaml');

const CONF_PATH = 'test/config';

module.exports = {
  load (file) {
	  var content = fs.readFileSync(file)
      var conf = yaml.safeLoad(content, {json:true});

      //TODO: convert .pem to base64
      var valid = true
      if(conf && _.isArray(conf.clusters)){
      	_.map(conf.clusters, (cs) => {
      		var pem = cs.cluster['certificate-authority']
      		if(pem){
	      		if(!path.isAbsolute(pem))
	      			pem = path.resolve(path.dirname(file), pem)
	      		
	      		console.log("Convert cert file to data-string(base64) -", pem)

	      		if(!fs.existsSync(pem)){
		      		console.log("There is no cert file. Skip this config.")
		      		valid = false
		      		return
	      		}

	      		pem = fs.readFileSync(pem)
	      		cs.cluster['certificate-authority-data'] = Buffer.from(pem).toString('base64')
	      		cs.cluster['certificate-authority'] = ''

	      		var tmp = yaml.safeDump(conf)
	      		fs.writeFile(file, tmp, 'utf8')
      		}
      	})
      }

      return valid ? conf : undefined
  },
  loadAll () {
	// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
	var confs = []
	fs.readdirSync(CONF_PATH).forEach(file => {
      var conf = this.load(`${CONF_PATH}/${file}`)

      if(!_.isObject(conf)){
	  	console.log("Discards invalid format file -", file)
	  	return
      }

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
	  var conf = this.load(`${CONF_PATH}/${file}`)

	  if(!ret && _.isObject(conf) && conf.clusters[0].name == clusterName)
	  	ret = path.resolve(`${CONF_PATH}/${file}`);
	})

	return ret;
  },
  getRootPath(){
  	return CONF_PATH	
  }
}

