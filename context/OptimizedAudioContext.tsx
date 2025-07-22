'use client';
import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback, 
  useRef,
  useMemo
} from 'react';

interface AudioContextType {
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  playSound: (soundId: string, volume?: number) => Promise<void>;
  backgroundAudio: HTMLAudioElement | null;
  isLoading: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    // 提供默认值，避免错误
    return {
      isAudioMuted: true,
      toggleAudioMute: () => {},
      playSound: async () => {},
      backgroundAudio: null,
      isLoading: true,
    };
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 使用 Map 缓存音频实例
  const soundCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const loadingPromisesRef = useRef<Map<string, Promise<void>>>(new Map());

  // 音频文件配置
  const soundConfig = useMemo(() => [
    { id: 'background', src: '/voices/background-voice.mp3', loop: true, volume: 0.6 },
    { id: 'fire', src: '/voices/fire-burning.mp3', loop: true, volume: 0.8 },
    { id: 'no', src: '/voices/no.mp3', loop: false, volume: 1.0 },
    { id: 'yes', src: '/voices/yes.mp3', loop: false, volume: 1.0 },
  ], []);

  // 预加载单个音频文件
  const preloadAudio = useCallback((config: typeof soundConfig[0]): Promise<void> => {
    const existingPromise = loadingPromisesRef.current.get(config.id);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const audio = new Audio(config.src);
      audio.preload = 'auto';
      audio.loop = config.loop;
      audio.volume = config.volume;

      const handleCanPlay = () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
        
        soundCacheRef.current.set(config.id, audio);
        
        // 背景音乐特殊处理
        if (config.id === 'background') {
          setBackgroundAudio(audio);
        }
        
        resolve();
      };

      const handleError = () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
        console.warn(`Failed to load audio: ${config.src}`);
        reject(new Error(`Failed to load audio: ${config.src}`));
      };

      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('error', handleError);

      // 设置超时
      setTimeout(() => {
        if (!soundCacheRef.current.has(config.id)) {
          handleError();
        }
      }, 10000);
    });

    loadingPromisesRef.current.set(config.id, promise);
    return promise;
  }, []);

  // 预加载所有音频文件
  useEffect(() => {
    let isMounted = true;

    const loadAllAudio = async () => {
      if (typeof window === 'undefined') return;

      try {
        const loadPromises = soundConfig.map(config => 
          preloadAudio(config).catch(error => {
            console.warn(`Failed to preload ${config.id}:`, error);
            return undefined; // 继续加载其他音频
          })
        );

        await Promise.allSettled(loadPromises);
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error preloading audio:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAllAudio();

    return () => {
      isMounted = false;
    };
  }, [soundConfig, preloadAudio]);

  // 背景音乐控制
  useEffect(() => {
    if (!backgroundAudio) return;

    const handleAudioState = async () => {
      try {
        backgroundAudio.muted = isAudioMuted;
        
        if (!isAudioMuted) {
          await backgroundAudio.play();
        } else {
          backgroundAudio.pause();
        }
      } catch (error) {
        console.warn('Background audio control error:', error);
      }
    };

    handleAudioState();
  }, [isAudioMuted, backgroundAudio]);

  // 切换音频静音状态
  const toggleAudioMute = useCallback(() => {
    setIsAudioMuted(prev => !prev);
  }, []);

  // 播放音效
  const playSound = useCallback(async (soundId: string, volume?: number): Promise<void> => {
    if (isAudioMuted) return;

    const sound = soundCacheRef.current.get(soundId);
    if (!sound) {
      console.warn(`Sound ${soundId} not found or not loaded`);
      return;
    }

    try {
      // 重置播放位置
      sound.currentTime = 0;
      
      // 设置音量
      if (volume !== undefined) {
        sound.volume = Math.max(0, Math.min(1, volume));
      }
      
      await sound.play();
    } catch (error) {
      console.warn(`Error playing sound ${soundId}:`, error);
    }
  }, [isAudioMuted]);

  // 清理资源
  useEffect(() => {
    return () => {
      soundCacheRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      soundCacheRef.current.clear();
      loadingPromisesRef.current.clear();
    };
  }, []);

  const contextValue = useMemo(() => ({
    isAudioMuted,
    toggleAudioMute,
    playSound,
    backgroundAudio,
    isLoading,
  }), [isAudioMuted, toggleAudioMute, playSound, backgroundAudio, isLoading]);

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};