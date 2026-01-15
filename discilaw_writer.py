import tkinter as tk
from tkinter import ttk, scrolledtext, filedialog, messagebox
import os
import shutil
import subprocess
from datetime import datetime
import re
import unicodedata

class DiscilawWriter:
    def __init__(self, root):
        self.root = root
        self.root.title("Discilaw Writer v3.0 - Wix Tarzı Editör")
        self.root.geometry("1000x800")
        self.root.configure(bg="#f0f2f5")

        # Proje Yolları
        self.project_root = os.getcwd()
        self.images_path = os.path.join(self.project_root, "public", "images", "blog")
        self.content_path = os.path.join(self.project_root, "src", "content", "blog")
        self.selected_image_path = None

        # --- ARAYÜZ TASARIMI ---
        main_frame = ttk.Frame(root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # ÜST BİLGİLER
        info_frame = ttk.LabelFrame(main_frame, text="Makale Künyesi", padding="15")
        info_frame.pack(fill=tk.X, pady=(0, 15))

        # Başlık ve Kategori
        grid_frame = ttk.Frame(info_frame)
        grid_frame.pack(fill=tk.X)
        
        ttk.Label(grid_frame, text="BAŞLIK:").grid(row=0, column=0, sticky="w")
        self.title_entry = ttk.Entry(grid_frame, font=("Arial", 11, "bold"))
        self.title_entry.grid(row=0, column=1, sticky="ew", padx=10, ipady=3)
        
        ttk.Label(grid_frame, text="KATEGORİ:").grid(row=0, column=2, sticky="w")
        self.category_cb = ttk.Combobox(grid_frame, values=[
            "Bilişim Hukuku", "Ceza Hukuku", "Ticaret Hukuku", "İdare Hukuku", 
            "Gayrimenkul Hukuku", "Miras Hukuku", "İş Hukuku", "Yapay Zeka Hukuku"
        ], state="readonly", font=("Arial", 10))
        self.category_cb.current(0)
        self.category_cb.grid(row=0, column=3, sticky="e", padx=10)
        
        grid_frame.columnconfigure(1, weight=1)

        # Resim Alanı
        img_frame = ttk.Frame(info_frame)
        img_frame.pack(fill=tk.X, pady=(10, 0))
        self.img_btn = ttk.Button(img_frame, text="📁 Kapak Resmi Seç", command=self.select_image)
        self.img_btn.pack(side=tk.LEFT)
        self.img_label = ttk.Label(img_frame, text="Henüz resim seçilmedi...", foreground="gray")
        self.img_label.pack(side=tk.LEFT, padx=10)

        # ARAÇ ÇUBUĞU
        toolbar = ttk.Frame(main_frame)
        toolbar.pack(fill=tk.X, pady=(5, 0))
        
        def make_bold(): self.wrap_text("**", "**")
        def make_italic(): self.wrap_text("*", "*")
        def make_h2(): self.wrap_text("\n## ", "\n")
        def make_h3(): self.wrap_text("\n### ", "\n")
        def make_list(): self.wrap_text("\n- ", "")

        ttk.Button(toolbar, text="B (Kalın)", width=10, command=make_bold).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="I (İtalik)", width=10, command=make_italic).pack(side=tk.LEFT, padx=2)
        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, padx=5, fill=tk.Y)
        ttk.Button(toolbar, text="Başlık 1", width=10, command=make_h2).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="Başlık 2", width=10, command=make_h3).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="Liste Yap", width=10, command=make_list).pack(side=tk.LEFT, padx=2)

        # EDİTÖR
        self.content_text = scrolledtext.ScrolledText(main_frame, height=20, font=("Calibri", 12), wrap=tk.WORD, undo=True)
        self.content_text.pack(fill=tk.BOTH, expand=True, pady=5)
        # Varsayılan metin
        self.content_text.insert("1.0", "Buraya yazınızı yazın. 'Enter' tuşu ile yaptığınız paragraflar sitede aynen görünecektir.")

        # ALT BUTONLAR
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill=tk.X, pady=10)

        style = ttk.Style()
        style.configure("Green.TButton", font=("Arial", 11, "bold"), foreground="green")
        style.configure("Blue.TButton", font=("Arial", 11, "bold"), foreground="blue")

        self.save_btn = ttk.Button(btn_frame, text="💾 TASLAĞI OLUŞTUR", style="Blue.TButton", command=self.save_draft)
        self.save_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)

        self.push_btn = ttk.Button(btn_frame, text="🚀 YAYINLA (GİT PUSH)", style="Green.TButton", command=self.publish_site)
        self.push_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)

    def slugify(self, text):
        text = text.replace('ı', 'i').replace('İ', 'i').lower()
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
        text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
        return text

    def wrap_text(self, prefix, suffix):
        try:
            start = self.content_text.index("sel.first")
            end = self.content_text.index("sel.last")
            selected = self.content_text.get(start, end)
            
            # Seçim boşluk içeriyorsa Markdown bozulur (** metin ** çalışmaz)
            # Seçimi temizle ve boşlukları dışarıya taşı
            trimmed = selected.strip()
            if not trimmed: # Sadece boşluk seçilmişse
                self.content_text.delete(start, end)
                self.content_text.insert(start, f"{prefix}{selected}{suffix}")
                return

            leading_ws = selected[:len(selected) - len(selected.lstrip())]
            trailing_ws = selected[len(selected.rstrip()):]
            
            self.content_text.delete(start, end)
            # Boşluklar dışarıda, Markdown işaretleri içerideki metne yapışık: " **metin** "
            formatted = f"{leading_ws}{prefix}{trimmed}{suffix}{trailing_ws}"
            self.content_text.insert(start, formatted)
        except tk.TclError:
            self.content_text.insert(tk.INSERT, f"{prefix}YAZI{suffix}")

    def select_image(self):
        path = filedialog.askopenfilename(filetypes=[("Resimler", "*.jpg *.jpeg *.png")])
        if path:
            self.selected_image_path = path
            self.img_label.config(text=os.path.basename(path), foreground="green")

    def save_draft(self):
        title = self.title_entry.get().strip()
        if not title:
            messagebox.showerror("Eksik", "Lütfen bir başlık girin!")
            return

        slug = self.slugify(title)
        
        # --- WIX FORMAT DÜZELTİCİ (EN ÖNEMLİ KISIM) ---
        raw_content = self.content_text.get("1.0", tk.END).strip()
        
        lines = raw_content.split('\n')
        formatted_lines = []
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Eğer satır boşsa, Markdown paragrafı için boşluk bırak
            if not stripped:
                formatted_lines.append("") 
                continue
                
            # Eğer Başlık (#) veya Liste (-) veya Alıntı (>) ise olduğu gibi bırak
            if stripped.startswith(('#', '-', '*', '>', '1.')):
                formatted_lines.append(line)
            else:
                # Normal bir metinse ve bir sonraki satır da doluysa
                # Markdown'da alt satıra geçmek için satır sonuna 2 boşluk koymak gerekir
                # VEYA direkt paragraf yapmak için 2 kere enter (\n\n) gerekir.
                # Biz kullanıcıyı yormamak için her "Enter"ı "Çift Enter" yapıyoruz.
                formatted_lines.append(line + "\n") 

        final_content = "\n".join(formatted_lines)
        
        # Resim İşlemleri
        img_dest = "/images/blog/default.jpg"
        if self.selected_image_path:
            if not os.path.exists(self.images_path):
                os.makedirs(self.images_path)
            ext = os.path.splitext(self.selected_image_path)[1]
            new_name = f"{slug}{ext}"
            shutil.copy2(self.selected_image_path, os.path.join(self.images_path, new_name))
            img_dest = f"/images/blog/{new_name}"

        frontmatter = f"""---
title: "{title}"
description: "{raw_content[:150].replace(chr(10), ' ')}..."
pubDate: {datetime.now().strftime("%Y-%m-%d")}
category: "{self.category_cb.get()}"
image: "{img_dest}"
---

{final_content}
"""
        
        with open(os.path.join(self.content_path, f"{slug}.md"), "w", encoding="utf-8") as f:
            f.write(frontmatter)
            
        messagebox.showinfo("Başarılı", f"Taslak kaydedildi!\n\nDosya: {slug}.md\n\nŞimdi 'YAYINLA' butonuna basabilirsin.")

    def publish_site(self):
        if not messagebox.askyesno("Yayınla", "Değişiklikler GitHub'a gönderilecek. Emin misin?"):
            return
            
        try:
            subprocess.run(["git", "add", "."], cwd=self.project_root, check=True)
            subprocess.run(["git", "commit", "-m", f"Post: {self.title_entry.get()}"], cwd=self.project_root, check=True)
            subprocess.run(["git", "push"], cwd=self.project_root, check=True)
            messagebox.showinfo("Harika!", "Site başarıyla güncellendi! 1-2 dakika içinde yayında.")
        except Exception as e:
            messagebox.showerror("Hata", f"Yayınlanırken hata oluştu:\n{e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = DiscilawWriter(root)
    root.mainloop()