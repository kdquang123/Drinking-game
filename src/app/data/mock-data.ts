import { CardKind, DrinkRow, Level, LEVELS, Question, Row } from '../core/game/game.model';

const THAT: Record<Level, Row[]> = {
  1: [
    ['secret', 'Món ăn nào bạn ', 'ghét nhất', ' nhưng vẫn giả vờ thích để khỏi mất lòng?'],
    ['secret', 'Lần gần nhất bạn ', 'khóc vì xem phim', ' là phim gì?'],
    ['vote', 'Ai trong nhóm này ', 'trả lời tin nhắn chậm nhất', '? Chỉ thẳng mặt luôn.'],
    ['social', 'Bài hát nào bạn ', 'nghe đi nghe lại', ' nhiều nhất tháng này?'],
    ['secret', 'Biệt danh ', 'xấu hổ nhất', ' bạn từng bị gọi là gì?'],
    ['social', 'App nào bạn ', 'mở nhiều nhất', ' mỗi ngày? Kiểm tra thời gian sử dụng luôn.'],
    ['vote', 'Nếu được đổi chỗ với một người trong nhóm 1 ngày, bạn ', 'chọn ai', '?'],
    ['love', '', 'Crush đầu đời', ' của bạn là ai, gặp ở đâu?'],
    ['secret', 'Thói quen ', 'kỳ cục nhất', ' của bạn khi ở nhà một mình là gì?'],
    ['secret', 'Bạn từng ', 'viện cớ để trốn', ' một buổi đi chơi chưa? Cớ gì?'],
    ['body', 'Kể lại một lần bạn ', 'quê độ nhất', ' trước đám đông.'],
    ['drink', 'Nếu trúng số 1 tỷ, việc ', 'đầu tiên', ' bạn làm là gì?'],
  ],
  2: [
    [
      'love',
      'Trong nhóm này, ai là người bạn từng ',
      'thầm để ý',
      ' nhất? Nói lý do trong 30 giây.',
    ],
    ['social', 'Bạn từng ', 'xem trộm trang cá nhân', ' của người yêu cũ chưa? Kể đi.'],
    ['social', 'Tin nhắn ', 'gần nhất bạn xoá', ' là gửi cho ai?'],
    ['secret', 'Điều gì ở bản thân mà bạn ', 'muốn giấu', ' nhóm này nhất?'],
    ['vote', 'Ai trong nhóm bạn sẽ ', 'không cho mượn tiền', '? Vì sao?'],
    ['drink', 'Lần ', 'say nhất', ' của bạn kết thúc ở đâu?'],
    ['love', 'Bạn từng ', 'thích hai người', ' cùng một lúc chưa?'],
    ['secret', 'Kể một ', 'lời nói dối', ' bạn từng nói với bố mẹ mà họ vẫn tin đến giờ.'],
    ['vote', 'Bạn ', 'ghen tị', ' với ai trong nhóm nhất, vì điều gì?'],
    ['social', 'Bạn đã từng ', 'đọc trộm tin nhắn', ' của ai chưa?'],
    ['love', 'Kiểu người nào khiến bạn ', 'đổ ngay', ' từ cái nhìn đầu tiên?'],
    ['social', 'Lần cuối bạn ', 'nhắn tin lúc say', ' là cho ai, nói gì?'],
  ],
  3: [
    ['love', 'Người yêu cũ nào bạn ', 'vẫn còn nhớ', ' nhiều nhất? Vì sao?'],
    ['secret', 'Điều ', 'hối hận nhất', ' bạn từng làm trong một mối quan hệ là gì?'],
    ['love', 'Nếu phải hẹn hò với một người trong nhóm, bạn ', 'chọn ai', '?'],
    ['secret', 'Bí mật ', 'chưa từng kể', ' với ai trong nhóm này là gì?'],
    ['secret', 'Bạn từng ', 'phụ lòng tin', ' của ai đó chưa? Kể ngắn thôi.'],
    ['vote', 'Ai trong nhóm khiến bạn thấy ', 'khó gần nhất', '? Nói thật lòng nhé.'],
    ['love', 'Lần gần nhất bạn ', 'hôn ai đó', ' là khi nào, ở đâu?'],
    ['love', 'Lý do thật sự khiến bạn ', 'chia tay', ' mối tình gần nhất là gì?'],
    ['love', 'Bạn đã từng ', 'thích người yêu', ' của bạn thân chưa?'],
    ['social', 'Ảnh ', 'chụp màn hình gần nhất', ' trong máy bạn là gì? Cho cả nhóm xem.'],
    ['love', 'Chuyện ', 'xấu hổ nhất', ' từng xảy ra trong một buổi hẹn hò của bạn?'],
    ['secret', 'Nếu được xoá một ký ức, bạn sẽ ', 'xoá chuyện gì', '?'],
  ],
};

