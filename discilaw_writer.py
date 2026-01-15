#!/usr/bin/env python3
"""
Discilaw Blog Writer v4.0 - MDX Edition
Supports raw HTML, automatic .md to .mdx migration, and smart content detection.
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, filedialog, messagebox
import os
import shutil
import subprocess
from datetime import datetime
import re
import unicodedata
import glob


class DiscilawWriter:
    def __init__(self, root):
        self.root = root
        self.root.title("Discilaw Writer v4.0 - MDX Edition")
        self.root.geometry("1050x850")
        self.root.configure(bg="#1a1a2e")

        # Proje Yolları
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        self.images_path = os.path.join(self.project_root, "public", "images", "blog")
        self.content_path = os.path.join(self.project_root, "src", "content", "blog")
        self.selected_image_path = None

        # Başlangıçta .md dosyalarını .mdx'e dönüştür
        self.migrate_md_to_mdx()

        # --- ARAYÜZ TASARIMI ---
        self.build_ui()

    def migrate_md_to_mdx(self):
        """Mevcut .md dosyalarını otomatik olarak .mdx'e dönüştürür."""
        if not os.path.exists(self.content_path):
            return
            
        md_files = glob.glob(os.path.join(self.content_path, "*.md"))
        if md_files:
            count = 0
            for md_file in md_files:
                mdx_file = md_file[:-3] + ".mdx"
                os.rename(md_file, mdx_file)
                count += 1
            if count > 0:
                messagebox.showinfo(
                    "Otomatik Dönüşüm",
                    f"{count} adet .md dosyası .mdx formatına dönüştürüldü.\n\n"
                    "MDX formatı HTML içeriklerini destekler."
                )

    def build_ui(self):
        """Ana arayüzü oluştur."""
        # Ana stil ayarları
        style = ttk.Style()
        style.theme_use('clam')
        style.configure(".", background="#1a1a2e", foreground="#eee")
        style.configure("TFrame", background="#1a1a2e")
        style.configure("TLabel", background="#1a1a2e", foreground="#eee", font=("Segoe UI", 10))
        style.configure("TEntry", fieldbackground="#16213e", foreground="#eee")
        style.configure("TCombobox", fieldbackground="#16213e", foreground="#eee")
        style.configure("TButton", background="#0f3460", foreground="#eee", font=("Segoe UI", 10))
        style.configure("TLabelframe", background="#1a1a2e", foreground="#e94560")
        style.configure("TLabelframe.Label", background="#1a1a2e", foreground="#e94560", font=("Segoe UI", 11, "bold"))
        
        style.configure("Save.TButton", font=("Segoe UI", 12, "bold"))
        style.configure("Publish.TButton", font=("Segoe UI", 12, "bold"))
        
        style.map("TButton", background=[("active", "#e94560")])

        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # ===== ÜST BİLGİLER =====
        info_frame = ttk.LabelFrame(main_frame, text="📝 Makale Bilgileri", padding="15")
        info_frame.pack(fill=tk.X, pady=(0, 15))

        grid_frame = ttk.Frame(info_frame)
        grid_frame.pack(fill=tk.X)

        ttk.Label(grid_frame, text="BAŞLIK:").grid(row=0, column=0, sticky="w", padx=(0, 10))
        self.title_entry = ttk.Entry(grid_frame, font=("Segoe UI", 12))
        self.title_entry.grid(row=0, column=1, sticky="ew", padx=5, ipady=5)

        ttk.Label(grid_frame, text="KATEGORİ:").grid(row=0, column=2, sticky="w", padx=(20, 10))
        self.category_cb = ttk.Combobox(grid_frame, values=[
            "Bilişim Hukuku", "Ceza Hukuku", "Ticaret Hukuku", "İdare Hukuku",
            "Gayrimenkul Hukuku", "Miras Hukuku", "İş Hukuku", "Yapay Zeka Hukuku"
        ], state="readonly", font=("Segoe UI", 10), width=18)
        self.category_cb.current(0)
        self.category_cb.grid(row=0, column=3, sticky="e", padx=5)

        grid_frame.columnconfigure(1, weight=1)

        # Resim Seçimi
        img_frame = ttk.Frame(info_frame)
        img_frame.pack(fill=tk.X, pady=(15, 0))
        
        self.img_btn = ttk.Button(img_frame, text="🖼️ Kapak Resmi Seç", command=self.select_image)
        self.img_btn.pack(side=tk.LEFT)
        
        self.img_label = ttk.Label(img_frame, text="Henüz resim seçilmedi...", foreground="#888")
        self.img_label.pack(side=tk.LEFT, padx=15)

        # ===== ARAÇ ÇUBUĞU =====
        toolbar_frame = ttk.LabelFrame(main_frame, text="🔧 Biçimlendirme Araçları", padding="10")
        toolbar_frame.pack(fill=tk.X, pady=(0, 10))

        toolbar = ttk.Frame(toolbar_frame)
        toolbar.pack(fill=tk.X)

        ttk.Button(toolbar, text="B (Kalın)", width=12, command=lambda: self.wrap_text("<strong>", "</strong>")).pack(side=tk.LEFT, padx=3)
        ttk.Button(toolbar, text="I (İtalik)", width=12, command=lambda: self.wrap_text("<em>", "</em>")).pack(side=tk.LEFT, padx=3)
        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, padx=8, fill=tk.Y)
        ttk.Button(toolbar, text="Başlık (H2)", width=12, command=lambda: self.wrap_text("<h2>", "</h2>")).pack(side=tk.LEFT, padx=3)
        ttk.Button(toolbar, text="Başlık (H3)", width=12, command=lambda: self.wrap_text("<h3>", "</h3>")).pack(side=tk.LEFT, padx=3)
        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, padx=8, fill=tk.Y)
        ttk.Button(toolbar, text="• Madde", width=10, command=lambda: self.insert_at_cursor("<li>", "</li>")).pack(side=tk.LEFT, padx=3)
        ttk.Button(toolbar, text="Alıntı", width=10, command=lambda: self.wrap_text("<blockquote>", "</blockquote>")).pack(side=tk.LEFT, padx=3)
        ttk.Button(toolbar, text="Satır Sonu", width=10, command=lambda: self.insert_at_cursor("<br/>", "")).pack(side=tk.LEFT, padx=3)

        # ===== EDİTÖR =====
        editor_frame = ttk.LabelFrame(main_frame, text="✏️ İçerik (MDX - HTML Destekli)", padding="10")
        editor_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 15))

        self.content_text = scrolledtext.ScrolledText(
            editor_frame,
            height=18,
            font=("Consolas", 12),
            wrap=tk.WORD,
            undo=True,
            bg="#0f0f23",
            fg="#f0f0f0",
            insertbackground="#e94560",
            selectbackground="#e94560",
            selectforeground="#fff",
            padx=10,
            pady=10
        )
        self.content_text.pack(fill=tk.BOTH, expand=True)
        
        # İpucu etiketi
        hint_label = ttk.Label(
            editor_frame,
            text="💡 İPUCU: HTML etiketleri kullanabilirsiniz: <strong>, <em>, <br/>, <h2>, <ul>, <li>, <table> vb.",
            foreground="#888",
            font=("Segoe UI", 9)
        )
        hint_label.pack(anchor="w", pady=(5, 0))

        # ===== ALT BUTONLAR =====
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill=tk.X)

        self.save_btn = ttk.Button(
            btn_frame,
            text="💾 TASLAĞI KAYDET (.mdx)",
            style="Save.TButton",
            command=self.save_draft
        )
        self.save_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10), ipady=10)

        self.push_btn = ttk.Button(
            btn_frame,
            text="🚀 SİTEYİ YAYINLA (Git Push)",
            style="Publish.TButton",
            command=self.publish_site
        )
        self.push_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=10)

        # Durum çubuğu
        self.status_var = tk.StringVar(value="Hazır. Yeni bir makale yazabilirsiniz.")
        status_bar = ttk.Label(self.root, textvariable=self.status_var, foreground="#888", font=("Segoe UI", 9))
        status_bar.pack(fill=tk.X, side=tk.BOTTOM, pady=5, padx=20)

    def slugify(self, text):
        """Başlığı URL-uyumlu slug'a dönüştür."""
        text = text.replace('ı', 'i').replace('İ', 'i').lower()
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
        text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
        return text

    def wrap_text(self, prefix, suffix):
        """Seçili metni etiketlerle sar veya imlece ekle."""
        try:
            start = self.content_text.index("sel.first")
            end = self.content_text.index("sel.last")
            selected = self.content_text.get(start, end).strip()
            self.content_text.delete(start, end)
            self.content_text.insert(start, f"{prefix}{selected}{suffix}")
        except tk.TclError:
            self.content_text.insert(tk.INSERT, f"{prefix}metin{suffix}")

    def insert_at_cursor(self, prefix, suffix):
        """İmleç konumuna ekle."""
        self.content_text.insert(tk.INSERT, f"{prefix}metin{suffix}")

    def select_image(self):
        """Resim seçme dialogu."""
        path = filedialog.askopenfilename(filetypes=[("Resimler", "*.jpg *.jpeg *.png *.webp")])
        if path:
            self.selected_image_path = path
            self.img_label.config(text=os.path.basename(path), foreground="#4ade80")
            self.status_var.set(f"Resim seçildi: {os.path.basename(path)}")

    def contains_html(self, text):
        """Metin HTML etiketi içeriyor mu kontrol et."""
        html_pattern = r'<[a-zA-Z][^>]*>'
        return bool(re.search(html_pattern, text))

    def sanitize_for_mdx(self, content):
        """
        HTML etiketlerini MDX/JSX uyumlu hale getir.
        MDX, self-closing tagları slash ile gerektirir: <br> -> <br/>
        """
        # Self-closing olması gereken HTML tagları
        void_tags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']
        
        for tag in void_tags:
            # <br> -> <br/> (slash olmayan self-closing tagları düzelt)
            pattern = rf'<{tag}(\s[^>]*)?>(?!/)'
            replacement = rf'<{tag}\1/>'
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
            
            # <br /> -> <br/> (fazla boşlukları temizle)
            content = re.sub(rf'<{tag}\s*/>', rf'<{tag}/>', content, flags=re.IGNORECASE)
        
        return content

    def format_content(self, raw_content):
        """
        İçeriği MDX için formatla:
        - HTML varsa: JSX uyumlu hale getir
        - HTML yoksa: Paragrafları <p> ile sar, satır sonlarını <br/> yap
        """
        if self.contains_html(raw_content):
            # HTML içerik - JSX uyumlu hale getir
            return self.sanitize_for_mdx(raw_content)
        
        # Düz metin - HTML formatına dönüştür
        paragraphs = re.split(r'\n{2,}', raw_content)
        formatted_paras = []
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # Tek satırlık newline'ları <br/> ile değiştir
            para = para.replace('\n', '<br/>\n')
            formatted_paras.append(f"<p>{para}</p>")
        
        return '\n\n'.join(formatted_paras)

    def save_draft(self):
        """Makaleyi .mdx olarak kaydet."""
        title = self.title_entry.get().strip()
        if not title:
            messagebox.showerror("Eksik", "Lütfen bir başlık girin!")
            return

        raw_content = self.content_text.get("1.0", tk.END).strip()
        if not raw_content:
            messagebox.showerror("Eksik", "Lütfen içerik yazın!")
            return

        slug = self.slugify(title)
        
        # İçeriği formatla
        formatted_content = self.format_content(raw_content)
        
        # Resim işlemleri
        img_dest = "/images/blog/default.jpg"
        if self.selected_image_path:
            if not os.path.exists(self.images_path):
                os.makedirs(self.images_path)
            ext = os.path.splitext(self.selected_image_path)[1]
            new_name = f"{slug}{ext}"
            shutil.copy2(self.selected_image_path, os.path.join(self.images_path, new_name))
            img_dest = f"/images/blog/{new_name}"

        # Açıklama için HTML taglarını temizle
        clean_desc = re.sub(r'<[^>]+>', '', raw_content[:200]).replace('\n', ' ').strip()

        # MDX dosya içeriği
        mdx_content = f'''---
title: "{title}"
description: "{clean_desc}..."
pubDate: {datetime.now().strftime("%Y-%m-%d")}
category: "{self.category_cb.get()}"
image: "{img_dest}"
---

{formatted_content}
'''

        # Dosyayı kaydet
        if not os.path.exists(self.content_path):
            os.makedirs(self.content_path)
            
        filepath = os.path.join(self.content_path, f"{slug}.mdx")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(mdx_content)

        self.status_var.set(f"✅ Kaydedildi: {slug}.mdx")
        messagebox.showinfo(
            "Başarılı",
            f"Makale kaydedildi!\n\n"
            f"📄 Dosya: {slug}.mdx\n"
            f"📁 Konum: {self.content_path}\n\n"
            f"Şimdi 'SİTEYİ YAYINLA' butonuna basabilirsiniz."
        )

    def publish_site(self):
        """Değişiklikleri GitHub'a gönder."""
        if not messagebox.askyesno("Yayınla", "Değişiklikler GitHub'a gönderilecek.\n\nEmin misiniz?"):
            return

        self.status_var.set("Git işlemi başlatılıyor...")
        self.root.update()

        try:
            subprocess.run(["git", "add", "."], cwd=self.project_root, check=True, capture_output=True)
            
            commit_msg = f"content: {self.title_entry.get() or 'Yeni içerik'} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            subprocess.run(["git", "commit", "-m", commit_msg], cwd=self.project_root, check=True, capture_output=True)
            
            subprocess.run(["git", "push"], cwd=self.project_root, check=True, capture_output=True)
            
            self.status_var.set("🚀 Site başarıyla güncellendi!")
            messagebox.showinfo(
                "Başarılı!",
                "Değişiklikler GitHub'a gönderildi.\n\n"
                "Site 1-2 dakika içinde güncellenecek."
            )
        except subprocess.CalledProcessError as e:
            self.status_var.set("❌ Git hatası oluştu")
            messagebox.showerror("Hata", f"Yayınlama başarısız:\n\n{e.stderr.decode() if e.stderr else str(e)}")
        except Exception as e:
            self.status_var.set("❌ Beklenmeyen hata")
            messagebox.showerror("Hata", f"Beklenmeyen hata:\n\n{str(e)}")


if __name__ == "__main__":
    root = tk.Tk()
    app = DiscilawWriter(root)
    root.mainloop()