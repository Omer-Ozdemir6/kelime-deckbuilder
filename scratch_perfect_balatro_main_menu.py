import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Breathtaking Balatro Main Menu GDScript (MainMenu.gd)
# -------------------------------------------------------------
menu_gd = '''extends Control

@onready var play_btn = $BottomBar/HBox/PlayButton
@onready var options_btn = $BottomBar/HBox/OptionsButton
@onready var quit_btn = $BottomBar/HBox/QuitButton
@onready var collection_btn = $BottomBar/HBox/CollectionButton

@onready var bg_swirl = $BGSwirl
@onready var decor_container = $DecorCards

var anim_time: float = 0.0

func _ready():
	play_btn.connect("pressed", Callable(self, "_on_play_pressed"))
	options_btn.connect("pressed", Callable(self, "_on_options_pressed"))
	quit_btn.connect("pressed", Callable(self, "_on_quit_pressed"))
	collection_btn.connect("pressed", Callable(self, "_on_collection_pressed"))
	
	_setup_button(play_btn, Color(0.02, 0.52, 0.95), Color(0.15, 0.65, 1.0))
	_setup_button(options_btn, Color(0.95, 0.55, 0.1), Color(1.0, 0.68, 0.2))
	_setup_button(quit_btn, Color(0.92, 0.22, 0.22), Color(1.0, 0.35, 0.35))
	_setup_button(collection_btn, Color(0.18, 0.72, 0.42), Color(0.28, 0.85, 0.52))

func _process(delta):
	anim_time += delta
	if bg_swirl:
		bg_swirl.rotation = anim_time * 0.2
		
	# Float background decor cards
	if decor_container:
		var cards = decor_container.get_children()
		for i in range(cards.size()):
			var c = cards[i]
			if c.has_meta("base_y"):
				var offset = sin(anim_time * 2.5 + i * 0.9) * 10.0
				c.position.y = c.get_meta("base_y") + offset

func _setup_button(btn: Button, norm_col: Color, hover_col: Color):
	btn.pivot_offset = Vector2(btn.custom_minimum_size.x / 2.0, btn.custom_minimum_size.y / 2.0)
	
	var norm_style = StyleBoxFlat.new()
	norm_style.bg_color = norm_col
	norm_style.corner_radius_top_left = 12
	norm_style.corner_radius_top_right = 12
	norm_style.corner_radius_bottom_left = 12
	norm_style.corner_radius_bottom_right = 12
	norm_style.shadow_color = Color(0, 0, 0, 0.5)
	norm_style.shadow_size = 6
	
	var hover_style = StyleBoxFlat.new()
	hover_style.bg_color = hover_col
	hover_style.border_width_left = 2
	hover_style.border_width_top = 2
	hover_style.border_width_right = 2
	hover_style.border_width_bottom = 2
	hover_style.border_color = Color(1, 1, 1, 0.9)
	hover_style.corner_radius_top_left = 12
	hover_style.corner_radius_top_right = 12
	hover_style.corner_radius_bottom_left = 12
	hover_style.corner_radius_bottom_right = 12
	hover_style.shadow_color = norm_col
	hover_style.shadow_size = 14
	
	btn.add_theme_stylebox_override("normal", norm_style)
	btn.add_theme_stylebox_override("hover", hover_style)
	
	btn.connect("mouse_entered", Callable(self, "_on_btn_hover").bind(btn))
	btn.connect("mouse_exited", Callable(self, "_on_btn_exit").bind(btn))

func _on_btn_hover(btn: Button):
	AudioManager.play_sfx("button_click")
	var tween = create_tween()
	tween.tween_property(btn, "scale", Vector2(1.08, 1.08), 0.1)

func _on_btn_exit(btn: Button):
	var tween = create_tween()
	tween.tween_property(btn, "scale", Vector2(1.0, 1.0), 0.1)

func _on_play_pressed():
	AudioManager.play_sfx("card_select")
	GameManager.change_state(GameManager.State.CHARACTER_SELECT)

func _on_options_pressed():
	AudioManager.play_sfx("button_click")

func _on_collection_pressed():
	AudioManager.play_sfx("card_select")

func _on_quit_pressed():
	get_tree().quit()
'''

