import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
wheel_gd_path = os.path.join(godot_dir, "scenes", "ui", "WheelOfFortuneModal.gd")

code = '''extends Control

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
	result_label.text = "🎉 TEBRİKLER! " + prize["label"]
	
	if prize["id"] == "GOLD_50":
		GameManager.modify_gold(50)
	elif prize["id"] == "HEAL_FULL":
		GameManager.modify_hp(30)
		
	emit_signal("prize_claimed", prize)

func _on_close():
	visible = false
'''

with open(wheel_gd_path, "w", encoding="utf-8") as f:
    f.write(code)

print("WheelOfFortuneModal.gd multiline string fixed!")
