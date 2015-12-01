var context = new AudioContext();
var vca = context.createGain();
var delay = context.createDelay();
var vco, vco2, vco3;
var oscillators = {};

var lowpassFilter = context.createBiquadFilter();
lowpassFilter.type = 'lowpass';

vca.gain.value = 0.4;
vca.connect(context.destination);

function createOscillator(frequency, velocity, note, oscType, dualType, detuned, tripType, lpFilter, data) {
  vco = context.createOscillator();
  vco.type = oscType || 'triangle';
  oscillators[note] = [];

  if(dualType && dualType != '') {
    vco2 = context.createOscillator();
    vco2.type = dualType;
    vco2.connect(vca);
    vco2.frequency.value = frequency;
    if(detuned) {
      vco2.detune.value = 10;
    }
    oscillators[note].push(vco2);
    vco2.start(context.currentTime);
  }

  if(tripType && tripType != '') {
    vco3 = context.createOscillator();
    vco3.type = tripType;
    vco3.connect(vca);
    vco3.frequency.value = frequency / 2;
    if(detuned) {
      vco3.detune.value = 10;
    }
    oscillators[note].push(vco3);
    vco3.start(context.currentTime);
  }

  if(lpFilter) {
    lowpassFilter.frequency.value = lpFilter.cutoff;
    lowpassFilter.Q.value = lpFilter.resonance;
  }
  vco.connect(lowpassFilter);
  lowpassFilter.connect(vca);
  vca.connect(context.destination);

  vco.frequency.value = frequency;
  if(detuned) {
    vco.detune.value = -10;
  }
  oscillators[note].push(vco);
  vco.start(context.currentTime);
  console.log(oscillators);
}

function removeOscillator(note) {
  oscillators[note].forEach(function(osc) {
    osc.stop(context.currentTime);
  });
}
