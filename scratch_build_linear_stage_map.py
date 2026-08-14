import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Linear Stage Progress System (Dallanmasız Temiz Aşama Haritası)
# -------------------------------------------------------------
map_gd = '''extends Control

@onready var small_stage_card = $VBox/StageCards/SmallStage
@onready var big_stage_card = $VBox/StageCards/BigStage
@onready var boss_stage_card = $VBox/StageCards/BossStage

@onready var shop_btn = $VBox/SubActions/ShopButton
@onready var camp_btn = $VBox/SubActions/CampButton
@onready var trivia_btn = $VBox/SubActions/TriviaButton

var current_round: int = 1 # 1: Small, 2: Big, 3: Boss

func _ready():
	current_round = GameManager.current_level
	
	_setup_stage_cards()
	_setup_sub_actions()

func _setup_stage_cards():
	_configure_card(small_stage_card, 1, "⚪ KÜÇÜK AŞAMA", "Hedef: 300 Puan", "Ödül: 💰 25 G", Color(0.2, 0.6, 0.9))
	_configure_card(big_stage_card, 2, "🔴 BÜYÜK AŞAMA", "Hedef: 600 Puan", "Ödül: 💰 45 G + Relic", Color(0.9, 0.5, 0.2))
	_configure_card(boss_stage_card, 3, "👑 PATRON: TEPEGÖZ", "Hedef: 1200 Puan", "Ödül: 🏆 Kademe Zaferi", Color(0.95, 0.25, 0.25))

func _configure_card(card_node: Control, round_num: int, title_text: String, target_text: String, reward_text: String, theme_color: Color):
	var title_lbl = card_node.get_node("VBox/Title")
	var target_lbl = card_node.get_node("VBox/Target")
	var reward_lbl = card_node.get_node("VBox/Reward")
	var action_btn = card_node.get_node("VBox/ActionButton")
	var status_lbl = card_node.get_node("VBox/Status")
	
	title_lbl.text = title_text
	target_lbl.text = target_text
	reward_lbl.text = reward_text
	
	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 14
	style.corner_radius_top_right = 14
	style.corner_radius_bottom_left = 14
	style.corner_radius_bottom_right = 14
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	
	if round_num < current_round:
		# Completed Stage
		style.bg_color = Color(0.08, 0.14, 0.12, 0.9)
		style.border_color = Color(0.2, 0.8, 0.4, 0.8)
		status_lbl.text = "✅ TAMAMLANDI"
		status_lbl.add_theme_color_override("font_color", Color(0.3, 0.9, 0.5))
		action_btn.visible = false
	elif round_num == current_round:
		# Active Stage
		style.bg_color = Color(0.12, 0.18, 0.32, 0.95)
		style.border_color = theme_color
		style.border_width_left = 3
		style.border_width_top = 3
		style.border_width_right = 3
		style.border_width_bottom = 3
		style.shadow_color = theme_color
		style.shadow_size = 12
		status_lbl.text = "📍 MEVCUT HEDEF"
		status_lbl.add_theme_color_override("font_color", theme_color)
		action_btn.visible = true
		action_btn.text = "⚔️ SAVAŞA BAŞLA ➔"
		action_btn.connect("pressed", Callable(self, "_start_combat").bind(round_num))
	else:
		# Locked Stage
		style.bg_color = Color(0.06, 0.08, 0.12, 0.6)
		style.border_color = Color(0.2, 0.25, 0.35, 0.4)
		status_lbl.text = "🔒 KİLİTLİ"
		status_lbl.add_theme_color_override("font_color", Color(0.5, 0.5, 0.6))
		action_btn.visible = false
		
	var panel = card_node.get_node("Panel")
	if panel:
		panel.add_theme_stylebox_override("panel", style)

func _setup_sub_actions():
	shop_btn.connect("pressed", Callable(self, "_on_shop"))
	camp_btn.connect("pressed", Callable(self, "_on_camp"))
	trivia_btn.connect("pressed", Callable(self, "_on_trivia"))

func _start_combat(round_num: int):
	AudioManager.play_sfx("card_select")
	if round_num == 1:
		GameManager.score_target = 300
	elif round_num == 2:
		GameManager.score_target = 600
	else:
		GameManager.score_target = 1200
		
	GameManager.current_score = 0
	GameManager.change_state(GameManager.State.COMBAT)

func _on_shop():
	AudioManager.play_sfx("button_click")
	GameManager.change_state(GameManager.State.SHOP)

func _on_camp():
	AudioManager.play_sfx("button_click")
	GameManager.change_state(GameManager.State.CAMP)

func _on_trivia():
	AudioManager.play_sfx("button_click")
	GameManager.change_state(GameManager.State.TRIVIA)
'''

with open(os.path.join(ui_dir, "MapScreen.gd"), "w", encoding="utf-8") as f:
    f.write(map_gd)

# -------------------------------------------------------------
# Linear Stage MapScreen.tscn
# -------------------------------------------------------------
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
color = Color(0.05, 0.07, 0.12, 1)

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 30.0
offset_top = 20.0
offset_right = -30.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 24
alignment = 1

[node name="TitleBox" type="VBoxContainer" parent="VBox"]
layout_mode = 2

