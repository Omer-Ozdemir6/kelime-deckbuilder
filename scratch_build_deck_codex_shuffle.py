import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")
autoload_dir = os.path.join(godot_dir, "autoload")

# -------------------------------------------------------------
# 1. Update GameManager.gd (Add played_words_history)
# -------------------------------------------------------------
gm_path = os.path.join(autoload_dir, "GameManager.gd")
with open(gm_path, "r", encoding="utf-8") as f:
    gm_code = f.read()

if "var played_words_history: Array = []" not in gm_code:
    gm_code = gm_code.replace("var passive_jokers: Array = []", "var passive_jokers: Array = []\nvar played_words_history: Array = []")
    gm_code = gm_code.replace("passive_jokers.clear()", "passive_jokers.clear()\n\tplayed_words_history.clear()")

with open(gm_path, "w", encoding="utf-8") as f:
    f.write(gm_code)

# -------------------------------------------------------------
# 2. Fix CardTile.tscn (mouse_filter = MOUSE_FILTER_IGNORE on panel/vbox)
# -------------------------------------------------------------
card_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/CardTile.gd" id="1_card"]

[node name="CardTile" type="Control"]
custom_minimum_size = Vector2(72, 104)
layout_mode = 3
anchors_preset = 0
pivot_offset = Vector2(36, 52)
mouse_default_cursor_shape = 2
script = ExtResource("1_card")

