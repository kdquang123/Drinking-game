# Thật hay Thách – Chén Vào, Chuyện Ra

Angular 22 (standalone, zoneless, signals) + Tailwind CSS 4. Web mobile-first, khung cố định 390px.

```bash
npm start          # http://localhost:4200
npm run build
npm test
```

Muốn mở trên điện thoại trong cùng mạng: `npx ng serve --host 0.0.0.0`, sau đó vào `http://<IP máy>:4200`.

## Cấu trúc

```
src/
  styles/
    tokens.css            Giá trị màu của 3 theme (dark / light26 / light27) – nguồn duy nhất
    tailwind-theme.css    Map token → class Tailwind, bo góc, độ nổi, thang chữ type-*
    base.css              Base, khung .app-frame 390px, hiệu ứng đổi theme
  app/
    core/
      storage/            StorageService + STORAGE_KEYS
      theme/              ThemeService, THEMES, THEME_META
      game/               GameSessionStore (ván đang chơi), model Player / Level / PlayMode
      content/            Model câu hỏi (Question, QuestionBank)
    shared/
      ui/                 Icon, IconButton, Button, Segmented, Avatar
      illustrations/      Logo, WheelMark, CardsMark
    features/
      home/               Trang chủ ✔
      settings/           TẠM: chỉ có nút đổi theme
      placeholder/        Trang tạm cho nguoi-choi, quay-chai, lat-the
public/data/questions.json   Bộ câu hỏi (thay file là xong, không cần build lại)
```

## Theme

- Màu đặt theo vai trò, tự đổi theo theme: `bg-surface`, `text-muted`, `bg-primary text-on-primary`, `bg-truth`, `fill-dare`, `stroke-ink`, `bg-w3 text-wt3`…
- Bảng màu mặc định của Tailwind đã bị tắt. Một class như `bg-red-500` sẽ không sinh ra CSS, nên mọi màu bắt buộc phải đi qua token.
- Đổi theme toàn app: `inject(ThemeService).set('light27')`.
- Xem trước theme trong một khung (màn Chọn giao diện): gắn `[attr.data-theme]="preview()"` lên khung đó. Không cần gọi service.
- Thêm theme mới: thêm một khối `[data-theme='…']` vào `tokens.css`, thêm key vào `THEMES` / `THEME_META`, rồi thêm vào script trong `index.html`.

### Bổ sung so với design system v1.0

| Token | Lý do |
|---|---|
| `back-on` | Màu nội dung trên mặt sau thẻ úp (6.13 có nhắc nhưng chưa khai báo) |
| `primary-strong` / `on-primary-strong` | Nền "đang chọn" có chữ nhỏ (segmented, ✓). Ở Light 2027 là `#2F6BF0` để đạt 4.5:1 |
| `w4…w9`, `wt4…wt9` | 10 màu người chơi khác nhau. Mỗi người giữ 1 slot suốt ván, nên 2 lát cạnh nhau không bao giờ trùng màu |
| `backdrop` | Nền bên ngoài khung 390px khi mở trên tablet/desktop |
| Light 2027 `w0` → `#2F6BF0` | Chữ trắng trên avatar/lát đạt tương phản |

## Thang chữ (`type-*`)

`type-display-xl` · `type-hero` · `type-display-l` · `type-display-m` · `type-button-l` · `type-card-keyword` · `type-title` · `type-avatar` · `type-card-body` · `type-body-l` · `type-body-m` · `type-action` · `type-control` · `type-body-s` · `type-caption` · `type-label`

Chữ HOA thì thêm `uppercase`. `<html lang="vi">` giúp "đ" chuyển đúng thành "Đ".

Độ nổi: `lip`, `active:pressed`, `card-frame` (chỉ dùng cho thẻ bài), `ring-selected`, `ring-error`.

## Lưu trữ (localStorage)

| Key | Nội dung | Xoá khi |
|---|---|---|
| `thth.theme` | Theme đang dùng | Không xoá |
| `thth.session.v1` | Ván đang chơi: người chơi, chế độ, mức | `GameSessionStore.end()`, không còn người chơi, hoặc quá 12h |

## Câu hỏi (`public/data/questions.json`)

```json
{ "id": "thach-vua-04", "kind": "thach", "level": "vua", "topic": "drink",
  "pre": "Uống một ngụm ", "hl": "không dùng tay", "post": "", "timer": 60 }
```

- `kind`: `that` | `thach` | `uong`. `level`: `nhe` | `vua` | `nang`. `topic`: `love` | `social` | `drink` (sau này có thêm `body` | `vote` | `secret`).
- Câu đầy đủ = `pre + hl + post`, tối đa 110 ký tự. `hl` là phần được tô màu.
- Viết chữ thường, thẻ tự chuyển sang HOA.
- `timer` chỉ dùng cho thẻ Thách. `sips` chỉ dùng cho thẻ Phạt uống. Thẻ Thật/Thách tính số ngụm theo mức: 1 / 2 / 3.
- Tải bằng `HttpClient` từ `QUESTION_BANK_URL` (`provideHttpClient` đã được cấu hình sẵn).
