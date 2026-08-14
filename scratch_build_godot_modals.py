import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. EventScreen.gd & EventScreen.tscn
# -------------------------------------------------------------
event_gd = '''extends Control

@onready var title_label = $VBox/Title
@onready var desc_label = $VBox/Desc
@onready var choices_vbox = $VBox/ChoicesVBox

var current_event: Dictionary = {}

func _ready():
	_load_random_event()

func _load_random_event():
	var events = CardDatabase.EVENTS
	current_event = events[randi() % events.size()]
	title_label.text = current_event["icon"] + " " + current_event["title"]
	desc_label.text = current_event["desc"]
	
	for c in choices_vbox.get_children():
		c.queue_free()
		
	for choice in current_event["choices"]:
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(0, 50)
		btn.text = choice["text"]
		btn.connect("pressed", Callable(self, "_on_choice_selected").bind(choice["action"]))
		choices_vbox.add_child(btn)

func _on_choice_selected(action: String):
	if action == "ADD_RARE":
		var rare_char = ["Ş", "Ğ", "Ç"][randi() % 3]
		GameManager.deck.append({"id": str(randi()), "char": rare_char, "points": 5, "seal": ""})
	elif action == "GOLD_35":
		GameManager.modify_gold(35)
	elif action == "GOLD_40":
		GameManager.modify_gold(40)
	elif action == "GOLD_60":
		GameManager.modify_gold(60)
		
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "EventScreen.gd"), "w", encoding="utf-8") as f:
    f.write(event_gd)

event_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/EventScreen.gd" id="1_event"]

[node name="EventScreen" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_event")

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -300.0
offset_top = -200.0
offset_right = 300.0
offset_bottom = 200.0
grow_horizontal = 2
grow_vertical = 2

[node name="Title" type="Label" parent="VBox"]
layout_mode = 2
text = "📖 Olay Ekrani"
horizontal_alignment = 1

[node name="Desc" type="Label" parent="VBox"]
custom_minimum_size = Vector2(0, 100)
layout_mode = 2
text = "Olay aciklamasi..."
autowrap_mode = 2
horizontal_alignment = 1

[node name="ChoicesVBox" type="VBoxContainer" parent="VBox"]
layout_mode = 2
'''

with open(os.path.join(ui_dir, "EventScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(event_tscn)

# -------------------------------------------------------------
# 2. TriviaScreen.gd & TriviaScreen.tscn
# -------------------------------------------------------------
trivia_gd = '''extends Control

@onready var q_label = $VBox/QuestionLabel
@onready var hint_label = $VBox/HintLabel
@onready var choice_vbox = $VBox/ChoiceVBox

var current_q: Dictionary = {}

func _ready():
	_load_question()

func _load_question():
	var questions = CardDatabase.TRIVIA_QUESTIONS
	current_q = questions[randi() % questions.size()]
	q_label.text = "❓ " + current_q["question"]
	hint_label.text = "💡 İpucu: " + current_q["hint"]
	
	for c in choice_vbox.get_children():
		c.queue_free()
		
	var ans = current_q["answer"]
	var choices = [ans, "İSTANBUL", "TÜRKİYE", "ORHUN"]
	choices.shuffle()
	
	for opt in choices:
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(0, 50)
		btn.text = opt
		btn.connect("pressed", Callable(self, "_check_answer").bind(opt))
		choice_vbox.add_child(btn)

func _check_answer(selected: String):
	if selected == current_q["answer"]:
		GameManager.modify_gold(40)
		print("Doğru Cevap! +40 Gold")
	else:
		print("Yanlış Cevap!")
	GameManager.change_state(GameManager.State.MAP)
'''

with open(os.path.join(ui_dir, "TriviaScreen.gd"), "w", encoding="utf-8") as f:
    f.write(trivia_gd)

trivia_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/TriviaScreen.gd" id="1_trivia"]

[node name="TriviaScreen" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_trivia")

[node name="VBox" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -300.0
offset_top = -200.0
offset_right = 300.0
offset_bottom = 200.0
grow_horizontal = 2
grow_vertical = 2

[node name="Title" type="Label" parent="VBox"]
layout_mode = 2
text = "🧩 Bilgi & Bilmece Yarışması"
horizontal_alignment = 1

[node name="QuestionLabel" type="Label" parent="VBox"]
custom_minimum_size = Vector2(0, 80)
layout_mode = 2
text = "Soru..."
autowrap_mode = 2
horizontal_alignment = 1

[node name="HintLabel" type="Label" parent="VBox"]
layout_mode = 2
text = "Ipucu..."
horizontal_alignment = 1

[node name="ChoiceVBox" type="VBoxContainer" parent="VBox"]
layout_mode = 2
'''

with open(os.path.join(ui_dir, "TriviaScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(trivia_tscn)

print("Modals and extra screens created successfully!")
