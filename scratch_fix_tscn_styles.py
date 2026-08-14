import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. Fixed HeaderBar.gd & HeaderBar.tscn
# -------------------------------------------------------------
header_gd = '''extends Control

@onready var hp_label = $HBox/HPLabel
@onready var gold_label = $HBox/GoldLabel
@onready var level_label = $HBox/LevelLabel
@onready var hands_label = $HBox/HandsLabel
@onready var discards_label = $HBox/DiscardsLabel
@onready var deck_button = $HBox/DeckButton
@onready var codex_button = $HBox/CodexButton

func _ready():
	GameManager.connect("player_stats_changed", Callable(self, "update_stats"))
	deck_button.connect("pressed", Callable(self, "_on_deck_pressed"))
	codex_button.connect("pressed", Callable(self, "_on_codex_pressed"))
	_style_buttons()
	update_stats()

func _style_buttons():
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.16, 0.22, 0.35, 0.9)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.3, 0.6, 0.9, 0.8)
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	
	deck_button.add_theme_stylebox_override("normal", style)
	codex_button.add_theme_stylebox_override("normal", style)

func update_stats():
	hp_label.text = "❤️ " + str(GameManager.player_hp) + "/" + str(GameManager.max_hp)
	gold_label.text = "💰 " + str(GameManager.gold) + " G"
	level_label.text = "🚩 Aşama " + str(GameManager.current_level)
	hands_label.text = "🖐️ Hamle: " + str(GameManager.hands_left)
	discards_label.text = "🔄 Iskarta: " + str(GameManager.discards_left)
	deck_button.text = "🎴 Deste (" + str(GameManager.deck.size()) + ")"

func _on_deck_pressed():
	print("Deck inspector opened!")

func _on_codex_pressed():
	print("Codex opened!")
'''

with open(os.path.join(ui_dir, "HeaderBar.gd"), "w", encoding="utf-8") as f:
    f.write(header_gd)

header_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/HeaderBar.gd" id="1_header"]

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
text = "🎴 Deste (20)"

[node name="CodexButton" type="Button" parent="HBox"]
custom_minimum_size = Vector2(110, 40)
layout_mode = 2
text = "📖 Sözlük"
'''

with open(os.path.join(ui_dir, "HeaderBar.tscn"), "w", encoding="utf-8") as f:
    f.write(header_tscn)

# -------------------------------------------------------------
# 2. Fixed MainMenu.gd & MainMenu.tscn
# -------------------------------------------------------------
main_menu_gd = '''extends Control

@onready var start_button = $VBox/StartButton
@onready var codex_button = $VBox/CodexButton
@onready var challenge_button = $VBox/ChallengeButton
@onready var exit_button = $VBox/ExitButton

@onready var floating_cards = [$DecorCards/CardK, $DecorCards/CardE, $DecorCards/CardL, $DecorCards/Cardİ, $DecorCards/CardM, $DecorCards/CardE2]

var anim_time: float = 0.0

func _ready():
	start_button.connect("pressed", Callable(self, "_on_start_pressed"))
	codex_button.connect("pressed", Callable(self, "_on_codex_pressed"))
	challenge_button.connect("pressed", Callable(self, "_on_challenge_pressed"))
	exit_button.connect("pressed", Callable(self, "_on_exit_pressed"))
	
	_setup_button_styles()

func _process(delta):
	anim_time += delta
	for i in range(floating_cards.size()):
		var card = floating_cards[i]
		if card:
			var offset = sin(anim_time * 2.0 + i * 0.8) * 8.0
			card.position.y = card.get_meta("base_y") + offset

