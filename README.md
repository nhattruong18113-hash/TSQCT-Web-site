# Trường Sĩ Quan Chính Trị — Web tra cứu

Trang tra cứu Roblox • Discord • Trello (không cần đăng nhập).

## Cấu trúc
| Đường dẫn | Mô tả |
|---|---|
| `index.html` | Bản **tĩnh** — chạy được trên GitHub Pages (gọi API Roblox qua `roproxy.com`, tin tức qua rss2json). |
| `php/index.php` | Bản **PHP** cho host có PHP (InfinityFree…): proxy Roblox, tin tức, lưu Gmail, hỏi AI Gemini. |
| `php/config.example.php` | Mẫu cấu hình. Copy thành `php/config.php` và điền `gemini_api_key`. |
| `php/data/` | Cache tin + `users.csv` (được chặn truy cập bởi `.htaccess`, bị `.gitignore`). |
| `assets/`, `og.png` | Ảnh nền, logo, ảnh chia sẻ. |

## Triển khai trên GitHub Pages
1. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
2. Mở `https://<user>.github.io/<repo>/`.
3. Sửa các thẻ `og:url`, `og:image`, `twitter:image` trong `index.html` sang URL Pages của bạn.

> GitHub Pages không chạy PHP, nên tính năng **Hỏi AI** và **lưu Gmail** chỉ có ở bản PHP.

## Chạy bản PHP
```bash
cp php/config.example.php php/config.php   # điền key
php -S localhost:8000 -t php
```
Hoặc đặt biến môi trường `GEMINI_API_KEY`.

## Bảo mật
- **Không bao giờ** commit API key hoặc `users.csv` (chứa email người dùng).
- Key Gemini cũ từng nằm trong mã nguồn → hãy **thu hồi (revoke) và tạo key mới** tại https://aistudio.google.com/apikey.
