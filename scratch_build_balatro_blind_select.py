import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Balatro-Style Blind Selector GDScript (MapScreen.gd)
# -------------------------------------------------------------
blind_gd = '''extends Control

@onready var small_card = $VBox/BlindsContainer/SmallBlind
@onready var big_card = $VBox/BlindsContainer/BigBlind
@onready var boss_card = $VBox/BlindsContainer/BossBlind
@onready var ante_label = $VBox/Header/AnteLabel

var current_blind_stage: int = 1 # 1: Small, 2: Big, 3: Boss

func _ready():
	current_blind_stage = GameManager.current_level
	ante_label.text = "ANTE  " + str(GameManager.act) + " / 8"
	
	_render_blinds()

func _render_blinds():
	_setup_small_blind()
	_setup_big_blind()
	_setup_boss_blind()

func _setup_small_blind():
	var status_btn = small_card.get_node("VBox/TopStatus/StatusButton")
	var skip_btn = small_card.get_node("VBox/SkipBox/SkipButton")
	var panel = small_card.get_node("Panel")
	
	if current_blind_stage > 1:
		# Already completed
		status_btn.text = "TAMAMLANDI"
		status_btn.disabled = true
		skip_btn.disabled = true
		_apply_card_style(panel, Color(0.15, 0.2, 0.25, 0.7), Color(0.2, 0.4, 0.5), false)
	elif current_blind_stage == 1:
		# Active
		status_btn.text = "SEÇ (Select)"
		status_btn.disabled = false
		status_btn.connect("pressed", Callable(self, "_select_blind").bind(1, 300))
		skip_btn.disabled = false
		skip_btn.connect("pressed", Callable(self, "_skip_blind").bind(1, 15))
		_apply_card_style(panel, Color(0.1, 0.16, 0.26, 0.95), Color(0.02, 0.52, 0.78), true)
	else:
		# Upcoming
		status_btn.text = "Sıradaki"
		status_btn.disabled = true
		skip_btn.disabled = true
		_apply_card_style(panel, Color(0.08, 0.1, 0.14, 0.6), Color(0.2, 0.25, 0.35), false)

func _setup_big_blind():
	var status_btn = big_card.get_node("VBox/TopStatus/StatusButton")
	var skip_btn = big_card.get_node("VBox/SkipBox/SkipButton")
	var panel = big_card.get_node("Panel")
	
	if current_blind_stage > 2:
		status_btn.text = "TAMAMLANDI"
		status_btn.disabled = true
		skip_btn.disabled = true
		_apply_card_style(panel, Color(0.15, 0.2, 0.25, 0.7), Color(0.2, 0.4, 0.5), false)
	elif current_blind_stage == 2:
		status_btn.text = "SEÇ (Select)"
		status_btn.disabled = false
		status_btn.connect("pressed", Callable(self, "_select_blind").bind(2, 600))
		skip_btn.disabled = false
		skip_btn.connect("pressed", Callable(self, "_skip_blind").bind(2, 25))
		_apply_card_style(panel, Color(0.2, 0.16, 0.08, 0.95), Color(0.85, 0.55, 0.1), true)
	else:
		status_btn.text = "Sıradaki"
		status_btn.disabled = true
		skip_btn.disabled = true
		_apply_card_style(panel, Color(0.08, 0.1, 0.14, 0.6), Color(0.25, 0.25, 0.35), false)

func _setup_boss_blind():
	var status_btn = boss_card.get_node("VBox/TopStatus/StatusButton")
	var panel = boss_card.get_node("Panel")
	
	if current_blind_stage == 3:
		status_btn.text = "SEÇ (Select)"
		status_btn.disabled = false
		status_btn.connect("pressed", Callable(self, "_select_blind").bind(3, 1200))
		_apply_card_style(panel, Color(0.25, 0.1, 0.12, 0.95), Color(0.9, 0.25, 0.25), true)
	else:
		status_btn.text = "Sıradaki"
		status_btn.disabled = true
		_apply_card_style(panel, Color(0.08, 0.1, 0.14, 0.6), Color(0.35, 0.2, 0.25), false)

func _apply_card_style(panel: Panel, bg_col: Color, border_col: Color, is_active: bool):
	var style = StyleBoxFlat.new()
	style.bg_color = bg_col
	style.border_width_left = 3 if is_active else 2
	style.border_width_top = 3 if is_active else 2
	style.border_width_right = 3 if is_active else 2
	style.border_width_bottom = 3 if is_active else 2
	style.border_color = border_col
	style.corner_radius_top_left = 16
	style.corner_radius_top_right = 16
	style.corner_radius_bottom_left = 16
	style.corner_radius_bottom_right = 16
	if is_active:
		style.shadow_color = border_col
		style.shadow_size = 14
	panel.add_theme_stylebox_override("panel", style)

func _select_blind(stage: int, target_score: int):
	AudioManager.play_sfx("card_select")
	GameManager.score_target = target_score
	GameManager.current_score = 0
	GameManager.change_state(GameManager.State.COMBAT)

func _skip_blind(stage: int, bonus_gold: int):
	AudioManager.play_sfx("buy")
	GameManager.modify_gold(bonus_gold)
	GameManager.current_level += 1
	current_blind_stage += 1
	_render_blinds()
'''

with open(os.path.join(ui_dir, "MapScreen.gd"), "w", encoding="utf-8") as f:
    f.write(blind_gd)

# -------------------------------------------------------------
# Balatro-Style Blind Selector TSCN (MapScreen.tscn)
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

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/BigBlind/VBox"]
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

[node name="VBox" type="VBoxContainer" parent="VBox/BlindsContainer/BossBlind/VBox"]
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

print("Authentic Balatro Blind Selector created successfully!")
