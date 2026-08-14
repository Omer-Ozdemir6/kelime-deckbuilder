import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Authentic Kelime Deckbuilder Game Area GDScript (WordPlayArea.gd)
# -------------------------------------------------------------
play_gd = '''extends Control

@onready var kademe_label = $VBox/TopBar/HBox/KademeBadge/Label
@onready var gold_label = $VBox/TopBar/HBox/GoldBadge/Label
@onready var deck_btn = $VBox/TopBar/HBox/DeckButton
@onready var codex_btn = $VBox/TopBar/HBox/CodexButton

@onready var score_progress = $VBox/TargetScorePanel/VBox/ScoreHBox/ProgressBar
@onready var score_text_label = $VBox/TargetScorePanel/VBox/ScoreHBox/ScoreTextLabel
@onready var hands_label = $VBox/TargetScorePanel/VBox/SubHBox/HandsBadge/Label
@onready var discards_label = $VBox/TargetScorePanel/VBox/SubHBox/DiscardsBadge/Label
@onready var refresh_btn = $VBox/TargetScorePanel/VBox/SubHBox/RefreshButton

@onready var word_preview_label = $VBox/WordBoardPanel/VBox/WordPreviewLabel
@onready var slots_container = $VBox/WordBoardPanel/VBox/SlotsFrame/SlotsHBox

@onready var clear_btn = $VBox/ActionRow/ClearButton
@onready var pass_btn = $VBox/ActionRow/PassButton
@onready var play_btn = $VBox/ActionRow/PlayButton

@onready var rack_container = $VBox/RackPanel/VBox/RackHBox
@onready var rack_info_label = $VBox/RackPanel/VBox/RackHeader/InfoLabel

var card_tile_scn = preload("res://scenes/ui/CardTile.tscn")

var hand_cards: Array = []
var selected_cards: Array = []

func _ready():
	play_btn.connect("pressed", Callable(self, "_on_play_word"))
	clear_btn.connect("pressed", Callable(self, "_on_clear_word"))
	pass_btn.connect("pressed", Callable(self, "_on_pass"))
	refresh_btn.connect("pressed", Callable(self, "_on_refresh_click"))
	deck_btn.connect("pressed", Callable(self, "_on_deck_click"))
	codex_btn.connect("pressed", Callable(self, "_on_codex_click"))
	
	_update_stats_display()
	_draw_hand()

func _update_stats_display():
	kademe_label.text = "KADEME " + str(GameManager.act)
	gold_label.text = "💰 " + str(GameManager.gold)
	deck_btn.text = "🎴 " + str(GameManager.deck.size())
	
	hands_label.text = "Hamle Hakkı: " + str(GameManager.hands_left)
	discards_label.text = "Iskarta: " + str(GameManager.discards_left)
	refresh_btn.text = "🔄 YENİLE (" + str(GameManager.discards_left) + ")"
	
	var cur = GameManager.current_score
	var target = GameManager.score_target
	score_progress.max_value = target
	score_progress.value = cur
	
	var pct = 0
	if target > 0:
		pct = int((float(cur) / float(target)) * 100.0)
	score_text_label.text = str(cur) + " / " + str(target) + "  (" + str(pct) + "%)"

func _draw_hand():
	hand_cards = GameManager.deck.duplicate()
	hand_cards.shuffle()
	hand_cards = hand_cards.slice(0, 8)
	selected_cards.clear()
	_render_board()

func _render_board():
	# Render Letter Rack
	for c in rack_container.get_children():
		c.queue_free()
	for card in hand_cards:
		if not selected_cards.has(card):
			var tile = card_tile_scn.instantiate()
			rack_container.add_child(tile)
			tile.setup(card)
			tile.connect("card_clicked", Callable(self, "_select_card"))
			
	rack_info_label.text = "🎴 Eldeki Harfler (" + str(hand_cards.size() - selected_cards.size()) + "/" + str(hand_cards.size()) + ")"
	
	# Render Played Word Slots
	for c in slots_container.get_children():
		c.queue_free()
		
	for card in selected_cards:
		var tile = card_tile_scn.instantiate()
		slots_container.add_child(tile)
		tile.setup(card)
		tile.connect("card_clicked", Callable(self, "_deselect_card"))
		
	# Render empty slot placeholders up to 7
	var remaining_slots = 7 - selected_cards.size()
	for i in range(remaining_slots):
		var slot_idx = selected_cards.size() + i + 1
		var lbl = Label.new()
		lbl.custom_minimum_size = Vector2(60, 90)
		var bonus_txt = ""
		if slot_idx == 5: bonus_txt = "\n+5p"
		elif slot_idx == 6: bonus_txt = "\n+10p"
		elif slot_idx == 7: bonus_txt = "\n+15p"
		lbl.text = "#" + str(slot_idx) + bonus_txt
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		lbl.add_theme_color_override("font_color", Color(0.4, 0.45, 0.55, 0.6))
		slots_container.add_child(lbl)
		
	_calculate_live_score()

func _select_card(card_data: Dictionary):
	if selected_cards.size() < 7:
		AudioManager.play_sfx("card_select")
		selected_cards.append(card_data)
		_render_board()

func _deselect_card(card_data: Dictionary):
	AudioManager.play_sfx("card_deselect")
	selected_cards.erase(card_data)
	_render_board()

func _on_clear_word():
	AudioManager.play_sfx("card_deselect")
	selected_cards.clear()
	_render_board()

func _calculate_live_score():
	if selected_cards.size() == 0:
		word_preview_label.text = "Henüz kelime yazılmadı"
		return
		
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	if eval_res["valid"]:
		word_preview_label.text = "Kelime: " + eval_res["word"] + " (✓ Geçerli) — Puan: " + str(eval_res["total_score"]) + " (" + str(eval_res["chips"]) + " x " + str(eval_res["mult"]) + ")"
		word_preview_label.add_theme_color_override("font_color", Color(0.3, 0.95, 0.6))
	else:
		word_preview_label.text = "Kelime: " + eval_res["word"] + " (❌ Sözlükte Bulunamadı)"
		word_preview_label.add_theme_color_override("font_color", Color(0.95, 0.4, 0.4))

func _on_play_word():
	if selected_cards.size() == 0:
		return
		
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	if eval_res["valid"]:
		AudioManager.play_sfx("word_score")
		var points = eval_res["total_score"]
		GameManager.current_score += points
		GameManager.hands_left -= 1
		GameManager.streak += 1
		
		_update_stats_display()
		
		if GameManager.current_score >= GameManager.score_target:
			AudioManager.play_sfx("victory")
			GameManager.modify_gold(30)
			GameManager.advance_stage()
			GameManager.change_state(GameManager.State.MAP)
		else:
			_draw_hand()
	else:
		AudioManager.play_sfx("error")

func _on_refresh_click():
	if GameManager.discards_left > 0:
		AudioManager.play_sfx("card_select")
		GameManager.discards_left -= 1
		_update_stats_display()
		_draw_hand()

func _on_pass():
	GameManager.change_state(GameManager.State.MAP)

func _on_deck_click():
	print("Deck clicked")

func _on_codex_click():
	print("Codex clicked")
'''

