import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
play_gd_path = os.path.join(godot_dir, "scenes", "ui", "WordPlayArea.gd")

code = '''extends Control

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
@onready var shuffle_btn = $VBox/ActionRow/ShuffleButton
@onready var play_btn = $VBox/ActionRow/PlayButton

@onready var rack_container = $VBox/RackPanel/VBox/RackHBox
@onready var rack_info_label = $VBox/RackPanel/VBox/RackHeader/InfoLabel

var card_tile_scn = preload("res://scenes/ui/CardTile.tscn")
var deck_modal_scn = preload("res://scenes/ui/DeckInspectorModal.tscn")
var codex_modal_scn = preload("res://scenes/ui/CodexModal.tscn")

var hand_cards: Array = []
var selected_cards: Array = []

func _ready():
	play_btn.connect("pressed", Callable(self, "_on_play_word"))
	clear_btn.connect("pressed", Callable(self, "_on_clear_word"))
	shuffle_btn.connect("pressed", Callable(self, "_on_shuffle_rack"))
	refresh_btn.connect("pressed", Callable(self, "_on_refresh_click"))
	deck_btn.connect("pressed", Callable(self, "_on_deck_click"))
	codex_btn.connect("pressed", Callable(self, "_on_codex_click"))
	
	_apply_premium_styles()
	_update_stats_display()
	_draw_hand()

func _apply_premium_styles():
	var kademe_style = StyleBoxFlat.new()
	kademe_style.bg_color = Color(0.22, 0.15, 0.05, 0.9)
	kademe_style.border_width_left = 1
	kademe_style.border_width_top = 1
	kademe_style.border_width_right = 1
	kademe_style.border_width_bottom = 1
	kademe_style.border_color = Color(0.95, 0.75, 0.25)
	kademe_style.corner_radius_top_left = 8
	kademe_style.corner_radius_top_right = 8
	kademe_style.corner_radius_bottom_left = 8
	kademe_style.corner_radius_bottom_right = 8
	$VBox/TopBar/HBox/KademeBadge.add_theme_stylebox_override("panel", kademe_style)

	var gold_style = StyleBoxFlat.new()
	gold_style.bg_color = Color(0.18, 0.14, 0.04, 0.9)
	gold_style.border_width_left = 1
	gold_style.border_width_top = 1
	gold_style.border_width_right = 1
	gold_style.border_width_bottom = 1
	gold_style.border_color = Color(0.95, 0.85, 0.3)
	gold_style.corner_radius_top_left = 8
	gold_style.corner_radius_top_right = 8
	gold_style.corner_radius_bottom_left = 8
	gold_style.corner_radius_bottom_right = 8
	$VBox/TopBar/HBox/GoldBadge.add_theme_stylebox_override("panel", gold_style)

	var frame_style = StyleBoxFlat.new()
	frame_style.bg_color = Color(0.06, 0.08, 0.14, 0.95)
	frame_style.border_width_left = 2
	frame_style.border_width_top = 2
	frame_style.border_width_right = 2
	frame_style.border_width_bottom = 2
	frame_style.border_color = Color(0.85, 0.55, 0.15, 0.8)
	frame_style.corner_radius_top_left = 14
	frame_style.corner_radius_top_right = 14
	frame_style.corner_radius_bottom_left = 14
	frame_style.corner_radius_bottom_right = 14
	frame_style.shadow_color = Color(0.85, 0.55, 0.15, 0.25)
	frame_style.shadow_size = 12
	$VBox/WordBoardPanel/VBox/SlotsFrame.add_theme_stylebox_override("panel", frame_style)

	var play_style = StyleBoxFlat.new()
	play_style.bg_color = Color(0.02, 0.55, 0.85)
	play_style.corner_radius_top_left = 10
	play_style.corner_radius_top_right = 10
	play_style.corner_radius_bottom_left = 10
	play_style.corner_radius_bottom_right = 10
	play_style.shadow_color = Color(0.02, 0.55, 0.85, 0.5)
	play_style.shadow_size = 10
	play_btn.add_theme_stylebox_override("normal", play_style)

func _update_stats_display():
	kademe_label.text = "KADEME " + str(GameManager.act)
	gold_label.text = "💰 " + str(GameManager.gold) + " G"
	deck_btn.text = "🎴 " + str(GameManager.deck.size())
	
	hands_label.text = "🖐️ Hamle Hakkı: " + str(GameManager.hands_left)
	discards_label.text = "🔄 Iskarta: " + str(GameManager.discards_left)
	refresh_btn.text = "🔄 YENİLE (" + str(GameManager.discards_left) + ")"
	
	var cur = GameManager.current_score
	var target = GameManager.score_target
	score_progress.max_value = target
	score_progress.value = cur
	
	var pct = 0
	if target > 0:
		pct = int((float(cur) / float(target)) * 100.0)
	score_text_label.text = str(cur) + " / " + str(target) + " (" + str(pct) + "%)"

func _draw_hand():
	hand_cards = GameManager.deck.duplicate()
	hand_cards.shuffle()
	hand_cards = hand_cards.slice(0, 8)
	selected_cards.clear()
	_render_board()

func _render_board():
	for c in rack_container.get_children():
		c.queue_free()
	for card in hand_cards:
		if not selected_cards.has(card):
			var tile = card_tile_scn.instantiate()
			rack_container.add_child(tile)
			tile.setup(card)
			tile.connect("card_clicked", Callable(self, "_select_card"))
			
	rack_info_label.text = "🎴 Eldeki Harfler (" + str(hand_cards.size() - selected_cards.size()) + "/" + str(hand_cards.size()) + ")"
	
	for c in slots_container.get_children():
		c.queue_free()
		
	for card in selected_cards:
		var tile = card_tile_scn.instantiate()
		slots_container.add_child(tile)
		tile.setup(card)
		tile.connect("card_clicked", Callable(self, "_deselect_card"))
		
	var remaining_slots = 7 - selected_cards.size()
	for i in range(remaining_slots):
		var slot_idx = selected_cards.size() + i + 1
		
		var slot_panel = PanelContainer.new()
		slot_panel.custom_minimum_size = Vector2(72, 104)
		
		var slot_style = StyleBoxFlat.new()
		slot_style.bg_color = Color(0.04, 0.06, 0.1, 0.6)
		slot_style.border_width_left = 1
		slot_style.border_width_top = 1
		slot_style.border_width_right = 1
		slot_style.border_width_bottom = 1
		slot_style.border_color = Color(0.3, 0.35, 0.45, 0.5)
		slot_style.corner_radius_top_left = 8
		slot_style.corner_radius_top_right = 8
		slot_style.corner_radius_bottom_left = 8
		slot_style.corner_radius_bottom_right = 8
		slot_panel.add_theme_stylebox_override("panel", slot_style)
		
		var vbox = VBoxContainer.new()
		vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		slot_panel.add_child(vbox)
		
		var lbl_num = Label.new()
		lbl_num.text = "#" + str(slot_idx)
		lbl_num.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl_num.add_theme_color_override("font_color", Color(0.5, 0.55, 0.65, 0.7))
		lbl_num.add_theme_font_size_override("font_size", 14)
		vbox.add_child(lbl_num)
		
		if slot_idx >= 5:
			var bonus_txt = ""
			if slot_idx == 5: bonus_txt = "+5p"
			elif slot_idx == 6: bonus_txt = "+10p"
			elif slot_idx == 7: bonus_txt = "+15p"
			
			var lbl_bonus = Label.new()
			lbl_bonus.text = bonus_txt
			lbl_bonus.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			lbl_bonus.add_theme_color_override("font_color", Color(0.95, 0.8, 0.3, 0.9))
			lbl_bonus.add_theme_font_size_override("font_size", 12)
			vbox.add_child(lbl_bonus)
			
		slots_container.add_child(slot_panel)
		
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

func _on_shuffle_rack():
	AudioManager.play_sfx("card_select")
	hand_cards.shuffle()
	_render_board()

func _calculate_live_score():
	if selected_cards.size() == 0:
		word_preview_label.text = "Henüz kelime yazılmadı"
		word_preview_label.add_theme_color_override("font_color", Color(0.6, 0.65, 0.75))
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
		
		# UI VFX Effects
		VFXManager.spawn_floating_text("+" + str(points) + " PUAN!", Vector2(640, 360), Color(0.3, 0.95, 0.6), self)
		VFXManager.trigger_screen_shake(self, 8.0)
		VFXManager.spawn_spark_burst(Vector2(640, 360), self, Color(0.95, 0.85, 0.3))
		
		# Record to played words history
		GameManager.played_words_history.append({
			"word": eval_res["word"],
			"points": points
		})
		
		_update_stats_display()
		
		if GameManager.current_score >= GameManager.score_target:
			AudioManager.play_sfx("victory")
			GameManager.modify_gold(30)
			GameManager.advance_stage()
			GameManager.change_state(GameManager.State.DRAFT)
		elif GameManager.hands_left <= 0:
			AudioManager.play_sfx("error")
			GameManager.change_state(GameManager.State.GAME_OVER)
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

func _on_deck_click():
	AudioManager.play_sfx("button_click")
	var modal = deck_modal_scn.instantiate()
	add_child(modal)

func _on_codex_click():
	AudioManager.play_sfx("button_click")
	var modal = codex_modal_scn.instantiate()
	add_child(modal)
'''

with open(play_gd_path, "w", encoding="utf-8") as f:
    f.write(code)

print("WordPlayArea.gd indentation fixed successfully!")
