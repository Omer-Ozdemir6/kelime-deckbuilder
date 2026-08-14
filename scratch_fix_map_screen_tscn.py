import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Fixed Balatro MapScreen.tscn
# -------------------------------------------------------------
blind_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/MapScreen.gd" id="1_map"]

[node name="MapScreen" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_map")

[node name="BG" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.07, 0.11, 0.16, 1)

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 40.0
offset_top = 20.0
offset_right = -40.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16
alignment = 1

[node name="Header" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 40)
layout_mode = 2
alignment = 1

[node name="AnteLabel" type="Label" parent="VBox/Header"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 26
text = "ANTE  1 / 8"

[node name="BlindsContainer" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 560)
layout_mode = 2
theme_override_constants/separation = 28
alignment = 1

[node name="SmallBlind" type="Control" parent="VBox/BlindsContainer"]
custom_minimum_size = Vector2(340, 540)
layout_mode = 2

[node name="Panel" type="Panel" parent="VBox/BlindsContainer/SmallBlind"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/SmallBlind"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 16.0
offset_top = 16.0
offset_right = -16.0
offset_bottom = -16.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 14

[node name="TopStatus" type="Control" parent="VBox/BlindsContainer/SmallBlind/VBox"]
custom_minimum_size = Vector2(0, 44)
layout_mode = 2

[node name="StatusButton" type="Button" parent="VBox/BlindsContainer/SmallBlind/VBox/TopStatus"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "SEÇ (Select)"

[node name="BlindTitle" type="Button" parent="VBox/BlindsContainer/SmallBlind/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 16
text = "Küçük Kör (Small Blind)"

[node name="Emblem" type="Label" parent="VBox/BlindsContainer/SmallBlind/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 54
text = "🔵"
horizontal_alignment = 1

[node name="ScoreBox" type="PanelContainer" parent="VBox/BlindsContainer/SmallBlind/VBox"]
custom_minimum_size = Vector2(0, 110)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/SmallBlind/VBox/ScoreBox"]
layout_mode = 2
alignment = 1

[node name="Label" type="Label" parent="VBox/BlindsContainer/SmallBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.85, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "En az Puan Yap:"
horizontal_alignment = 1

[node name="Score" type="Label" parent="VBox/BlindsContainer/SmallBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 32
text = "300"
horizontal_alignment = 1

[node name="Reward" type="Label" parent="VBox/BlindsContainer/SmallBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "Ödül: 💰💰💰 ($25)"
horizontal_alignment = 1

[node name="OrLabel" type="Label" parent="VBox/BlindsContainer/SmallBlind/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.6, 0.65, 0.7, 1)
theme_override_font_sizes/font_size = 14
text = "veya"
horizontal_alignment = 1

[node name="SkipBox" type="HBoxContainer" parent="VBox/BlindsContainer/SmallBlind/VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
theme_override_constants/separation = 10

[node name="TagIcon" type="Button" parent="VBox/BlindsContainer/SmallBlind/VBox/SkipBox"]
custom_minimum_size = Vector2(48, 48)
layout_mode = 2
text = "🎁"

[node name="SkipButton" type="Button" parent="VBox/BlindsContainer/SmallBlind/VBox/SkipBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 15
text = "Pas Geç (Skip)"

[node name="BigBlind" type="Control" parent="VBox/BlindsContainer"]
custom_minimum_size = Vector2(340, 540)
layout_mode = 2

[node name="Panel" type="Panel" parent="VBox/BlindsContainer/BigBlind"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/BigBlind"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 16.0
offset_top = 16.0
offset_right = -16.0
offset_bottom = -16.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 14

[node name="TopStatus" type="Control" parent="VBox/BlindsContainer/BigBlind/VBox"]
custom_minimum_size = Vector2(0, 44)
layout_mode = 2

[node name="StatusButton" type="Button" parent="VBox/BlindsContainer/BigBlind/VBox/TopStatus"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "Sıradaki"

[node name="BlindTitle" type="Button" parent="VBox/BlindsContainer/BigBlind/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 16
text = "Büyük Kör (Big Blind)"

[node name="Emblem" type="Label" parent="VBox/BlindsContainer/BigBlind/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 54
text = "🟡"
horizontal_alignment = 1

[node name="ScoreBox" type="PanelContainer" parent="VBox/BlindsContainer/BigBlind/VBox"]
custom_minimum_size = Vector2(0, 110)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/BigBlind/VBox/ScoreBox"]
layout_mode = 2
alignment = 1

[node name="Label" type="Label" parent="VBox/BlindsContainer/BigBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.85, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "En az Puan Yap:"
horizontal_alignment = 1

[node name="Score" type="Label" parent="VBox/BlindsContainer/BigBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 32
text = "600"
horizontal_alignment = 1

[node name="Reward" type="Label" parent="VBox/BlindsContainer/BigBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "Ödül: 💰💰💰💰 ($45)"
horizontal_alignment = 1

[node name="OrLabel" type="Label" parent="VBox/BlindsContainer/BigBlind/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.6, 0.65, 0.7, 1)
theme_override_font_sizes/font_size = 14
text = "veya"
horizontal_alignment = 1

[node name="SkipBox" type="HBoxContainer" parent="VBox/BlindsContainer/BigBlind/VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
theme_override_constants/separation = 10

[node name="TagIcon" type="Button" parent="VBox/BlindsContainer/BigBlind/VBox/SkipBox"]
custom_minimum_size = Vector2(48, 48)
layout_mode = 2
text = "🔮"

[node name="SkipButton" type="Button" parent="VBox/BlindsContainer/BigBlind/VBox/SkipBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 15
text = "Pas Geç (Skip)"

[node name="BossBlind" type="Control" parent="VBox/BlindsContainer"]
custom_minimum_size = Vector2(340, 540)
layout_mode = 2

[node name="Panel" type="Panel" parent="VBox/BlindsContainer/BossBlind"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/BossBlind"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 16.0
offset_top = 16.0
offset_right = -16.0
offset_bottom = -16.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 14

[node name="TopStatus" type="Control" parent="VBox/BlindsContainer/BossBlind/VBox"]
custom_minimum_size = Vector2(0, 44)
layout_mode = 2

[node name="StatusButton" type="Button" parent="VBox/BlindsContainer/BossBlind/VBox/TopStatus"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "Sıradaki"

[node name="BlindTitle" type="Button" parent="VBox/BlindsContainer/BossBlind/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 16
text = "Efes Tepegözü (The Window)"

[node name="Emblem" type="Label" parent="VBox/BlindsContainer/BossBlind/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 54
text = "👹"
horizontal_alignment = 1

[node name="ModifierDesc" type="Label" parent="VBox/BlindsContainer/BossBlind/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.9, 0.7, 0.3, 1)
theme_override_font_sizes/font_size = 12
text = "⚠️ 5+ harfli kelimeler dışındakiler geçersizdir!"
horizontal_alignment = 1
autowrap_mode = 2

[node name="ScoreBox" type="PanelContainer" parent="VBox/BlindsContainer/BossBlind/VBox"]
custom_minimum_size = Vector2(0, 100)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/BossBlind/VBox/ScoreBox"]
layout_mode = 2
alignment = 1

[node name="Label" type="Label" parent="VBox/BlindsContainer/BossBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.85, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "En az Puan Yap:"
horizontal_alignment = 1

[node name="Score" type="Label" parent="VBox/BlindsContainer/BossBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 32
text = "1200"
horizontal_alignment = 1

[node name="Reward" type="Label" parent="VBox/BlindsContainer/BossBlind/VBox/ScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "Ödül: 💰💰💰💰💰 ($60)"
horizontal_alignment = 1

[node name="AnteTag" type="Label" parent="VBox/BlindsContainer/BossBlind/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 14
text = "Ante Yükselir: Tüm hedefler artar"
horizontal_alignment = 1
'''

with open(os.path.join(ui_dir, "MapScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(blind_tscn)

print("MapScreen.tscn hierarchy paths fixed!")
