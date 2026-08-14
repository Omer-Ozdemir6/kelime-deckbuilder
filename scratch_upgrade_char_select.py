import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Upgraded CharacterSelect.gd
# -------------------------------------------------------------
char_gd = '''extends Control

@onready var mimar_card = $Grid/MimarCard
@onready var bilge_card = $Grid/BilgeCard
@onready var savasci_card = $Grid/SavasciCard
@onready var ozan_card = $Grid/OzanCard
@onready var back_btn = $BackButton

func _ready():
	_setup_card(mimar_card, "MIMAR", Color(0.18, 0.75, 0.65), Color(0.08, 0.22, 0.2))
	_setup_card(bilge_card, "BILGE", Color(0.75, 0.45, 0.95), Color(0.18, 0.08, 0.25))
	_setup_card(savasci_card, "SAVASCI", Color(0.95, 0.35, 0.35), Color(0.25, 0.08, 0.1))
	_setup_card(ozan_card, "OZAN", Color(0.95, 0.8, 0.25), Color(0.25, 0.2, 0.08))
	
	back_btn.connect("pressed", Callable(self, "_on_back"))

func _setup_card(card_node: Control, char_id: String, border_color: Color, bg_color: Color):
	card_node.pivot_offset = Vector2(210, 110)
	
	var norm_style = StyleBoxFlat.new()
	norm_style.bg_color = bg_color
	norm_style.border_width_left = 2
	norm_style.border_width_top = 2
	norm_style.border_width_right = 2
	norm_style.border_width_bottom = 2
	norm_style.border_color = border_color
	norm_style.corner_radius_top_left = 16
	norm_style.corner_radius_top_right = 16
	norm_style.corner_radius_bottom_left = 16
	norm_style.corner_radius_bottom_right = 16
	norm_style.shadow_color = Color(0, 0, 0, 0.6)
	norm_style.shadow_size = 10
	
	var hover_style = StyleBoxFlat.new()
	hover_style.bg_color = bg_color.lightened(0.15)
	hover_style.border_width_left = 3
	hover_style.border_width_top = 3
	hover_style.border_width_right = 3
	hover_style.border_width_bottom = 3
	hover_style.border_color = Color(1.0, 0.9, 0.4)
	hover_style.corner_radius_top_left = 16
	hover_style.corner_radius_top_right = 16
	hover_style.corner_radius_bottom_left = 16
	hover_style.corner_radius_bottom_right = 16
	hover_style.shadow_color = border_color
	hover_style.shadow_size = 16
	
	var panel = card_node.get_node("Panel")
	if panel:
		panel.add_theme_stylebox_override("panel", norm_style)
		
	card_node.connect("gui_input", Callable(self, "_on_card_input").bind(char_id))
	card_node.connect("mouse_entered", Callable(self, "_on_card_hover").bind(card_node, panel, hover_style))
	card_node.connect("mouse_exited", Callable(self, "_on_card_exit").bind(card_node, panel, norm_style))
	
	var btn = card_node.get_node_or_null("SelectButton")
	if btn:
		btn.connect("pressed", Callable(self, "_select_char").bind(char_id))

func _on_card_hover(card_node: Control, panel: Panel, hover_style: StyleBoxFlat):
	AudioManager.play_sfx("button_click")
	if panel:
		panel.add_theme_stylebox_override("panel", hover_style)
	var tween = create_tween()
	tween.tween_property(card_node, "scale", Vector2(1.04, 1.04), 0.1)

func _on_card_exit(card_node: Control, panel: Panel, norm_style: StyleBoxFlat):
	if panel:
		panel.add_theme_stylebox_override("panel", norm_style)
	var tween = create_tween()
	tween.tween_property(card_node, "scale", Vector2(1.0, 1.0), 0.1)

func _on_card_input(event, char_id: String):
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_select_char(char_id)

func _select_char(char_id: String):
	AudioManager.play_sfx("card_select")
	GameManager.start_new_run(char_id, "WHITE_STAKE")

func _on_back():
	GameManager.change_state(GameManager.State.MAIN_MENU)
'''

with open(os.path.join(ui_dir, "CharacterSelect.gd"), "w", encoding="utf-8") as f:
    f.write(char_gd)

