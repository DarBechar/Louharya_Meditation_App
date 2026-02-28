import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export interface AudioPlayerState {
  isLoaded: boolean;
  isPlaying: boolean;
  duration: number;
  position: number;
  progress: number;
}

export function useAudioPlayer(audioUrl?: string) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isLoaded: false,
    isPlaying: false,
    duration: 0,
    position: 0,
    progress: 0,
  });

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  useEffect(() => {
    if (!audioUrl) return;
    let sound: Audio.Sound;

    (async () => {
      sound = new Audio.Sound();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setState({
          isLoaded: true,
          isPlaying: status.isPlaying,
          duration: status.durationMillis ?? 0,
          position: status.positionMillis,
          progress: status.durationMillis
            ? status.positionMillis / status.durationMillis
            : 0,
        });
      });
      await sound.loadAsync({ uri: audioUrl });
      soundRef.current = sound;
    })();

    return () => {
      sound?.unloadAsync();
    };
  }, [audioUrl]);

  const play = useCallback(async () => {
    await soundRef.current?.playAsync();
  }, []);

  const pause = useCallback(async () => {
    await soundRef.current?.pauseAsync();
  }, []);

  const seek = useCallback(async (positionMs: number) => {
    await soundRef.current?.setPositionAsync(positionMs);
  }, []);

  const toggle = useCallback(async () => {
    if (state.isPlaying) await pause();
    else await play();
  }, [state.isPlaying, play, pause]);

  return { ...state, play, pause, seek, toggle };
}
