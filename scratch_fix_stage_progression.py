import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
autoload_dir = os.path.join(godot_dir, "autoload")
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Updated GameManager.gd with advance_stage()
# -------------------------------------------------------------
game_manager_code = '''extends Node

# GameManager.gd - Global Game Manager Singleton

enum State {
	MAIN_MENU,
	CHARACTER_SELECT,
	STAKES_SELECT,
	MAP,
	COMBAT,
	SHOP,
	EVENT,
	CAMP,
	TRIVIA,
	DRAFT,
	VICTORY,
	GAME_OVER
}

signal state_changed(new_state)
signal player_stats_changed

var current_state: State = State.MAIN_MENU

# Player Run State
var selected_character: String = "MIMAR"
var selected_stake: String = "WHITE_STAKE"
var player_hp: int = 100
var max_hp: int = 100
var gold: int = 50
var hands_left: int = 4
var discards_left: int = 3
var current_level: int = 1 # 1: Small Blind, 2: Big Blind, 3: Boss Blind
var act: int = 1 # Ante level (1 to 8)
var streak: int = 1
var score_target: int = 300
var current_score: int = 0

var deck: Array = []
var hand: Array = []
var discard_pile: Array = []
var active_relics: Array = []
var passive_jokers: Array = []

func _ready():
	print("GameManager initialized!")

func change_state(new_state: State):
	current_state = new_state
	emit_signal("state_changed", new_state)

func start_new_run(character_id: String = "MIMAR", stake_id: String = "WHITE_STAKE"):
	selected_character = character_id
	selected_stake = stake_id
	player_hp = 100
	max_hp = 100
	gold = 50
	hands_left = 4
	discards_left = 3
	current_level = 1
	act = 1
	streak = 1
	score_target = 300
	current_score = 0
	active_relics.clear()
	passive_jokers.clear()
	
	# Load starter deck
	deck.clear()
	var starter_data = CardDatabase.STARTER_DECKS.get(character_id, CardDatabase.STARTER_DECKS["MIMAR"])
	for char in starter_data["letters"]:
		deck.append({
			"id": str(randi()),
			"char": char,
			"points": CardDatabase.get_letter_info(char).get("points", 1),
			"seal": ""
		})
	deck.shuffle()
	
	emit_signal("player_stats_changed")
	change_state(State.MAP)

func advance_stage():
	current_level += 1
	if current_level > 3:
		current_level = 1
		act += 1
	# Reset round stats
	hands_left = 4
	discards_left = 3
	current_score = 0
	emit_signal("player_stats_changed")

func modify_hp(amount: int):
	player_hp = clamp(player_hp + amount, 0, max_hp)
	emit_signal("player_stats_changed")
	if player_hp <= 0:
		change_state(State.GAME_OVER)

func modify_gold(amount: int):
	gold = max(0, gold + amount)
	emit_signal("player_stats_changed")

func add_relic(relic_id: String):
	if not active_relics.has(relic_id):
		active_relics.append(relic_id)
		emit_signal("player_stats_changed")
'''

with open(os.path.join(autoload_dir, "GameManager.gd"), "w", encoding="utf-8") as f:
    f.write(game_manager_code)

# -------------------------------------------------------------
# Updated WordPlayArea.gd to call advance_stage()
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

print("Stage progression bug fixed! advance_stage() integrated.")
