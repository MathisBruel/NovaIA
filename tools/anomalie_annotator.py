"""
Outil d'annotation des zones d'anomalies pour le jeu Chasseur d'Anomalies.

Usage:
    pip install pillow mysql-connector-python
    python anomalie_annotator.py

Contrôles:
    - Clic gauche sur l'image : placer/déplacer le point d'anomalie
    - Molette souris (ou slider) : ajuster le rayon
    - Bouton "Sauvegarder" : mettre à jour la base de données
    - Boutons "◀ / ▶" : naviguer entre les entrées
"""

import json
import os
import tkinter as tk
from tkinter import messagebox

import mysql.connector
from PIL import Image, ImageDraw, ImageTk

# ─── Configuration BDD ────────────────────────────────────────────────────────
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "specialweek",
}

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_PUBLIC = os.path.join(PROJECT_ROOT, "frontend", "public")
MIGRATION_FILE = os.path.join(PROJECT_ROOT, "migration", "03_chasse_anomalies.sql")

# ─── BDD ─────────────────────────────────────────────────────────────────────

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


def load_entries():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, image_url, titre_image, "
        "coordonnes_anomalie_json, explication, points_accordes "
        "FROM jeu_chasse_anomalies ORDER BY id"
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def save_entry(entry_id, coords_json):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE jeu_chasse_anomalies SET coordonnes_anomalie_json = %s WHERE id = %s",
        (json.dumps(coords_json, ensure_ascii=False), entry_id),
    )
    conn.commit()
    cursor.close()
    conn.close()


def _sql_escape(s):
    """Escape single quotes for SQL string literals."""
    return str(s).replace("'", "''")