[node name="CardPanel" type="Panel" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
mouse_filter = 2

[node name="VBox" type="VBoxContainer" parent="CardPanel"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 4.0
offset_top = 8.0
offset_right = -4.0
offset_bottom = -6.0
grow_horizontal = 2
grow_vertical = 2
mouse_filter = 2
alignment = 1

[node name="LetterLabel" type="Label" parent="CardPanel/VBox"]
layout_mode = 2
size_flags_vertical = 3
mouse_filter = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_colors/font_shadow_color = Color(0, 0, 0, 0.9)
theme_override_constants/shadow_offset_x = 2
theme_override_constants/shadow_offset_y = 2
theme_override_font_sizes/font_size = 36
text = "A"
horizontal_alignment = 1
vertical_alignment = 1

[node name="PointsTag" type="PanelContainer" parent="CardPanel/VBox"]
custom_minimum_size = Vector2(0, 20)
layout_mode = 2
size_flags_horizontal = 4
mouse_filter = 2

[node name="PointsLabel" type="Label" parent="CardPanel/VBox/PointsTag"]
layout_mode = 2
mouse_filter = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 11
text = "1 PT"
horizontal_alignment = 1
vertical_alignment = 1

[node name="SealBadge" type="Control" parent="CardPanel"]
layout_mode = 1
anchors_preset = 1
anchor_left = 1.0
anchor_right = 1.0
offset_left = -24.0
offset_top = -6.0
offset_right = 6.0
offset_bottom = 24.0
grow_horizontal = 0
mouse_filter = 2

[node name="SealLabel" type="Label" parent="CardPanel/SealBadge"]
visible = false
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
mouse_filter = 2
theme_override_font_sizes/font_size = 14
text = "🔮"
horizontal_alignment = 1
vertical_alignment = 1

[connection signal="gui_input" from="." to="." method="_on_gui_input"]
[connection signal="mouse_entered" from="." to="." method="_on_mouse_entered"]
[connection signal="mouse_exited" from="." to="." method="_on_mouse_exited"]
'''

with open(os.path.join(ui_dir, "CardTile.tscn"), "w", encoding="utf-8") as f:
    f.write(card_tscn)

# -------------------------------------------------------------
# 3. DeckInspectorModal.gd & DeckInspectorModal.tscn
# -------------------------------------------------------------
deck_modal_gd = '''extends Control

@onready var grid_container = $Panel/VBox/ScrollContainer/GridContainer
@onready var close_btn = $Panel/CloseButton
@onready var title_label = $Panel/VBox/Title

var card_tile_scn = preload("res://scenes/ui/CardTile.tscn")

func _ready():
	close_btn.connect("pressed", Callable(self, "_on_close"))
	_render_deck()

func _render_deck():
	title_label.text = "🎴 DESTEDEKİ HARFLER (" + str(GameManager.deck.size()) + " Kart)"
	for c in grid_container.get_children():
		c.queue_free()
		
	for card in GameManager.deck:
		var tile = card_tile_scn.instantiate()
		grid_container.add_child(tile)
		tile.setup(card)

func _on_close():
	queue_free()
'''

with open(os.path.join(ui_dir, "DeckInspectorModal.gd"), "w", encoding="utf-8") as f:
    f.write(deck_modal_gd)

deck_modal_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/DeckInspectorModal.gd" id="1_deck"]

[node name="DeckInspectorModal" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_deck")

[node name="Overlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0, 0, 0, 0.85)

[node name="Panel" type="Panel" parent="."]
custom_minimum_size = Vector2(650, 480)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -325.0
offset_top = -240.0
offset_right = 325.0
offset_bottom = 240.0
grow_horizontal = 2
grow_vertical = 2

[node name="CloseButton" type="Button" parent="Panel"]
custom_minimum_size = Vector2(36, 36)
layout_mode = 1
anchors_preset = 1
anchor_left = 1.0
anchor_right = 1.0
offset_left = -44.0
offset_top = 10.0
offset_right = -8.0
offset_bottom = 46.0
grow_horizontal = 0
text = "❌"

[node name="VBox" type="VBoxContainer" parent="Panel"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 20.0
offset_top = 20.0
offset_right = -20.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 14

[node name="Title" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 20
text = "🎴 DESTEDEKİ HARFLER"
horizontal_alignment = 1

[node name="ScrollContainer" type="ScrollContainer" parent="Panel/VBox"]
layout_mode = 2
size_flags_vertical = 3

[node name="GridContainer" type="GridContainer" parent="Panel/VBox/ScrollContainer"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_constants/h_separation = 12
theme_override_constants/v_separation = 12
columns = 7
'''

with open(os.path.join(ui_dir, "DeckInspectorModal.tscn"), "w", encoding="utf-8") as f:
    f.write(deck_modal_tscn)

# -------------------------------------------------------------
# 4. CodexModal.gd & CodexModal.tscn (Dictionary/Played Words History)
# -------------------------------------------------------------
codex_modal_gd = '''extends Control

@onready var item_list = $Panel/VBox/ScrollContainer/VBox
@onready var close_btn = $Panel/CloseButton

func _ready():
	close_btn.connect("pressed", Callable(self, "_on_close"))
	_render_words()

func _render_words():
	for c in item_list.get_children():
		c.queue_free()
		
	if GameManager.played_words_history.size() == 0:
		var lbl = Label.new()
		lbl.text = "Henüz oynanmış kelime bulunmuyor."
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.75))
		item_list.add_child(lbl)
		return
		
	for item in GameManager.played_words_history:
		var pnl = PanelContainer.new()
		pnl.custom_minimum_size = Vector2(0, 44)
		
		var hbox = HBoxContainer.new()
		pnl.add_child(hbox)
		
		var w_lbl = Label.new()
		w_lbl.text = "  📖 " + item.get("word", "")
		w_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		w_lbl.add_theme_font_size_override("font_size", 16)
		w_lbl.add_theme_color_override("font_color", Color(0.4, 0.85, 1))
		hbox.add_child(w_lbl)
		
		var pts_lbl = Label.new()
		pts_lbl.text = "+" + str(item.get("points", 0)) + " Puan  "
		pts_lbl.add_theme_font_size_override("font_size", 16)
		pts_lbl.add_theme_color_override("font_color", Color(0.95, 0.85, 0.3))
		hbox.add_child(pts_lbl)
		
		item_list.add_child(pnl)

func _on_close():
	queue_free()
'''

with open(os.path.join(ui_dir, "CodexModal.gd"), "w", encoding="utf-8") as f:
    f.write(codex_modal_gd)

codex_modal_tscn = '''[gd_scene load_steps=2 format=3]

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
color = Color(0, 0, 0, 0.85)

[node name="Panel" type="Panel" parent="."]
custom_minimum_size = Vector2(550, 460)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -275.0
offset_top = -230.0
offset_right = 275.0
offset_bottom = 230.0
grow_horizontal = 2
grow_vertical = 2

[node name="CloseButton" type="Button" parent="Panel"]
custom_minimum_size = Vector2(36, 36)
layout_mode = 1
anchors_preset = 1
anchor_left = 1.0
anchor_right = 1.0
offset_left = -44.0
offset_top = 10.0
offset_right = -8.0
offset_bottom = 46.0
grow_horizontal = 0
text = "❌"

[node name="VBox" type="VBoxContainer" parent="Panel"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 20.0
offset_top = 20.0
offset_right = -20.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 14

[node name="Title" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 20
text = "📖 OYNANAN KELİMELER SÖZLÜĞÜ"
horizontal_alignment = 1

[node name="ScrollContainer" type="ScrollContainer" parent="Panel/VBox"]
layout_mode = 2
size_flags_vertical = 3

[node name="VBox" type="VBoxContainer" parent="Panel/VBox/ScrollContainer"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_constants/separation = 8
'''

with open(os.path.join(ui_dir, "CodexModal.tscn"), "w", encoding="utf-8") as f:
    f.write(codex_modal_tscn)

# -------------------------------------------------------------
# 5. Upgraded WordPlayArea.gd with Shuffle, Deck & Codex modals
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

with open(os.path.join(ui_dir, "WordPlayArea.gd"), "w", encoding="utf-8") as f:
    f.write(play_gd)

# Update WordPlayArea.tscn ActionRow (ShuffleButton instead of PassButton)
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
color = Color(0.06, 0.08, 0.14, 1)

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 24.0
offset_top = 16.0
offset_right = -24.0
offset_bottom = -16.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 14

[node name="TopBar" type="PanelContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 52)
layout_mode = 2

[node name="HBox" type="HBoxContainer" parent="VBox/TopBar"]
layout_mode = 2
offset_left = 16.0
offset_right = -16.0
theme_override_constants/separation = 16
alignment = 0

[node name="KademeBadge" type="PanelContainer" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(130, 36)
layout_mode = 2
size_flags_vertical = 4

[node name="Label" type="Label" parent="VBox/TopBar/HBox/KademeBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 14
text = "KADEME 1"
horizontal_alignment = 1

[node name="GoldBadge" type="PanelContainer" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(110, 36)
layout_mode = 2
size_flags_vertical = 4

[node name="Label" type="Label" parent="VBox/TopBar/HBox/GoldBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "💰 105 G"
horizontal_alignment = 1

[node name="Spacer" type="Control" parent="VBox/TopBar/HBox"]
layout_mode = 2
size_flags_horizontal = 3

[node name="DeckButton" type="Button" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(96, 36)
layout_mode = 2
size_flags_vertical = 4
text = "🎴 20"

[node name="CodexButton" type="Button" parent="VBox/TopBar/HBox"]
custom_minimum_size = Vector2(100, 36)
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
theme_override_constants/separation = 10
alignment = 1

[node name="JokerInfo" type="Label" parent="VBox/TargetScorePanel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.7, 0.75, 0.85, 0.85)
theme_override_font_sizes/font_size = 13
text = "🃏 Pasif Joker Slotu Boş (Dükkandan yeni jokerler alabilirsiniz)"

[node name="ScoreHBox" type="HBoxContainer" parent="VBox/TargetScorePanel/VBox"]
custom_minimum_size = Vector2(0, 32)
layout_mode = 2
theme_override_constants/separation = 16

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
custom_minimum_size = Vector2(150, 0)
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 15
text = "0 / 1200 (0%)"
horizontal_alignment = 2

[node name="SubHBox" type="HBoxContainer" parent="VBox/TargetScorePanel/VBox"]
layout_mode = 2
theme_override_constants/separation = 16

[node name="HandsBadge" type="PanelContainer" parent="VBox/TargetScorePanel/VBox/SubHBox"]
custom_minimum_size = Vector2(160, 32)
layout_mode = 2

[node name="Label" type="Label" parent="VBox/TargetScorePanel/VBox/SubHBox/HandsBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.8, 0.3, 1)
theme_override_font_sizes/font_size = 13
text = "🖐️ Hamle Hakkı: 4"
horizontal_alignment = 1

[node name="DiscardsBadge" type="PanelContainer" parent="VBox/TargetScorePanel/VBox/SubHBox"]
custom_minimum_size = Vector2(140, 32)
layout_mode = 2

[node name="Label" type="Label" parent="VBox/TargetScorePanel/VBox/SubHBox/DiscardsBadge"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.4, 0.4, 1)
theme_override_font_sizes/font_size = 13
text = "🔄 Iskarta: 3"
horizontal_alignment = 1

[node name="Spacer" type="Control" parent="VBox/TargetScorePanel/VBox/SubHBox"]
layout_mode = 2
size_flags_horizontal = 3

[node name="RefreshButton" type="Button" parent="VBox/TargetScorePanel/VBox/SubHBox"]
custom_minimum_size = Vector2(130, 32)
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
offset_top = 14.0
offset_right = -16.0
offset_bottom = -14.0
theme_override_constants/separation = 16
alignment = 1

[node name="WordPreviewLabel" type="Label" parent="VBox/WordBoardPanel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 16
text = "Henüz kelime yazılmadı"
horizontal_alignment = 1

[node name="SlotsFrame" type="PanelContainer" parent="VBox/WordBoardPanel/VBox"]
custom_minimum_size = Vector2(0, 140)
layout_mode = 2

[node name="SlotsHBox" type="HBoxContainer" parent="VBox/WordBoardPanel/VBox/SlotsFrame"]
layout_mode = 2
theme_override_constants/separation = 14
alignment = 1

[node name="ActionRow" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 56)
layout_mode = 2
theme_override_constants/separation = 20
alignment = 1

[node name="ClearButton" type="Button" parent="VBox/ActionRow"]
custom_minimum_size = Vector2(150, 48)
layout_mode = 2
text = "🧹 Temizle"

[node name="ShuffleButton" type="Button" parent="VBox/ActionRow"]
custom_minimum_size = Vector2(170, 48)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.75, 0.3, 1)
text = "🔀 Karıştır"

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

print("Card selection fix, Shuffle button, Deck inspector, and Codex modal integrated!")