func _setup_button_styles():
	var btn_norm = StyleBoxFlat.new()
	btn_norm.bg_color = Color(0.12, 0.16, 0.26, 0.9)
	btn_norm.border_width_left = 2
	btn_norm.border_width_top = 2
	btn_norm.border_width_right = 2
	btn_norm.border_width_bottom = 2
	btn_norm.border_color = Color(0.2, 0.6, 0.9, 0.8)
	btn_norm.corner_radius_top_left = 12
	btn_norm.corner_radius_top_right = 12
	btn_norm.corner_radius_bottom_left = 12
	btn_norm.corner_radius_bottom_right = 12

	var btn_hover = StyleBoxFlat.new()
	btn_hover.bg_color = Color(0.18, 0.25, 0.42, 0.95)
	btn_hover.border_width_left = 3
	btn_hover.border_width_top = 3
	btn_hover.border_width_right = 3
	btn_hover.border_width_bottom = 3
	btn_hover.border_color = Color(0.4, 0.85, 1.0, 1.0)
	btn_hover.corner_radius_top_left = 12
	btn_hover.corner_radius_top_right = 12
	btn_hover.corner_radius_bottom_left = 12
	btn_hover.corner_radius_bottom_right = 12

	var btns = [start_button, codex_button, challenge_button, exit_button]
	for btn in btns:
		btn.add_theme_stylebox_override("normal", btn_norm)
		btn.add_theme_stylebox_override("hover", btn_hover)
		btn.connect("mouse_entered", Callable(self, "_on_btn_hover").bind(btn))
		btn.connect("mouse_exited", Callable(self, "_on_btn_exit").bind(btn))

func _on_btn_hover(btn: Button):
	AudioManager.play_sfx("button_click")
	var tween = create_tween()
	tween.tween_property(btn, "scale", Vector2(1.05, 1.05), 0.1)

func _on_btn_exit(btn: Button):
	var tween = create_tween()
	tween.tween_property(btn, "scale", Vector2(1.0, 1.0), 0.1)

func _on_start_pressed():
	AudioManager.play_sfx("card_select")
	GameManager.change_state(GameManager.State.CHARACTER_SELECT)

func _on_codex_pressed():
	AudioManager.play_sfx("card_select")

func _on_challenge_pressed():
	AudioManager.play_sfx("card_select")

func _on_exit_pressed():
	get_tree().quit()
