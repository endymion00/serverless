'use strict';

const SError            = require('./Error'),
  SerializerFileSystem  = require('./SerializerFileSystem'),
  BbPromise             = require('bluebird'),
  _                     = require('lodash');

/**
 * This is the class which represents deployment Stage
 */

class Stage extends SerializerFileSystem {

  constructor(S, project, name) {
    super();

    this._S = S;
    this._project = project;
    this._regions = {};

    this.name = name;
  }

  save() {
    let _this = this;
    return BbPromise.try(function(){
      return _this.saveVarsToFile( `s-variables-${_this.getName()}.json` );
    })
    .then(function(){
      BbPromise.each( _.values(_this._regions), function(region){
        return region.save();
      });
    });
  }

  getName(){
    return this.name;
  }

  getRegion( name ){
    return this._regions[ name ];
  }

  getRegions(){
    return Object.keys( this._regions );
  }

  hasRegion( name ){
    return this._regions[ name ] != undefined;
  }

  setRegion(region ){
    this._regions[ region.getName() ] = region;
  }

  removeRegion( name ){
    let region = this._regions[ name ];

    delete this._regions[ name ];

    return BbPromise.try(function(){
      if( region ){
        return region.destroy();
      }
    });
  }
}

module.exports = Stage;