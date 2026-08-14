import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Redesigned CharacterSelect.tscn & CharacterSelect.gd
# -------------------------------------------------------------
char_tscn = '''[gd_scene load_steps=4 format=3]

[ext_resource type="Script" path="res://scenes/ui/CharacterSelect.gd" id="1_char"]

[sub_stylebox type="StyleBoxFlat" id="StyleBoxFlat_card_norm"]
bg_color = Color(0.1, 0.14, 0.22, 0.95)
border_width_left = 2
border_width_top = 2
border_width_right = 2
border_width_bottom = 2
border_color = Color(0.25, 0.45, 0.7, 0.8)
corner_radius_top_left = 14
corner_radius_top_right = 14
corner_radius_bottom_left = 14
corner_radius_bottom_right = 14
shadow_color = Color(0, 0, 0, 0.5)
shadow_size = 8

[sub_stylebox type="StyleBoxFlat" id="StyleBoxFlat_card_hover"]
bg_color = Color(0.16, 0.22, 0.36, 0.98)
border_width_left = 3
border_width_top = 3
border_width_right = 3
border_width_bottom = 3
border_color = Color(0.95, 0.8, 0.3, 1.0)
corner_radius_top_left = 14
corner_radius_top_right = 14
corner_radius_bottom_left = 14
corner_radius_bottom_right = 14
shadow_color = Color(0.95, 0.8, 0.3, 0.3)
shadow_size = 14

[node name="CharacterSelect" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_char")

[node name="BG" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.06, 0.08, 0.13, 1)

[node name="Title" type="Label" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -300.0
offset_top = 40.0
offset_right = 300.0
offset_bottom = 90.0
grow_horizontal = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 36
text = "KARAKTERİNİ SEÇ"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Grid" type="GridContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -420.0
offset_top = -180.0
offset_right = 420.0
offset_bottom = 180.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/h_separation = 20
theme_override_constants/v_separation = 20
columns = 2

[node name="MimarButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
theme_override_styles/normal = SubResource("StyleBoxFlat_card_norm")
theme_override_styles/hover = SubResource("StyleBoxFlat_card_hover")
text = "🏛️ MİMAR\n\nDengeli Harf Dağılımı\nBaşlangıç Altını: +10"

[node name="BilgeButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
theme_override_styles/normal = SubResource("StyleBoxFlat_card_norm")
theme_override_styles/hover = SubResource("StyleBoxFlat_card_hover")
text = "📜 BİLGE\n\nNadir Harfler & Joker Odaklı\nEkstra Iskarta Hakkı"

[node name="SavasciButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
theme_override_styles/normal = SubResource("StyleBoxFlat_card_norm")
theme_override_styles/hover = SubResource("StyleBoxFlat_card_hover")
text = "⚔️ SAVAŞÇI\n\nYüksek Puanlı Sert Harfler\nYüksek Taban Puan"

[node name="OzanButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
theme_override_styles/normal = SubResource("StyleBoxFlat_card_norm")
theme_override_styles/hover = SubResource("StyleBoxFlat_card_hover")
text = "🪕 OZAN\n\nSesli Harfler & Kombo Odaklı\nSürekli Çarpan Artışı"

[node name="BackButton" type="Button" parent="."]
custom_minimum_size = Vector2(160, 48)
layout_mode = 1
anchors_preset = 7
anchor_left = 0.5
anchor_top = 1.0
anchor_right = 0.5
anchor_bottom = 1.0
offset_left = -80.0
offset_top = -70.0
offset_right = 80.0
offset_bottom = -22.0
grow_horizontal = 2
grow_vertical = 0
theme_override_styles/normal = SubResource("StyleBoxFlat_card_norm")
theme_override_styles/hover = SubResource("StyleBoxFlat_card_hover")
text = "⬅️ Geri"
'''

with open(os.path.join(ui_dir, "CharacterSelect.tscn"), "w", encoding="utf-8") as f:
    f.write(char_tscn)

# -------------------------------------------------------------
# Redesigned HeaderBar.tscn
# -------------------------------------------------------------
header_tscn = '''[gd_scene load_steps=3 format=3]

[ext_resource type="Script" path="res://scenes/ui/HeaderBar.gd" id="1_header"]

[sub_stylebox type="StyleBoxFlat" id="StyleBoxFlat_header_btn"]
bg_color = Color(0.16, 0.22, 0.35, 0.9)
border_width_left = 1
border_width_top = 1
border_width_right = 1
border_width_bottom = 1
border_color = Color(0.3, 0.6, 0.9, 0.8)
corner_radius_top_left = 8
corner_radius_top_right = 8
corner_radius_bottom_left = 8
corner_radius_bottom_right = 8

[node name="HeaderBar" type="Control"]
custom_minimum_size = Vector2(0, 64)
layout_mode = 3
anchors_preset = 10
anchor_right = 1.0
grow_horizontal = 2
script = ExtResource("1_header")

[node name="Panel" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.08, 0.11, 0.17, 0.96)

[node name="BorderBottom" type="ColorRect" parent="."]
custom_minimum_size = Vector2(0, 2)
layout_mode = 1
anchors_preset = 12
anchor_top = 1.0
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 0
color = Color(0.2, 0.5, 0.8, 0.6)

[node name="HBox" type="HBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 24.0
offset_right = -24.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16
alignment = 1

[node name="HPLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(0.95, 0.35, 0.45, 1)
theme_override_font_sizes/font_size = 18
text = "❤️ 100/100"
vertical_alignment = 1

[node name="GoldLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 18
text = "💰 50 G"
vertical_alignment = 1

[node name="LevelLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 18
text = "🚩 Aşama 1"
vertical_alignment = 1

[node name="HandsLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 16
text = "🖐️ Hamle: 4"
vertical_alignment = 1

[node name="DiscardsLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 16
text = "🔄 Iskarta: 3"
vertical_alignment = 1

[node name="DeckButton" type="Button" parent="HBox"]
custom_minimum_size = Vector2(130, 40)
layout_mode = 2
theme_override_styles/normal = SubResource("StyleBoxFlat_header_btn")
text = "🎴 Deste (20)"

[node name="CodexButton" type="Button" parent="HBox"]
custom_minimum_size = Vector2(110, 40)
layout_mode = 2
theme_override_styles/normal = SubResource("StyleBoxFlat_header_btn")
text = "📖 Sözlük"
'''

with open(os.path.join(ui_dir, "HeaderBar.tscn"), "w", encoding="utf-8") as f:
    f.write(header_tscn)

print("All UI screens redesigned successfully!")