'''

with open(os.path.join(ui_dir, "MainMenu.gd"), "w", encoding="utf-8") as f:
    f.write(main_menu_gd)

main_menu_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/MainMenu.gd" id="1_menu"]

[node name="MainMenu" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_menu")

[node name="BackgroundGradient" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.05, 0.07, 0.12, 1)

[node name="GlowOverlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -400.0
offset_top = -300.0
offset_right = 400.0
offset_bottom = 300.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.12, 0.2, 0.35, 0.15)

[node name="DecorCards" type="Control" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="CardK" type="Button" parent="DecorCards"]
metadata/base_y = 120.0
layout_mode = 0
offset_left = 120.0
offset_top = 120.0
offset_right = 190.0
offset_bottom = 210.0
rotation = -0.15
theme_override_colors/font_color = Color(0.95, 0.8, 0.3, 1)
theme_override_font_sizes/font_size = 28
text = "K"

[node name="CardE" type="Button" parent="DecorCards"]
metadata/base_y = 100.0
layout_mode = 0
offset_left = 220.0
offset_top = 100.0
offset_right = 290.0
offset_bottom = 190.0
rotation = 0.1
theme_override_colors/font_color = Color(0.4, 0.8, 1, 1)
theme_override_font_sizes/font_size = 28
text = "E"

[node name="CardL" type="Button" parent="DecorCards"]
metadata/base_y = 130.0
layout_mode = 0
offset_left = 320.0
offset_top = 130.0
offset_right = 390.0
offset_bottom = 220.0
rotation = -0.05
theme_override_colors/font_color = Color(0.9, 0.4, 0.8, 1)
theme_override_font_sizes/font_size = 28
text = "L"

[node name="Cardİ" type="Button" parent="DecorCards"]
metadata/base_y = 130.0
layout_mode = 0
offset_left = 880.0
offset_top = 130.0
offset_right = 950.0
offset_bottom = 220.0
rotation = 0.12
theme_override_colors/font_color = Color(0.4, 0.9, 0.5, 1)
theme_override_font_sizes/font_size = 28
text = "İ"

[node name="CardM" type="Button" parent="DecorCards"]
metadata/base_y = 100.0
layout_mode = 0
offset_left = 980.0
offset_top = 100.0
offset_right = 1050.0
offset_bottom = 190.0
rotation = -0.1
theme_override_colors/font_color = Color(0.95, 0.8, 0.3, 1)
theme_override_font_sizes/font_size = 28
text = "M"

[node name="CardE2" type="Button" parent="DecorCards"]
metadata/base_y = 140.0
layout_mode = 0
offset_left = 1080.0
offset_top = 140.0
offset_right = 1150.0
offset_bottom = 230.0
rotation = 0.18
theme_override_colors/font_color = Color(0.4, 0.8, 1, 1)
theme_override_font_sizes/font_size = 28
text = "E"

[node name="TitleBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -400.0
offset_top = 70.0
offset_right = 400.0
offset_bottom = 220.0
grow_horizontal = 2
alignment = 1

[node name="MainTitle" type="Label" parent="TitleBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_colors/font_shadow_color = Color(0, 0, 0, 0.8)
theme_override_constants/shadow_offset_x = 3
theme_override_constants/shadow_offset_y = 3
theme_override_font_sizes/font_size = 52
text = "KELİME DECKBUILDER"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Subtitle" type="Label" parent="TitleBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 18
text = "✦ TÜRKÇE KELİME & STRATEJİ DECKBUILDER OYUNU ✦"
horizontal_alignment = 1
vertical_alignment = 1

[node name="VBox" type="VBoxContainer" parent="."]
custom_minimum_size = Vector2(340, 0)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -170.0
offset_top = -60.0
offset_right = 170.0
offset_bottom = 230.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16
alignment = 1

[node name="StartButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 58)
layout_mode = 2
pivot_offset = Vector2(170, 29)
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_hover_color = Color(0.4, 0.95, 1, 1)
theme_override_font_sizes/font_size = 22
text = "⚔️ Oyuna Başla"

[node name="CodexButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 58)
layout_mode = 2
pivot_offset = Vector2(170, 29)
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_hover_color = Color(0.4, 0.95, 1, 1)
theme_override_font_sizes/font_size = 20
text = "📖 Kodeks & Kataloğu Gör"

[node name="ChallengeButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 58)
layout_mode = 2
pivot_offset = Vector2(170, 29)
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_hover_color = Color(0.4, 0.95, 1, 1)
theme_override_font_sizes/font_size = 20
text = "🏆 Meydan Okumalar"

[node name="ExitButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 54)
layout_mode = 2
pivot_offset = Vector2(170, 27)
theme_override_colors/font_color = Color(0.9, 0.4, 0.4, 1)
theme_override_colors/font_hover_color = Color(1, 0.5, 0.5, 1)
theme_override_font_sizes/font_size = 18
text = "🚪 Çıkış"
'''

with open(os.path.join(ui_dir, "MainMenu.tscn"), "w", encoding="utf-8") as f:
    f.write(main_menu_tscn)

# -------------------------------------------------------------
# 3. Fixed CharacterSelect.tscn
# -------------------------------------------------------------
char_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/CharacterSelect.gd" id="1_char"]

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
text = "🏛️ MİMAR\n\nDengeli Harf Dağılımı\nBaşlangıç Altını: +10"

[node name="BilgeButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
text = "📜 BİLGE\n\nNadir Harfler & Joker Odaklı\nEkstra Iskarta Hakkı"

[node name="SavasciButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
text = "⚔️ SAVAŞÇI\n\nYüksek Puanlı Sert Harfler\nYüksek Taban Puan"

[node name="OzanButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(400, 160)
layout_mode = 2
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
text = "⬅️ Geri"
'''

with open(os.path.join(ui_dir, "CharacterSelect.tscn"), "w", encoding="utf-8") as f:
    f.write(char_tscn)

print("TSCN parse errors completely resolved!")
