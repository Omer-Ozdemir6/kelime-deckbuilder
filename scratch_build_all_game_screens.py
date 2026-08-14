import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. GameOverModal.gd & GameOverModal.tscn (Run Summary)
# -------------------------------------------------------------
game_over_gd = '''extends Control

@onready var title_label = $Panel/VBox/Title
@onready var kademe_val = $Panel/VBox/StatsBox/VBox/KademeRow/Value
@onready var score_val = $Panel/VBox/StatsBox/VBox/ScoreRow/Value
@onready var gold_val = $Panel/VBox/StatsBox/VBox/GoldRow/Value
@onready var words_val = $Panel/VBox/StatsBox/VBox/WordsRow/Value

@onready var restart_btn = $Panel/VBox/ActionRow/RestartButton
@onready var menu_btn = $Panel/VBox/ActionRow/MenuButton

func _ready():
	restart_btn.connect("pressed", Callable(self, "_on_restart"))
	menu_btn.connect("pressed", Callable(self, "_on_menu"))
	_update_run_summary()

func _update_run_summary():
	if GameManager.current_state == GameManager.State.VICTORY:
		title_label.text = "🏆 ZAFER! (RUN GENEL HESABI)"
		title_label.add_theme_color_override("font_color", Color(0.3, 0.95, 0.6))
	else:
		title_label.text = "💀 SINAV ELENDİ (RUN GENEL HESABI)"
		title_label.add_theme_color_override("font_color", Color(0.95, 0.35, 0.35))
		
	kademe_val.text = "KADEME " + str(GameManager.act)
	score_val.text = str(GameManager.current_score) + " Puan"
	gold_val.text = "+" + str(GameManager.gold) + " G"
	words_val.text = str(GameManager.played_words_history.size()) + " Kelime"

func _on_restart():
	AudioManager.play_sfx("button_click")
	GameManager.start_new_run(GameManager.selected_character, GameManager.selected_stake)

func _on_menu():
	AudioManager.play_sfx("button_click")
	GameManager.change_state(GameManager.State.MAIN_MENU)
'''

with open(os.path.join(ui_dir, "GameOverModal.gd"), "w", encoding="utf-8") as f:
    f.write(game_over_gd)

game_over_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/GameOverModal.gd" id="1_over"]