const THACH: Record<Level, Row[]> = {
  1: [
    ['vote', 'Nói ', '5 từ', ' mô tả người ngồi bên trái bạn trong 10 giây.', 10],
    ['body', 'Hát ', 'điệp khúc', ' một bài bất kỳ thật to.'],
    ['social', 'Đọc tin nhắn gần nhất của bạn bằng ', 'giọng MC thời sự', '.'],
    ['body', 'Làm ', '10 cái squat', ' ngay bây giờ.', 30],
    ['body', 'Bắt chước ', 'dáng đi', ' của một người trong nhóm, mọi người đoán là ai.'],
    ['vote', 'Nhắm mắt và ', 'đoán đồ vật', ' người bên phải đưa cho bạn.'],
    ['body', 'Nói câu "nồi đồng nấu ốc" ', '3 lần thật nhanh', ' không vấp.'],
    ['body', 'Giữ ', 'mặt nghiêm túc', ' trong lúc cả nhóm chọc cười bạn.', 30],
    ['vote', 'Khen ', 'từng người', ' trong nhóm một câu, không được trùng ý.', 60],
    ['social', 'Chụp ', 'selfie mặt xấu nhất', ' cùng người bên trái.'],
    ['vote', 'Kể một chuyện cười, không ai cười thì ', 'kể thêm câu nữa', '.'],
    ['body', 'Đứng lên ', 'nhảy 15 giây', ' theo bài nhóm chọn.', 15],
  ],
  2: [
    ['social', 'Đọc to ', 'tin nhắn gần nhất', ' trong nhóm chat gia đình.'],
    ['social', 'Để người bên trái ', 'đăng một story', ' bằng máy bạn (bạn được duyệt trước).'],
    ['social', 'Gọi cho ', 'người thứ 3', ' trong danh bạ và hát chúc mừng sinh nhật.', 60],
    ['social', 'Đổi ', 'ảnh đại diện', ' thành ảnh do nhóm chọn, giữ trong 1 tiếng.'],
    ['social', 'Cho cả nhóm xem ', 'lịch sử tìm kiếm', ' gần nhất của bạn.'],
    ['love', 'Diễn lại ', 'cảnh tỏ tình', ' với người đối diện, phải thật nghiêm túc.', 30],
    ['love', 'Để nhóm ', 'chọn 1 emoji', ', bạn phải gửi nó cho crush.'],
    ['body', 'Nói ', 'giọng miền khác', ' cho đến hết lượt sau.'],
    ['love', 'Gọi mọi người là ', '"người đẹp"', ' cho đến hết lượt sau.'],
    ['body', 'Nhảy ', 'một điệu TikTok', ' bất kỳ trong 20 giây.', 20],
    ['body', 'Để người bên phải ', 'vẽ lên tay', ' bạn bằng bút, giữ đến cuối buổi.'],
    ['vote', 'Đoán ', 'món ăn yêu thích', ' của từng người trong nhóm.', 60],
  ],
  3: [
    [
      'social',
      'Nhắn cho người yêu cũ đúng một câu ',
      '"Dạo này ổn không?"',
      ' rồi úp máy tới hết lượt sau.',
      60,
    ],
    ['social', 'Để nhóm ', 'đọc 3 tin nhắn', ' gần nhất giữa bạn và một người họ chọn.'],
    ['love', 'Gọi cho crush và ', 'nói chuyện 1 phút', ' mà không được nhắc tới game.', 60],
    ['social', 'Đăng story ', '"Mình đang cô đơn"', ' và để đó 30 phút.'],
    ['social', 'Nhắn cho ', 'sếp hoặc thầy cô', ' một lời cảm ơn thật lòng.'],
    ['social', 'Để nhóm ', 'soạn một tin nhắn', ', bạn chọn người nhận rồi bấm gửi.'],
    ['love', 'Ngồi ', 'sát người bên trái', ' đến hết lượt sau, nếu người đó đồng ý.'],
    ['secret', 'Thì thầm ', 'một bí mật', ' vào tai người bạn tin nhất trong nhóm.'],
    ['social', 'Cho cả nhóm xem ', '5 ảnh gần nhất', ' trong thư viện.'],
    ['social', 'Để người bên phải ', 'trả lời tin nhắn', ' tiếp theo bạn nhận được.'],
    ['vote', 'Nói thẳng một điều ', 'bạn chưa ưng', ' ở người đối diện, nhẹ nhàng thôi.'],
    ['love', '', 'Mát-xa vai', ' cho người bên trái trong 30 giây.', 30],
  ],
};

