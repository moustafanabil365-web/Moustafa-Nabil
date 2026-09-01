import React, { useState, useRef } from 'react';
import { 
  Music, Film, Image as ImageIcon, Mic, Search, MapPin, 
  Sparkles, Play, Pause, Loader2, Download, Upload, Volume2, 
  VolumeX, RefreshCw, Layers, CheckCircle, Radio
} from 'lucide-react';
import { PharaonicCartouche, WingedSunSymbol } from './PharaonicDecorations';

interface AiStudioStudioHubProps {
  destination?: string;
  onApplyImageToPlan?: (imageUrl: string) => void;
}

export const AiStudioStudioHub: React.FC<AiStudioStudioHubProps> = ({
  destination = 'القاهرة والأهرامات، مصر',
  onApplyImageToPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'video' | 'image' | 'transcribe' | 'grounding'>('music');

  // Music State (Lyria)
  const [musicPrompt, setMusicPrompt] = useState(`موسيقى تصويرية فرعونية وملحمية لرحلة استكشاف ${destination} مع آلات الناي والعود والإيقاعات الشرقية`);
  const [musicType, setMusicType] = useState<'clip' | 'pro'>('clip');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicResult, setMusicResult] = useState<{ audioUrl?: string; lyrics?: string; note?: string } | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Video State (Veo 3.1)
  const [videoPrompt, setVideoPrompt] = useState(`جولة سينمائية جوية مذهلة بتقنية 4K فوق معالم ${destination} وقت الغروب الذهبي`);
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [videoImageInput, setVideoImageInput] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgressMsg, setVideoProgressMsg] = useState('');
  const [videoResultUrl, setVideoResultUrl] = useState<string | null>(null);

  // Image Generation & Editing State
  const [imagePrompt, setImagePrompt] = useState(`لقطة فوتوغرافية ساحرة وواقعية لمعالم ${destination} مع انعكاس أشعة الشمس الذهبية`);
  const [imageAspect, setImageAspect] = useState<'16:9' | '1:1' | '9:16' | '4:3'>('16:9');
  const [baseImageInput, setBaseImageInput] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageResult, setGeneratedImageResult] = useState<string | null>(null);

  // Audio Transcribe State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Grounding State (Google Maps & Search)
  const [groundMode, setGroundMode] = useState<'maps' | 'search'>('maps');
  const [groundPrompt, setGroundPrompt] = useState(`ما هي أفضل المطاعم وأوقات عمل المعالم في ${destination} اليوم مع التقييمات الحديثة؟`);
  const [isGrounding, setIsGrounding] = useState(false);
  const [groundResult, setGroundResult] = useState<{ answer: string; metadata?: any } | null>(null);

  // Handle Music Generation
  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    setMusicResult(null);
    try {
      const res = await fetch('/api/ai/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          modelType: musicType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMusicResult({
          audioUrl: data.audioDataUrl,
          lyrics: data.lyrics,
          note: data.note,
        });
      } else {
        alert(data.error || 'تعذر توليد الموسيقى حالياً');
      }
    } catch (e: any) {
      console.error(e);
      alert('حدث خطأ أثناء الاتصال بمحرك Lyria الموسيقي.');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // Handle Video Generation with Veo
  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoResultUrl(null);
    setVideoProgressMsg('جارٍ إرسال الطلب لمحرك Veo 3.1 ومعالجة المشهد السينمائي...');

    try {
      // 1. Initiate Generation
      const initRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspect,
          imageBase64: videoImageInput ? videoImageInput.split(',')[1] : undefined,
        }),
      });
      const initData = await initRes.json();
      if (!initData.operationName) {
        throw new Error(initData.error || 'فشل بدء عملية توليد الفيديو');
      }

      const operationName = initData.operationName;
      setVideoProgressMsg('يتم الآن رندرة الفيديو بالذكاء الاصطناعي... قد يستغرق الأمر دقيقة إلى دقيقتين.');

      // 2. Poll until complete
      let isDone = false;
      let attempts = 0;
      while (!isDone && attempts < 40) {
        await new Promise((r) => setTimeout(r, 6000));
        attempts++;
        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        const pollData = await pollRes.json();
        if (pollData.done) {
          isDone = true;
          break;
        } else {
          setVideoProgressMsg(`جارٍ إخراج لقطات الفيديو ثلاثية الأبعاد (${attempts * 4}%)...`);
        }
      }

      if (isDone) {
        setVideoProgressMsg('اكتمل توليد الفيديو! يتم الآن تحميل البث المباشر...');
        const dlRes = await fetch('/api/video-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        const blob = await dlRes.blob();
        const videoUrl = URL.createObjectURL(blob);
        setVideoResultUrl(videoUrl);
      } else {
        throw new Error('استغرقت عملية الرندرة وقتاً طويلاً، يرجى المحاولة بعد قليل.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ في معالجة الفيديو.');
    } finally {
      setIsGeneratingVideo(false);
      setVideoProgressMsg('');
    }
  };

  // Handle Image Generation / Editing
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedImageResult(null);
    try {
      const res = await fetch('/api/ai/generate-or-edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageAspect,
          base64InputImage: baseImageInput ? baseImageInput.split(',')[1] : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImageResult(data.imageUrl);
      } else {
        alert(data.error || 'تعذر توليد الصورة');
      }
    } catch (e: any) {
      console.error(e);
      alert('خطأ أثناء توليد الصورة بالذكاء الاصطناعي.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle Voice Recording & Transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          setIsTranscribing(true);
          try {
            const res = await fetch('/api/ai/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Data,
                mimeType: 'audio/webm',
              }),
            });
            const data = await res.json();
            if (data.success) {
              setTranscriptionResult(data.transcription);
            } else {
              alert(data.error || 'فشل تحويل الصوت إلى نص');
            }
          } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء معالجة الصوت.');
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('يرجى السماح بالوصول إلى الميكروفون لاستخدام ميزة التفريغ الصوتي.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle Grounded Query
  const handleGroundedQuery = async () => {
    setIsGrounding(true);
    setGroundResult(null);
    try {
      const res = await fetch('/api/ai/grounded-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: groundPrompt,
          groundMode,
          locationContext: destination,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGroundResult({
          answer: data.answer,
          metadata: data.groundingMetadata,
        });
      } else {
        alert(data.error || 'تعذر جلب البيانات المحدّثة');
      }
    } catch (e: any) {
      console.error(e);
      alert('خطأ أثناء الاتصال بمحرك البحث والخرائط.');
    } finally {
      setIsGrounding(false);
    }
  };

  return (
    <div className="bg-[#0b111e] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative overflow-hidden">
      {/* Decorative Pharaonic Background Layer */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#d4af37]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">𓂀</span>
            <span className="px-3 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d061] text-xs font-black border border-[#d4af37]/40">
              مركز إبداع الذكاء الاصطناعي الملكي (AI Studio Hub)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>ستوديو الميديا والبحث الذكي المتقدم</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9eb3cf] mt-1">
            مجهز بأحدث نماذج Google: توليد الموسيقى (Lyria)، تحريك الفيديو (Veo 3)، توليد الصور وتعديلها، التفريغ الصوتي، والربط الحي مع خرائط وبحث Google.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <WingedSunSymbol className="w-20 h-6 opacity-75" />
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
        <button
          onClick={() => setActiveTab('music')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'music'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#141f33] text-[#a4bbd6] hover:text-white hover:bg-[#1a2942]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>موسيقى تصويرية (Lyria)</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'video'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#141f33] text-[#a4bbd6] hover:text-white hover:bg-[#1a2942]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>توليد وتحريك فيديو (Veo 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'image'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#141f33] text-[#a4bbd6] hover:text-white hover:bg-[#1a2942]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>إنشاء وتعديل الصور (Imagen)</span>
        </button>

        <button
          onClick={() => setActiveTab('transcribe')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'transcribe'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#141f33] text-[#a4bbd6] hover:text-white hover:bg-[#1a2942]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>تفريغ الصوت الذكي (Transcribe)</span>
        </button>

        <button
          onClick={() => setActiveTab('grounding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'grounding'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#141f33] text-[#a4bbd6] hover:text-white hover:bg-[#1a2942]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>بحث وخرائط Google الحية (Grounding)</span>
        </button>
      </div>

      {/* Tab 1: Lyria Music Generation */}
      {activeTab === 'music' && (
        <div className="space-y-6 bg-[#0f1726] border border-[#d4af37]/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#f5d061]">
                <Music className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">توليد موسيقى وأجواء الرحلة بواسطة Lyria</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMusicType('clip')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  musicType === 'clip' ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                }`}
              >
                مقطع قصير (30 ثانية)
              </button>
              <button
                onClick={() => setMusicType('pro')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  musicType === 'pro' ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                }`}
              >
                مسار كامل (Lyria Pro)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#9eb3cf] font-semibold">وصف الطابع الموسيقي المطلوب:</label>
            <textarea
              value={musicPrompt}
              onChange={(e) => setMusicPrompt(e.target.value)}
              rows={2}
              className="w-full bg-[#141f33] border border-[#d4af37]/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#d4af37]"
              placeholder="مثال: موسيقى هادئة للأهرامات مع إيقاعات شرقية وألحان الناي..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateMusic}
              disabled={isGeneratingMusic || !musicPrompt}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-black font-black text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {isGeneratingMusic ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ التوليد الموسيقي عبر Lyria...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد النغمة الموسيقية للرحلة</span>
                </>
              )}
            </button>
          </div>

          {musicResult && (
            <div className="mt-4 bg-[#141f33] border border-[#d4af37]/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Volume2 className="w-4 h-4 text-[#d4af37]" />
                  <span>تم التوليد الموسيقي بنجاح!</span>
                </div>
                {musicResult.audioUrl && (
                  <a
                    href={musicResult.audioUrl}
                    download="travel-soundtrack.wav"
                    className="flex items-center gap-1 text-xs text-[#d4af37] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل المقطع</span>
                  </a>
                )}
              </div>

              {musicResult.audioUrl ? (
                <audio controls src={musicResult.audioUrl} className="w-full h-10 mt-2" />
              ) : (
                <p className="text-xs text-[#9eb3cf]">{musicResult.note || musicResult.lyrics}</p>
              )}

              {musicResult.lyrics && (
                <p className="text-xs text-[#d3e2f5] italic bg-[#0b111e] p-2.5 rounded-lg border border-neutral-800">
                  {musicResult.lyrics}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Veo Video Generation */}
      {activeTab === 'video' && (
        <div className="space-y-6 bg-[#0f1726] border border-[#d4af37]/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#f5d061]">
                <Film className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">توليد وتحريك الفيديو السينمائي بواسطة Veo 3</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVideoAspect('16:9')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  videoAspect === '16:9' ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                }`}
              >
                16:9 عريض (أفقي)
              </button>
              <button
                onClick={() => setVideoAspect('9:16')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  videoAspect === '9:16' ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                }`}
              >
                9:16 طولي (ستوري / تيك توك)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#9eb3cf] font-semibold">وصف المشهد السينمائي أو حركة الكاميرا:</label>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              rows={2}
              className="w-full bg-[#141f33] border border-[#d4af37]/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Optional Initial Image Upload to Animate */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#141f33]/60 p-3.5 rounded-xl border border-neutral-800">
            <label className="flex items-center gap-2 px-3 py-2 bg-[#1b2a45] hover:bg-[#223659] text-xs font-bold text-neutral-200 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تحميل صورة لتحريكها إلى فيديو (Image-to-Video)</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setVideoImageInput(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            {videoImageInput && (
              <div className="flex items-center gap-2">
                <img src={videoImageInput} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-[#d4af37]" />
                <button
                  onClick={() => setVideoImageInput(null)}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  إلغاء الصورة
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateVideo}
              disabled={isGeneratingVideo || !videoPrompt}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-black font-black text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {isGeneratingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ الرندرة السينمائية عبر Veo...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>توليد الفيديو السينمائي</span>
                </>
              )}
            </button>
          </div>

          {videoProgressMsg && (
            <div className="bg-[#141f33] border border-blue-500/30 p-3 rounded-xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin shrink-0" />
              <p className="text-xs text-blue-200">{videoProgressMsg}</p>
            </div>
          )}

          {videoResultUrl && (
            <div className="mt-4 bg-[#141f33] border border-[#d4af37]/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                  الفيديو جاهز للمشاهدة والتحميل!
                </span>
                <a
                  href={videoResultUrl}
                  download="veo-travel-cinematic.mp4"
                  className="flex items-center gap-1 text-xs text-[#d4af37] hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل MP4</span>
                </a>
              </div>
              <video controls src={videoResultUrl} className="w-full max-h-[400px] rounded-lg bg-black" />
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Image Generation & Editing */}
      {activeTab === 'image' && (
        <div className="space-y-6 bg-[#0f1726] border border-[#d4af37]/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#f5d061]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">إنشاء وتعديل الصور بدقة 1K بواسطة Imagen</h3>
            </div>
            <div className="flex items-center gap-1.5">
              {(['16:9', '1:1', '9:16', '4:3'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setImageAspect(r)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                    imageAspect === r ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#9eb3cf] font-semibold">وصف الصورة المطلوبة أو التعديل:</label>
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={2}
              className="w-full bg-[#141f33] border border-[#d4af37]/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#141f33]/60 p-3.5 rounded-xl border border-neutral-800">
            <label className="flex items-center gap-2 px-3 py-2 bg-[#1b2a45] hover:bg-[#223659] text-xs font-bold text-neutral-200 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تحميل صورة لتعديلها أو إضافة عناصر إليها</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setBaseImageInput(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            {baseImageInput && (
              <div className="flex items-center gap-2">
                <img src={baseImageInput} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-[#d4af37]" />
                <button
                  onClick={() => setBaseImageInput(null)}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  إلغاء الصورة
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !imagePrompt}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-black font-black text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ إنشاء الصورة بدقة فائقة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد الصورة الآن</span>
                </>
              )}
            </button>
          </div>

          {generatedImageResult && (
            <div className="mt-4 bg-[#141f33] border border-[#d4af37]/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">الصورة المولدة بنجاح:</span>
                <div className="flex items-center gap-3">
                  {onApplyImageToPlan && (
                    <button
                      onClick={() => onApplyImageToPlan(generatedImageResult)}
                      className="px-3 py-1 text-xs rounded-lg bg-[#d4af37] text-black font-bold hover:bg-[#f5d061]"
                    >
                      تعيين كخلفية أو صورة رئيسية للرحلة
                    </button>
                  )}
                  <a
                    href={generatedImageResult}
                    download="generated-travel-view.png"
                    className="flex items-center gap-1 text-xs text-[#d4af37] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل الصورة</span>
                  </a>
                </div>
              </div>
              <img
                src={generatedImageResult}
                alt="AI Generated Destination View"
                className="w-full max-h-[450px] object-cover rounded-xl shadow-lg border border-neutral-800"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Audio Transcription */}
      {activeTab === 'transcribe' && (
        <div className="space-y-6 bg-[#0f1726] border border-[#d4af37]/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#f5d061]">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">تفريغ الصوت والتسجيلات بواسطة gemini-3.5-transcribe</h3>
            </div>
          </div>

          <p className="text-xs text-[#9eb3cf]">
            تحدث بحرية بصوتك عن رغباتك في السفر أو تفاصيل الميزانية أو الأماكن التي تود زيارتها، وسيقوم الذكاء الاصطناعي بتحويلها فورياً إلى نص دقيق.
          </p>

          <div className="flex items-center justify-center p-8 bg-[#141f33] border border-[#d4af37]/20 rounded-2xl">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-sm animate-pulse shadow-xl shadow-red-600/30 cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                <span>جارٍ الاستماع... اضغط لإيقاف التسجيل وتفريغ النص</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={isTranscribing}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#d4af37] hover:bg-[#f5d061] text-black font-black text-sm shadow-xl shadow-[#d4af37]/20 cursor-pointer transition-transform hover:scale-105"
              >
                <Mic className="w-5 h-5" />
                <span>اضغط وتحدث لتفريغ الصوت فورياً</span>
              </button>
            )}
          </div>

          {isTranscribing && (
            <div className="flex items-center justify-center gap-3 py-4 text-sm text-[#f5d061]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ معالجة الصوت وتحويله إلى نص عالي الدقة عبر Gemini Transcribe...</span>
            </div>
          )}

          {transcriptionResult && (
            <div className="bg-[#141f33] border border-[#d4af37]/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#d4af37]">النص المفرغ من التسجيل الصوتي:</span>
                <button
                  onClick={() => navigator.clipboard.writeText(transcriptionResult)}
                  className="text-xs text-[#a4bbd6] hover:text-white"
                >
                  نسخ النص
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed bg-[#0b111e] p-3 rounded-lg border border-neutral-800">
                {transcriptionResult}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Google Maps & Search Grounding */}
      {activeTab === 'grounding' && (
        <div className="space-y-6 bg-[#0f1726] border border-[#d4af37]/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#f5d061]">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">استعلام مباشر وموثوق مع بيانات خرائط وبحث Google</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGroundMode('maps')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  groundMode === 'maps' ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>بيانات خرائط Google (Maps Grounding)</span>
              </button>
              <button
                onClick={() => setGroundMode('search')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  groundMode === 'search' ? 'bg-[#d4af37] text-black' : 'bg-[#141f33] text-neutral-300'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>محرك بحث Google (Search Grounding)</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#9eb3cf] font-semibold">استفسارك حول الأماكن أو الفعاليات الحالية:</label>
            <textarea
              value={groundPrompt}
              onChange={(e) => setGroundPrompt(e.target.value)}
              rows={2}
              className="w-full bg-[#141f33] border border-[#d4af37]/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGroundedQuery}
              disabled={isGrounding || !groundPrompt}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-black font-black text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {isGrounding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ جلب البيانات الحية من Google...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>بحث واستعلام موثوق</span>
                </>
              )}
            </button>
          </div>

          {groundResult && (
            <div className="mt-4 bg-[#141f33] border border-[#d4af37]/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f5d061]">
                <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                <span>إجابة موثوقة ومربوطة ببيانات Google الحية:</span>
              </div>
              <div className="text-sm text-neutral-200 leading-relaxed bg-[#0b111e] p-4 rounded-xl border border-neutral-800 whitespace-pre-wrap">
                {groundResult.answer}
              </div>
              {groundResult.metadata && (
                <div className="text-[11px] text-[#8ea5c4] bg-[#0b111e]/80 p-2.5 rounded-lg border border-neutral-800">
                  <span className="font-semibold text-[#d4af37]">المصادر والتحقق: </span>
                  تم التحقق من الإحداثيات والنتائج عبر واجهة الربط المباشر لـ Google.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
