import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
autoload_dir = os.path.join(godot_dir, "autoload")
scenes_dir = os.path.join(godot_dir, "scenes")
ui_dir = os.path.join(scenes_dir, "ui")

# -------------------------------------------------------------
# 1. Enhanced AudioManager.gd with Procedural Sound Effects
# -------------------------------------------------------------
audio_manager_code = '''extends Node

# AudioManager.gd - Procedural Sound Effects Synthesizer

var players: Array = []
var player_count: int = 12

func _ready():
	for i in range(player_count):
		var p = AudioStreamPlayer.new()
		add_child(p)
		players.append(p)

func play_sfx(type: String):
	# Create synthetic beep/chime tone using AudioStreamGenerator or pitched playback
	var player = _get_available_player()
	if not player:
		return
		
	var sample_rate = 44100
	var stream = AudioStreamGenerator.new()
	stream.mix_rate = sample_rate
	stream.buffer_length = 0.15
	
	player.stream = stream
	player.play()
	
	var playback = player.get_stream_playback()
	if not playback:
		return
		
	var freq = 440.0
	match type:
		"card_select": freq = 523.25 # C5
		"card_deselect": freq = 392.00 # G4
		"word_score": freq = 659.25 # E5
		"button_click": freq = 440.0 # A4
		"victory": freq = 880.0 # A5
		"error": freq = 220.0 # A3
		"buy": freq = 587.33 # D5

	var frames = int(sample_rate * 0.08)
	for i in range(frames):
		var phase = float(i) / sample_rate * freq * TAU
		var sample = sin(phase) * (1.0 - float(i) / frames) * 0.3
		playback.push_frame(Vector2(sample, sample))

func _get_available_player() -> AudioStreamPlayer:
	for p in players:
		if not p.playing:
			return p
	return players[0]
'''

with open(os.path.join(autoload_dir, "AudioManager.gd"), "w", encoding="utf-8") as f:
    f.write(audio_manager_code)

# -------------------------------------------------------------
# 2. CardTile.gd & CardTile.tscn (Rich Card Graphics)
# -------------------------------------------------------------
card_tile_gd = '''extends Control

signal card_clicked(card_data)

@onready var bg_panel = $Panel
@onready var letter_label = $VBox/LetterLabel
@onready var points_label = $VBox/PointsLabel
@onready var seal_icon = $SealIcon

var card_data: Dictionary = {}
var is_selected: bool = false
var original_pos: Vector2 = Vector2.ZERO

func _ready():
	custom_minimum_size = Vector2(76, 106)
	connect("gui_input", Callable(self, "_on_gui_input"))
	connect("mouse_entered", Callable(self, "_on_mouse_enter"))
	connect("mouse_exited", Callable(self, "_on_mouse_exit"))

func setup(data: Dictionary):
	card_data = data
	var ch = data.get("char", "A")
	var pts = data.get("points", 1)
	var seal = data.get("seal", "")
	
	letter_label.text = ch
	points_label.text = str(pts) + " PT"
	
	_update_style(seal)

func _update_style(seal: String):
	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 10
	style.corner_radius_top_right = 10
	style.corner_radius_bottom_left = 10
	style.corner_radius_bottom_right = 10
	style.border_width_left = 3
	style.border_width_top = 3
	style.border_width_right = 3
	style.border_width_bottom = 3
	
	if seal == "FOIL":
		style.bg_color = Color(0.25, 0.20, 0.05, 0.95)
		style.border_color = Color(0.95, 0.80, 0.20, 1.0)
		seal_icon.text = "🪙"
	elif seal == "HOLOGRAPHIC":
		style.bg_color = Color(0.20, 0.05, 0.25, 0.95)
		style.border_color = Color(0.80, 0.30, 0.95, 1.0)
		seal_icon.text = "🔮"
	elif seal == "POLYCHROME":
		style.bg_color = Color(0.25, 0.05, 0.15, 0.95)
		style.border_color = Color(0.95, 0.40, 0.70, 1.0)
		seal_icon.text = "🌈"
	elif seal == "RED_SEAL":
		style.bg_color = Color(0.25, 0.05, 0.05, 0.95)
		style.border_color = Color(0.95, 0.25, 0.25, 1.0)
		seal_icon.text = "🔴"
	else:
		style.bg_color = Color(0.12, 0.16, 0.24, 0.95)
		style.border_color = Color(0.25, 0.40, 0.65, 1.0)
		seal_icon.text = ""
		
	bg_panel.add_theme_stylebox_override("panel", style)

func _on_mouse_enter():
	AudioManager.play_sfx("button_click")
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.08, 1.08), 0.1)

func _on_mouse_exit():
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.1)

func _on_gui_input(event):
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		emit_signal("card_clicked", card_data)
'''

