var fs = require('fs');

var _getBuf =  function(fname) {
    return fs.readFileSync(fname);
}
var _bufToJSON = function(buf) {

  var ns = buf.readUInt16BE(114);
  var dt = buf.readUInt16BE(116) / (1000. * 1000.);

  var trclen = 240 + ns * 4;
  var ntrc = buf.length / trclen;

  if (ntrc !== Math.floor(ntrc)) {
    return({});
  }

  var traces = [];
  for(var i=0; i<ntrc; i++) {
    var skip = i*trclen;
    var tracl = buf.readUInt32BE(0 + skip);
    var tracr = buf.readUInt32BE(4 + skip);
    var ffid  = buf.readUInt32BE(8 + skip);
    var tracf = buf.readUInt32BE(12 + skip);
    var ep = buf.readUInt32BE(16 + skip);
    var cdp  = buf.readInt32BE(20 + skip);
    var cdpt = buf.readInt32BE(24+ skip);
    var offset = buf.readInt32BE(36);
    var sx = buf.readUInt32BE(72+ skip);
    var sy = buf.readUInt32BE(76+ skip);
    var gx = buf.readUInt32BE(80+ skip);
    var gy = buf.readUInt32BE(84+ skip);
    // redundant? check consistency?
    var ns = buf.readUInt16BE(114+ skip);
    var dt = buf.readUInt16BE(116+ skip) / (1000. * 1000.); // us -> seconds

    var samps = [];
    for(var j=0; j<ns; j++) {
      samps.push({t:dt*j, v:buf.readFloatBE(240+j*4 + skip)});
    }
    traces.push({
      tracl:tracl,
      tracr:tracr,
      ffid:ffid,
      tracf:tracf,
      ep:ep,
      cdp:cdp,
      cdpt:cdpt,
      offset:offset,
      sx:sx,
      sy:sy,
      gx:gx,
      gy:gy,
      ns:ns,
      dt:dt,
      samps:samps
    })
  }
  return {dt:dt, ns: ns, traces:traces};
}

module.exports = {
  readSegy: function(fname) {
    var buf = this._getBuf(fname);
    var textHdr = buf.slice(0,3200);
    var binHdr = buf.slice(3200,3600);
    var dt = binHdr.readUInt16BE(216);
    var ns = binHdr.readUInt16BE(220);

    var segy = _bufToJSON(buf.slice(3600));
    return segy;
  },

  readSU: function(fname) {
    var buf = _getBuf(fname);
    var su = _bufToJSON(buf);
    return su;
  }
};
