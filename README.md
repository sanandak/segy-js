# segy-js

A library to read SU (and eventually SEG-Y) files and return a JSON formatted array of traces.

## Installation

  npm install https://github.com/sanandak/segy-js [--save]

## Usage

    var readSU = require('segy-js').readSU
    var su = readSU('filename')

`su` is a JSON object with 3 fields: `ns` (number of samples per trace), `dt` (sample rate in seconds), and `traces` (an array of traces).

e.g,

    su = {ns:750, dt:.004, traces: [trc0, trc1, ...]}

Each member of `traces` is an object with fields that correspond to the SU/SEGY trace header fields and an array of _sample values_ :
- `tracl` (trace number in line, at byte 0)
- `tracr` (trace number in record at byte 4)
- `ffid`  (field file id at byte 8)
- `tracf` (trace number in file at byte 12)
- `ep` (energy point id at byte 16)
- `cdp` (cdp number at byte 20)
- `cdpt` ?
- `offset` (source to receiver offset at byte 36)
- `sx` (source x coordinate at byte 72)
- `sy` (source y coordinate at byte 76)
- `gx` (group/receiver coordinate at byte 80)
- `gy` (group/receiver coordinate at byte 84)
- `ns` (number of samples in trace at byte 114)
- `dt` (sample interval at byte 116), converted to seconds
- `samps` (_sample values_ at byte 240+; assumed floating point big-endian (FIXME); converted to array of objects with sample times and values).  See below

e.g,

    trc0 = {
         tracl:0,
         tracr: 0,
         ffid:1,
         ...,
         samps:[samp0, samp1, ...]
       }

Each _sample value_ is an object with two fields: `t` (time in seconds of the sample, relative to the first sample) and `v` (sample value)

e.g.,

    samp0 = {t: 0, v: .01}

## TODO

Populate all the trace header fields.

## Tests

  TBD

## Contributing

  TBD

## Release History

  * v0.1.0 Initial Release

## Reference

The SEG-Y format is documented at http://seg.org/Publications/SEG-Technical-Standards.

The SU format is similar to SEG-Y Rev. 1, but without the Text and Binary tape reel headers (bytes 0-3600), and with modifications to the trace header fields.

http://www.cwp.mines.edu/cwpcodes/
