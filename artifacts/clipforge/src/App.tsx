import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Download,
  FolderOpen,
  Gauge,
  HelpCircle,
  History,
  LayoutTemplate,
  Maximize2,
  MessageCircleQuestion,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Redo2,
  RotateCcw,
  Scissors,
  Settings2,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  Volume2,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Clip = {
  id: number;
  title: string;
  start: number;
  end: number;
  status: 'ready' | 'exporting';
  downloadUrl?: string;
};

const DEMO_CLIPS: Clip[] = [
  { id: 1, title: 'The quiet part nobody tells you', start: 4, end: 18, status: 'ready' },
  { id: 2, title: 'Build for the replay', start: 18, end: 33, status: 'ready' },
  { id: 3, title: 'Make it easy to say yes', start: 33, end: 47, status: 'ready' },
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

function IconButton({
  label,
  testId,
  children,
  onClick,
}: {
  label: string;
  testId: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="cf-icon-btn" title={label} aria-label={label} data-testid={testId} onClick={onClick}>
      {children}
    </button>
  );
}

function ClipRow({ clip, onDownload, onDelete }: { clip: Clip; onDownload: () => void; onDelete: () => void }) {
  return (
    <div className="cf-clip-row" data-testid={`row-clip-${clip.id}`}>
      <div className="cf-clip-thumb" aria-hidden="true">
        <span className="cf-clip-index">0{clip.id}</span>
      </div>
      <div className="cf-clip-copy">
        <span className="cf-clip-title" data-testid={`text-clip-title-${clip.id}`}>{clip.title}</span>
        <span className="cf-clip-meta" data-testid={`text-clip-time-${clip.id}`}>
          {formatTime(clip.start)} — {formatTime(clip.end)} · 9:16
        </span>
        <span className={`cf-clip-status ${clip.status === 'exporting' ? 'pending' : ''}`} data-testid={`status-clip-${clip.id}`}>
          <span /> {clip.status === 'exporting' ? 'Preparing' : 'Ready to export'}
        </span>
      </div>
      <div>
        <IconButton label={`Download clip ${clip.id}`} testId={`button-download-clip-${clip.id}`} onClick={onDownload}>
          <Download size={14} />
        </IconButton>
        <IconButton label={`Remove clip ${clip.id}`} testId={`button-delete-clip-${clip.id}`} onClick={onDelete}>
          <Trash2 size={13} />
        </IconButton>
      </div>
    </div>
  );
}

function Inspector({
  aspect,
  setAspect,
  splitMode,
  setSplitMode,
  duration,
  setDuration,
  clips,
  onSplit,
  onDownloadAll,
  onDownload,
  onDelete,
}: {
  aspect: string;
  setAspect: (value: string) => void;
  splitMode: 'preset' | 'custom';
  setSplitMode: (value: 'preset' | 'custom') => void;
  duration: number;
  setDuration: (value: number) => void;
  clips: Clip[];
  onSplit: () => void;
  onDownloadAll: () => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <aside className="cf-inspector" data-testid="panel-inspector">
      <section className="cf-inspector-section">
        <div className="cf-section-heading">
          <h3>Output format</h3>
          <span>Choose a frame</span>
        </div>
        <div className="cf-format-grid">
          {[
            { id: '9:16', label: 'Portrait', size: '1080×1920', style: '' },
            { id: '1:1', label: 'Square', size: '1080×1080', style: 'square' },
            { id: '16:9', label: 'Landscape', size: '1920×1080', style: 'landscape' },
          ].map((item) => (
            <button
              key={item.id}
              className={`cf-format ${item.style} ${aspect === item.id ? 'selected' : ''}`}
              onClick={() => setAspect(item.id)}
              data-testid={`button-format-${item.id.replace(':', '-')}`}
              aria-pressed={aspect === item.id}
            >
              <span className="cf-format-icon" />
              <b>{item.id}</b>
              <small>{item.label}</small>
            </button>
          ))}
        </div>
        <p className="cf-helper">Your source will be reframed around the active subject. You can fine-tune this after splitting.</p>
      </section>

      <section className="cf-inspector-section">
        <div className="cf-section-heading">
          <h3>Split source</h3>
          <span>3 generated</span>
        </div>
        <div className="cf-select-row">
          <button className={`cf-segment ${splitMode === 'preset' ? 'active' : ''}`} onClick={() => setSplitMode('preset')} data-testid="button-split-preset">Presets</button>
          <button className={`cf-segment ${splitMode === 'custom' ? 'active' : ''}`} onClick={() => setSplitMode('custom')} data-testid="button-split-custom">Custom</button>
        </div>
        {splitMode === 'preset' ? (
          <div className="cf-duration-row">
            {[15, 30, 60].map((value) => (
              <button key={value} className={`cf-duration-pill ${duration === value ? 'selected' : ''}`} onClick={() => setDuration(value)} data-testid={`button-duration-${value}`}>
                {value}s
              </button>
            ))}
          </div>
        ) : (
          <div className="cf-duration-row">
            <label className="cf-helper" htmlFor="custom-duration">Clip length</label>
            <input id="custom-duration" className="cf-number-input" type="number" min={3} max={180} value={duration} onChange={(event) => setDuration(Number(event.target.value) || 3)} data-testid="input-custom-duration" />
            <span className="cf-helper">seconds</span>
          </div>
        )}
        <p className="cf-helper">Split the selected range into tidy, export-ready clips.</p>
        <button className="cf-split-btn" onClick={onSplit} data-testid="button-split-clips">
          <Scissors size={14} /> Split into clips
        </button>
      </section>

      <section className="cf-inspector-section" data-testid="panel-clip-queue">
        <div className="cf-queue-head">
          <div className="cf-section-heading" style={{ marginBottom: 0 }}><h3>Clip queue</h3></div>
          <span className="cf-queue-count" data-testid="text-clip-count">{clips.length}</span>
        </div>
        {clips.length > 0 ? (
          <>
            <div className="cf-clip-list">
              {clips.map((clip) => <ClipRow key={clip.id} clip={clip} onDownload={() => onDownload(clip.id)} onDelete={() => onDelete(clip.id)} />)}
            </div>
            <button className="cf-outline-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 11 }} onClick={onDownloadAll} data-testid="button-download-all">
              <Download size={14} /> Download all
            </button>
          </>
        ) : (
          <div className="cf-queue-empty" data-testid="empty-clip-queue">No clips yet. Set a range, then split your source.</div>
        )}
      </section>
    </aside>
  );
}

function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('midnight-memo — episode 04.mp4');
  const [isDemo, setIsDemo] = useState(true);
  const [sourceDuration, setSourceDuration] = useState(72);
  const [aspect, setAspect] = useState('9:16');
  const [splitMode, setSplitMode] = useState<'preset' | 'custom'>('preset');
  const [duration, setDuration] = useState(15);
  const [rangeStart, setRangeStart] = useState(4);
  const [rangeEnd, setRangeEnd] = useState(47);
  const [currentTime, setCurrentTime] = useState(12.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clips, setClips] = useState<Clip[]>(DEMO_CLIPS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [autoCaptions, setAutoCaptions] = useState(true);
  const [toast, setToast] = useState('');

  const hasVideo = isDemo || Boolean(videoUrl);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;
    if (isPlaying) {
      void video.play().catch(() => {
        setIsPlaying(false);
        notify('Your browser blocked playback. Press play again to continue.');
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoUrl]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2300);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      notify('Choose a video file to start editing.');
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setVideoUrl(nextUrl);
    setVideoFile(file);
    setFileName(file.name);
    setIsDemo(false);
    setClips([]);
    setRangeStart(0);
    setRangeEnd(1);
    setSourceDuration(1);
    setCurrentTime(0);
    notify('Source loaded — ready to forge.');
  };

  const loadDemo = () => {
    setVideoUrl(null);
    setVideoFile(null);
    setIsDemo(true);
    setFileName('midnight-memo — episode 04.mp4');
    setSourceDuration(72);
    setRangeStart(4);
    setRangeEnd(47);
    setCurrentTime(12.4);
    setClips(DEMO_CLIPS);
    notify('Demo project loaded.');
  };

  const resetProject = () => {
    setVideoUrl(null);
    setVideoFile(null);
    setIsDemo(false);
    setClips([]);
    setCurrentTime(0);
    setRangeStart(0);
    setRangeEnd(1);
    setSourceDuration(1);
    notify('Workspace reset. Drop in a source to begin.');
  };

  const handleMetadata = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const nextDuration = video.duration;
    setSourceDuration(nextDuration);
    setRangeStart(0);
    setRangeEnd(Math.min(nextDuration, 42));
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && Number.isFinite(video.currentTime)) {
      setCurrentTime(video.currentTime);
    }
  };

  const seekPreview = (value: number) => {
    const nextTime = Math.min(Math.max(value, 0), sourceDuration);
    setCurrentTime(nextTime);
    if (videoRef.current && videoUrl) {
      videoRef.current.currentTime = nextTime;
    }
  };

  const splitClips = () => {
    if (!hasVideo || rangeEnd <= rangeStart) {
      notify('Choose a valid source range first.');
      return;
    }
    const next: Clip[] = [];
    let cursor = rangeStart;
    let id = 1;
    while (cursor < rangeEnd && next.length < 12) {
      const end = Math.min(cursor + duration, rangeEnd);
      next.push({ id, title: `Clip ${id.toString().padStart(2, '0')} · ${formatTime(cursor)}`, start: cursor, end, status: 'ready' });
      cursor = end;
      id += 1;
    }
    setClips(next);
    notify(`${next.length} clip${next.length === 1 ? '' : 's'} added to the queue.`);
  };

  const getExportMimeType = () => {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? '';
  };

  const getCropSource = (video: HTMLVideoElement, targetRatio: number) => {
    const sourceRatio = video.videoWidth / video.videoHeight;
    if (sourceRatio > targetRatio) {
      const width = video.videoHeight * targetRatio;
      return { sx: (video.videoWidth - width) / 2, sy: 0, sw: width, sh: video.videoHeight };
    }
    const height = video.videoWidth / targetRatio;
    return { sx: 0, sy: (video.videoHeight - height) / 2, sw: video.videoWidth, sh: height };
  };

  const renderClip = async (clip: Clip) => {
    const video = videoRef.current;
    if (!video || !videoUrl || !videoFile) {
      throw new Error('Upload a source video before exporting.');
    }
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error('The video is still loading. Try export again in a moment.');
    }
    if (!HTMLCanvasElement.prototype.captureStream || typeof MediaRecorder === 'undefined') {
      throw new Error('This browser does not support in-browser video export.');
    }
    const targetRatio = aspect === '16:9' ? 16 / 9 : aspect === '1:1' ? 1 : 9 / 16;
    const outputWidth = aspect === '1:1' ? 720 : 720;
    const outputHeight = Math.round(outputWidth / targetRatio);
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare the export canvas.');

    const stream = canvas.captureStream(30);
    const sourceStream = (video as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream?.();
    sourceStream?.getAudioTracks().forEach((track) => stream.addTrack(track));
    const mimeType = getExportMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: BlobPart[] = [];
    const previousTime = video.currentTime;
    const wasPlaying = !video.paused;
    video.pause();

    const waitForSeek = async (time: number) => {
      if (Math.abs(video.currentTime - time) < 0.05) return;
      await new Promise<void>((resolve) => {
        const handleSeeked = () => resolve();
        video.addEventListener('seeked', handleSeeked, { once: true });
        video.currentTime = time;
      });
    };

    await waitForSeek(clip.start);
    const result = await new Promise<Blob>((resolve, reject) => {
      let stopped = false;
      const drawFrame = () => {
        if (stopped) return;
        const crop = getCropSource(video, targetRatio);
        context.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvas.width, canvas.height);
        if (video.currentTime >= clip.end - 0.02 || video.ended) {
          stopped = true;
          video.pause();
          recorder.stop();
          return;
        }
        requestAnimationFrame(drawFrame);
      };
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => reject(new Error('The browser could not encode this clip.'));
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        resolve(new Blob(chunks, { type: mimeType || 'video/webm' }));
      };
      recorder.start(100);
      void video.play().then(drawFrame).catch(() => {
        stopped = true;
        recorder.stop();
        reject(new Error('Playback was blocked while rendering this clip.'));
      });
    });
    video.currentTime = previousTime;
    if (wasPlaying) void video.play().catch(() => undefined);
    return result;
  };

  const triggerDownload = (url: string, name: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const downloadClip = async (id: number) => {
    const clip = clips.find((item) => item.id === id);
    if (!clip) return;
    if (!videoUrl || !videoFile) {
      notify('Upload a source video before exporting clips.');
      return;
    }
    setClips((current) => current.map((item) => item.id === id ? { ...item, status: 'exporting' } : item));
    try {
      const blob = clip.downloadUrl ? null : await renderClip(clip);
      const url = clip.downloadUrl ?? URL.createObjectURL(blob as Blob);
      setClips((current) => current.map((item) => item.id === id ? { ...item, status: 'ready', downloadUrl: url } : item));
      triggerDownload(url, `clipforge-${String(id).padStart(2, '0')}.webm`);
      notify(`Clip ${id.toString().padStart(2, '0')} downloaded.`);
    } catch (error) {
      setClips((current) => current.map((item) => item.id === id ? { ...item, status: 'ready' } : item));
      notify(error instanceof Error ? error.message : 'Export failed. Try again.');
    }
  };

  const downloadAll = async () => {
    if (!clips.length) {
      notify('Split the source into clips before exporting.');
      return;
    }
    if (!videoUrl || !videoFile) {
      notify('Upload a source video before exporting clips.');
      return;
    }
    for (const clip of clips) {
      await downloadClip(clip.id);
    }
    notify('All clips exported to your downloads.');
  };

  const undo = () => {
    loadDemo();
    notify('Restored the last demo edit.');
  };

  return (
    <div className="cf-app">
      <header className="cf-topbar">
        <div className="cf-brand" data-testid="text-brand"><span className="cf-brand-mark"><Scissors size={17} strokeWidth={2.5} /></span>ClipForge</div>
        <div className="cf-project">
          <span className="cf-project-name" data-testid="text-project-name">{fileName}</span>
          <span className="cf-project-status" data-testid="status-project"><span /> Autosaved</span>
        </div>
        <div className="cf-top-actions">
          <IconButton label="Undo last action" testId="button-undo" onClick={undo}><Undo2 size={16} /></IconButton>
          <IconButton label="Redo last action" testId="button-redo" onClick={() => notify('Nothing new to redo.')}><Redo2 size={16} /></IconButton>
          <IconButton label="Open help" testId="button-help" onClick={() => setHelpOpen((open) => !open)}><CircleHelp size={17} /></IconButton>
          <IconButton label="Open settings" testId="button-settings" onClick={() => setSettingsOpen((open) => !open)}><Settings2 size={16} /></IconButton>
          <span className="cf-avatar" data-testid="avatar-user">AR</span>
        </div>
        {helpOpen && (
          <div className="cf-settings" data-testid="panel-help">
            <h3><MessageCircleQuestion size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Quick help</h3>
            <p>Upload a long-form source, set your crop, mark a range on the timeline, then split it into clips.</p>
            <div className="cf-settings-row"><span>Keyboard shortcuts</span><span style={{ color: '#c7ed79', fontFamily: 'var(--app-font-mono)' }}>⌘ /</span></div>
            <button className="cf-outline-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setHelpOpen(false)} data-testid="button-close-help">Got it</button>
          </div>
        )}
        {settingsOpen && (
          <div className="cf-settings" data-testid="panel-settings">
            <h3>Workspace settings</h3>
            <p>Small defaults that keep your first pass moving.</p>
            <div className="cf-settings-row"><span>Auto captions</span><button className={`cf-toggle ${autoCaptions ? 'on' : ''}`} onClick={() => setAutoCaptions((value) => !value)} data-testid="toggle-auto-captions"><i /></button></div>
            <div className="cf-settings-row"><span>Render quality</span><strong style={{ color: '#c7ed79', fontSize: 10 }}>High</strong></div>
            <button className="cf-outline-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setSettingsOpen(false)} data-testid="button-close-settings">Close</button>
          </div>
        )}
      </header>

      <nav className="cf-rail" aria-label="Workspace tools">
        <button className="cf-rail-button active" title="Editor" data-testid="button-nav-editor"><Clapperboard size={18} /></button>
        <button className="cf-rail-button" title="Media bin" data-testid="button-nav-media"><FolderOpen size={18} /></button>
        <button className="cf-rail-button" title="Templates" data-testid="button-nav-templates"><LayoutTemplate size={18} /></button>
        <button className="cf-rail-button" title="Audio" data-testid="button-nav-audio"><Music2 size={18} /></button>
        <div className="cf-rail-bottom">
          <button className="cf-rail-button" title="Version history" data-testid="button-nav-history"><History size={18} /></button>
          <button className="cf-rail-button" title="Help center" data-testid="button-nav-help" onClick={() => setHelpOpen(true)}><HelpCircle size={18} /></button>
        </div>
      </nav>

      <main className="cf-main">
        <div className="cf-workspace-header">
          <div className="cf-breadcrumb"><span className="hidden sm:inline">Workspace</span><span className="cf-breadcrumb-sep">/</span><strong data-testid="text-page-title">Forge a clip</strong></div>
          <div className="cf-header-actions">
            <button className="cf-outline-btn" onClick={resetProject} data-testid="button-reset-project"><RotateCcw size={13} /><span>Reset</span></button>
            <button className="cf-primary-btn" onClick={downloadAll} data-testid="button-export-top"><Download size={13} /><span>Export</span><ChevronDown size={12} /></button>
          </div>
        </div>

        <div className="cf-editor-grid">
          <section className="cf-workspace">
            <div className="cf-preview-card" data-testid="panel-preview">
              <div className="cf-preview-toolbar">
                <span className="cf-label"><span className="dot" /> Preview <span style={{ color: '#586279', fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>· {aspect}</span></span>
                <div className="cf-preview-actions">
                  <IconButton label="Fit preview" testId="button-fit-preview"><Maximize2 size={14} /></IconButton>
                  <IconButton label="Preview options" testId="button-preview-options"><MoreHorizontal size={16} /></IconButton>
                </div>
              </div>
              <div className="cf-stage" data-testid="stage-video-preview">
                {hasVideo ? (
                  <>
                     <div className="cf-video-frame" style={{ aspectRatio: aspect === '16:9' ? '16/9' : aspect === '1:1' ? '1/1' : '9/16' }} data-testid="video-preview-frame">
                       {videoUrl ? (
                         <video
                           ref={videoRef}
                           className="cf-source-video"
                           src={videoUrl}
                           playsInline
                           onLoadedMetadata={handleMetadata}
                           onTimeUpdate={handleTimeUpdate}
                           onPlay={() => setIsPlaying(true)}
                           onPause={() => setIsPlaying(false)}
                           onEnded={() => setIsPlaying(false)}
                           data-testid="video-source"
                         />
                       ) : (
                         <div className="cf-frame-caption"><small>Midnight memo · 04</small>Make room<br />for the work.</div>
                       )}
                    </div>
                     <span className="cf-stage-time" data-testid="text-preview-time">{formatTime(currentTime)} / {formatTime(sourceDuration)}</span>
                    <span className="cf-stage-badge" data-testid="status-preview">{isDemo ? 'DEMO SOURCE' : 'SOURCE READY'}</span>
                  </>
                ) : (
                  <div className="cf-empty-state" data-testid="empty-upload-state">
                    <div className="cf-empty-icon"><Upload size={22} /></div>
                    <h2>Start with a source.</h2>
                    <p>Drop in a long video and ClipForge will give you a clean place to find the moments worth keeping.</p>
                    <div className="cf-empty-buttons">
                      <button className="cf-primary-btn" onClick={() => fileInputRef.current?.click()} data-testid="button-upload-empty"><Upload size={14} /> Upload video</button>
                      <button className="cf-outline-btn" onClick={loadDemo} data-testid="button-load-demo-empty"><Sparkles size={14} /> Load demo</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="cf-transport">
                <button className="cf-play" onClick={() => setIsPlaying((playing) => !playing)} data-testid="button-play-preview" aria-label={isPlaying ? 'Pause preview' : 'Play preview'}>
                  {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                </button>
                 <span className="cf-transport-time" data-testid="text-transport-time">{formatTime(currentTime)} / {formatTime(sourceDuration)}</span>
                 <input
                   className="cf-scrubber"
                   type="range"
                   min="0"
                   max={sourceDuration}
                   step="0.01"
                   value={Math.min(currentTime, sourceDuration)}
                   onChange={(event) => seekPreview(Number(event.target.value))}
                   aria-label="Seek preview"
                   data-testid="input-preview-scrubber"
                 />
                 <div className="cf-volume"><Volume2 size={14} /><input ref={(element) => { if (element && videoRef.current) videoRef.current.volume = Number(element.value) / 100; }} type="range" min="0" max="100" defaultValue="75" onChange={(event) => { if (videoRef.current) videoRef.current.volume = Number(event.target.value) / 100; }} aria-label="Preview volume" data-testid="input-preview-volume" /></div>
              </div>
            </div>

            <div className="cf-timeline" data-testid="panel-timeline">
              <div className="cf-timeline-head">
                <span className="cf-label"><span className="dot" style={{ background: '#ff786d' }} /> Source timeline</span>
                <span className="cf-label" style={{ letterSpacing: 0, textTransform: 'none', fontWeight: 500 }}><Gauge size={13} /> {formatTime(rangeEnd - rangeStart)} selected</span>
              </div>
              <div className="cf-timeline-body">
                 <div className="cf-ruler"><span>00:00</span><span>00:15</span><span>00:30</span><span>00:45</span><span>01:00</span><span>{formatTime(sourceDuration)}</span></div>
                <div className="cf-track" data-testid="timeline-track">
                  <div className="cf-waveform">{Array.from({ length: 47 }, (_, index) => <i key={index} style={{ height: `${14 + ((index * 17) % 31)}%` }} />)}</div>
                   <div className="cf-selection" style={{ left: `${(rangeStart / sourceDuration) * 100}%`, width: `${((rangeEnd - rangeStart) / sourceDuration) * 100}%` }} />
                </div>
                 <input className="cf-range-input" type="range" min="0" max={Math.max(sourceDuration - 0.01, 0.01)} step="0.01" value={Math.min(rangeStart, Math.max(sourceDuration - 0.01, 0.01))} onChange={(event) => setRangeStart(Math.min(Number(event.target.value), rangeEnd - 0.01))} aria-label="Selection start" data-testid="input-range-start" />
                 <input className="cf-range-input" type="range" min="0.01" max={sourceDuration} step="0.01" value={Math.max(rangeEnd, 0.01)} onChange={(event) => setRangeEnd(Math.max(Number(event.target.value), rangeStart + 0.01))} aria-label="Selection end" data-testid="input-range-end" />
                <div className="cf-range-row">
                  <label>IN <output data-testid="text-range-start">{formatTime(rangeStart)}</output></label>
                  <label style={{ textAlign: 'right' }}>OUT <output data-testid="text-range-end">{formatTime(rangeEnd)}</output></label>
                </div>
              </div>
            </div>
          </section>

           <Inspector aspect={aspect} setAspect={setAspect} splitMode={splitMode} setSplitMode={setSplitMode} duration={duration} setDuration={setDuration} clips={clips} onSplit={splitClips} onDownloadAll={downloadAll} onDownload={downloadClip} onDelete={(id) => { setClips((current) => { const removed = current.find((clip) => clip.id === id); if (removed?.downloadUrl) URL.revokeObjectURL(removed.downloadUrl); return current.filter((clip) => clip.id !== id); }); notify('Clip removed from queue.'); }} />
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFile} hidden data-testid="input-upload-video" />
      {toast && <div className="cf-toast" role="status" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;