with open(os.path.join(ui_dir, "WordPlayArea.gd"), "w", encoding="utf-8") as f:
    f.write(play_gd)

# -------------------------------------------------------------
# Authentic Kelime Deckbuilder Game Area TSCN (WordPlayArea.tscn)
# -------------------------------------------------------------
play_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/WordPlayArea.gd" id="1_play"]

[node name="WordPlayArea" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_play")

[node name="BG" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.05, 0.07, 0.12, 1)

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 20.0
offset_top = 10.0
offset_right = -20.0
offset_bottom = -10.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 12

[node name="TopBar" type="PanelContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 48)
layout_mode = 2

[node name="HBox" type="HBoxContainer" parent="VBox/TopBar"]
layout_mode = 2
offset_left = 12.0
offset_right = -12.0
theme_override_constants/separation = 16
alignment = 0

[node name="KademeBadge" type="PanelContainer" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(120, 32)
layout_mode = 2
size_flags_vertical = 4

[node name="Label" type="Label" parent="VBox/TopBar/HBox/KademeBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 14
text = "KADEME 1"
horizontal_alignment = 1

[node name="GoldBadge" type="PanelContainer" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(90, 32)
layout_mode = 2
size_flags_vertical = 4

[node name="Label" type="Label" parent="VBox/TopBar/HBox/GoldBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "💰 15"
horizontal_alignment = 1

[node name="Spacer" type="Control" parent="VBox/TopBar/HBox"]
layout_mode = 2
size_flags_horizontal = 3

[node name="DeckButton" type="Button" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(90, 34)
layout_mode = 2
size_flags_vertical = 4
text = "🎴 20"

[node name="CodexButton" type="Button" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(90, 34)
layout_mode = 2
size_flags_vertical = 4
text = "📖 Sözlük"

[node name="TargetScorePanel" type="PanelContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 110)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="VBox/TargetScorePanel"]
layout_mode = 2
offset_left = 16.0
offset_top = 10.0
offset_right = -16.0
offset_bottom = -10.0
theme_override_constants/separation = 8
alignment = 1

[node name="JokerInfo" type="Label" parent="VBox/TargetScorePanel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.7, 0.75, 0.85, 0.8)
theme_override_font_sizes/font_size = 12
text = "🃏 Pasif Joker Slotu Boş (Dükkandan yeni jokerler alabilirsiniz)"

[node name="ScoreHBox" type="HBoxContainer" parent="VBox/TargetScorePanel/VBox"]
custom_minimum_size = Vector2(0, 32)
layout_mode = 2
theme_override_constants/separation = 14

[node name="Label" type="Label" parent="VBox/TargetScorePanel/VBox/ScoreHBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.3, 0.9, 0.8, 1)
theme_override_font_sizes/font_size = 15
text = "🎯 HEDEF PUAN:"

[node name="ProgressBar" type="ProgressBar" parent="VBox/TargetScorePanel/VBox/ScoreHBox"]
layout_mode = 2
size_flags_horizontal = 3
size_flags_vertical = 4
value = 0.0
show_percentage = false

[node name="ScoreTextLabel" type="Label" parent="VBox/TargetScorePanel/VBox/ScoreHBox"]
custom_minimum_size = Vector2(140, 0)
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 15
text = "0 / 300  (0%)"
horizontal_alignment = 2

[node name="SubHBox" type="HBoxContainer" parent="VBox/TargetScorePanel/VBox"]
layout_mode = 2
theme_override_constants/separation = 14

[node name="HandsBadge" type="PanelContainer" parent="VBox/TargetScorePanel/VBox/SubHBox"]
custom_minimum_size = Vector2(150, 30)
layout_mode = 2

[node name="Label" type="Label" parent="VBox/TargetScorePanel/VBox/SubHBox/HandsBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.8, 0.3, 1)
theme_override_font_sizes/font_size = 13
text = "Hamle Hakkı: 4"
horizontal_alignment = 1

[node name="DiscardsBadge" type="PanelContainer" parent="VBox/TargetScorePanel/VBox/SubHBox"]
custom_minimum_size = Vector2(130, 30)
layout_mode = 2

[node name="Label" type="Label" parent="VBox/TargetScorePanel/VBox/SubHBox/DiscardsBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.4, 0.4, 1)
theme_override_font_sizes/font_size = 13
text = "Iskarta: 3"
horizontal_alignment = 1

[node name="Spacer" type="Control" parent="VBox/TargetScorePanel/VBox/SubHBox"]
layout_mode = 2
size_flags_horizontal = 3

[node name="RefreshButton" type="Button" parent="VBox/TargetScorePanel/VBox/SubHBox"]
custom_minimum_size = Vector2(120, 30)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 13
text = "🔄 YENİLE (3)"

[node name="WordBoardPanel" type="PanelContainer" parent="VBox"]
layout_mode = 2
size_flags_vertical = 3

[node name="VBox" type="VBoxContainer" parent="VBox/WordBoardPanel"]
layout_mode = 2
offset_left = 16.0
offset_top = 12.0
offset_right = -16.0
offset_bottom = -12.0
theme_override_constants/separation = 16
alignment = 1

[node name="WordPreviewLabel" type="Label" parent="VBox/WordBoardPanel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 15
text = "Henüz kelime yazılmadı"
horizontal_alignment = 1

[node name="SlotsFrame" type="PanelContainer" parent="VBox/WordBoardPanel/VBox"]
custom_minimum_size = Vector2(0, 140)
layout_mode = 2

[node name="SlotsHBox" type="HBoxContainer" parent="VBox/WordBoardPanel/VBox/SlotsFrame"]
layout_mode = 2
theme_override_constants/separation = 12
alignment = 1

[node name="ActionRow" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 56)
layout_mode = 2
theme_override_constants/separation = 16
alignment = 1

[node name="ClearButton" type="Button" parent="VBox/ActionRow"]
custom_minimum_size = Vector2(140, 48)
layout_mode = 2
text = "🧹 Temizle"

[node name="PassButton" type="Button" parent="VBox/ActionRow"]
custom_minimum_size = Vector2(160, 48)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.4, 0.4, 1)
text = "🏳️ Pas"

[node name="PlayButton" type="Button" parent="VBox/ActionRow"]
custom_minimum_size = Vector2(280, 48)
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "▶ KELİMEYİ OYNA"

[node name="RackPanel" type="PanelContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 160)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="VBox/RackPanel"]
layout_mode = 2
offset_left = 16.0
offset_top = 10.0
offset_right = -16.0
offset_bottom = -10.0
theme_override_constants/separation = 10

[node name="RackHeader" type="HBoxContainer" parent="VBox/RackPanel/VBox"]
layout_mode = 2

[node name="InfoLabel" type="Label" parent="VBox/RackPanel/VBox/RackHeader"]
layout_mode = 2
theme_override_colors/font_color = Color(0.3, 0.9, 0.8, 1)
theme_override_font_sizes/font_size = 13
text = "🎴 Eldeki Harfler (8/8)"

[node name="RackHBox" type="HBoxContainer" parent="VBox/RackPanel/VBox"]
layout_mode = 2
theme_override_constants/separation = 10
alignment = 1
'''

with open(os.path.join(ui_dir, "WordPlayArea.tscn"), "w", encoding="utf-8") as f:
    f.write(play_tscn)

print("Authentic Kelime Deckbuilder Game Area created successfully!")