[node name="MainTitle" type="Label" parent="VBox/TitleBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 28
text = "🗺️ KADEME 1 — ANADOLU EFSANELERİ"
horizontal_alignment = 1

[node name="Subtitle" type="Label" parent="VBox/TitleBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 15
text = "✦ Aşamaları sırayla tamamla, hedeflere ulaş ve Patronu mağlup et! ✦"
horizontal_alignment = 1

[node name="StageCards" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 320)
layout_mode = 2
theme_override_constants/separation = 24
alignment = 1

[node name="SmallStage" type="Control" parent="VBox/StageCards"]
custom_minimum_size = Vector2(360, 300)
layout_mode = 2

[node name="Panel" type="Panel" parent="VBox/StageCards/SmallStage"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="VBox/StageCards/SmallStage"]
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
theme_override_constants/separation = 12
alignment = 1

[node name="Status" type="Label" parent="VBox/StageCards/SmallStage/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 14
text = "📍 MEVCUT HEDEF"
horizontal_alignment = 1

[node name="Title" type="Label" parent="VBox/StageCards/SmallStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "⚪ KÜÇÜK AŞAMA"
horizontal_alignment = 1

[node name="Target" type="Label" parent="VBox/StageCards/SmallStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 18
text = "Hedef: 300 Puan"
horizontal_alignment = 1

[node name="Reward" type="Label" parent="VBox/StageCards/SmallStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 14
text = "Ödül: 💰 25 G"
horizontal_alignment = 1

[node name="ActionButton" type="Button" parent="VBox/StageCards/SmallStage/VBox"]
custom_minimum_size = Vector2(0, 48)
layout_mode = 2
theme_override_font_sizes/font_size = 16
text = "⚔️ SAVAŞA BAŞLA ➔"

[node name="BigStage" type="Control" parent="VBox/StageCards"]
custom_minimum_size = Vector2(360, 300)
layout_mode = 2

[node name="Panel" type="Panel" parent="VBox/StageCards/BigStage"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="VBox/StageCards/BigStage"]
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
theme_override_constants/separation = 12
alignment = 1

[node name="Status" type="Label" parent="VBox/StageCards/BigStage/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 14
text = "🔒 KİLİTLİ"
horizontal_alignment = 1

[node name="Title" type="Label" parent="VBox/StageCards/BigStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "🔴 BÜYÜK AŞAMA"
horizontal_alignment = 1

[node name="Target" type="Label" parent="VBox/StageCards/BigStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 18
text = "Hedef: 600 Puan"
horizontal_alignment = 1

[node name="Reward" type="Label" parent="VBox/StageCards/BigStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 14
text = "Ödül: 💰 45 G + Relic"
horizontal_alignment = 1

[node name="ActionButton" type="Button" parent="VBox/StageCards/BigStage/VBox"]
custom_minimum_size = Vector2(0, 48)
layout_mode = 2
theme_override_font_sizes/font_size = 16
text = "⚔️ SAVAŞA BAŞLA ➔"

[node name="BossStage" type="Control" parent="VBox/StageCards"]
custom_minimum_size = Vector2(360, 300)
layout_mode = 2

[node name="Panel" type="Panel" parent="VBox/StageCards/BossStage"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="VBox/StageCards/BossStage"]
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
theme_override_constants/separation = 12
alignment = 1

[node name="Status" type="Label" parent="VBox/StageCards/BossStage/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 14
text = "🔒 KİLİTLİ"
horizontal_alignment = 1

[node name="Title" type="Label" parent="VBox/StageCards/BossStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 22
text = "👑 PATRON: TEPEGÖZ"
horizontal_alignment = 1

[node name="Target" type="Label" parent="VBox/StageCards/BossStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 18
text = "Hedef: 1200 Puan"
horizontal_alignment = 1

[node name="Reward" type="Label" parent="VBox/StageCards/BossStage/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.85, 0.9, 0.95, 1)
theme_override_font_sizes/font_size = 14
text = "Ödül: 🏆 Kademe Zaferi"
horizontal_alignment = 1

[node name="ActionButton" type="Button" parent="VBox/StageCards/BossStage/VBox"]
custom_minimum_size = Vector2(0, 48)
layout_mode = 2
theme_override_font_sizes/font_size = 16
text = "⚔️ SAVAŞA BAŞLA ➔"

[node name="SubActions" type="HBoxContainer" parent="VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
theme_override_constants/separation = 20
alignment = 1

[node name="ShopButton" type="Button" parent="VBox/SubActions"]
custom_minimum_size = Vector2(220, 48)
layout_mode = 2
text = "🏪 Tüccar Dükkanı"

[node name="CampButton" type="Button" parent="VBox/SubActions"]
custom_minimum_size = Vector2(220, 48)
layout_mode = 2
text = "🔥 Dinlenme Kampı"

[node name="TriviaButton" type="Button" parent="VBox/SubActions"]
custom_minimum_size = Vector2(220, 48)
layout_mode = 2
text = "🧩 Bilgi Yarışması"
'''

with open(os.path.join(ui_dir, "MapScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(map_tscn)

print("Linear Stage Progress System created successfully!")