def save_to_migration(entries):
    """Régénère 03_chasse_anomalies.sql à partir des entrées en mémoire."""
    lines = [
        "USE specialweek;",
        "SET NAMES utf8mb4;",
        "",
        "INSERT INTO jeu_chasse_anomalies (image_url, titre_image, coordonnes_anomalie_json, explication, points_accordes) VALUES",
    ]
    rows = []
    for entry in entries:
        coords = entry.get("coordonnes_anomalie_json") or ""
        if isinstance(coords, dict):
            coords = json.dumps(coords, ensure_ascii=False)
        rows.append(
            "('{}', '{}', '{}', '{}', {})".format(
                _sql_escape(entry["image_url"]),
                _sql_escape(entry["titre_image"]),
                _sql_escape(coords),
                _sql_escape(entry["explication"]),
                int(entry["points_accordes"]),
            )
        )
    lines.append(",\n".join(rows) + ";")
    lines.append("")
    with open(MIGRATION_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


# ─── Application ──────────────────────────────────────────────────────────────

class AnomalieAnnotator:

    def __init__(self, root):
        self.root = root
        self.root.title("Annotateur d'anomalies — Chasseur d'Anomalies")
        self.root.resizable(True, True)

        self.entries = []
        self.current_index = 0
        self.anomaly_point = None    # (x, y) coords image originale
        self.anomaly_radius = 80
        self.anomaly_type = ""
        self.orig_image = None
        self.display_scale = 1.0
        self._img_offset = (0, 0)
        self._placeholder_text = ""

        self._build_ui()
        self._load_data()

    # ── UI ───────────────────────────────────────────────────────────────────

    def _build_ui(self):
        # Navigation
        top = tk.Frame(self.root)
        top.pack(fill=tk.X, padx=8, pady=4)

        self.btn_prev = tk.Button(top, text="◀ Précédent", command=self._prev)
        self.btn_prev.pack(side=tk.LEFT)

        self.lbl_index = tk.Label(top, text="0 / 0", width=10)
        self.lbl_index.pack(side=tk.LEFT, padx=6)

        self.btn_next = tk.Button(top, text="Suivant ▶", command=self._next)
        self.btn_next.pack(side=tk.LEFT)

        self.lbl_titre = tk.Label(top, text="", font=("Helvetica", 12, "bold"))
        self.lbl_titre.pack(side=tk.LEFT, padx=20)

        # Canvas image
        canvas_frame = tk.Frame(self.root, bg="#1a1a2e")
        canvas_frame.pack(fill=tk.BOTH, expand=True, padx=8)

        self.canvas = tk.Canvas(canvas_frame, bg="#1a1a2e", cursor="crosshair",
                                width=900, height=500)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        self.canvas.bind("<Button-1>", self._on_click)
        self.canvas.bind("<MouseWheel>", self._on_scroll)
        self.canvas.bind("<Configure>", self._on_canvas_resize)

        # Panneau de contrôle
        ctrl = tk.Frame(self.root)
        ctrl.pack(fill=tk.X, padx=8, pady=6)

        # ── Colonne gauche : infos image ─────────────────────────────────────
        left = tk.LabelFrame(ctrl, text="Image", padx=6, pady=4)
        left.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 8))

        self.lbl_img_path = tk.Label(left, text="", wraplength=260,
                                      justify=tk.LEFT, fg="#333333", width=36)
        self.lbl_img_path.pack(anchor=tk.W)

        self.lbl_img_size = tk.Label(left, text="", fg="#888888")
        self.lbl_img_size.pack(anchor=tk.W)

        # ── Colonne centre : anomalie ─────────────────────────────────────────
        mid = tk.LabelFrame(ctrl, text="Zone anomalie", padx=6, pady=4)
        mid.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 8))

        # Type
        tk.Label(mid, text="Type (description courte) :").pack(anchor=tk.W)
        self.type_var = tk.StringVar()
        self.entry_type = tk.Entry(mid, textvariable=self.type_var, width=40)
        self.entry_type.pack(fill=tk.X, pady=(0, 6))

        # Rayon
        tk.Label(mid, text="Rayon (px image originale) :").pack(anchor=tk.W)
        radius_row = tk.Frame(mid)
        radius_row.pack(fill=tk.X)

        self.radius_var = tk.IntVar(value=self.anomaly_radius)
        self.radius_slider = tk.Scale(
            radius_row, from_=10, to=400, orient=tk.HORIZONTAL,
            variable=self.radius_var, length=260,
            command=lambda _: self._on_radius_change()
        )
        self.radius_slider.pack(side=tk.LEFT)

        self.lbl_radius = tk.Label(radius_row, text="80 px", width=7)
        self.lbl_radius.pack(side=tk.LEFT, padx=4)

        # Coords
        self.lbl_coords = tk.Label(mid, text="Point : — (cliquez sur l'image)",
                                    fg="#333")
        self.lbl_coords.pack(anchor=tk.W, pady=(4, 0))

        tk.Button(mid, text="Effacer le point", command=self._clear_point).pack(
            anchor=tk.W, pady=2)

        # ── Colonne droite : explication + save ───────────────────────────────
        right = tk.LabelFrame(ctrl, text="Explication BDD", padx=6, pady=4)
        right.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        self.txt_explication = tk.Text(right, height=5, wrap=tk.WORD,
                                        state=tk.DISABLED)
        self.txt_explication.pack(fill=tk.BOTH, expand=True)

        self.btn_save = tk.Button(
            right, text="Sauvegarder dans la BDD",
            bg="#2ecc71", fg="white", font=("Helvetica", 10, "bold"),
            command=self._save
        )
        self.btn_save.pack(fill=tk.X, pady=(4, 0))

        # Barre de statut
        self.status_var = tk.StringVar(value="Prêt.")
        tk.Label(self.root, textvariable=self.status_var,
                 bd=1, relief=tk.SUNKEN, anchor=tk.W).pack(
            fill=tk.X, side=tk.BOTTOM)

    # ── Données ──────────────────────────────────────────────────────────────

    def _load_data(self):
        try:
            self.entries = load_entries()
        except Exception as e:
            messagebox.showerror("Erreur BDD", f"Impossible de se connecter :\n{e}")
            return
        if self.entries:
            self.current_index = 0
            self._show_entry()

    # ── Navigation ───────────────────────────────────────────────────────────

    def _prev(self):
        if self.current_index > 0:
            self.current_index -= 1
            self._show_entry()

    def _next(self):
        if self.current_index < len(self.entries) - 1:
            self.current_index += 1
            self._show_entry()

    # ── Affichage entrée ─────────────────────────────────────────────────────

    def _show_entry(self):
        entry = self.entries[self.current_index]
        total = len(self.entries)

        self.lbl_index.config(text=f"{self.current_index + 1} / {total}")
        self.lbl_titre.config(text=f"ID {entry['id']}  —  {entry['titre_image']}")

        # Explication
        self.txt_explication.config(state=tk.NORMAL)
        self.txt_explication.delete("1.0", tk.END)
        self.txt_explication.insert(tk.END, entry["explication"])
        self.txt_explication.config(state=tk.DISABLED)

        # Lire les coordonnées existantes
        self.anomaly_point = None
        self.anomaly_radius = 80
        self.anomaly_type = ""

        coords_raw = entry.get("coordonnes_anomalie_json", "") or ""
        if coords_raw.strip():
            try:
                data = json.loads(coords_raw)
                if isinstance(data, dict) and "x" in data and "y" in data:
                    self.anomaly_point = (int(data["x"]), int(data["y"]))
                    self.anomaly_radius = int(data.get("radius", 80))
                    self.anomaly_type = data.get("type", "")
            except (json.JSONDecodeError, ValueError, KeyError):
                pass

        self.radius_var.set(self.anomaly_radius)
        self.type_var.set(self.anomaly_type)

        # Charger l'image depuis image_url
        self.orig_image = None
        image_url = entry.get("image_url", "")
        if image_url:
            abs_path = os.path.join(
                FRONTEND_PUBLIC,
                image_url.lstrip("/").replace("/", os.sep)
            )
            if os.path.isfile(abs_path):
                self._load_image(abs_path)
            else:
                self._draw_placeholder(
                    f"Fichier introuvable :\n{abs_path}"
                )
                self.lbl_img_path.config(text=image_url, fg="#cc0000")
                self.lbl_img_size.config(text="")
        else:
            self._draw_placeholder("Aucune image_url en BDD.")
            self.lbl_img_path.config(text="(vide)", fg="#cc0000")
            self.lbl_img_size.config(text="")

        if self.orig_image:
            self._refresh_canvas()

        self._update_coords_label()
        self.status_var.set(
            f"Entrée {self.current_index + 1}/{total}  |  ID {entry['id']}  |  {image_url}"
        )

    def _load_image(self, path):
        self.orig_image = Image.open(path).convert("RGB")
        rel = os.path.relpath(path, FRONTEND_PUBLIC).replace(os.sep, "/")
        w, h = self.orig_image.size
        self.lbl_img_path.config(text=rel, fg="#333333")
        self.lbl_img_size.config(text=f"{w} × {h} px")

    # ── Canvas ───────────────────────────────────────────────────────────────

    def _draw_placeholder(self, text):
        self.canvas.delete("all")
        w = self.canvas.winfo_width()
        h = self.canvas.winfo_height()
        cx = w // 2 if w > 1 else 450
        cy = h // 2 if h > 1 else 250
        self.canvas.create_text(cx, cy, text=text,
                                 fill="#aaaaaa", font=("Helvetica", 12),
                                 justify=tk.CENTER)
        self._placeholder_text = text

    def _on_canvas_resize(self, _event):
        if self.orig_image:
            self._refresh_canvas()
        elif self._placeholder_text:
            self._draw_placeholder(self._placeholder_text)

    def _refresh_canvas(self):
        if self.orig_image is None:
            return

        self.anomaly_radius = self.radius_var.get()
        self.lbl_radius.config(text=f"{self.anomaly_radius} px")

        canvas_w = max(self.canvas.winfo_width(), 100)
        canvas_h = max(self.canvas.winfo_height(), 100)
        img_w, img_h = self.orig_image.size

        scale = min(canvas_w / img_w, canvas_h / img_h)
        self.display_scale = scale

        disp_w = int(img_w * scale)
        disp_h = int(img_h * scale)

        disp_img = self.orig_image.resize((disp_w, disp_h), Image.LANCZOS)

        if self.anomaly_point is not None:
            draw = ImageDraw.Draw(disp_img)
            dx = int(self.anomaly_point[0] * scale)
            dy = int(self.anomaly_point[1] * scale)
            dr = int(self.anomaly_radius * scale)

            # Cercle principal
            draw.ellipse([dx - dr, dy - dr, dx + dr, dy + dr],
                         outline=(255, 50, 50), width=3)
            # Point central
            cr = max(4, dr // 6)
            draw.ellipse([dx - cr, dy - cr, dx + cr, dy + cr],
                         fill=(255, 50, 50))
            # Croix
            draw.line([dx - dr, dy, dx + dr, dy], fill=(255, 50, 50), width=2)
            draw.line([dx, dy - dr, dx, dy + dr], fill=(255, 50, 50), width=2)

        self.tk_image = ImageTk.PhotoImage(disp_img)
        self.canvas.delete("all")

        offset_x = (canvas_w - disp_w) // 2
        offset_y = (canvas_h - disp_h) // 2
        self._img_offset = (offset_x, offset_y)
        self.canvas.create_image(offset_x, offset_y, anchor=tk.NW,
                                  image=self.tk_image)

    # ── Interactions ─────────────────────────────────────────────────────────

    def _on_click(self, event):
        if self.orig_image is None:
            return
        ox, oy = self._img_offset
        px = (event.x - ox) / self.display_scale
        py = (event.y - oy) / self.display_scale
        img_w, img_h = self.orig_image.size
        px = max(0, min(img_w, px))
        py = max(0, min(img_h, py))
        self.anomaly_point = (int(px), int(py))
        self._update_coords_label()
        self._refresh_canvas()

    def _on_scroll(self, event):
        delta = 8 if event.delta > 0 else -8
        new_r = max(10, min(400, self.anomaly_radius + delta))
        self.radius_var.set(new_r)
        self._on_radius_change()

    def _on_radius_change(self):
        self.anomaly_radius = self.radius_var.get()
        self.lbl_radius.config(text=f"{self.anomaly_radius} px")
        self._update_coords_label()
        self._refresh_canvas()

    def _clear_point(self):
        self.anomaly_point = None
        self._update_coords_label()
        self._refresh_canvas()

    def _update_coords_label(self):
        if self.anomaly_point:
            x, y = self.anomaly_point
            self.lbl_coords.config(
                text=f"Point : ({x}, {y})  |  Rayon : {self.anomaly_radius} px"
            )
        else:
            self.lbl_coords.config(text="Point : — (cliquez sur l'image)")

    # ── Sauvegarde ───────────────────────────────────────────────────────────

    def _save(self):
        if not self.entries:
            return
        entry = self.entries[self.current_index]

        if not self.anomaly_point:
            messagebox.showwarning("Aucun point", "Cliquez sur l'image pour placer le point d'anomalie avant de sauvegarder.")
            return

        x, y = self.anomaly_point
        coords = {
            "type": self.type_var.get().strip(),
            "x": x,
            "y": y,
            "radius": self.anomaly_radius,
        }

        try:
            save_entry(entry["id"], coords)
            self.entries[self.current_index]["coordonnes_anomalie_json"] = json.dumps(coords)
            save_to_migration(self.entries)
            self.status_var.set(
                f"Sauvegarde OK  —  ID {entry['id']}  |  migration mise à jour  |  {coords}"
            )
            self.btn_save.config(bg="#27ae60")
            self.root.after(1500, lambda: self.btn_save.config(bg="#2ecc71"))
        except Exception as e:
            messagebox.showerror("Erreur sauvegarde", str(e))


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    root = tk.Tk()
    root.geometry("1150x780")
    AnomalieAnnotator(root)
    root.mainloop()


if __name__ == "__main__":
    main()
