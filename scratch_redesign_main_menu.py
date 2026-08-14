import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Redesigned MainMenu.gd
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
	
	_setup_button_effects(start_button)
	_setup_button_effects(codex_button)
	_setup_button_effects(challenge_button)
	_setup_button_effects(exit_button)

func _process(delta):
	anim_time += delta
	# Floating animation for background letter cards
	for i in range(floating_cards.size()):
		var card = floating_cards[i]
		if card:
			var offset = sin(anim_time * 2.0 + i * 0.8) * 8.0
			card.position.y = card.get_meta("base_y") + offset

func _setup_button_effects(btn: Button):
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
	print("Codex pressed from menu")

func _on_challenge_pressed():
	AudioManager.play_sfx("card_select")
	print("Challenge pressed")

func _on_exit_pressed():
	get_tree().quit()
'''

with open(os.path.join(ui_dir, "MainMenu.gd"), "w", encoding="utf-8") as f:
    f.write(main_menu_gd)

# -------------------------------------------------------------
# Redesigned MainMenu.tscn with Rich Styling
# -------------------------------------------------------------
main_menu_tscn = '''[gd_scene load_steps=5 format=3]

[ext_resource type="Script" path="res://scenes/ui/MainMenu.gd" id="1_menu"]

[sub_stylebox type="StyleBoxFlat" id="StyleBoxFlat_btn_normal"]
bg_color = Color(0.12, 0.16, 0.26, 0.9)
border_width_left = 2
border_width_top = 2
border_width_right = 2
border_width_bottom = 2
border_color = Color(0.2, 0.6, 0.9, 0.8)
corner_radius_top_left = 12
corner_radius_top_right = 12
corner_radius_bottom_left = 12
corner_radius_bottom_right = 12
shadow_color = Color(0, 0, 0, 0.4)
shadow_size = 6

[sub_stylebox type="StyleBoxFlat" id="StyleBoxFlat_btn_hover"]
bg_color = Color(0.18, 0.25, 0.42, 0.95)
border_width_left = 3
border_width_top = 3
border_width_right = 3
border_width_bottom = 3
border_color = Color(0.4, 0.85, 1.0, 1.0)
corner_radius_top_left = 12
corner_radius_top_right = 12
corner_radius_bottom_left = 12
corner_radius_bottom_right = 12
shadow_color = Color(0.2, 0.7, 1.0, 0.4)
shadow_size = 12

[sub_stylebox type="StyleBoxFlat" id="StyleBoxFlat_btn_pressed"]
bg_color = Color(0.08, 0.12, 0.2, 1.0)
border_width_left = 2
border_width_top = 2
border_width_right = 2
border_width_bottom = 2
border_color = Color(0.9, 0.7, 0.2, 1.0)
corner_radius_top_left = 12
corner_radius_top_right = 12
corner_radius_bottom_left = 12
corner_radius_bottom_right = 12

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
text = "✦ TÜRKÇE KELİME & STRATEJİ KART OYUNU ✦"
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
theme_override_styles/normal = SubResource("StyleBoxFlat_btn_normal")
theme_override_styles/hover = SubResource("StyleBoxFlat_btn_hover")
theme_override_styles/pressed = SubResource("StyleBoxFlat_btn_pressed")
text = "⚔️ Oyuna Başla"

[node name="CodexButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 58)
layout_mode = 2
pivot_offset = Vector2(170, 29)
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_hover_color = Color(0.4, 0.95, 1, 1)
theme_override_font_sizes/font_size = 20
theme_override_styles/normal = SubResource("StyleBoxFlat_btn_normal")
theme_override_styles/hover = SubResource("StyleBoxFlat_btn_hover")
theme_override_styles/pressed = SubResource("StyleBoxFlat_btn_pressed")
text = "📖 Kodeks & Kataloğu Gör"

[node name="ChallengeButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 58)
layout_mode = 2
pivot_offset = Vector2(170, 29)
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_hover_color = Color(0.4, 0.95, 1, 1)
theme_override_font_sizes/font_size = 20
theme_override_styles/normal = SubResource("StyleBoxFlat_btn_normal")
theme_override_styles/hover = SubResource("StyleBoxFlat_btn_hover")
theme_override_styles/pressed = SubResource("StyleBoxFlat_btn_pressed")
text = "🏆 Meydan Okumalar"

[node name="ExitButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 54)
layout_mode = 2
pivot_offset = Vector2(170, 27)
theme_override_colors/font_color = Color(0.9, 0.4, 0.4, 1)
theme_override_colors/font_hover_color = Color(1, 0.5, 0.5, 1)
theme_override_font_sizes/font_size = 18
theme_override_styles/normal = SubResource("StyleBoxFlat_btn_normal")
theme_override_styles/hover = SubResource("StyleBoxFlat_btn_hover")
theme_override_styles/pressed = SubResource("StyleBoxFlat_btn_pressed")
text = "🚪 Çıkış"
'''

with open(os.path.join(ui_dir, "MainMenu.tscn"), "w", encoding="utf-8") as f:
    f.write(main_menu_tscn)

print("Main Menu successfully redesigned with stunning visual aesthetics!")
