import Image from 'next/image';
import { useAudioContext } from '@/context/AudioContent';

const AudioControl = () => {
  const audioContext = useAudioContext();

  if (!audioContext) {
    return null;
  }

  const { isAudioMuted, toggleAudioMute, audio } = audioContext;

  const toggleBackgroundVoice = () => {
    toggleAudioMute();

    if (audio && !isAudioMuted) {
      audio.play().catch((e) => console.error('Error playing audio:', e));
    }
  };

  return (
    <>
      <button
        className="fixed bottom-12 right-12 z-50 w-12"
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
