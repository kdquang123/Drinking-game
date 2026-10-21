/*
 * Nhạc nền tổng hợp bằng Web Audio — không cần file nhạc, chạy được offline.
 * Vòng lặp lo-fi 92 BPM, tiến trình Am – F – C – G (mỗi hợp âm 1 nhịp 4/4):
 * pad hợp âm + bass + giai điệu rải + hi-hat nhẹ, âm lượng thấp để không át tiếng nói chuyện.
 * Bật/tắt do AudioService quyết định (setting, đã mở khoá, app đang hiện).
 */
const BPM = 92;
const STEP = 60 / BPM / 4; // nốt móc kép
const LOOKAHEAD = 0.12;
const VOLUME = 0.6; // âm lượng tổng của nhạc nền (0–1), chỉnh số này nếu to/nhỏ quá

// MIDI note → Hz
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

const CHORDS = [
  { root: 45, notes: [57, 60, 64] }, // Am
  { root: 41, notes: [57, 60, 65] }, // F
  { root: 48, notes: [55, 60, 64] }, // C
  { root: 43, notes: [55, 59, 62] }, // G
];
const ARP = [0, 1, 2, 1, 2, 0, 1, 2]; // vị trí nốt trong hợp âm theo từng nốt móc đơn

export class LofiMusic {
  private readonly master: GainNode;
  private readonly noise: AudioBuffer;
  private timer?: ReturnType<typeof setInterval>;
  private nextTime = 0;
  private step = 0;
  private playing = false;

  constructor(private readonly ctx: AudioContext) {
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2600;
    this.master.connect(lp).connect(ctx.destination);

    this.noise = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  start(): void {
    if (this.playing) return;
    const c = this.ctx;
    this.playing = true;
    this.step = 0;
    this.nextTime = c.currentTime + 0.1;
    this.fadeTo(VOLUME, 1.2);
    this.timer = setInterval(() => this.schedule(), 40);
  }

  stop(): void {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    this.fadeTo(0, 0.4);
  }

  private fadeTo(value: number, seconds: number) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  private schedule() {
    const c = this.ctx;
    // Context đang treo thì currentTime đứng yên, tránh dồn lịch phát rồi xả ra một lúc
    if (c.state !== 'running') return;
    // Bị trễ (tab bị throttle) thì nhảy tới hiện tại thay vì phát bù một loạt nốt
    if (this.nextTime < c.currentTime) this.nextTime = c.currentTime + 0.05;
    while (this.nextTime < c.currentTime + LOOKAHEAD) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += STEP;
      this.step = (this.step + 1) % 64; // 4 nhịp × 16 nốt móc kép
    }
  }

  private playStep(s: number, t: number) {
    const chord = CHORDS[Math.floor(s / 16)];
    const inBar = s % 16;
    // Pad: đầu mỗi nhịp, ngân hết nhịp
    if (inBar === 0)
      chord.notes.forEach((n) => this.tone(hz(n), t, STEP * 16, 'triangle', 0.05, 0.4));
    // Bass: phách 1 và 3
    if (inBar === 0 || inBar === 8) this.tone(hz(chord.root), t, STEP * 6, 'sine', 0.22, 0.02);
    // Giai điệu rải: nốt móc đơn, cao hơn 1 quãng tám
    if (inBar % 2 === 0) {
      const n = chord.notes[ARP[inBar / 2]] + 12;
      this.tone(hz(n), t, STEP * 1.6, 'sine', 0.045, 0.005);
    }
    // Hi-hat: phách lệch
    if (inBar % 4 === 2) this.hat(t);
  }

  private tone(
    f: number,
    t: number,
    dur: number,
    type: OscillatorType,
    peak: number,
    attack: number,
  ) {
    const c = this.ctx;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private hat(t: number) {
    const c = this.ctx;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(hp).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + 0.06);
  }
}
