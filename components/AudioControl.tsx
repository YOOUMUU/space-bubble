import Image from 'next/image';
import { useAudioContext } from '@/context/AudioContent';

const AudioControl = () => {
  const { isAudioMuted, toggleAudioMute, audio } = useAudioContext();

  const toggleBackgroundVoice = () => {
    toggleAudioMute();

    // 根据静音状态决定是否播放音频
    if (!isAudioMuted) {
      // 尝试播放音频，如果遇到错误则记录
      audio.play().catch((e) => console.error('Error playing audio:', e));
    }
  };

  return (
    <>
      <button
        className="absolute bottom-12 right-12 z-50 w-12"
        onClick={toggleBackgroundVoice}
      >
        <Image
          src="/qian/voice_control.svg"
          alt="Control"
          width={100}
          height={100}
        />
        {isAudioMuted && (
          <div className="absolute right-6 top-0 z-20 h-12 w-[4px] rotate-[-45deg] bg-[#98485C]"></div>
        )}
      </button>
    </>
  );
};

export default AudioControl;