with open(os.path.join(ui_dir, "MainMenu.gd"), "w", encoding="utf-8") as f:
    f.write(menu_gd)

# -------------------------------------------------------------
# Breathtaking Balatro Main Menu TSCN (MainMenu.tscn)
# -------------------------------------------------------------
menu_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/MainMenu.gd" id="1_menu"]

[node name="MainMenu" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_menu")

[node name="BG" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.1, 0.04, 0.08, 1)

[node name="BGSwirl" type="Control" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
grow_horizontal = 2
grow_vertical = 2

[node name="SwirlRed" type="ColorRect" parent="BGSwirl"]
custom_minimum_size = Vector2(1800, 1800)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -900.0
offset_top = -900.0
offset_right = 900.0
offset_bottom = 900.0
grow_horizontal = 2
grow_vertical = 2
pivot_offset = Vector2(900, 900)
color = Color(0.75, 0.15, 0.22, 0.45)

[node name="SwirlBlue" type="ColorRect" parent="BGSwirl"]
custom_minimum_size = Vector2(1500, 1500)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -750.0
offset_top = -750.0
offset_right = 750.0
offset_bottom = 750.0
grow_horizontal = 2
grow_vertical = 2
rotation = 0.785398
pivot_offset = Vector2(750, 750)
color = Color(0.06, 0.42, 0.78, 0.4)

[node name="DecorCards" type="Control" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="CardA" type="Button" parent="DecorCards"]
metadata/base_y = 100.0
layout_mode = 0
offset_left = 140.0
offset_top = 100.0
offset_right = 210.0
offset_bottom = 200.0
rotation = -0.18
theme_override_colors/font_color = Color(0.95, 0.8, 0.3, 1)
theme_override_font_sizes/font_size = 32
text = "A"

[node name="CardE" type="Button" parent="DecorCards"]
metadata/base_y = 140.0
layout_mode = 0
offset_left = 240.0
offset_top = 140.0
offset_right = 310.0
offset_bottom = 240.0
rotation = 0.12
theme_override_colors/font_color = Color(0.4, 0.8, 1, 1)
theme_override_font_sizes/font_size = 32
text = "E"

[node name="Cardİ" type="Button" parent="DecorCards"]
metadata/base_y = 120.0
layout_mode = 0
offset_left = 960.0
offset_top = 120.0
offset_right = 1030.0
offset_bottom = 220.0
rotation = -0.12
theme_override_colors/font_color = Color(0.9, 0.4, 0.8, 1)
theme_override_font_sizes/font_size = 32
text = "İ"

[node name="CardJoker" type="Button" parent="DecorCards"]
metadata/base_y = 150.0
layout_mode = 0
offset_left = 1060.0
offset_top = 150.0
offset_right = 1130.0
offset_bottom = 250.0
rotation = 0.15
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 32
text = "🃏"

[node name="VersionLabel" type="Label" parent="."]
layout_mode = 1
anchors_preset = 1
anchor_left = 1.0
anchor_right = 1.0
offset_left = -160.0
offset_top = 16.0
offset_right = -20.0
offset_bottom = 40.0
grow_horizontal = 0
theme_override_colors/font_color = Color(0.8, 0.85, 0.95, 0.7)
theme_override_font_sizes/font_size = 14
text = "v1.0.0-FULL"
horizontal_alignment = 2

[node name="MainLogo" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -450.0
offset_top = 90.0
offset_right = 450.0
offset_bottom = 270.0
grow_horizontal = 2
theme_override_constants/separation = 4
alignment = 1

[node name="LogoHBox" type="HBoxContainer" parent="MainLogo"]
layout_mode = 2
theme_override_constants/separation = 12
alignment = 1

[node name="TextLeft" type="Label" parent="MainLogo/LogoHBox"]
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_shadow_color = Color(0, 0, 0, 0.95)
theme_override_constants/shadow_offset_x = 5
theme_override_constants/shadow_offset_y = 5
theme_override_font_sizes/font_size = 80
text = "KELİ"
horizontal_alignment = 2

[node name="CenterCard" type="Control" parent="MainLogo/LogoHBox"]
custom_minimum_size = Vector2(90, 120)
layout_mode = 2
size_flags_vertical = 4

[node name="CardPanel" type="Panel" parent="MainLogo/LogoHBox/CenterCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="CardLabel" type="Label" parent="MainLogo/LogoHBox/CenterCard"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_colors/font_color = Color(0.95, 0.25, 0.25, 1)
theme_override_font_sizes/font_size = 56
text = "M"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Badge" type="Label" parent="MainLogo/LogoHBox/CenterCard"]
layout_mode = 1
anchors_preset = 3
anchor_left = 1.0
anchor_top = 1.0
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = -28.0
offset_top = -24.0
offset_right = -4.0
offset_bottom = -4.0
grow_horizontal = 0
grow_vertical = 0
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 11
text = "2pt"

[node name="TextRight" type="Label" parent="MainLogo/LogoHBox"]
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_shadow_color = Color(0, 0, 0, 0.95)
theme_override_constants/shadow_offset_x = 5
theme_override_constants/shadow_offset_y = 5
theme_override_font_sizes/font_size = 80
text = "E"
horizontal_alignment = 1

[node name="Subtitle" type="Label" parent="MainLogo"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 16
text = "✦ STRATEJİ & TÜRKÇE KELİME DECKBUILDER ✦"
horizontal_alignment = 1
vertical_alignment = 1

[node name="ProfileWidget" type="PanelContainer" parent="."]
custom_minimum_size = Vector2(140, 60)
layout_mode = 1
anchors_preset = 2
anchor_top = 1.0
anchor_bottom = 1.0
offset_left = 30.0
offset_top = -90.0
offset_right = 170.0
offset_bottom = -30.0
grow_vertical = 0

[node name="VBox" type="VBoxContainer" parent="ProfileWidget"]
layout_mode = 2
alignment = 1

[node name="Title" type="Label" parent="ProfileWidget/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.7, 0.75, 0.85, 1)
theme_override_font_sizes/font_size = 12
text = "Profil"
horizontal_alignment = 1

[node name="Name" type="Label" parent="ProfileWidget/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 16
text = "P1"
horizontal_alignment = 1

[node name="LangWidget" type="PanelContainer" parent="."]
custom_minimum_size = Vector2(140, 50)
layout_mode = 1
anchors_preset = 3
anchor_left = 1.0
anchor_top = 1.0
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = -170.0
offset_top = -80.0
offset_right = -30.0
offset_bottom = -30.0
grow_horizontal = 0
grow_vertical = 0

[node name="Label" type="Label" parent="LangWidget"]
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 15
text = "🇹🇷 Türkçe"
horizontal_alignment = 1
vertical_alignment = 1

[node name="BottomBar" type="PanelContainer" parent="."]
custom_minimum_size = Vector2(720, 80)
layout_mode = 1
anchors_preset = 7
anchor_left = 0.5
anchor_top = 1.0
anchor_right = 0.5
anchor_bottom = 1.0
offset_left = -360.0
offset_top = -110.0
offset_right = 360.0
offset_bottom = -30.0
grow_horizontal = 2
grow_vertical = 0

[node name="HBox" type="HBoxContainer" parent="BottomBar"]
layout_mode = 2
theme_override_constants/separation = 16
alignment = 1

[node name="PlayButton" type="Button" parent="BottomBar/HBox"]
custom_minimum_size = Vector2(170, 56)
layout_mode = 2
size_flags_vertical = 4
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 22
text = "⚔️ PLAY"

[node name="OptionsButton" type="Button" parent="BottomBar/HBox"]
custom_minimum_size = Vector2(150, 56)
layout_mode = 2
size_flags_vertical = 4
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "⚙️ AYARLAR"

[node name="QuitButton" type="Button" parent="BottomBar/HBox"]
custom_minimum_size = Vector2(130, 56)
layout_mode = 2
size_flags_vertical = 4
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "🚪 ÇIKIŞ"

[node name="CollectionButton" type="Button" parent="BottomBar/HBox"]
custom_minimum_size = Vector2(170, 56)
layout_mode = 2
size_flags_vertical = 4
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "📖 KODEKS"
'''

with open(os.path.join(ui_dir, "MainMenu.tscn"), "w", encoding="utf-8") as f:
    f.write(menu_tscn)

print("Perfect Balatro Main Menu created successfully!")
