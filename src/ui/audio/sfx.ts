import { Howl, Howler } from "howler";

const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAA";

Howler.volume(0.18);

const cardTap = new Howl({
  src: [SILENT_WAV],
  volume: 0.8,
});

const confirm = new Howl({
  src: [SILENT_WAV],
  volume: 1,
});

export function playCardTap(): void {
  cardTap.play();
}

export function playConfirm(): void {
  confirm.play();
}
