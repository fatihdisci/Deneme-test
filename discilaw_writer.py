#!/usr/bin/env python3
"""
Discilaw Blog Writer - A Desktop GUI for Managing Astro Blog Posts
Author: Discilaw Development Team
Version: 1.0.0
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, filedialog, messagebox
import os
import re
import shutil
import subprocess
from datetime import datetime
from pathlib import Path


class DiscilawWriter:
    """Main application class for the blog writer GUI."""
    
    # Project paths (relative to this script's location)
    PROJECT_ROOT = Path(__file__).parent
    CONTENT_DIR = PROJECT_ROOT / "src" / "content" / "blog"
    IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "blog"
    
    # Turkish character mapping for slug generation
    TURKISH_CHAR_MAP = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
    }
    
    # Category options
    CATEGORIES = [
        "Bilişim Hukuku",
        "Ceza Hukuku",
        "Ticaret Hukuku",
        "İdare Hukuku",
        "Gayrimenkul Hukuku",
        "Miras Hukuku",
        "İş Hukuku"
    ]
    
    def __init__(self, root):
        """Initialize the application."""
        self.root = root
        self.root.title("Discilaw Blog Yazıcı")
        self.root.geometry("900x750")
        self.root.configure(bg="#1e293b")
        
        # Store selected image path
        self.selected_image_path = None
        
        # Configure styles
        self._configure_styles()
        
        # Build the UI
        self._build_ui()
        
    def _configure_styles(self):
        """Configure ttk styles for a modern dark theme."""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure colors
        style.configure(".", background="#1e293b", foreground="#e2e8f0")
        style.configure("TFrame", background="#1e293b")
        style.configure("TLabel", background="#1e293b", foreground="#e2e8f0", font=("Segoe UI", 10))
        style.configure("Title.TLabel", font=("Segoe UI", 14, "bold"), foreground="#fbbf24")
        style.configure("TEntry", fieldbackground="#334155", foreground="#e2e8f0")
        style.configure("TCombobox", fieldbackground="#334155", foreground="#e2e8f0")
        style.configure("TButton", background="#334155", foreground="#e2e8f0", font=("Segoe UI", 10))
        style.configure("Toolbar.TButton", padding=5, font=("Segoe UI", 10, "bold"))
        style.configure("Primary.TButton", background="#d97706", foreground="white", font=("Segoe UI", 11, "bold"))
        style.configure("Success.TButton", background="#059669", foreground="white", font=("Segoe UI", 11, "bold"))
        style.configure("Status.TLabel", background="#0f172a", foreground="#94a3b8", font=("Segoe UI", 9))
        
        style.map("TButton",
                  background=[("active", "#475569")],
                  foreground=[("active", "#ffffff")])
        style.map("Primary.TButton",
                  background=[("active", "#b45309")])
        style.map("Success.TButton",
                  background=[("active", "#047857")])
    
    def _build_ui(self):
        """Build the main UI layout."""
        # Main container
        main_frame = ttk.Frame(self.root, padding="15")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # === TOP SECTION: Metadata ===
        self._build_metadata_section(main_frame)
        
        # === MIDDLE SECTION: Editor ===
        self._build_editor_section(main_frame)
        
        # === BOTTOM SECTION: Actions ===
        self._build_action_section(main_frame)
        
        # === STATUS BAR ===
        self._build_status_bar()
    
    def _build_metadata_section(self, parent):
        """Build the metadata input section."""
        meta_frame = ttk.Frame(parent)
        meta_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Title
        ttk.Label(meta_frame, text="Başlık:", style="Title.TLabel").grid(row=0, column=0, sticky="w", pady=5)
        self.title_entry = ttk.Entry(meta_frame, width=60, font=("Segoe UI", 11))
        self.title_entry.grid(row=0, column=1, columnspan=3, sticky="ew", padx=(10, 0), pady=5)
        
        # Category
        ttk.Label(meta_frame, text="Kategori:").grid(row=1, column=0, sticky="w", pady=5)
        self.category_combo = ttk.Combobox(meta_frame, values=self.CATEGORIES, width=25, state="readonly")
        self.category_combo.current(0)
        self.category_combo.grid(row=1, column=1, sticky="w", padx=(10, 0), pady=5)
        
        # Date
        ttk.Label(meta_frame, text="Tarih:").grid(row=1, column=2, sticky="w", padx=(20, 0), pady=5)
        self.date_entry = ttk.Entry(meta_frame, width=15)
        self.date_entry.insert(0, datetime.now().strftime("%Y-%m-%d"))
        self.date_entry.grid(row=1, column=3, sticky="w", padx=(10, 0), pady=5)
        
        # Image selection
        ttk.Label(meta_frame, text="Kapak Resmi:").grid(row=2, column=0, sticky="w", pady=5)
        
        image_frame = ttk.Frame(meta_frame)
        image_frame.grid(row=2, column=1, columnspan=3, sticky="w", padx=(10, 0), pady=5)
        
        self.image_btn = ttk.Button(image_frame, text="📷 Resim Seç", command=self._select_image)
        self.image_btn.pack(side=tk.LEFT)
        
        self.image_label = ttk.Label(image_frame, text="(Resim seçilmedi)", foreground="#94a3b8")
        self.image_label.pack(side=tk.LEFT, padx=(10, 0))
        
        # Configure column weights
        meta_frame.columnconfigure(1, weight=1)
    
    def _build_editor_section(self, parent):
        """Build the content editor section."""
        editor_frame = ttk.Frame(parent)
        editor_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 15))
        
        # Toolbar
        toolbar = ttk.Frame(editor_frame)
        toolbar.pack(fill=tk.X, pady=(0, 5))
        
        ttk.Label(toolbar, text="Biçimlendirme:", foreground="#94a3b8").pack(side=tk.LEFT, padx=(0, 10))
        
        # Formatting buttons
        btn_bold = ttk.Button(toolbar, text="B", width=3, style="Toolbar.TButton",
                              command=lambda: self._insert_formatting("**", "**"))
        btn_bold.pack(side=tk.LEFT, padx=2)
        
        btn_italic = ttk.Button(toolbar, text="I", width=3, style="Toolbar.TButton",
                                command=lambda: self._insert_formatting("*", "*"))
        btn_italic.pack(side=tk.LEFT, padx=2)
        
        btn_h2 = ttk.Button(toolbar, text="H2", width=4, style="Toolbar.TButton",
                            command=lambda: self._insert_formatting("## ", ""))
        btn_h2.pack(side=tk.LEFT, padx=2)
        
        btn_h3 = ttk.Button(toolbar, text="H3", width=4, style="Toolbar.TButton",
                            command=lambda: self._insert_formatting("### ", ""))
        btn_h3.pack(side=tk.LEFT, padx=2)
        
        btn_list = ttk.Button(toolbar, text="• Liste", width=7, style="Toolbar.TButton",
                              command=lambda: self._insert_formatting("- ", ""))
        btn_list.pack(side=tk.LEFT, padx=2)
        
        btn_quote = ttk.Button(toolbar, text="❝ Alıntı", width=8, style="Toolbar.TButton",
                               command=lambda: self._insert_formatting("> ", ""))
        btn_quote.pack(side=tk.LEFT, padx=2)
        
        # Content Text Area
        self.content_text = scrolledtext.ScrolledText(
            editor_frame,
            wrap=tk.WORD,
            font=("Consolas", 11),
            bg="#0f172a",
            fg="#e2e8f0",
            insertbackground="#fbbf24",
            selectbackground="#334155",
            padx=10,
            pady=10,
            height=20
        )
        self.content_text.pack(fill=tk.BOTH, expand=True)
    
    def _build_action_section(self, parent):
        """Build the action buttons section."""
        action_frame = ttk.Frame(parent)
        action_frame.pack(fill=tk.X)
        
        # Save Draft Button
        self.save_btn = ttk.Button(
            action_frame,
            text="📝 TASLAĞI KAYDET",
            style="Primary.TButton",
            command=self._save_draft
        )
        self.save_btn.pack(side=tk.LEFT, padx=(0, 10), ipadx=20, ipady=8)
        
        # Publish Button
        self.publish_btn = ttk.Button(
            action_frame,
            text="🚀 SİTEYİ YAYINLA",
            style="Success.TButton",
            command=self._publish_site
        )
        self.publish_btn.pack(side=tk.LEFT, ipadx=20, ipady=8)
        
        # Clear Button
        self.clear_btn = ttk.Button(
            action_frame,
            text="🗑️ Temizle",
            command=self._clear_form
        )
        self.clear_btn.pack(side=tk.RIGHT)
    
    def _build_status_bar(self):
        """Build the status bar at the bottom."""
        status_frame = ttk.Frame(self.root)
        status_frame.pack(fill=tk.X, side=tk.BOTTOM)
        
        self.status_label = ttk.Label(
            status_frame,
            text="Hazır. Yeni bir makale yazabilirsiniz.",
            style="Status.TLabel",
            padding=(10, 5)
        )
        self.status_label.pack(fill=tk.X)
    
    def _set_status(self, message: str, is_error: bool = False):
        """Update the status bar message."""
        color = "#ef4444" if is_error else "#22c55e"
        self.status_label.configure(text=message, foreground=color)
        self.root.update()
    
    def _slugify(self, text: str) -> str:
        """Convert text to URL-friendly slug with Turkish character support."""
        # Convert Turkish characters
        slug = text.lower()
        for turkish, latin in self.TURKISH_CHAR_MAP.items():
            slug = slug.replace(turkish, latin)
        
        # Remove non-alphanumeric characters (except spaces)
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        
        # Replace spaces with hyphens
        slug = re.sub(r'[\s_]+', '-', slug)
        
        # Remove multiple consecutive hyphens
        slug = re.sub(r'-+', '-', slug)
        
        # Trim hyphens from ends
        slug = slug.strip('-')
        
        return slug
    
    def _fix_paragraphs(self, content: str) -> str:
        """
        Convert single newlines to double newlines for proper Markdown paragraphs.
        This prevents the 'wall of text' issue.
        """
        # Split by existing double newlines to preserve intentional breaks
        paragraphs = re.split(r'\n{2,}', content)
        
        # Within each paragraph, replace single newlines with double
        fixed_paragraphs = []
        for para in paragraphs:
            # If it's a list or header, don't modify
            lines = para.split('\n')
            if len(lines) > 1:
                # Check if this is a list or special block
                is_special = all(
                    line.strip().startswith(('-', '*', '#', '>', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.'))
                    or line.strip() == ''
                    for line in lines if line.strip()
                )
                if is_special:
                    fixed_paragraphs.append(para)
                else:
                    # Regular paragraph - join sentences that should be together
                    fixed_paragraphs.append(para.replace('\n', '\n\n'))
            else:
                fixed_paragraphs.append(para)
        
        return '\n\n'.join(fixed_paragraphs)
    
    def _insert_formatting(self, prefix: str, suffix: str):
        """Insert formatting around selected text or at cursor."""
        try:
            # Try to get selected text
            sel_start = self.content_text.index(tk.SEL_FIRST)
            sel_end = self.content_text.index(tk.SEL_LAST)
            selected = self.content_text.get(sel_start, sel_end)
            
            # Replace with formatted text
            self.content_text.delete(sel_start, sel_end)
            self.content_text.insert(sel_start, f"{prefix}{selected}{suffix}")
        except tk.TclError:
            # No selection - insert at cursor with placeholder
            cursor = self.content_text.index(tk.INSERT)
            if suffix:
                self.content_text.insert(cursor, f"{prefix}metin{suffix}")
            else:
                self.content_text.insert(cursor, prefix)
    
    def _select_image(self):
        """Open file dialog to select an image."""
        filetypes = [
            ("Resim Dosyaları", "*.jpg *.jpeg *.png *.webp"),
            ("Tüm Dosyalar", "*.*")
        ]
        
        filepath = filedialog.askopenfilename(
            title="Kapak Resmi Seç",
            filetypes=filetypes
        )
        
        if filepath:
            self.selected_image_path = filepath
            filename = os.path.basename(filepath)
            self.image_label.configure(text=filename, foreground="#22c55e")
            self._set_status(f"Resim seçildi: {filename}")
    
    def _save_draft(self):
        """Save the article as a Markdown file."""
        # Validate inputs
        title = self.title_entry.get().strip()
        if not title:
            messagebox.showerror("Hata", "Lütfen bir başlık girin!")
            return
        
        content = self.content_text.get("1.0", tk.END).strip()
        if not content:
            messagebox.showerror("Hata", "Lütfen içerik yazın!")
            return
        
        # Generate slug
        slug = self._slugify(title)
        
        # Prepare image path
        image_path = ""
        if self.selected_image_path:
            # Copy image to public folder
            try:
                self.IMAGES_DIR.mkdir(parents=True, exist_ok=True)
                ext = Path(self.selected_image_path).suffix
                new_image_name = f"{slug}{ext}"
                new_image_path = self.IMAGES_DIR / new_image_name
                shutil.copy2(self.selected_image_path, new_image_path)
                image_path = f"/images/blog/{new_image_name}"
                self._set_status(f"Resim kopyalandı: {new_image_name}")
            except Exception as e:
                messagebox.showerror("Hata", f"Resim kopyalanamadı: {e}")
                return
        
        # Fix paragraph formatting
        fixed_content = self._fix_paragraphs(content)
        
        # Build frontmatter
        category = self.category_combo.get()
        date = self.date_entry.get().strip()
        
        frontmatter = f'''---
title: "{title}"
description: "{title[:100]}..."
pubDate: {date}
category: "{category}"
tags: []
image: "{image_path}"
---

'''
        
        # Full content
        full_content = frontmatter + fixed_content
        
        # Save to file
        try:
            self.CONTENT_DIR.mkdir(parents=True, exist_ok=True)
            filepath = self.CONTENT_DIR / f"{slug}.md"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(full_content)
            
            self._set_status(f"✅ Kaydedildi: {slug}.md")
            messagebox.showinfo("Başarılı", f"Makale kaydedildi:\n{filepath}")
            
        except Exception as e:
            self._set_status(f"Hata: {e}", is_error=True)
            messagebox.showerror("Hata", f"Dosya kaydedilemedi: {e}")
    
    def _publish_site(self):
        """Push changes to GitHub."""
        try:
            self._set_status("Git işlemi başlatılıyor...")
            
            # Git add
            result = subprocess.run(
                ["git", "add", "."],
                cwd=self.PROJECT_ROOT,
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                raise Exception(f"git add failed: {result.stderr}")
            
            # Git commit
            commit_msg = f"content: Yeni makale eklendi - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            result = subprocess.run(
                ["git", "commit", "-m", commit_msg],
                cwd=self.PROJECT_ROOT,
                capture_output=True,
                text=True
            )
            if result.returncode != 0 and "nothing to commit" not in result.stdout:
                raise Exception(f"git commit failed: {result.stderr}")
            
            # Git push
            result = subprocess.run(
                ["git", "push"],
                cwd=self.PROJECT_ROOT,
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                raise Exception(f"git push failed: {result.stderr}")
            
            self._set_status("🚀 Site başarıyla yayınlandı!")
            messagebox.showinfo("Başarılı", "Değişiklikler GitHub'a gönderildi.\nSite birkaç dakika içinde güncellenecek.")
            
        except Exception as e:
            self._set_status(f"Git hatası: {e}", is_error=True)
            messagebox.showerror("Hata", f"Yayınlama başarısız:\n{e}")
    
    def _clear_form(self):
        """Clear all form fields."""
        if messagebox.askyesno("Onay", "Tüm alanları temizlemek istediğinize emin misiniz?"):
            self.title_entry.delete(0, tk.END)
            self.content_text.delete("1.0", tk.END)
            self.date_entry.delete(0, tk.END)
            self.date_entry.insert(0, datetime.now().strftime("%Y-%m-%d"))
            self.category_combo.current(0)
            self.selected_image_path = None
            self.image_label.configure(text="(Resim seçilmedi)", foreground="#94a3b8")
            self._set_status("Form temizlendi.")


def main():
    """Application entry point."""
    root = tk.Tk()
    app = DiscilawWriter(root)
    root.mainloop()


if __name__ == "__main__":
    main()
