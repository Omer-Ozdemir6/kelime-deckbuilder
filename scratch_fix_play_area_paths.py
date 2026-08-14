import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Fixed WordPlayArea.gd with precise node paths
# -------------------------------------------------------------
play_gd = '''extends Control

@onready var chips_label = $MainLayout/LeftSidebar/ScoreMeter/HBox/ChipsBox/ChipsLabel
@onready var mult_label = $MainLayout/LeftSidebar/ScoreMeter/HBox/MultBox/MultLabel
@onready var round_score_label = $MainLayout/LeftSidebar/RoundScoreBox/VBox/ScoreLabel
@onready var target_score_label = $MainLayout/LeftSidebar/BlindBox/VBox/TargetScore

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
			GameManager.advance_stage()
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

print("WordPlayArea.gd node paths fixed successfully!")
