import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
scenes_dir = os.path.join(godot_dir, "scenes")
ui_dir = os.path.join(scenes_dir, "ui")

os.makedirs(ui_dir, exist_ok=True)

# -------------------------------------------------------------
# 1. Main.gd & Main.tscn
# -------------------------------------------------------------
main_gd = '''extends Control

@onready var view_container = $ViewContainer
@onready var header_bar = $HeaderBar

var current_view_node: Node = null

func _ready():
	GameManager.connect("state_changed", Callable(self, "_on_state_changed"))
	_on_state_changed(GameManager.current_state)

func _on_state_changed(new_state):
	if current_view_node:
		current_view_node.queue_free()
		current_view_node = null
		
	var scene_path = ""
	match new_state:
		GameManager.State.MAIN_MENU:
			scene_path = "res://scenes/ui/MainMenu.tscn"
			header_bar.visible = false
		GameManager.State.CHARACTER_SELECT:
			scene_path = "res://scenes/ui/CharacterSelect.tscn"
			header_bar.visible = false
		GameManager.State.STAKES_SELECT:
			scene_path = "res://scenes/ui/StakesSelect.tscn"
			header_bar.visible = false
		GameManager.State.MAP:
			scene_path = "res://scenes/ui/MapScreen.tscn"
			header_bar.visible = true
		GameManager.State.COMBAT:
			scene_path = "res://scenes/ui/WordPlayArea.tscn"
			header_bar.visible = true
		GameManager.State.SHOP:
			scene_path = "res://scenes/ui/ShopScreen.tscn"
			header_bar.visible = true
		GameManager.State.CAMP:
			scene_path = "res://scenes/ui/CampScreen.tscn"
			header_bar.visible = true
		GameManager.State.EVENT:
			scene_path = "res://scenes/ui/EventScreen.tscn"
			header_bar.visible = true
		GameManager.State.TRIVIA:
			scene_path = "res://scenes/ui/TriviaScreen.tscn"
			header_bar.visible = true
		GameManager.State.VICTORY, GameManager.State.GAME_OVER:
			scene_path = "res://scenes/ui/MainMenu.tscn"
			header_bar.visible = false
			
	if scene_path != "" and ResourceLoader.exists(scene_path):
		var scn = load(scene_path)
		current_view_node = scn.instantiate()
		view_container.add_child(current_view_node)
'''

with open(os.path.join(scenes_dir, "Main.gd"), "w", encoding="utf-8") as f:
    f.write(main_gd)

main_tscn = '''[gd_scene load_steps=3 format=3]

[ext_resource type="Script" path="res://scenes/Main.gd" id="1_main"]
[ext_resource type="PackedScene" path="res://scenes/ui/HeaderBar.tscn" id="2_header"]

[node name="Main" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_main")

[node name="Background" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.06, 0.08, 0.12, 1.0)

[node name="ViewContainer" type="Control" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_top = 60.0
grow_horizontal = 2
grow_vertical = 2

[node name="HeaderBar" parent="." instance=ExtResource("2_header")]
layout_mode = 1
anchor_right = 1.0
offset_bottom = 60.0
grow_horizontal = 2
'''

with open(os.path.join(scenes_dir, "Main.tscn"), "w", encoding="utf-8") as f:
    f.write(main_tscn)

# -------------------------------------------------------------
# 2. HeaderBar.gd & HeaderBar.tscn
# -------------------------------------------------------------
header_gd = '''extends Control

@onready var hp_label = $HBox/HPLabel
@onready var gold_label = $HBox/GoldLabel
@onready var level_label = $HBox/LevelLabel
@onready var hands_label = $HBox/HandsLabel
@onready var discards_label = $HBox/DiscardsLabel
@onready var deck_button = $HBox/DeckButton
@onready var codex_button = $HBox/CodexButton

func _ready():
	GameManager.connect("player_stats_changed", Callable(self, "update_stats"))
	deck_button.connect("pressed", Callable(self, "_on_deck_pressed"))
	codex_button.connect("pressed", Callable(self, "_on_codex_pressed"))
	update_stats()

func update_stats():
	hp_label.text = "❤️ " + str(GameManager.player_hp) + "/" + str(GameManager.max_hp)
	gold_label.text = "💰 " + str(GameManager.gold) + " G"
	level_label.text = "🚩 Aşama " + str(GameManager.current_level)
	hands_label.text = "🖐️ Hamle: " + str(GameManager.hands_left)
	discards_label.text = "🔄 Iskarta: " + str(GameManager.discards_left)
	deck_button.text = "🎴 Deste (" + str(GameManager.deck.size()) + ")"

func _on_deck_pressed():
	print("Deck inspector opened!")

func _on_codex_pressed():
	print("Codex opened!")
'''

