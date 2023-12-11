import Image from 'next/image';
import { useAudioContext } from '@/context/AudioContent';
import { useRef } from 'react';

const AudioControl = () => {
  const { isAudioMuted, toggleAudioMute } = useAudioContext();

  const bgAudioRef = useRef<HTMLAudioElement>(null);

  const toggleBackgroundVoice = () => {
    toggleAudioMute();
    if (bgAudioRef.current) {
      bgAudioRef.current.play();
    }
  };

  return (
    <>
      <audio ref={bgAudioRef} muted={isAudioMuted} loop>
        <source src="/voices/background-voice.mp3" type="audio/mpeg" />
      </audio>
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
