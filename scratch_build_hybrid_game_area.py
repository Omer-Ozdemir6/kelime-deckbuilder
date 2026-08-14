import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Hybrid Gameplay Arena GDScript (WordPlayArea.gd)
# -------------------------------------------------------------
play_gd = '''extends Control

@onready var chips_label = $MainLayout/LeftSidebar/ScoreMeter/HBox/ChipsBox/ChipsLabel
@onready var mult_label = $MainLayout/LeftSidebar/ScoreMeter/HBox/MultBox/MultLabel
@onready var round_score_label = $MainLayout/LeftSidebar/RoundScoreBox/ScoreLabel
@onready var target_score_label = $MainLayout/LeftSidebar/BlindBox/TargetScore

@onready var hands_label = $MainLayout/LeftSidebar/StatsBox/Grid/HandsValue
@onready var discards_label = $MainLayout/LeftSidebar/StatsBox/Grid/DiscardsValue
@onready var gold_label = $MainLayout/LeftSidebar/StatsBox/Grid/GoldValue
@onready var ante_label = $MainLayout/LeftSidebar/StatsBox/Grid/AnteValue

@onready var jokers_container = $MainLayout/CenterArea/TopJokers/HBox
@onready var slots_container = $MainLayout/CenterArea/WordBoard/SlotsHBox
@onready var rack_container = $MainLayout/CenterArea/BottomRack/RackHBox
@onready var word_preview_label = $MainLayout/CenterArea/WordBoard/WordPreviewLabel

@onready var play_button = $MainLayout/CenterArea/ActionRow/PlayButton
@onready var clear_button = $MainLayout/CenterArea/ActionRow/ClearButton
@onready var pass_button = $MainLayout/CenterArea/ActionRow/PassButton

var card_tile_scn = preload("res://scenes/ui/CardTile.tscn")

var hand_cards: Array = []
var selected_cards: Array = []

func _ready():
	play_button.connect("pressed", Callable(self, "_on_play_word"))
	clear_button.connect("pressed", Callable(self, "_on_clear_word"))
	pass_button.connect("pressed", Callable(self, "_on_pass"))
	
	_setup_sidebar_styles()
	_update_stats_display()
	_draw_hand()

func _setup_sidebar_styles():
	var blue_box = StyleBoxFlat.new()
	blue_box.bg_color = Color(0.02, 0.45, 0.9)
	blue_box.corner_radius_top_left = 8
	blue_box.corner_radius_bottom_left = 8
	$MainLayout/LeftSidebar/ScoreMeter/HBox/ChipsBox.add_theme_stylebox_override("panel", blue_box)

	var red_box = StyleBoxFlat.new()
	red_box.bg_color = Color(0.9, 0.22, 0.22)
	red_box.corner_radius_top_right = 8
	red_box.corner_radius_bottom_right = 8
	$MainLayout/LeftSidebar/ScoreMeter/HBox/MultBox.add_theme_stylebox_override("panel", red_box)

func _update_stats_display():
	target_score_label.text = str(GameManager.score_target)
	round_score_label.text = str(GameManager.current_score)
	hands_label.text = str(GameManager.hands_left)
	discards_label.text = str(GameManager.discards_left)
	gold_label.text = "$" + str(GameManager.gold)
	ante_label.text = str(GameManager.act) + "/8"

func _draw_hand():
	hand_cards = GameManager.deck.duplicate()
	hand_cards.shuffle()
	hand_cards = hand_cards.slice(0, 8)
	selected_cards.clear()
	_render_board()

func _render_board():
	# Render Rack
	for c in rack_container.get_children():
		c.queue_free()
	for card in hand_cards:
		if not selected_cards.has(card):
			var tile = card_tile_scn.instantiate()
			rack_container.add_child(tile)
			tile.setup(card)
			tile.connect("card_clicked", Callable(self, "_select_card"))
			
	# Render Played Word Slots
	for c in slots_container.get_children():
		c.queue_free()
	for card in selected_cards:
		var tile = card_tile_scn.instantiate()
		slots_container.add_child(tile)
		tile.setup(card)
		tile.connect("card_clicked", Callable(self, "_deselect_card"))
		
	_calculate_live_multiplier()

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

func _calculate_live_multiplier():
	if selected_cards.size() == 0:
		chips_label.text = "0"
		mult_label.text = "0"
		word_preview_label.text = "Henüz kelime yazılmadı"
		return
		
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	chips_label.text = str(eval_res["chips"])
	mult_label.text = str(eval_res["mult"])
	
	if eval_res["valid"]:
		word_preview_label.text = "Kelime: " + eval_res["word"] + " (✓ Geçerli) — Toplam: " + str(eval_res["total_score"]) + " Puan"
	else:
		word_preview_label.text = "Kelime: " + eval_res["word"] + " (❌ Sözlükte Bulunamadı)"

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
			GameManager.change_state(GameManager.State.MAP)
		else:
			_draw_hand()
	else:
		AudioManager.play_sfx("error")

func _on_pass():
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "WordPlayArea.gd"), "w", encoding="utf-8") as f:
    f.write(play_gd)

# -------------------------------------------------------------
# Hybrid Gameplay Arena TSCN (WordPlayArea.tscn)
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
color = Color(0.06, 0.08, 0.13, 1)

[node name="MainLayout" type="HBoxContainer" parent="."]
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

[node name="LeftSidebar" type="VBoxContainer" parent="MainLayout"]
custom_minimum_size = Vector2(280, 0)
layout_mode = 2
theme_override_constants/separation = 12

[node name="BlindBox" type="PanelContainer" parent="MainLayout/LeftSidebar"]
custom_minimum_size = Vector2(0, 110)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="MainLayout/LeftSidebar/BlindBox"]
layout_mode = 2
alignment = 1

[node name="BlindTitle" type="Label" parent="MainLayout/LeftSidebar/BlindBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 18
text = "🔵 KÜÇÜK AŞAMA"
horizontal_alignment = 1

[node name="TargetLabel" type="Label" parent="MainLayout/LeftSidebar/BlindBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.85, 0.95, 1)
theme_override_font_sizes/font_size = 13
text = "Hedef Puan:"
horizontal_alignment = 1

[node name="TargetScore" type="Label" parent="MainLayout/LeftSidebar/BlindBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 28
text = "300"
horizontal_alignment = 1

[node name="RoundScoreBox" type="PanelContainer" parent="MainLayout/LeftSidebar"]
custom_minimum_size = Vector2(0, 70)
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="MainLayout/LeftSidebar/RoundScoreBox"]
layout_mode = 2
alignment = 1

[node name="Title" type="Label" parent="MainLayout/LeftSidebar/RoundScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.7, 0.75, 0.85, 1)
theme_override_font_sizes/font_size = 12
text = "Toplanan Skor"
horizontal_alignment = 1

[node name="ScoreLabel" type="Label" parent="MainLayout/LeftSidebar/RoundScoreBox/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 26
text = "0"
horizontal_alignment = 1

[node name="ScoreMeter" type="Control" parent="MainLayout/LeftSidebar"]
custom_minimum_size = Vector2(0, 70)
layout_mode = 2

[node name="HBox" type="HBoxContainer" parent="MainLayout/LeftSidebar/ScoreMeter"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 0

[node name="ChipsBox" type="Panel" parent="MainLayout/LeftSidebar/ScoreMeter/HBox"]
layout_mode = 2
size_flags_horizontal = 3

[node name="ChipsLabel" type="Label" parent="MainLayout/LeftSidebar/ScoreMeter/HBox/ChipsBox"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_font_sizes/font_size = 32
text = "0"
horizontal_alignment = 1
vertical_alignment = 1

[node name="XLabel" type="Label" parent="MainLayout/LeftSidebar/ScoreMeter/HBox"]
custom_minimum_size = Vector2(24, 0)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 20
text = "X"
horizontal_alignment = 1
vertical_alignment = 1

[node name="MultBox" type="Panel" parent="MainLayout/LeftSidebar/ScoreMeter/HBox"]
layout_mode = 2
size_flags_horizontal = 3

[node name="MultLabel" type="Label" parent="MainLayout/LeftSidebar/ScoreMeter/HBox/MultBox"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_font_sizes/font_size = 32
text = "0"
horizontal_alignment = 1
vertical_alignment = 1

[node name="StatsBox" type="PanelContainer" parent="MainLayout/LeftSidebar"]
layout_mode = 2
size_flags_vertical = 3

[node name="Grid" type="GridContainer" parent="MainLayout/LeftSidebar/StatsBox"]
layout_mode = 2
theme_override_constants/h_separation = 12
theme_override_constants/v_separation = 12
columns = 2

[node name="HandsTitle" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
text = "🖐️ Hamle:"

[node name="HandsValue" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
text = "4"

[node name="DiscardsTitle" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
text = "🔄 Iskarta:"

[node name="DiscardsValue" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.4, 0.4, 1)
text = "3"

[node name="GoldTitle" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
text = "💰 Altın:"

[node name="GoldValue" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
text = "$50"

[node name="AnteTitle" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
text = "🚩 Ante:"

[node name="AnteValue" type="Label" parent="MainLayout/LeftSidebar/StatsBox/Grid"]
layout_mode = 2
theme_override_colors/font_color = Color(0.8, 0.5, 0.95, 1)
text = "1/8"

[node name="CenterArea" type="VBoxContainer" parent="MainLayout"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_constants/separation = 14

[node name="TopJokers" type="PanelContainer" parent="MainLayout/CenterArea"]
custom_minimum_size = Vector2(0, 90)
layout_mode = 2

[node name="HBox" type="HBoxContainer" parent="MainLayout/CenterArea/TopJokers"]
layout_mode = 2
theme_override_constants/separation = 12
alignment = 1

[node name="InfoLabel" type="Label" parent="MainLayout/CenterArea/TopJokers/HBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.6, 0.65, 0.75, 1)
theme_override_font_sizes/font_size = 13
text = "🃏 Pasif Joker Slotları (Dükkandan yeni jokerler alabilirsiniz)"

[node name="WordBoard" type="PanelContainer" parent="MainLayout/CenterArea"]
layout_mode = 2
size_flags_vertical = 3

[node name="VBox" type="VBoxContainer" parent="MainLayout/CenterArea/WordBoard"]
layout_mode = 2
alignment = 1

[node name="WordPreviewLabel" type="Label" parent="MainLayout/CenterArea/WordBoard"]
layout_mode = 2
size_flags_vertical = 0
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 15
text = "Henüz kelime yazılmadı"
horizontal_alignment = 1

[node name="SlotsHBox" type="HBoxContainer" parent="MainLayout/CenterArea/WordBoard"]
custom_minimum_size = Vector2(0, 130)
layout_mode = 2
theme_override_constants/separation = 12
alignment = 1

[node name="ActionRow" type="HBoxContainer" parent="MainLayout/CenterArea"]
custom_minimum_size = Vector2(0, 56)
layout_mode = 2
theme_override_constants/separation = 16
alignment = 1

[node name="ClearButton" type="Button" parent="MainLayout/CenterArea/ActionRow"]
custom_minimum_size = Vector2(140, 50)
layout_mode = 2
text = "🧹 Temizle"

[node name="PassButton" type="Button" parent="MainLayout/CenterArea/ActionRow"]
custom_minimum_size = Vector2(140, 50)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.4, 0.4, 1)
text = "🏳️ Pas Geç"

[node name="PlayButton" type="Button" parent="MainLayout/CenterArea/ActionRow"]
custom_minimum_size = Vector2(260, 50)
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 18
text = "▶️ KELİMEYİ OYNA"

[node name="BottomRack" type="PanelContainer" parent="MainLayout/CenterArea"]
custom_minimum_size = Vector2(0, 140)
layout_mode = 2

[node name="RackHBox" type="HBoxContainer" parent="MainLayout/CenterArea/BottomRack"]
layout_mode = 2
theme_override_constants/separation = 10
alignment = 1
'''

with open(os.path.join(ui_dir, "WordPlayArea.tscn"), "w", encoding="utf-8") as f:
    f.write(play_tscn)

print("Hybrid Gameplay Arena created successfully!")
