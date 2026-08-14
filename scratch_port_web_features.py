import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. WheelOfFortuneModal.gd & WheelOfFortuneModal.tscn
# -------------------------------------------------------------
wheel_gd = '''extends Control

signal prize_claimed(prize_data)

@onready var spin_btn = $Panel/VBox/SpinButton
@onready var close_btn = $Panel/CloseButton
@onready var result_label = $Panel/VBox/ResultLabel
@onready var wheel_disc = $Panel/VBox/WheelContainer/Disc

var is_spinning: bool = false
var prizes = [
	{"id": "FOIL_ALL", "label": "🪙 TÜM HARFLERE FOIL MÜHÜR", "icon": "🪙"},
	{"id": "GOLD_50", "label": "💰 +50 ALTIN", "icon": "💰"},
	{"id": "JOKER_CARD", "label": "🃏 EFSANEVİ JOKER KART", "icon": "🃏"},
	{"id": "LEVEL_UP_ALL", "label": "📜 SEVİYE YÜKSELTME", "icon": "📜"},
	{"id": "POTION_PACK", "label": "🧪 SİMYA İKSİRİ PAKETİ", "icon": "🧪"},
	{"id": "HEAL_FULL", "label": "❤️ +30 CAN YENİLENMESİ", "icon": "❤️"}
]

func _ready():
	spin_btn.connect("pressed", Callable(self, "_on_spin"))
	close_btn.connect("pressed", Callable(self, "_on_close"))
	result_label.text = ""

func _on_spin():
	if is_spinning:
		return
	is_spinning = true
	AudioManager.play_sfx("card_select")
	spin_btn.disabled = true
	
	var chosen_idx = randi() % prizes.size()
	var target_prize = prizes[chosen_idx]
	
	var target_deg = 1800.0 + (chosen_idx * (360.0 / prizes.size()))
	var tween = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_CUBIC)
	tween.tween_property(wheel_disc, "rotation_degrees", target_deg, 3.5)
	tween.connect("finished", Callable(self, "_on_spin_finished").bind(target_prize))

func _on_spin_finished(prize):
	is_spinning = false
	AudioManager.play_sfx("victory")
	result_label.text = "🎉 TEBRİKLER!\n" + prize["label"]
	
	if prize["id"] == "GOLD_50":
		GameManager.modify_gold(50)
	elif prize["id"] == "HEAL_FULL":
		GameManager.modify_hp(30)
		
	emit_signal("prize_claimed", prize)

func _on_close():
	visible = false
'''

with open(os.path.join(ui_dir, "WheelOfFortuneModal.gd"), "w", encoding="utf-8") as f:
    f.write(wheel_gd)

wheel_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/WheelOfFortuneModal.gd" id="1_wheel"]

[node name="WheelOfFortuneModal" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_wheel")

[node name="Overlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0, 0, 0, 0.8)

[node name="Panel" type="Panel" parent="."]
custom_minimum_size = Vector2(400, 480)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -200.0
offset_top = -240.0
offset_right = 200.0
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
offset_top = 8.0
offset_right = -8.0
offset_bottom = 44.0
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
alignment = 1

[node name="Title" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "🎲 SİMYA ÇARKIFELEĞİ"
horizontal_alignment = 1

[node name="WheelContainer" type="Control" parent="Panel/VBox"]
custom_minimum_size = Vector2(200, 200)
layout_mode = 2
size_flags_horizontal = 4

[node name="Arrow" type="Label" parent="Panel/VBox/WheelContainer"]
layout_mode = 1
anchors_preset = 5
anchor_left = 0.5
anchor_right = 0.5
offset_left = -10.0
offset_top = -15.0
offset_right = 10.0
offset_bottom = 10.0
grow_horizontal = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.3, 1)
theme_override_font_sizes/font_size = 24
text = "▼"

[node name="Disc" type="Button" parent="Panel/VBox/WheelContainer"]
custom_minimum_size = Vector2(180, 180)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -90.0
offset_top = -90.0
offset_right = 90.0
offset_bottom = 90.0
grow_horizontal = 2
grow_vertical = 2
pivot_offset = Vector2(90, 90)
text = "🌀 ÇARK 🌀"

[node name="ResultLabel" type="Label" parent="Panel/VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
theme_override_colors/font_color = Color(0.4, 0.85, 1, 1)
theme_override_font_sizes/font_size = 15
text = "Çarkıfeleği çevir!"
horizontal_alignment = 1

[node name="SpinButton" type="Button" parent="Panel/VBox"]
custom_minimum_size = Vector2(0, 50)
layout_mode = 2
theme_override_font_sizes/font_size = 18
text = "🎲 ÇARKI ÇEVİR (BEDAVA)"
'''

with open(os.path.join(ui_dir, "WheelOfFortuneModal.tscn"), "w", encoding="utf-8") as f:
    f.write(wheel_tscn)

# -------------------------------------------------------------
# 2. DraftRewardModal.gd & DraftRewardModal.tscn
# -------------------------------------------------------------
draft_gd = '''extends Control

@onready var cards_hbox = $Panel/VBox/CardsHBox
@onready var skip_btn = $Panel/VBox/SkipButton

var card_tile_scn = preload("res://scenes/ui/CardTile.tscn")

func _ready():
	skip_btn.connect("pressed", Callable(self, "_on_skip"))
	_generate_draft_choices()

func _generate_draft_choices():
	for c in cards_hbox.get_children():
		c.queue_free()
		
	var pool = ["Ş", "Ğ", "Ç", "Ö", "Ü", "J", "Z", "V", "F", "G", "B", "C", "D"]
	pool.shuffle()
	
	for i in range(3):
		var char_ch = pool[i]
		var card_data = {
			"id": str(randi()),
			"char": char_ch,
			"points": CardDatabase.get_letter_info(char_ch).get("points", 3),
			"seal": ""
		}
		var tile = card_tile_scn.instantiate()
		cards_hbox.add_child(tile)
		tile.setup(card_data)
		tile.connect("card_clicked", Callable(self, "_on_card_selected").bind(card_data))

func _on_card_selected(card_data: Dictionary):
	AudioManager.play_sfx("card_select")
	GameManager.deck.append(card_data)
	GameManager.change_state(GameManager.State.MAP)

func _on_skip():
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "DraftRewardModal.gd"), "w", encoding="utf-8") as f:
    f.write(draft_gd)

draft_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/DraftRewardModal.gd" id="1_draft"]

[node name="DraftRewardModal" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_draft")

[node name="Overlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0, 0, 0, 0.8)

[node name="Panel" type="Panel" parent="."]
custom_minimum_size = Vector2(500, 360)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -250.0
offset_top = -180.0
offset_right = 250.0
offset_bottom = 180.0
grow_horizontal = 2
grow_vertical = 2

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
theme_override_constants/separation = 20
alignment = 1

[node name="Title" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 24
text = "🎁 KART ÖDÜLÜ SEÇİMİ"
horizontal_alignment = 1

[node name="CardsHBox" type="HBoxContainer" parent="Panel/VBox"]
custom_minimum_size = Vector2(0, 140)
layout_mode = 2
theme_override_constants/separation = 24
alignment = 1

[node name="SkipButton" type="Button" parent="Panel/VBox"]
custom_minimum_size = Vector2(160, 44)
layout_mode = 2
size_flags_horizontal = 4
text = "⏩ Pas Geç"
'''

with open(os.path.join(ui_dir, "DraftRewardModal.tscn"), "w", encoding="utf-8") as f:
    f.write(draft_tscn)

print("Web features (WheelOfFortune & DraftRewardModal) ported successfully!")