# -------------------------------------------------------------
# Upgraded CharacterSelect.tscn with Artwork Images & Badges
# -------------------------------------------------------------
char_tscn = '''[gd_scene load_steps=6 format=3]

[ext_resource type="Script" path="res://scenes/ui/CharacterSelect.gd" id="1_char"]
[ext_resource type="Texture2D" path="res://assets/mimar.jpg" id="2_mimar"]
[ext_resource type="Texture2D" path="res://assets/bilge.jpg" id="3_bilge"]
[ext_resource type="Texture2D" path="res://assets/savasci.jpg" id="4_savasci"]
[ext_resource type="Texture2D" path="res://assets/ozan.jpg" id="5_ozan"]

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
color = Color(0.05, 0.07, 0.12, 1)

[node name="TitleBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -300.0
offset_top = 25.0
offset_right = 300.0
offset_bottom = 85.0
grow_horizontal = 2
alignment = 1

[node name="Title" type="Label" parent="TitleBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 36
text = "KARAKTERİNİ SEÇ"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Subtitle" type="Label" parent="TitleBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 14
text = "✦ Başlangıç avantajını belirle ve yolculuğa çık ✦"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Grid" type="GridContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -440.0
offset_top = -220.0
offset_right = 440.0
offset_bottom = 220.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/h_separation = 24
theme_override_constants/v_separation = 24
columns = 2

[node name="MimarCard" type="Control" parent="Grid"]
custom_minimum_size = Vector2(420, 200)
layout_mode = 2

[node name="Panel" type="Panel" parent="Grid/MimarCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="HBox" type="HBoxContainer" parent="Grid/MimarCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 12.0
offset_top = 12.0
offset_right = -12.0
offset_bottom = -12.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16

[node name="Portrait" type="TextureRect" parent="Grid/MimarCard/HBox"]
custom_minimum_size = Vector2(140, 140)
layout_mode = 2
size_flags_vertical = 4
texture = ExtResource("2_mimar")
expand_mode = 1
stretch_mode = 6

[node name="VBox" type="VBoxContainer" parent="Grid/MimarCard/HBox"]
layout_mode = 2
size_flags_horizontal = 3
alignment = 1

[node name="Name" type="Label" parent="Grid/MimarCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "🏛️ MİMAR"

[node name="Perks" type="Label" parent="Grid/MimarCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "• Dengeli Harf Dağılımı\n• Başlangıç Altını: +10 💰\n• Taban Puan Avantajı"

[node name="SelectButton" type="Button" parent="Grid/MimarCard/HBox/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(0.2, 0.95, 0.8, 1)
text = "SEÇ VE BAŞLA ➔"

[node name="BilgeCard" type="Control" parent="Grid"]
custom_minimum_size = Vector2(420, 200)
layout_mode = 2

[node name="Panel" type="Panel" parent="Grid/BilgeCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="HBox" type="HBoxContainer" parent="Grid/BilgeCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 12.0
offset_top = 12.0
offset_right = -12.0
offset_bottom = -12.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16

[node name="Portrait" type="TextureRect" parent="Grid/BilgeCard/HBox"]
custom_minimum_size = Vector2(140, 140)
layout_mode = 2
size_flags_vertical = 4
texture = ExtResource("3_bilge")
expand_mode = 1
stretch_mode = 6

[node name="VBox" type="VBoxContainer" parent="Grid/BilgeCard/HBox"]
layout_mode = 2
size_flags_horizontal = 3
alignment = 1

[node name="Name" type="Label" parent="Grid/BilgeCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "📜 BİLGE"

[node name="Perks" type="Label" parent="Grid/BilgeCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "• Nadir Harf & Joker Odaklı\n• Ekstra Iskarta Hakkı 🔄\n• Yüksek Zeka Çarpanı"

[node name="SelectButton" type="Button" parent="Grid/BilgeCard/HBox/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.5, 1, 1)
text = "SEÇ VE BAŞLA ➔"

[node name="SavasciCard" type="Control" parent="Grid"]
custom_minimum_size = Vector2(420, 200)
layout_mode = 2

[node name="Panel" type="Panel" parent="Grid/SavasciCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="HBox" type="HBoxContainer" parent="Grid/SavasciCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 12.0
offset_top = 12.0
offset_right = -12.0
offset_bottom = -12.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16

[node name="Portrait" type="TextureRect" parent="Grid/SavasciCard/HBox"]
custom_minimum_size = Vector2(140, 140)
layout_mode = 2
size_flags_vertical = 4
texture = ExtResource("4_savasci")
expand_mode = 1
stretch_mode = 6

[node name="VBox" type="VBoxContainer" parent="Grid/SavasciCard/HBox"]
layout_mode = 2
size_flags_horizontal = 3
alignment = 1

[node name="Name" type="Label" parent="Grid/SavasciCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "⚔️ SAVAŞÇI"

[node name="Perks" type="Label" parent="Grid/SavasciCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "• Yüksek Puanlı Sert Harfler\n• Yüksek Taban Puan 💥\n• Hızlı Hasar Odaklı"

[node name="SelectButton" type="Button" parent="Grid/SavasciCard/HBox/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(1, 0.4, 0.4, 1)
text = "SEÇ VE BAŞLA ➔"

[node name="OzanCard" type="Control" parent="Grid"]
custom_minimum_size = Vector2(420, 200)
layout_mode = 2

[node name="Panel" type="Panel" parent="Grid/OzanCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="HBox" type="HBoxContainer" parent="Grid/OzanCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 12.0
offset_top = 12.0
offset_right = -12.0
offset_bottom = -12.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16

[node name="Portrait" type="TextureRect" parent="Grid/OzanCard/HBox"]
custom_minimum_size = Vector2(140, 140)
layout_mode = 2
size_flags_vertical = 4
texture = ExtResource("5_ozan")
expand_mode = 1
stretch_mode = 6

[node name="VBox" type="VBoxContainer" parent="Grid/OzanCard/HBox"]
layout_mode = 2
size_flags_horizontal = 3
alignment = 1

[node name="Name" type="Label" parent="Grid/OzanCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "🪕 OZAN"

[node name="Perks" type="Label" parent="Grid/OzanCard/HBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "• Sesli Harfler & Akıcılık\n• Sürekli Çarpan Artışı 🎵\n• Kombo Zincir Bonusu"

[node name="SelectButton" type="Button" parent="Grid/OzanCard/HBox/VBox"]
custom_minimum_size = Vector2(0, 36)
layout_mode = 2
theme_override_colors/font_color = Color(1, 0.85, 0.3, 1)
text = "SEÇ VE BAŞLA ➔"

[node name="BackButton" type="Button" parent="."]
custom_minimum_size = Vector2(160, 48)
layout_mode = 1
anchors_preset = 7
anchor_left = 0.5
anchor_top = 1.0
anchor_right = 0.5
anchor_bottom = 1.0
offset_left = -80.0
offset_top = -65.0
offset_right = 80.0
offset_bottom = -17.0
grow_horizontal = 2
grow_vertical = 0
text = "⬅️ Geri"
'''

with open(os.path.join(ui_dir, "CharacterSelect.tscn"), "w", encoding="utf-8") as f:
    f.write(char_tscn)

print("CharacterSelect screen successfully upgraded with high-res artwork and themes!")
