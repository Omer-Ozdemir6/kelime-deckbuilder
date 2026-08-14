import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. Fully Functional MainMenu.gd
# -------------------------------------------------------------
menu_gd = '''extends Control

@onready var play_btn = $BottomBar/HBox/PlayButton
@onready var options_btn = $BottomBar/HBox/OptionsButton
@onready var quit_btn = $BottomBar/HBox/QuitButton
@onready var collection_btn = $BottomBar/HBox/CollectionButton
@onready var bg_swirl = $BGSwirl
@onready var decor_container = $DecorCards

var codex_modal_scn = preload("res://scenes/ui/CodexModal.tscn")
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
	var challenge_scn = load("res://scenes/ui/ChallengeSelectModal.tscn")
	var modal = challenge_scn.instantiate()
	add_child(modal)

func _on_collection_pressed():
	AudioManager.play_sfx("card_select")
	var modal = codex_modal_scn.instantiate()
	add_child(modal)

func _on_quit_pressed():
	get_tree().quit()
'''

with open(os.path.join(ui_dir, "MainMenu.gd"), "w", encoding="utf-8") as f:
    f.write(menu_gd)

# -------------------------------------------------------------
# 2. Fully Functional MapScreen.gd (Balatro Blind Selector + Shop Button)
# -------------------------------------------------------------
map_gd = '''extends Control

@onready var ante_label = $VBox/Header/AnteLabel

@onready var small_blind_panel = $VBox/BlindsContainer/SmallBlind
@onready var small_status_btn = $VBox/BlindsContainer/SmallBlind/VBox/TopStatus/StatusButton
@onready var small_skip_btn = $VBox/BlindsContainer/SmallBlind/VBox/SkipBox/SkipButton

@onready var big_blind_panel = $VBox/BlindsContainer/BigBlind
@onready var big_status_btn = $VBox/BlindsContainer/BigBlind/VBox/TopStatus/StatusButton
@onready var big_skip_btn = $VBox/BlindsContainer/BigBlind/VBox/SkipBox/SkipButton

@onready var boss_blind_panel = $VBox/BlindsContainer/BossBlind
@onready var boss_status_btn = $VBox/BlindsContainer/BossBlind/VBox/TopStatus/StatusButton

@onready var shop_btn = $VBox/Header/ShopButton

func _ready():
	small_status_btn.connect("pressed", Callable(self, "_select_blind").bind(1))
	small_skip_btn.connect("pressed", Callable(self, "_skip_blind").bind(1))
	
	big_status_btn.connect("pressed", Callable(self, "_select_blind").bind(2))
	big_skip_btn.connect("pressed", Callable(self, "_skip_blind").bind(2))
	
	boss_status_btn.connect("pressed", Callable(self, "_select_blind").bind(3))
	shop_btn.connect("pressed", Callable(self, "_open_shop"))
	
	_update_blind_states()

func _update_blind_states():
	ante_label.text = "ANTE  " + str(GameManager.act) + " / 8"
	var lvl = GameManager.current_level
	
	# Small Blind
	if lvl > 1:
		small_status_btn.text = "TAMAMLANDI"
		small_status_btn.disabled = true
		small_skip_btn.disabled = true
	elif lvl == 1:
		small_status_btn.text = "SEÇ (Select)"
		small_status_btn.disabled = false
		small_skip_btn.disabled = false
	else:
		small_status_btn.text = "Sıradaki"
		small_status_btn.disabled = true
		small_skip_btn.disabled = true
		
	# Big Blind
	if lvl > 2:
		big_status_btn.text = "TAMAMLANDI"
		big_status_btn.disabled = true
		big_skip_btn.disabled = true
	elif lvl == 2:
		big_status_btn.text = "SEÇ (Select)"
		big_status_btn.disabled = false
		big_skip_btn.disabled = false
	else:
		big_status_btn.text = "Sıradaki"
		big_status_btn.disabled = true
		big_skip_btn.disabled = true
		
	# Boss Blind
	if lvl == 3:
		boss_status_btn.text = "SEÇ (Boss Savaş)"
		boss_status_btn.disabled = false
	else:
		boss_status_btn.text = "Sıradaki"
		boss_status_btn.disabled = true

func _select_blind(blind_num: int):
	AudioManager.play_sfx("card_select")
	if blind_num == 1:
		GameManager.score_target = 300 * GameManager.act
	elif blind_num == 2:
		GameManager.score_target = 600 * GameManager.act
	elif blind_num == 3:
		GameManager.score_target = 1200 * GameManager.act
		
	GameManager.change_state(GameManager.State.COMBAT)

func _skip_blind(blind_num: int):
	AudioManager.play_sfx("victory")
	GameManager.modify_gold(25)
	GameManager.advance_stage()
	_update_blind_states()

func _open_shop():
	AudioManager.play_sfx("button_click")
	GameManager.change_state(GameManager.State.SHOP)
'''

with open(os.path.join(ui_dir, "MapScreen.gd"), "w", encoding="utf-8") as f:
    f.write(map_gd)

# Update MapScreen.tscn Header to include ShopButton
map_tscn = '''[gd_scene load_steps=2 format=3]

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
custom_minimum_size = Vector2(0, 48)
layout_mode = 2
alignment = 1

[node name="AnteLabel" type="Label" parent="VBox/Header"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 26
text = "ANTE  1 / 8"

[node name="ShopButton" type="Button" parent="VBox/Header"]
custom_minimum_size = Vector2(160, 40)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 16
text = "🛒 SİMYACI DÜKKANI"

[node name="BlindsContainer" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 540)
layout_mode = 2
theme_override_constants/separation = 28
alignment = 1

[node name="SmallBlind" type="Control" parent="VBox/BlindsContainer"]
custom_minimum_size = Vector2(340, 520)
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
custom_minimum_size = Vector2(340, 520)
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
custom_minimum_size = Vector2(340, 520)
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
    f.write(map_tscn)

print("All buttons audit and signal connections completed!")