with open(os.path.join(ui_dir, "CardTile.gd"), "w", encoding="utf-8") as f:
    f.write(card_tile_gd)

card_tile_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/CardTile.gd" id="1_tile"]

[node name="CardTile" type="Control"]
custom_minimum_size = Vector2(76, 106)
layout_mode = 3
anchors_preset = 0
script = ExtResource("1_tile")

[node name="Panel" type="Panel" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_top = 8.0
offset_bottom = -8.0
grow_horizontal = 2
grow_vertical = 2
alignment = 1

[node name="LetterLabel" type="Label" parent="VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 32
text = "A"
horizontal_alignment = 1
vertical_alignment = 1

[node name="PointsLabel" type="Label" parent="VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.85, 0.95, 1)
theme_override_font_sizes/font_size = 12
text = "1 PT"
horizontal_alignment = 1

[node name="SealIcon" type="Label" parent="."]
layout_mode = 1
anchors_preset = 1
anchor_left = 1.0
anchor_right = 1.0
offset_left = -24.0
offset_top = 4.0
offset_right = -4.0
offset_bottom = 24.0
grow_horizontal = 0
horizontal_alignment = 2
'''

with open(os.path.join(ui_dir, "CardTile.tscn"), "w", encoding="utf-8") as f:
    f.write(card_tile_tscn)

# -------------------------------------------------------------
# 3. EnemyNode.gd & EnemyNode.tscn (Visual Enemy Avatar)
# -------------------------------------------------------------
enemy_gd = '''extends Control

@onready var avatar_label = $VBox/AvatarLabel
@onready var name_label = $VBox/NameLabel
@onready var hp_bar = $VBox/HPBar
@onready var intent_label = $VBox/IntentLabel

var enemy_hp: int = 250
var max_enemy_hp: int = 250
var enemy_name: String = "Efsanevi Tepegöz"

func _ready():
	setup_enemy("Efsanevi Tepegöz", "👹", 300, "⚔️ Saldırı: 15 Hasar")

func setup_enemy(n: String, icon: String, hp: int, intent: String):
	enemy_name = n
	enemy_hp = hp
	max_enemy_hp = hp
	name_label.text = enemy_name
	avatar_label.text = icon
	intent_label.text = "Niyet: " + intent
	_update_hp()

func take_damage(amount: int):
	enemy_hp = max(0, enemy_hp - amount)
	_update_hp()
	
	# Shake animation
	var tween = create_tween()
	tween.tween_property(self, "position", position + Vector2(10, 0), 0.05)
	tween.tween_property(self, "position", position - Vector2(10, 0), 0.05)
	tween.tween_property(self, "position", position, 0.05)

func _update_hp():
	hp_bar.max_value = max_enemy_hp
	hp_bar.value = enemy_hp
'''

with open(os.path.join(ui_dir, "EnemyNode.gd"), "w", encoding="utf-8") as f:
    f.write(enemy_gd)

enemy_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/EnemyNode.gd" id="1_enemy"]

[node name="EnemyNode" type="Control"]
custom_minimum_size = Vector2(300, 180)
layout_mode = 3
anchors_preset = 0
script = ExtResource("1_enemy")

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
alignment = 1

[node name="AvatarLabel" type="Label" parent="VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 64
text = "👹"
horizontal_alignment = 1

[node name="NameLabel" type="Label" parent="VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 18
text = "Efsanevi Tepegöz"
horizontal_alignment = 1

[node name="HPBar" type="ProgressBar" parent="VBox"]
custom_minimum_size = Vector2(240, 20)
layout_mode = 2
size_flags_horizontal = 4
value = 100.0
show_percentage = true

[node name="IntentLabel" type="Label" parent="VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.75, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "Niyet: ⚔️ Saldırı 15"
horizontal_alignment = 1
'''

with open(os.path.join(ui_dir, "EnemyNode.tscn"), "w", encoding="utf-8") as f:
    f.write(enemy_tscn)

# -------------------------------------------------------------
# 4. CodexModal.gd & CodexModal.tscn
# -------------------------------------------------------------
codex_gd = '''extends Control

@onready var close_btn = $Panel/VBox/Header/CloseButton
@onready var tab_cards_btn = $Panel/VBox/Header/Tabs/CardsBtn
@onready var tab_relics_btn = $Panel/VBox/Header/Tabs/RelicsBtn
@onready var content_grid = $Panel/VBox/Scroll/Margin/Grid

func _ready():
	close_btn.connect("pressed", Callable(self, "_on_close"))
	tab_cards_btn.connect("pressed", Callable(self, "_show_cards"))
	tab_relics_btn.connect("pressed", Callable(self, "_show_relics"))
	_show_cards()

func _show_cards():
	_clear_grid()
	for ch in CardDatabase.LETTER_DEFINITIONS.keys():
		var info = CardDatabase.LETTER_DEFINITIONS[ch]
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(140, 70)
		btn.text = ch + " (" + str(info["points"]) + " PT)\n" + info["desc"]
		content_grid.add_child(btn)

func _show_relics():
	_clear_grid()
	for r_id in CardDatabase.RELICS.keys():
		var relic = CardDatabase.RELICS[r_id]
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(220, 80)
		btn.text = relic["icon"] + " " + relic["name"] + "\n" + relic["desc"]
		content_grid.add_child(btn)

func _clear_grid():
	for c in content_grid.get_children():
		c.queue_free()

func _on_close():
	visible = false
'''

with open(os.path.join(ui_dir, "CodexModal.gd"), "w", encoding="utf-8") as f:
    f.write(codex_gd)

codex_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/CodexModal.gd" id="1_codex"]

[node name="CodexModal" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_codex")

[node name="Overlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0, 0, 0, 0.75)

[node name="Panel" type="Panel" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -450.0
offset_top = -280.0
offset_right = 450.0
offset_bottom = 280.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="Panel"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 20.0
offset_top = 15.0
offset_right = -20.0
offset_bottom = -15.0
grow_horizontal = 2
grow_vertical = 2

[node name="Header" type="HBoxContainer" parent="Panel/VBox"]
custom_minimum_size = Vector2(0, 40)
layout_mode = 2

[node name="Title" type="Label" parent="Panel/VBox/Header"]
layout_mode = 2
theme_override_font_sizes/font_size = 20
text = "📖 KODEKS & OYUN KATALOĞU"

[node name="Tabs" type="HBoxContainer" parent="Panel/VBox/Header"]
layout_mode = 2
size_flags_horizontal = 3
alignment = 1

[node name="CardsBtn" type="Button" parent="Panel/VBox/Header/Tabs"]
layout_mode = 2
text = "🎴 Harfler"

[node name="RelicsBtn" type="Button" parent="Panel/VBox/Header/Tabs"]
layout_mode = 2
text = "💎 Relic'ler"

[node name="CloseButton" type="Button" parent="Panel/VBox/Header"]
custom_minimum_size = Vector2(40, 0)
layout_mode = 2
text = "❌"

[node name="Scroll" type="ScrollContainer" parent="Panel/VBox"]
layout_mode = 2
size_flags_vertical = 3

[node name="Margin" type="MarginContainer" parent="Panel/VBox/Scroll"]
layout_mode = 2
size_flags_horizontal = 3
size_flags_vertical = 3

[node name="Grid" type="HFlowContainer" parent="Panel/VBox/Scroll/Margin"]
layout_mode = 2
alignment = 1
'''

with open(os.path.join(ui_dir, "CodexModal.tscn"), "w", encoding="utf-8") as f:
    f.write(codex_tscn)

# -------------------------------------------------------------
# 5. Upgraded WordPlayArea.gd with CardTile & EnemyNode Integration
# -------------------------------------------------------------
play_upgraded_gd = '''extends Control

@onready var enemy_node = $VBox/EnemyContainer/EnemyNode
@onready var rack_container = $VBox/RackContainer
@onready var played_container = $VBox/PlayedContainer
@onready var score_label = $VBox/ScorePanel/ScoreLabel
@onready var submit_btn = $VBox/Actions/SubmitButton
@onready var redraw_btn = $VBox/Actions/RedrawButton
@onready var pass_btn = $VBox/Actions/PassButton

var card_tile_scn = preload("res://scenes/ui/CardTile.tscn")
var hand_cards: Array = []
var selected_cards: Array = []

func _ready():
	submit_btn.connect("pressed", Callable(self, "_on_submit"))
	redraw_btn.connect("pressed", Callable(self, "_on_redraw"))
	pass_btn.connect("pressed", Callable(self, "_on_pass"))
	_draw_hand()

func _draw_hand():
	hand_cards = GameManager.deck.duplicate()
	hand_cards.shuffle()
	hand_cards = hand_cards.slice(0, 8)
	selected_cards.clear()
	_update_rack_ui()

func _update_rack_ui():
	for c in rack_container.get_children():
		c.queue_free()
	for c in played_container.get_children():
		c.queue_free()
		
	for card in hand_cards:
		if not selected_cards.has(card):
			var tile = card_tile_scn.instantiate()
			rack_container.add_child(tile)
			tile.setup(card)
			tile.connect("card_clicked", Callable(self, "_select_card"))
			
	for card in selected_cards:
		var tile = card_tile_scn.instantiate()
		played_container.add_child(tile)
		tile.setup(card)
		tile.connect("card_clicked", Callable(self, "_deselect_card"))
		
	_calculate_preview_score()

func _select_card(card):
	if selected_cards.size() < 8:
		AudioManager.play_sfx("card_select")
		selected_cards.append(card)
		_update_rack_ui()

func _deselect_card(card):
	AudioManager.play_sfx("card_deselect")
	selected_cards.erase(card)
	_update_rack_ui()

func _calculate_preview_score():
	if selected_cards.size() == 0:
		score_label.text = "Skor Hedefi: " + str(GameManager.current_score) + " / " + str(GameManager.score_target)
		return
		
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	if eval_res["valid"]:
		score_label.text = "Kelime: " + eval_res["word"] + " | 💥 Puan: " + str(eval_res["total_score"]) + " (" + str(eval_res["chips"]) + " x " + str(eval_res["mult"]) + ")"
	else:
		score_label.text = "Kelime: " + eval_res["word"] + " (❌ Sözlükte Bulunamadı)"

func _on_submit():
	if selected_cards.size() == 0:
		return
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	if eval_res["valid"]:
		AudioManager.play_sfx("word_score")
		var score = eval_res["total_score"]
		GameManager.current_score += score
		GameManager.hands_left -= 1
		GameManager.streak += 1
		
		enemy_node.take_damage(score)
		
		if GameManager.current_score >= GameManager.score_target or enemy_node.enemy_hp <= 0:
			AudioManager.play_sfx("victory")
			GameManager.modify_gold(30)
			GameManager.change_state(GameManager.State.MAP)
		else:
			_draw_hand()
	else:
		AudioManager.play_sfx("error")

func _on_redraw():
	if GameManager.discards_left > 0:
		AudioManager.play_sfx("card_select")
		GameManager.discards_left -= 1
		_draw_hand()

func _on_pass():
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "WordPlayArea.gd"), "w", encoding="utf-8") as f:
    f.write(play_upgraded_gd)

play_upgraded_tscn = '''[gd_scene load_steps=3 format=3]

[ext_resource type="Script" path="res://scenes/ui/WordPlayArea.gd" id="1_play"]
[ext_resource type="PackedScene" path="res://scenes/ui/EnemyNode.tscn" id="2_enemy"]

[node name="WordPlayArea" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_play")

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 40.0
offset_top = 10.0
offset_right = -40.0
offset_bottom = -10.0
grow_horizontal = 2
grow_vertical = 2

[node name="EnemyContainer" type="Control" parent="VBox"]
custom_minimum_size = Vector2(0, 180)
layout_mode = 2

[node name="EnemyNode" parent="VBox/EnemyContainer" instance=ExtResource("2_enemy")]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -150.0
offset_top = -90.0
offset_right = 150.0
offset_bottom = 90.0
grow_horizontal = 2
grow_vertical = 2

[node name="ScorePanel" type="PanelContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2

[node name="ScoreLabel" type="Label" parent="VBox/ScorePanel"]
layout_mode = 2
theme_override_font_sizes/font_size = 18
text = "Skor Hedefi: 0 / 300"
horizontal_alignment = 1
vertical_alignment = 1

[node name="PlayedContainer" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 120)
layout_mode = 2
alignment = 1

[node name="RackContainer" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 120)
layout_mode = 2
alignment = 1

[node name="Actions" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
alignment = 1

[node name="SubmitButton" type="Button" parent="VBox/Actions"]
custom_minimum_size = Vector2(200, 50)
layout_mode = 2
text = "⚔️ KELİMEYİ GÖNDER"

[node name="RedrawButton" type="Button" parent="VBox/Actions"]
custom_minimum_size = Vector2(170, 50)
layout_mode = 2
text = "🔄 HARFLERİ YENİLE"

[node name="PassButton" type="Button" parent="VBox/Actions"]
custom_minimum_size = Vector2(130, 50)
layout_mode = 2
text = "🏳️ PAS GEÇ"
'''

with open(os.path.join(ui_dir, "WordPlayArea.tscn"), "w", encoding="utf-8") as f:
    f.write(play_upgraded_tscn)

print("Visual & Feature enhancements applied successfully!")
