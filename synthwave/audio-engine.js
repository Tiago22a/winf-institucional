/* SYNTHWAVE.fm audio engine — ported to Vanilla JS from src/lib/audioEngine.ts.
 * Web Audio procedural presets, optional URL-based tracks, ambient soundscapes,
 * Media Session integration and analyser for live visualization.
 */
(function(global){
'use strict';
const PROGRESSIONS={
 cyber_drive:[[110,164.81,220,277.18],[98,146.83,196,246.94],[87.31,130.81,174.61,220],[98,146.83,196,246.94]],
 aerocore_ambient:[[65.41,130.81,196,293.66],[58.27,116.54,174.61,261.63],[73.42,146.83,220,329.63],[65.41,130.81,196,293.66]],
 neoskin_pulse:[[55,110,138.59,220],[55,110,146.83,220],[51.91,103.83,130.81,207.65],[48.99,97.99,123.47,196]],
 deep_focus_lofi:[[130.81,196,246.94,329.63],[110,164.81,220,261.63],[146.83,220,261.63,349.23],[98,146.83,196,246.94]],
 night_glide:[[87.31,174.61,220,261.63],[98,196,246.94,293.66],[110,220,261.63,329.63],[110,164.81,220,329.63]],
 sunset_highway:[[110,164.81,220,277.18],[130.81,196,261.63,329.63],[87.31,130.81,174.61,220],[98,146.83,196,246.94]]
};
class AudioEngine {
 constructor(){this.ctx=null;this.master=null;this.analyser=null;this.media=null;this.mediaSource=null;this.interval=null;this.nodes=new Set();this.soundscape=null;this.soundscapeSource=null;this.volume=.65;this.playing=false;this.generation=0;this.currentTrack=null;this.onEnd=null;this.ambientType=null;}
 init(){if(!this.ctx||this.ctx.state==='closed'){const AC=global.AudioContext||global.webkitAudioContext;if(!AC)throw Error('Este navegador não suporta Web Audio');this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=this.volume;this.analyser=this.ctx.createAnalyser();this.analyser.fftSize=128;this.analyser.smoothingTimeConstant=.78;this.master.connect(this.analyser);this.analyser.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;}
 setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)||0));if(this.ctx&&this.master)this.master.gain.setTargetAtTime(this.volume,this.ctx.currentTime,.05);if(this.media)this.media.volume=this.volume;}
 getAnalyser(){return this.analyser;}
 _voice(freq,type,start,duration,level,target,attack=.04){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);g.gain.linearRampToValueAtTime(level,start+Math.min(attack,duration*.4));g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(target);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect()};this.nodes.add(o);o.start(start);o.stop(start+duration+.01);}
 _preset(track){const c=this.ctx,generation=this.generation,chords=PROGRESSIONS[track.synthPreset]||PROGRESSIONS.cyber_drive,bpm=Math.max(40,Math.min(210,track.bpm||110)),period=120/bpm;let step=0;const tick=()=>{if(generation!==this.generation||!this.playing)return;const now=c.currentTime,chord=chords[step++%chords.length],filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=track.synthPreset==='aerocore_ambient'?1200:2200;filter.Q.value=2.5;filter.connect(this.master);for(let i=0;i<chord.length;i++)this._voice(chord[i],i===0?'sawtooth':'triangle',now,period*.96,.06/chord.length,filter,.2);if(track.synthPreset!=='aerocore_ambient')this._voice(chord[0]/2,'sine',now,period*.48,.12,this.master,.05); // Filter only passes through short-lived voices.
 setTimeout(()=>{try{filter.disconnect()}catch(_){}},Math.ceil(period*1100)+100);};tick();this.interval=setInterval(tick,period*1000);}
 _failTrack(err){
   this.stop();
   if(this.onError)this.onError(err instanceof Error?err:new Error(String(err)));
   else console.warn('Audio could not be loaded',err);
 }
 _makeMedia(){
   if(!this.media){
     this.media=new Audio();
     this.media.preload='metadata';
     this.media.volume=this.volume;
     this.media.addEventListener('ended',()=>{if(this.playing&&this.currentTrack?.audioUrl&&this.onEnd)this.onEnd()});
     this.media.addEventListener('error',()=>{
       const track=this.currentTrack;
       if(!this.playing||!track?.audioUrl)return;
       if(!this._tryingFallback&&track.fallbackAudioUrl){
         this._tryingFallback=true;
         this.media.src=track.fallbackAudioUrl;
         this.media.load();
         this.media.play().catch(e=>this._failTrack(e));
       }else this._failTrack(new Error('Não foi possível carregar a fonte de áudio: '+track.title));
     });
   }
   return this.media;
 }
 async play(track,onEnd){
   this.stop(false);
   this.currentTrack=track;
   this.onEnd=onEnd||null;
   this.playing=true;
   const token=++this.generation;
   try{
     this.init();
     if(track.audioUrl){
       const audio=this._makeMedia();
       const supportsOgg=audio.canPlayType('audio/ogg; codecs="vorbis"');
       this._tryingFallback=!supportsOgg&&Boolean(track.fallbackAudioUrl);
       audio.src=this._tryingFallback?track.fallbackAudioUrl:track.audioUrl;
       audio.volume=this.volume;
       await audio.play();
       if(token!==this.generation){audio.pause();return}
     }else this._preset(track);
     this._setSession(track);
     if(this.ambientType)this.setSoundscape(this.ambientType);
   }catch(err){
     if(token!==this.generation)return;
     // An Ogg source may be blocked while a Wikimedia transcode is playable.
     if(track.audioUrl&&!this._tryingFallback&&track.fallbackAudioUrl){
       this._tryingFallback=true;
       try{this.media.src=track.fallbackAudioUrl;await this.media.play();this._setSession(track);return}catch(e){err=e}
     }
     this._failTrack(err);
   }
 }
 async resume(track,onEnd){
   if(this.currentTrack===track&&this.media&&track.audioUrl){
     this.onEnd=onEnd||this.onEnd;
     this.playing=true;
     try{await this.media.play();this._setSession(track);if(this.ambientType)this.setSoundscape(this.ambientType)}
     catch(err){this._failTrack(err)}
   }else return this.play(track,onEnd);
 }
 pause(){
   if(this.currentTrack?.audioUrl&&this.media){
     this.playing=false;
     this.media.pause();
     this._stopSoundscape();
     this._sessionState();
   }else this.stop(false);
 }
 stop(clearTrack=true){
   this.generation++;
   this.playing=false;
   if(this.interval!==null)clearInterval(this.interval);
   this.interval=null;
   for(const o of Array.from(this.nodes)){
     try{o.stop()}catch(_){}
     try{o.disconnect()}catch(_){}
     this.nodes.delete(o);
   }
   if(this.media){this.media.pause();this.media.removeAttribute('src');this.media.load()}
   this._stopSoundscape();
   if(clearTrack){this.currentTrack=null;this.onEnd=null}
   this._sessionState();
 }
 _stopSoundscape(){if(this.soundscapeSource){try{this.soundscapeSource.stop()}catch(_){}this.soundscapeSource.disconnect();this.soundscapeSource=null}if(this.soundscape){this.soundscape.disconnect();this.soundscape=null}}
 setSoundscape(type){if(type!==null&&!['rain','traffic','static'].includes(type))return;this.ambientType=type;this._stopSoundscape();if(!type||!this.playing||!this.ctx)return;const c=this.ctx,size=c.sampleRate*2,buffer=c.createBuffer(1,size,c.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<size;i++)samples[i]=(Math.random()*2-1)*(type==='traffic'?.5:1);const src=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();src.buffer=buffer;src.loop=true;filter.type=type==='rain'?'highpass':'lowpass';filter.frequency.value=type==='rain'?2000:type==='traffic'?300:4500;gain.gain.value=type==='static'?.06:.12;src.connect(filter);filter.connect(gain);gain.connect(this.master);src.start();this.soundscape=gain;this.soundscapeSource=src;}
 _setSession(t){if(!('mediaSession'in navigator))return;try{navigator.mediaSession.metadata=new MediaMetadata({title:t.title,artist:t.artist+' · SYNTHWAVE.fm',album:t.album||'SYNTHWAVE.fm',artwork:t.cover?[{src:t.cover}]:[]});navigator.mediaSession.setActionHandler('play',()=>global.togglePlay());navigator.mediaSession.setActionHandler('pause',()=>global.togglePlay());navigator.mediaSession.setActionHandler('nexttrack',()=>global.next());navigator.mediaSession.setActionHandler('previoustrack',()=>global.previous());this._sessionState()}catch(e){console.debug('Media Session unavailable',e)}}
 _sessionState(){if('mediaSession'in navigator)try{navigator.mediaSession.playbackState=this.playing?'playing':'paused'}catch(_){}}
}
global.SynthwaveAudio=new AudioEngine();
})(window);
