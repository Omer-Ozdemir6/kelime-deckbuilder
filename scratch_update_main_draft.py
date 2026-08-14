import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
main_gd_path = os.path.join(godot_dir, "scenes", "Main.gd")

code = '''extends Control

@onready var view_container = $ViewContainer
@onready var header_bar = get_node_or_null("HeaderBar")

var current_view_node: Node = null

func _ready():
	GameManager.connect("state_changed", Callable(self, "_on_state_changed"))
	_on_state_changed(GameManager.current_state)

func _on_state_changed(new_state):
	if current_view_node:
		current_view_node.queue_free()
		current_view_node = null
		
	var show_header = false
	var scene_path = ""
	match new_state:
		GameManager.State.MAIN_MENU:
			scene_path = "res://scenes/ui/MainMenu.tscn"
			show_header = false
		GameManager.State.CHARACTER_SELECT:
			scene_path = "res://scenes/ui/CharacterSelect.tscn"
			show_header = false
		GameManager.State.STAKES_SELECT:
			scene_path = "res://scenes/ui/StakesSelect.tscn"
			show_header = false
		GameManager.State.MAP:
			scene_path = "res://scenes/ui/MapScreen.tscn"
			show_header = true
		GameManager.State.COMBAT:
			scene_path = "res://scenes/ui/WordPlayArea.tscn"
			show_header = true
		GameManager.State.SHOP:
			scene_path = "res://scenes/ui/ShopScreen.tscn"
			show_header = true
		GameManager.State.CAMP:
			scene_path = "res://scenes/ui/CampScreen.tscn"
			show_header = true
		GameManager.State.EVENT:
			scene_path = "res://scenes/ui/EventScreen.tscn"
			show_header = true
		GameManager.State.TRIVIA:
			scene_path = "res://scenes/ui/TriviaScreen.tscn"
			show_header = true
		GameManager.State.DRAFT:
			scene_path = "res://scenes/ui/DraftRewardModal.tscn"
			show_header = true
		GameManager.State.VICTORY, GameManager.State.GAME_OVER:
			scene_path = "res://scenes/ui/MainMenu.tscn"
			show_header = false
			
	if header_bar:
		header_bar.visible = show_header

	if scene_path != "" and ResourceLoader.exists(scene_path):
		var scn = load(scene_path)
		current_view_node = scn.instantiate()
		view_container.add_child(current_view_node)
'''

with open(main_gd_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Main.gd updated with DRAFT view state!")
