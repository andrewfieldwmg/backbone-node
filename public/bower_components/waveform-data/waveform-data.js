"use strict";

var require = window.require;

var WaveformData = require("./lib/core");
WaveformData.adapters = require("./lib/adapters");

WaveformData.builders = {
  webaudio: require("./lib/builders/webaudio.js")
};

module.exports = WaveformData;