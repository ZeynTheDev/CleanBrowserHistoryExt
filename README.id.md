*Baca dalam bahasa lain: [🇬🇧 English](README.md)*
# 🗑️ Clean Browser History (Ghost Mode)
> [!NOTE]
> Current Version: 2.1.20032026

> "Ghost mode for your doomscrolling sessions. Keeps your history clean."

Sebuah ekstensi browser yang ringan, cepat, dan *robust* untuk menjaga histori browser tetap bersih saat sesi *doomscrolling*-mu. Keseluruhannya dibuat menggunakan HTML, CSS, dan Vanilla JavaScript (Manifest V3) tanpa *library* eksternal.

📖 **[Baca Panduan Pengguna Lengkap di Wiki Kami!](https://github.com/ZeynTheDev/CleanBrowserHistoryExt/wiki)**

## 🌟 Apa yang Baru di Versi 2.1
Ekstensi ini baru saja mendapatkan pembaruan masif untuk para *Power User*!
* **Aturan Path-Specific (Custom URL):** Kamu sekarang bisa menargetkan bagian spesifik dari sebuah situs web! Sebagai contoh, menambahkan `mangadex.org/chapter` atau `youtube.com/watch` akan langsung menghapus histori bacaan/tontonanmu, namun tetap membiarkan kunjungan di beranda utama tersimpan dengan aman.
* **Backup & Restore:** Menghabiskan banyak waktu menyusun *Blacklist*/*Whitelist* yang sempurna? Kamu sekarang bisa mengekspor (Export) dan mengimpor (Import) daftarmu sebagai fail JSON yang aman.
* **Dukungan Bilingual:** *Dashboard* Opsi sekarang sepenuhnya mendukung pergantian bahasa secara mulus antara bahasa Inggris (EN) dan bahasa Indonesia (ID) melalui menu *dropdown*.
* **UI Modern & Inline Editing:** *Dashboard* telah dipoles menggunakan ikon Google Material Symbols dan sekarang mendukung pengeditan URL secara langsung dari daftar tanpa perlu menghapus dan menambahkannya kembali.

## ✨ Fitur Utama
* **Dual Operation Mode:**
  * **Erase Listed Only (Blacklist):** Hanya menghapus *history* dari situs/jalur (*path*) yang didaftarkan secara eksplisit.
  * **Never Erase Listed (Whitelist):** Menghapus seluruh *history* secara bawaan, KECUALI pada situs-situs yang ada di daftar amanmu.
* **Instant Toggle Popup:** Nyalakan atau matikan "Ghost Mode" untuk tab yang sedang aktif hanya dengan satu klik.
* **Global Keyboard Shortcut:** Tekan `Alt+G` (bawaan) untuk mengatur *cleaning mode* tanpa perlu menggerakkan tetikusmu.
* **Real-time Theme Sync:** Dukungan penuh terhadap mode Gelap dan Terang di seluruh halaman *popup* dan opsi.

## 📸 Screenshots

| Antarmuka Popup | Dashboard Opsi | Export/Import (FITUR BARU!) |
| :---: | :---: | :---: |
| ![Popup UI](assets/v2.0/v2.0popup.png) | ![Options UI](assets/v2.0/v2.0optionpage.png) | ![Export/Import Button](assets/v2.1/v2.1exportimport.png) |

## 🚀 Installation (Developer Mode)

Karena ekstensi ini masih dalam tahap pengembangan aktif, kamu dapat menginstal versi *bundled* secara manual:

### Penggunaan Baru
1. **Unduh Rilis Terbaru:** Pergi ke halaman [Releases](../../releases) *repository* ini dan unduh fail `.zip` terbaru (contoh: `CleanBrowserHistoryExtv2.1.zip`).
2. **Ekstrak:** Ekstrak fail ZIP yang telah diunduh ke sebuah folder permanen di komputermu.
3. Buka browser berbasis Chromium (Google Chrome, Brave, Edge, dll).
4. Pergi ke `chrome://extensions/` melalui *address bar*.
5. Nyalakan **Developer mode** dengan mengaktifkannya di tepi pojok kanan atas.
6. Klik tombol **Load unpacked** di kiri atas yang muncul.
7. Pilih folder tempat kamu mengekstrak fail ekstensi.
8. Selesai! Sematkan ikon 🗑️ ke *browser toolbar* untuk memudahkan akses.

### Pembaruan
1. **Unduh Rilis Terbaru:** Unduh fail `.zip` terbaru dari halaman [Releases](../../releases).
2. **Ekstrak & Timpa:** Ekstrak fail ZIP ke folder tempat versi sebelumnya berada di komputermu. **Pastikan aplikasi ZIP extractor milikmu mengganti fail yang sudah ada (replace existing files)** untuk mencegah bentrok antar versi.
3. Pergi ke `chrome://extensions/` di browsermu.
4. Temukan ekstensi **Clean Browser History** dan klik ikon **Muat Ulang / Reload** (🔄).
5. Pastikan nomor versi berhasil diperbarui ke versi terbaru (contoh: `v2.1`).

## ⚙️ Mengapa butuh akses berikut?

Ekstensi ini dibangun dengan keutamaan privasi mutlak. Permohonan akses yang dideklarasikan di `manifest.json` digunakan secara ketat agar fungsi inti ekstensi dapat berjalan:
* `"history"`: Digunakan **hanya** untuk menghapus URL spesifik secara spontan setelah kamu mengaksesnya. Ekstensi ini TIDAK MEMBACA, MENGUMPULKAN, ATAU MENGIRIMKAN data historimu ke server jarak jauh manapun.
* `"storage"`: Digunakan untuk menyimpan preferensi daftar situs, pilihan bahasa, dan kondisi tema secara lokal di browsermu.
* `"tabs"`: Digunakan untuk membaca URL dari tab yang sedang aktif untuk menentukan apakah situs tersebut perlu dipantau, serta untuk mendeteksi penggunaan *hotkey* `Alt+G`.

## 👨‍💻 Author
Dikembangkan oleh **Zeyn The Dev**.

## 📄 Lisensi
Didistribusikan di bawah lisensi **MIT License**. Cek fail `LICENSE` untuk informasi lebih lanjut.