[node name="GameOverModal" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_over")

[node name="Overlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.04, 0.05, 0.09, 0.92)

[node name="Panel" type="Panel" parent="."]
custom_minimum_size = Vector2(520, 480)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -260.0
offset_top = -240.0
offset_right = 260.0
offset_bottom = 240.0
grow_horizontal = 2
grow_vertical = 2

[node name="VBox" type="VBoxContainer" parent="Panel"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 24.0
offset_top = 20.0
offset_right = -24.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16
alignment = 1

[node name="Icon" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_font_sizes/font_size = 48
text = "💀"
horizontal_alignment = 1

[node name="Title" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.35, 0.35, 1)
theme_override_font_sizes/font_size = 20
text = "SINAV ELENDİ (RUN GENEL HESABI)"
horizontal_alignment = 1

[node name="SubTitle" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.7, 0.75, 0.85, 0.8)
theme_override_font_sizes/font_size = 12
text = "Hamle hakkınız bitti! Kazanılan altınlar ve başarımlar hesaplandı."
horizontal_alignment = 1

[node name="StatsBox" type="PanelContainer" parent="Panel/VBox"]
layout_mode = 2

[node name="VBox" type="VBoxContainer" parent="Panel/VBox/StatsBox"]
layout_mode = 2
offset_left = 16.0
offset_top = 12.0
offset_right = -16.0
offset_bottom = -12.0
theme_override_constants/separation = 12

[node name="KademeRow" type="HBoxContainer" parent="Panel/VBox/StatsBox/VBox"]
layout_mode = 2

[node name="Label" type="Label" parent="Panel/VBox/StatsBox/VBox/KademeRow"]
layout_mode = 2
size_flags_horizontal = 3
text = "🏛️ Ulaşılan Kademe:"

[node name="Value" type="Label" parent="Panel/VBox/StatsBox/VBox/KademeRow"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
text = "KADEME 1"

[node name="ScoreRow" type="HBoxContainer" parent="Panel/VBox/StatsBox/VBox"]
layout_mode = 2

[node name="Label" type="Label" parent="Panel/VBox/StatsBox/VBox/ScoreRow"]
layout_mode = 2
size_flags_horizontal = 3
text = "🏆 Toplam Run Skoru:"

[node name="Value" type="Label" parent="Panel/VBox/StatsBox/VBox/ScoreRow"]
layout_mode = 2
theme_override_colors/font_color = Color(0.3, 0.95, 0.6, 1)
text = "0 Puan"

[node name="GoldRow" type="HBoxContainer" parent="Panel/VBox/StatsBox/VBox"]
layout_mode = 2

[node name="Label" type="Label" parent="Panel/VBox/StatsBox/VBox/GoldRow"]
layout_mode = 2
size_flags_horizontal = 3
text = "💰 Kazanılan Toplam Altın:"

[node name="Value" type="Label" parent="Panel/VBox/StatsBox/VBox/GoldRow"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
text = "+15 G"

[node name="WordsRow" type="HBoxContainer" parent="Panel/VBox/StatsBox/VBox"]
layout_mode = 2

[node name="Label" type="Label" parent="Panel/VBox/StatsBox/VBox/WordsRow"]
layout_mode = 2
size_flags_horizontal = 3
text = "📖 Yazılan Toplam Kelime:"

[node name="Value" type="Label" parent="Panel/VBox/StatsBox/VBox/WordsRow"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
text = "0 Kelime"

[node name="ActionRow" type="VBoxContainer" parent="Panel/VBox"]
layout_mode = 2
theme_override_constants/separation = 10

[node name="RestartButton" type="Button" parent="Panel/VBox/ActionRow"]
custom_minimum_size = Vector2(0, 48)
layout_mode = 2
theme_override_colors/font_color = Color(1, 1, 1, 1)
theme_override_font_sizes/font_size = 16
text = "🔄 YENİ KOŞU BAŞLAT"

[node name="MenuButton" type="Button" parent="Panel/VBox/ActionRow"]
custom_minimum_size = Vector2(0, 44)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
text = "🏠 ANA MENÜYE DÖN"
'''

with open(os.path.join(ui_dir, "GameOverModal.tscn"), "w", encoding="utf-8") as f:
    f.write(game_over_tscn)

# -------------------------------------------------------------
# 2. ShopScreen.gd & ShopScreen.tscn (Full Merchant Shop)
# -------------------------------------------------------------
shop_gd = '''extends Control

@onready var gold_label = $VBox/TopBar/GoldLabel
@onready var leave_btn = $VBox/TopBar/LeaveButton

@onready var pack_btn1 = $VBox/MainHBox/RightCol/Pack1
@onready var pack_btn2 = $VBox/MainHBox/RightCol/Pack2
@onready var remove_card_btn = $VBox/MainHBox/RightCol/RemoveCardButton

func _ready():
	leave_btn.connect("pressed", Callable(self, "_on_leave"))
	pack_btn1.connect("pressed", Callable(self, "_buy_pack").bind(25))
	pack_btn2.connect("pressed", Callable(self, "_buy_pack").bind(40))
	remove_card_btn.connect("pressed", Callable(self, "_buy_remove"))
	_update_display()

func _update_display():
	gold_label.text = "💰 " + str(GameManager.gold) + " G"

func _buy_pack(cost: int):
	if GameManager.gold >= cost:
		AudioManager.play_sfx("card_select")
		GameManager.modify_gold(-cost)
		_update_display()
		GameManager.change_state(GameManager.State.DRAFT)

func _buy_remove():
	if GameManager.gold >= 30 and GameManager.deck.size() > 5:
		AudioManager.play_sfx("card_deselect")
		GameManager.modify_gold(-30)
		GameManager.deck.pop_back()
		_update_display()

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

[node name="BG" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.08, 0.05, 0.12, 1)

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
theme_override_constants/separation = 16

[node name="TopBar" type="HBoxContainer" parent="VBox"]
layout_mode = 2

[node name="Title" type="Label" parent="VBox/TopBar"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 24
text = "🛒 SİMYACI DÜKKANI"

[node name="Spacer" type="Control" parent="VBox/TopBar"]
layout_mode = 2
size_flags_horizontal = 3

[node name="GoldLabel" type="Label" parent="VBox/TopBar"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 20
text = "💰 105 G"

[node name="LeaveButton" type="Button" parent="VBox/TopBar"]
custom_minimum_size = Vector2(140, 40)
layout_mode = 2
text = "🚪 Dükkandan Çık"

[node name="MainHBox" type="HBoxContainer" parent="VBox"]
layout_mode = 2
size_flags_vertical = 3
theme_override_constants/separation = 20

[node name="LeftCol" type="VBoxContainer" parent="VBox/MainHBox"]
layout_mode = 2
size_flags_horizontal = 3
theme_override_constants/separation = 12

[node name="Label" type="Label" parent="VBox/MainHBox/LeftCol"]
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
text = "🃏 Pasif Jokerler & Efsunlu Kartlar"

[node name="JokerGrid" type="HBoxContainer" parent="VBox/MainHBox/LeftCol"]
custom_minimum_size = Vector2(0, 160)
layout_mode = 2
theme_override_constants/separation = 14

[node name="Item1" type="Button" parent="VBox/MainHBox/LeftCol/JokerGrid"]
custom_minimum_size = Vector2(140, 150)
layout_mode = 2
text = "🃏 Bilge Jokeri\n+100 Taban Puan\nFiyat: $40"

[node name="Item2" type="Button" parent="VBox/MainHBox/LeftCol/JokerGrid"]
custom_minimum_size = Vector2(140, 150)
layout_mode = 2
text = "🔮 Polikrom Mühür\nx1.5 Katlama\nFiyat: $50"

[node name="RightCol" type="VBoxContainer" parent="VBox/MainHBox"]
custom_minimum_size = Vector2(300, 0)
layout_mode = 2
theme_override_constants/separation = 14

[node name="Label" type="Label" parent="VBox/MainHBox/RightCol"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
text = "📦 Harf Paketleri & Hizmetler"

[node name="Pack1" type="Button" parent="VBox/MainHBox/RightCol"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
text = "📦 Standart Harf Paketi ($25)"

[node name="Pack2" type="Button" parent="VBox/MainHBox/RightCol"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
text = "📦 Nadir Harf Paketi ($40)"

[node name="RemoveCardButton" type="Button" parent="VBox/MainHBox/RightCol"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.4, 0.4, 1)
text = "🗑️ Desteden Kart Sil ($30)"
'''

with open(os.path.join(ui_dir, "ShopScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(shop_tscn)

# -------------------------------------------------------------
# 3. Update Main.gd to connect GAME_OVER / VICTORY state to GameOverModal
# -------------------------------------------------------------
main_gd_path = os.path.join(godot_dir, "scenes", "Main.gd")
with open(main_gd_path, "r", encoding="utf-8") as f:
    main_code = f.read()

main_code = main_code.replace(
    'GameManager.State.VICTORY, GameManager.State.GAME_OVER:\n\t\t\tscene_path = "res://scenes/ui/MainMenu.tscn"',
    'GameManager.State.VICTORY, GameManager.State.GAME_OVER:\n\t\t\tscene_path = "res://scenes/ui/GameOverModal.tscn"'
)

with open(main_gd_path, "w", encoding="utf-8") as f:
    f.write(main_code)

print("GameOverModal, ShopScreen, and Main.gd state handler updated successfully!")
