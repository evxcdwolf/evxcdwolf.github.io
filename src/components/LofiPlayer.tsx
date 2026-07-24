import React, { useState, useRef, useEffect } from 'react';
import { AudioTrack } from '../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, Sparkles, Radio } from 'lucide-react';

interface LofiPlayerProps {
  tracks: AudioTrack[];
}

export const LofiPlayer: React.FC<LofiPlayerProps> = ({ tracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [customTrackUrl, setCustomTrackUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [trackList, setTrackList] = useState<AudioTrack[]>(tracks);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = trackList[currentTrackIndex] || tracks[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % trackList.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 150);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 150);
  };

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTrackUrl) return;

    const newTrack: AudioTrack = {
      id: `custom-${Date.now()}`,
      title: customTitle || 'Custom Lofi Audio',
      artist: 'User Track',
      url: customTrackUrl,
      duration: 'Live',
    };

    setTrackList([newTrack, ...trackList]);
    setCurrentTrackIndex(0);
    setCustomTrackUrl('');
    setCustomTitle('');
    setShowAddModal(false);
  };

  return (
    <section id="player" className="w-full py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Title */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Lofi & Ambient Audio
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Chill beats & background coding soundscapes
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition-all"
          >
            + Add Track
          </button>
        </div>

        {/* Player Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          
          {/* HTML5 Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentTrack?.url}
            onEnded={handleNext}
            preload="none"
          />

          {/* Rotating Vinyl Record Animation */}
          <div className="relative group flex-shrink-0">
            <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-2xl flex items-center justify-center relative overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
              {/* Vinyl Groove Lines */}
              <div className="absolute inset-2 rounded-full border border-zinc-800/60" />
              <div className="absolute inset-4 rounded-full border border-zinc-800/80" />
              <div className="absolute inset-8 rounded-full border border-zinc-800/80" />
              
              {/* Vinyl Center Label */}
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200">
                <span>🦊</span>
              </div>
            </div>

            {/* Glowing Aura when playing */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full bg-white/5 blur-xl pointer-events-none animate-pulse" />
            )}
          </div>

          {/* Track Info & Controls */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                  <span>{isPlaying ? 'NOW PLAYING' : 'PAUSED'}</span>
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {currentTrackIndex + 1} / {trackList.length}
                </span>
              </div>

              <h3 className="text-base font-bold text-white truncate">
                {currentTrack?.title}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {currentTrack?.artist}
              </p>
            </div>

            {/* Simulated Visualizer Frequency Bars */}
            <div className="flex items-end gap-1 h-8 px-2 py-1 bg-zinc-950 rounded-xl border border-zinc-850">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 65, 85, 35, 95, 60, 40, 75, 90, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-zinc-400/80 rounded-t transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 1.2)) % 100)}%` : '15%',
                    opacity: isPlaying ? 0.8 : 0.3,
                  }}
                />
              ))}
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-between gap-4 pt-1">
              
              {/* Media Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold shadow-lg transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 pl-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 accent-zinc-200 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {trackList.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(false);
                setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                  }
                }, 100);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                currentTrackIndex === idx
                  ? 'bg-zinc-800 text-white border-zinc-600 shadow'
                  : 'bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <div className="truncate pr-2">
                <div className="text-xs font-semibold truncate">{t.title}</div>
                <div className="text-[10px] font-mono text-zinc-500">{t.artist}</div>
              </div>
              <Disc className={`w-4 h-4 flex-shrink-0 ${currentTrackIndex === idx ? 'text-emerald-400 animate-spin-slow' : 'text-zinc-600'}`} />
            </div>
          ))}
        </div>

        {/* Add Track Input Drawer */}
        {showAddModal && (
          <form onSubmit={handleAddCustomTrack} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
            <div className="font-bold text-zinc-200">Add Custom Audio Track / Stream URL</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Track Title (e.g. Chill Synth MP3)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
              />
              <input
                type="url"
                placeholder="Audio Direct MP3 or Stream URL"
                value={customTrackUrl}
                onChange={(e) => setCustomTrackUrl(e.target.value)}
                required
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-zinc-100 text-zinc-950 font-bold hover:bg-white"
              >
                Save Track
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