with open(os.path.join(ui_dir, "HeaderBar.gd"), "w", encoding="utf-8") as f:
    f.write(header_gd)

header_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/HeaderBar.gd" id="1_header"]

[node name="HeaderBar" type="Control"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 3
anchors_preset = 10
anchor_right = 1.0
grow_horizontal = 2
script = ExtResource("1_header")

[node name="Panel" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.12, 0.14, 0.2, 0.95)

[node name="HBox" type="HBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 20.0
offset_right = -20.0
grow_horizontal = 2
grow_vertical = 2
alignment = 1

[node name="HPLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
text = "❤️ 100/100"
vertical_alignment = 1

[node name="GoldLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
text = "💰 50 G"
vertical_alignment = 1

[node name="LevelLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
text = "🚩 Aşama 1"
vertical_alignment = 1

[node name="HandsLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
text = "🖐️ Hamle: 4"
vertical_alignment = 1

[node name="DiscardsLabel" type="Label" parent="HBox"]
layout_mode = 2
size_flags_horizontal = 3
text = "🔄 Iskarta: 3"
vertical_alignment = 1

[node name="DeckButton" type="Button" parent="HBox"]
layout_mode = 2
text = "🎴 Deste (20)"

[node name="CodexButton" type="Button" parent="HBox"]
layout_mode = 2
text = "📖 Sözlük"
'''

with open(os.path.join(ui_dir, "HeaderBar.tscn"), "w", encoding="utf-8") as f:
    f.write(header_tscn)

# -------------------------------------------------------------
# 3. MainMenu.gd & MainMenu.tscn
# -------------------------------------------------------------
menu_gd = '''extends Control

@onready var start_button = $VBox/StartButton
@onready var codex_button = $VBox/CodexButton
@onready var exit_button = $VBox/ExitButton

func _ready():
	start_button.connect("pressed", Callable(self, "_on_start_pressed"))
	codex_button.connect("pressed", Callable(self, "_on_codex_pressed"))
	exit_button.connect("pressed", Callable(self, "_on_exit_pressed"))

func _on_start_pressed():
	GameManager.change_state(GameManager.State.CHARACTER_SELECT)

func _on_codex_pressed():
	print("Codex from menu")

func _on_exit_pressed():
	get_tree().quit()
'''

with open(os.path.join(ui_dir, "MainMenu.gd"), "w", encoding="utf-8") as f:
    f.write(menu_gd)

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

[node name="Title" type="Label" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -250.0
offset_top = 100.0
offset_right = 250.0
offset_bottom = 180.0
grow_horizontal = 2
text = "KELİME DECKBUILDER"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Subtitle" type="Label" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -200.0
offset_top = 180.0
offset_right = 200.0
offset_bottom = 220.0
grow_horizontal = 2
text = "Türkçe Kelime & Strateji Kart Oyunu"
horizontal_alignment = 1
vertical_alignment = 1

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -120.0
offset_top = -40.0
offset_right = 120.0
offset_bottom = 160.0
grow_horizontal = 2
grow_vertical = 2

[node name="StartButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
text = "⚔️ Oyuna Başla"

[node name="CodexButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
text = "📖 Kodeks & Kataloğu Gör"

[node name="ExitButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
text = "🚪 Çıkış"
'''

with open(os.path.join(ui_dir, "MainMenu.tscn"), "w", encoding="utf-8") as f:
    f.write(menu_tscn)

# -------------------------------------------------------------
# 4. CharacterSelect.gd & CharacterSelect.tscn
# -------------------------------------------------------------
char_gd = '''extends Control

@onready var mimar_btn = $Grid/MimarButton
@onready var bilge_btn = $Grid/BilgeButton
@onready var savasci_btn = $Grid/SavasciButton
@onready var ozan_btn = $Grid/OzanButton
@onready var back_btn = $BackButton

func _ready():
	mimar_btn.connect("pressed", Callable(self, "_select_char").bind("MIMAR"))
	bilge_btn.connect("pressed", Callable(self, "_select_char").bind("BILGE"))
	savasci_btn.connect("pressed", Callable(self, "_select_char").bind("SAVASCI"))
	ozan_btn.connect("pressed", Callable(self, "_select_char").bind("OZAN"))
	back_btn.connect("pressed", Callable(self, "_on_back"))

func _select_char(char_id: String):
	GameManager.start_new_run(char_id, "WHITE_STAKE")

func _on_back():
	GameManager.change_state(GameManager.State.MAIN_MENU)
'''

with open(os.path.join(ui_dir, "CharacterSelect.gd"), "w", encoding="utf-8") as f:
    f.write(char_gd)

char_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/CharacterSelect.gd" id="1_char"]

[node name="CharacterSelect" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_char")

[node name="Title" type="Label" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -200.0
offset_top = 40.0
offset_right = 200.0
offset_bottom = 90.0
grow_horizontal = 2
text = "Karakterini Seç"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Grid" type="GridContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -400.0
offset_top = -180.0
offset_right = 400.0
offset_bottom = 180.0
grow_horizontal = 2
grow_vertical = 2
columns = 2

[node name="MimarButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(380, 160)
layout_mode = 2
text = "🏛️ MİMAR\n\nDengeli Harf Dağılımı\nBaşlangıç Altını: +10"

[node name="BilgeButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(380, 160)
layout_mode = 2
text = "📜 BİLGE\n\nNadir Harfler & Joker Odaklı\nEkstra Iskarta Hakkı"

[node name="SavasciButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(380, 160)
layout_mode = 2
text = "⚔️ SAVAŞÇI\n\nYüksek Puanlı Sert Harfler\nYüksek Taban Puan"

[node name="OzanButton" type="Button" parent="Grid"]
custom_minimum_size = Vector2(380, 160)
layout_mode = 2
text = "🪕 OZAN\n\nSesli Harfler & Kombo Odaklı\nSürekli Çarpan Artışı"

[node name="BackButton" type="Button" parent="."]
custom_minimum_size = Vector2(120, 40)
layout_mode = 1
anchors_preset = 7
anchor_left = 0.5
anchor_top = 1.0
anchor_right = 0.5
anchor_bottom = 1.0
offset_left = -60.0
offset_top = -60.0
offset_right = 60.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 0
text = "⬅️ Geri"
'''

with open(os.path.join(ui_dir, "CharacterSelect.tscn"), "w", encoding="utf-8") as f:
    f.write(char_tscn)

# -------------------------------------------------------------
# 5. MapScreen.gd & MapScreen.tscn
# -------------------------------------------------------------
map_gd = '''extends Control

@onready var nodes_container = $Scroll/Margin/Grid

func _ready():
	_generate_map_nodes()

func _generate_map_nodes():
	for child in nodes_container.get_children():
		child.queue_free()
		
	var node_types = [
		{"name": "⚔️ Kelime Savaşı", "state": GameManager.State.COMBAT},
		{"name": "🏪 Tüccar Dükkanı", "state": GameManager.State.SHOP},
		{"name": "🔥 Dinlenme Kampı", "state": GameManager.State.CAMP},
		{"name": "📖 Gizemli Olay", "state": GameManager.State.EVENT},
		{"name": "🧩 Bilgi Yarışması", "state": GameManager.State.TRIVIA}
	]
	
	for i in range(12):
		var n_info = node_types[randi() % node_types.size()]
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(240, 80)
		btn.text = "Adım #" + str(i + 1) + "\n" + n_info["name"]
		btn.connect("pressed", Callable(self, "_on_node_selected").bind(n_info["state"]))
		nodes_container.add_child(btn)

func _on_node_selected(target_state):
	GameManager.change_state(target_state)
'''

with open(os.path.join(ui_dir, "MapScreen.gd"), "w", encoding="utf-8") as f:
    f.write(map_gd)

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

[node name="Title" type="Label" parent="."]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -200.0
offset_top = 20.0
offset_right = 200.0
offset_bottom = 60.0
grow_horizontal = 2
text = "🗺️ Yol Haritası - Aşama 1"
horizontal_alignment = 1
vertical_alignment = 1

[node name="Scroll" type="ScrollContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_top = 80.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2

[node name="Margin" type="MarginContainer" parent="Scroll"]
layout_mode = 2
size_flags_horizontal = 3
size_flags_vertical = 3

[node name="Grid" type="VBoxContainer" parent="Scroll/Margin"]
layout_mode = 2
size_flags_horizontal = 4
alignment = 1
'''

with open(os.path.join(ui_dir, "MapScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(map_tscn)

# -------------------------------------------------------------
# 6. WordPlayArea.gd & WordPlayArea.tscn
# -------------------------------------------------------------
play_gd = '''extends Control

@onready var rack_container = $VBox/RackContainer
@onready var played_container = $VBox/PlayedContainer
@onready var score_label = $VBox/ScorePanel/ScoreLabel
@onready var submit_btn = $VBox/Actions/SubmitButton
@onready var redraw_btn = $VBox/Actions/RedrawButton
@onready var pass_btn = $VBox/Actions/PassButton

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
			var btn = Button.new()
			btn.custom_minimum_size = Vector2(70, 90)
			btn.text = card["char"] + "\n(" + str(card["points"]) + " pt)"
			btn.connect("pressed", Callable(self, "_select_card").bind(card))
			rack_container.add_child(btn)
			
	for card in selected_cards:
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(70, 90)
		btn.text = card["char"] + "\n(" + str(card["points"]) + " pt)"
		btn.connect("pressed", Callable(self, "_deselect_card").bind(card))
		played_container.add_child(btn)
		
	_calculate_preview_score()

func _select_card(card):
	if selected_cards.size() < 8:
		selected_cards.append(card)
		_update_rack_ui()

func _deselect_card(card):
	selected_cards.erase(card)
	_update_rack_ui()

func _calculate_preview_score():
	if selected_cards.size() == 0:
		score_label.text = "Hedef Skor: " + str(GameManager.current_score) + " / " + str(GameManager.score_target)
		return
		
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	if eval_res["valid"]:
		score_label.text = "Kelime: " + eval_res["word"] + " | Puan: " + str(eval_res["total_score"]) + " (" + str(eval_res["chips"]) + " x " + str(eval_res["mult"]) + ")"
	else:
		score_label.text = "Kelime: " + eval_res["word"] + " (Geçersiz Sözlük Kelimesi)"

func _on_submit():
	if selected_cards.size() == 0:
		return
	var eval_res = WordEngine.calculate_word_score(selected_cards, GameManager.active_relics, GameManager.streak)
	if eval_res["valid"]:
		GameManager.current_score += eval_res["total_score"]
		GameManager.hands_left -= 1
		GameManager.streak += 1
		if GameManager.current_score >= GameManager.score_target:
			GameManager.modify_gold(25)
			GameManager.change_state(GameManager.State.MAP)
		else:
			_draw_hand()
	else:
		print("Geçersiz Kelime!")

func _on_redraw():
	if GameManager.discards_left > 0:
		GameManager.discards_left -= 1
		_draw_hand()

func _on_pass():
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "WordPlayArea.gd"), "w", encoding="utf-8") as f:
    f.write(play_gd)

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

[node name="ScorePanel" type="PanelContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 80)
layout_mode = 2

[node name="ScoreLabel" type="Label" parent="VBox/ScorePanel"]
layout_mode = 2
text = "Hedef Skor: 0 / 300"
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
custom_minimum_size = Vector2(180, 50)
layout_mode = 2
text = "⚔️ Kelimeyi Gönder"

[node name="RedrawButton" type="Button" parent="VBox/Actions"]
custom_minimum_size = Vector2(160, 50)
layout_mode = 2
text = "🔄 Harfleri Yenile"

[node name="PassButton" type="Button" parent="VBox/Actions"]
custom_minimum_size = Vector2(140, 50)
layout_mode = 2
text = "🏳️ Pas Geç"
'''

with open(os.path.join(ui_dir, "WordPlayArea.tscn"), "w", encoding="utf-8") as f:
    f.write(play_tscn)

# -------------------------------------------------------------
# 7. ShopScreen.gd & ShopScreen.tscn
# -------------------------------------------------------------
shop_gd = '''extends Control

@onready var items_container = $VBox/ItemsGrid
@onready var leave_btn = $VBox/LeaveButton

func _ready():
	leave_btn.connect("pressed", Callable(self, "_on_leave"))
	_populate_shop()

func _populate_shop():
	for c in items_container.get_children():
		c.queue_free()
		
	# Relic item
	var relic = CardDatabase.get_random_relic()
	var btn1 = Button.new()
	btn1.custom_minimum_size = Vector2(250, 120)
	btn1.text = relic["icon"] + " " + relic["name"] + "\n(" + str(relic["cost"]) + " G)\n" + relic["desc"]
	btn1.connect("pressed", Callable(self, "_buy_relic").bind(relic))
	items_container.add_child(btn1)
	
	# Heal item
	var btn2 = Button.new()
	btn2.custom_minimum_size = Vector2(250, 120)
	btn2.text = "❤️ Can Yenile (+30 HP)\n(25 G)"
	btn2.connect("pressed", Callable(self, "_buy_heal"))
	items_container.add_child(btn2)

func _buy_relic(relic):
	if GameManager.gold >= relic["cost"]:
		GameManager.modify_gold(-relic["cost"])
		GameManager.add_relic(relic["id"])
		print("Relic purchased!")

func _buy_heal():
	if GameManager.gold >= 25:
		GameManager.modify_gold(-25)
		GameManager.modify_hp(30)

func _on_leave():
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "ShopScreen.gd"), "w", encoding="utf-8") as f:
    f.write(shop_gd)

shop_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/ShopScreen.gd" id="1_shop"]

[node name="ShopScreen" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_shop")

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 50.0
offset_top = 30.0
offset_right = -50.0
offset_bottom = -30.0
grow_horizontal = 2
grow_vertical = 2

[node name="Title" type="Label" parent="VBox"]
layout_mode = 2
text = "🏪 Tüccar Dükkanı"
horizontal_alignment = 1
vertical_alignment = 1

[node name="ItemsGrid" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 300)
layout_mode = 2
alignment = 1

[node name="LeaveButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(160, 50)
layout_mode = 2
size_flags_horizontal = 4
text = "🚪 Ayrıl"
'''

with open(os.path.join(ui_dir, "ShopScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(shop_tscn)

# -------------------------------------------------------------
# 8. CampScreen, EventScreen, TriviaScreen Placeholders
# -------------------------------------------------------------
camp_gd = '''extends Control
func _ready():
	$VBox/RestButton.connect("pressed", Callable(self, "_rest"))
	$VBox/LeaveButton.connect("pressed", Callable(self, "_leave"))
func _rest():
	GameManager.modify_hp(30)
	_leave()
func _leave():
	GameManager.change_state(GameManager.State.MAP)
'''
with open(os.path.join(ui_dir, "CampScreen.gd"), "w", encoding="utf-8") as f:
    f.write(camp_gd)

camp_tscn = '''[gd_scene load_steps=2 format=3]
[ext_resource type="Script" path="res://scenes/ui/CampScreen.gd" id="1_camp"]
[node name="CampScreen" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_camp")
[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -150.0
offset_top = -100.0
offset_right = 150.0
offset_bottom = 100.0
grow_horizontal = 2
grow_vertical = 2
[node name="Title" type="Label" parent="VBox"]
layout_mode = 2
text = "🔥 Dinlenme Kampı"
horizontal_alignment = 1
[node name="RestButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
text = "💤 Dinlen (+30 Can)"
[node name="LeaveButton" type="Button" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
text = "🚶 Yola Devam Et"
'''
with open(os.path.join(ui_dir, "CampScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(camp_tscn)

print("All scenes and UI scripts generated successfully!")