const UONG: DrinkRow[] = [
  ['drink', 'Ai ', 'đến muộn nhất', ' buổi hôm nay thì uống!', 2, 'Ai cũng dính'],
  ['drink', 'Ai đang ', 'mặc đồ đen', ' thì uống!', 1, 'Ai cũng dính'],
  ['vote', 'Người ', 'trẻ nhất', ' bàn uống!', 1, 'Một người'],
  ['vote', 'Người ', 'lớn tuổi nhất', ' bàn uống!', 1, 'Một người'],
  ['love', 'Ai ', 'còn độc thân', ' thì uống!', 1, 'Ai cũng dính'],
  ['love', 'Ai ', 'đang có người yêu', ' thì uống!', 2, 'Ai cũng dính'],
  ['drink', '', 'Cả bàn', ' cụng ly và cùng uống!', 1, 'Cả bàn'],
  ['social', 'Ai có ', 'pin dưới 50%', ' thì uống!', 1, 'Ai cũng dính'],
  ['drink', '', 'Người cầm máy', ' chọn một người uống cùng mình.', 2, 'Người cầm máy'],
  ['secret', 'Ai từng ', 'ngủ gật', ' trong lớp hoặc cuộc họp thì uống!', 1, 'Ai cũng dính'],
  ['vote', 'Người ', 'ngồi bên phải', ' người cầm máy uống!', 2, 'Một người'],
  ['drink', 'Ai ', 'chưa uống ngụm nào', ' từ đầu buổi thì uống!', 1, 'Ai cũng dính'],
  ['body', 'Ai ', 'đeo kính', ' thì uống!', 1, 'Ai cũng dính'],
  ['secret', 'Ai ', 'về nhà muộn nhất', ' tuần này thì uống!', 2, 'Ai cũng dính'],
  ['social', 'Ai để ', 'ảnh đại diện là selfie', ' thì uống!', 1, 'Ai cũng dính'],
  ['body', 'Người ', 'cao nhất', ' bàn uống!', 1, 'Một người'],
  ['secret', 'Ai từng ', 'quên sinh nhật', ' bạn thân thì uống!', 2, 'Ai cũng dính'],
  ['drink', '', 'Cả bàn', ' uống một ngụm nước lọc rồi chơi tiếp!', 1, 'Cả bàn'],
];

function fromRow(kind: CardKind, level: Level, row: Row, index: number): Question {
  const [illo, pre, hl, post, timer] = row;
  return {
    id: `${index + 1}`,
    kind,
    level,
    illo,
    pre,
    hl,
    post,
    ...(timer !== undefined && { timer }),
  };
}

function fromDrinkRow(row: DrinkRow, index: number): Question {
  const [illo, pre, hl, post, sips, target] = row;
  return {
    id: `${index + 1}`,
    kind: CardKind.DRINK,
    illo,
    pre,
    hl,
    post,
    sips,
    target,
  };
}

/** Kho toàn bộ câu hỏi, dựng một lần khi load module */
export const QUESTION_BANK: readonly Question[] = [
  ...LEVELS.flatMap((lv) => THAT[lv.value].map((r, i) => fromRow(CardKind.TRUTH, lv.value, r, i))),
  ...LEVELS.flatMap((lv) => THACH[lv.value].map((r, i) => fromRow(CardKind.DARE, lv.value, r, i))),
  ...UONG.map(fromDrinkRow),
];

export interface DeckOptions {
  level: Level;
  /** Mặc định cả ba loại */
  kinds?: CardKind[];
  /** Cứ bao nhiêu thẻ Thật/Thách thì xen một thẻ Phạt uống */
  drinkEvery?: number;
  /** Giới hạn số thẻ, bỏ trống thì dùng hết */
  size?: number;
  /** Cho phép truyền hàm random giả để test */
  random?: () => number;
}

/** Fisher-Yates, không đổi mảng gốc */
function shuffle<T>(list: readonly T[], random = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildDeck(opts: DeckOptions): Question[] {
  const {
    level,
    kinds = ['truth', 'dare', 'drink'],
    drinkEvery = 4,
    size,
    random = Math.random,
  } = opts;

  const main = shuffle(
    QUESTION_BANK.filter((q) => q.kind !== 'drink' && q.level === level && kinds.includes(q.kind)),
    random,
  );
  const drinks = kinds.includes('drink')
    ? shuffle(
        QUESTION_BANK.filter((q) => q.kind === 'drink'),
        random,
      )
    : [];

  // Chỉ có một nhóm thì không cần xen kẽ
  const deck =
    main.length === 0 || drinks.length === 0
      ? [...main, ...drinks]
      : interleave(main, drinks, drinkEvery);

  return size ? deck.slice(0, size) : deck;
}

/** Cứ `every` thẻ chính thì chèn một thẻ phụ; thẻ phụ dư được nối cuối */
function interleave<T>(main: T[], extra: T[], every: number): T[] {
  const out: T[] = [];
  let e = 0;
  main.forEach((q, i) => {
    out.push(q);
    if ((i + 1) % every === 0 && e < extra.length) out.push(extra[e++]);
  });
  return out;
}
