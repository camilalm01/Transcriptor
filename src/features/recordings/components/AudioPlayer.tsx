interface Props {
  audioUrl?: string;
}

export default function AudioPlayer({
  audioUrl,
}: Props) {

  if (!audioUrl) {
    return null;
  }

  return (
    <audio
      controls
      className="w-full"
      src={audioUrl}
    />
  );
}