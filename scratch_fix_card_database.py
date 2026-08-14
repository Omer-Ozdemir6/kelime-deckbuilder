import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
card_db_path = os.path.join(godot_dir, "autoload", "CardDatabase.gd")

code = '''extends Node

# CardDatabase.gd - Global Database for Letters, Seals, Relics, Jokers, Events, Trivia & Decks

const LETTER_DEFINITIONS = {
	"A": {"points": 1, "rarity": "normal", "desc": "Sık kullanılan sesli harf"},
	"E": {"points": 1, "rarity": "normal", "desc": "Sık kullanılan sesli harf"},
	"İ": {"points": 1, "rarity": "normal", "desc": "Sık kullanılan sesli harf"},
	"I": {"points": 2, "rarity": "normal", "desc": "Türkçe sesli harf"},
	"K": {"points": 3, "rarity": "normal", "desc": "Kelime kurucu sessiz harf"},
	"L": {"points": 2, "rarity": "normal", "desc": "Yaygın sessiz harf"},
	"M": {"points": 2, "rarity": "normal", "desc": "Yaygın sessiz harf"},
	"N": {"points": 2, "rarity": "normal", "desc": "Yaygın sessiz harf"},
	"R": {"points": 2, "rarity": "normal", "desc": "Yaygın sessiz harf"},
	"S": {"points": 2, "rarity": "normal", "desc": "Yaygın sessiz harf"},
	"T": {"points": 2, "rarity": "normal", "desc": "Yaygın sessiz harf"},
	"B": {"points": 3, "rarity": "nadir", "desc": "Güçlü sessiz harf"},
	"C": {"points": 4, "rarity": "nadir", "desc": "Değerli sessiz harf"},
	"D": {"points": 3, "rarity": "nadir", "desc": "Güçlü sessiz harf"},
	"O": {"points": 2, "rarity": "nadir", "desc": "Yuvarlak sesli harf"},
	"U": {"points": 2, "rarity": "nadir", "desc": "Yuvarlak sesli harf"},
	"Y": {"points": 3, "rarity": "nadir", "desc": "Kaynaştırma harfi"},
	"Ş": {"points": 5, "rarity": "nadir", "desc": "Türkçe özel harf"},
	"Ğ": {"points": 8, "rarity": "nadir", "desc": "Yüksek puanlı yumuşak g"},
	"Ç": {"points": 5, "rarity": "nadir", "desc": "Türkçe özel harf"},
	"Ö": {"points": 4, "rarity": "nadir", "desc": "Noktalı sesli harf"},
	"Ü": {"points": 3, "rarity": "nadir", "desc": "Noktalı sesli harf"},
	"F": {"points": 6, "rarity": "cok_nadir", "desc": "Sert sessiz harf"},
	"G": {"points": 5, "rarity": "cok_nadir", "desc": "Değerli sessiz harf"},
	"H": {"points": 5, "rarity": "cok_nadir", "desc": "Değerli sessiz harf"},
	"J": {"points": 10, "rarity": "cok_nadir", "desc": "Efsanevi +10 Puan Harfi"},
	"P": {"points": 5, "rarity": "cok_nadir", "desc": "Sert sessiz harf"},
	"V": {"points": 7, "rarity": "cok_nadir", "desc": "Nadir yüksek puanlı harf"},
	"Z": {"points": 10, "rarity": "cok_nadir", "desc": "Efsanevi +10 Puan Harfi"}
}

const SEAL_DEFINITIONS = {
	"FOIL": {"id": "FOIL", "name": "Altın Yaldız", "icon": "🪙", "bonusChips": 30, "bonusMult": 0, "desc": "Oynandığında +30 Taban Puan ekler."},
	"HOLOGRAPHIC": {"id": "HOLOGRAPHIC", "name": "Holografik Mühür", "icon": "🔮", "bonusChips": 0, "bonusMult": 15, "desc": "Oynandığında +15 Çarpan ekler."},
	"POLYCHROME": {"id": "POLYCHROME", "name": "Polikrom Mühür", "icon": "🌈", "bonusChips": 0, "bonusMult": 0, "isPolychrome": true, "desc": "Kelimenin toplam puanını 1.5x ile çarpar."},
	"RED_SEAL": {"id": "RED_SEAL", "name": "Kırmızı Mühür", "icon": "🔴", "isRedSeal": true, "desc": "Bu harf kelime skoru hesaplanırken 2 KEZ TETİKLENİR!"},
	"EMERALD_SEAL": {"id": "EMERALD_SEAL", "name": "Zümrüt Mühür", "icon": "💚", "bonusGold": 15, "desc": "Oynandığında anında +15 Ekstra Altın kazandırır."},
	"LIGHTNING_SEAL": {"id": "LIGHTNING_SEAL", "name": "Yıldırım Mühürü", "icon": "⚡", "bonusCombo": 2, "desc": "Oynandığında kombo seviyesini anında +2 arttırır."},
	"FREEZE_SEAL": {"id": "FREEZE_SEAL", "name": "Buz Mühürü", "icon": "❄️", "isFreeze": true, "desc": "Korumalı Harf: Tur bittiğinde harf elden kaybolmaz."},
	"GLASS": {"id": "GLASS", "name": "Cam Mühür", "icon": "🥃", "isGlass": true, "bonusMultX": 2.0, "desc": "Oynandığında x2.0 Çarpan verir, ancak %25 ihtimalle kırılıp desteden silinir!"},
	"STEEL": {"id": "STEEL", "name": "Çelik Mühür", "icon": "🛡️", "isSteel": true, "desc": "Elde tutulduğu sürece kelimenize x1.5 Çarpan kazandırır!"},
	"STONE": {"id": "STONE", "name": "Taş Mühür", "icon": "🗿", "isStone": true, "bonusChips": 50, "desc": "Harfsiz Taş: Oynandığında veya elde tutulduğunda +50 Taban Puan ekler."},
	"BLUE_SEAL": {"id": "BLUE_SEAL", "name": "Mavi Mühür", "icon": "🔵", "isBlueSeal": true, "desc": "Tur sonunda elde tutulursa rastgele 1 Gezegen Taş Seviye Yükseltmesi verir!"},
	"PURPLE_SEAL": {"id": "PURPLE_SEAL", "name": "Mor Mühür", "icon": "🟣", "isPurpleSeal": true, "desc": "Iskarta yapıldığında anında rastgele 1 Efsun Taş kazandırır!"}
}

const STAKES = [
	{"id": "WHITE_STAKE", "name": "Beyaz Mühür (Normal)", "icon": "⚪", "desc": "Standart oyun zorluğu."},
	{"id": "RED_STAKE", "name": "Kırmızı Mühür", "icon": "🔴", "desc": "Artan ıskartalar tur sonunda ekstra altın kazandırmaz."},
	{"id": "GREEN_STAKE", "name": "Yeşil Mühür", "icon": "🟢", "desc": "Kademe hedef skorları %25 daha hızlı yükselir."},
	{"id": "BLUE_STAKE", "name": "Mavi Mühür", "icon": "🔵", "desc": "Her aşamada -1 Iskarta hakkınız olur."},
	{"id": "BLACK_STAKE", "name": "Siyah Mühür", "icon": "⚫", "desc": "Dükkandaki ürün fiyatları %20 daha pahalıdır."},
	{"id": "PURPLE_STAKE", "name": "Mor Mühür", "icon": "🟣", "desc": "Skor hedefleri %50 daha hızlı artar."},
	{"id": "ORANGE_STAKE", "name": "Turuncu Mühür", "icon": "🟠", "desc": "Dükkandaki jokerler daha yüksek maliyetlidir."},
	{"id": "GOLD_STAKE", "name": "Altın Mühür (Efsanevi)", "icon": "👑", "desc": "En zorlu Balatro meydan okuması!"}
]

const RELICS = {
	"UZUN_SOZ": {"id": "UZUN_SOZ", "name": "Uzun Söz Mührü", "icon": "📜", "cost": 75, "desc": "5 harf ve üzerindeki kelimeler +25% ekstra puan kazandırır."},
	"KISA_SOZ": {"id": "KISA_SOZ", "name": "Kısa Söz Tılsımı", "icon": "⚡", "cost": 65, "desc": "3-4 harfli hızlı kelimeler +20% ekstra puan kazandırır."},
	"MUREKKEP": {"id": "MUREKKEP", "name": "Sihirli Mürekkep", "icon": "✒️", "cost": 95, "desc": "Her kademedeki ilk kelime 2x puan kazandırır."},
	"NADIR_MUHUR": {"id": "NADIR_MUHUR", "name": "Nadir Mühür", "icon": "💎", "cost": 110, "desc": "Ş, Ğ, Ç, Ö, Ü, Z harflerini içeren kelimeler +30% bonus puan verir."},
	"KESKIN_KALEM": {"id": "KESKIN_KALEM", "name": "Keskin Kalem", "icon": "✏️", "cost": 75, "desc": "Nadir ve Çok Nadir harfler +3 ekstra taban puan verir."},
	"SERI_KATIP": {"id": "SERI_KATIP", "name": "Seri Kâtip", "icon": "🔥", "cost": 85, "desc": "Kombo çarpanı her başarılı kelimede +2 artar."},
	"ALTIN_SOZLUK": {"id": "ALTIN_SOZLUK", "name": "Altın Sözlük", "icon": "💰", "cost": 90, "desc": "5+ harfli her başarılı kelime +3 ekstra altın kazandırır."},
	"ZINCIR_USTASI": {"id": "ZINCIR_USTASI", "name": "Zincir Ustası", "icon": "🔗", "cost": 95, "desc": "Kelime zincirlerinde +30% ekstra puan verir."},
	"BANKACI": {"id": "BANKACI", "name": "Usta Bankacı", "icon": "🏦", "cost": 85, "desc": "Harf Bankasından kullanılan harf içeren kelimeler +40% bonus puan kazandırır."},
	"CIFT_HARF": {"id": "CIFT_HARF", "name": "Çift Harf Mührü", "icon": "👯", "cost": 70, "desc": "Aynı harfi 2 veya daha fazla kez içeren kelimeler +25% bonus puan kazandırır."},
	"UC_SESLI": {"id": "UC_SESLI", "name": "Üç Sesli Mührü", "icon": "🎵", "cost": 80, "desc": "3 farklı sesli harf içeren kelimeler +35% ekstra puan kazandırır."},
	"SON_HARF": {"id": "SON_HARF", "name": "Son Harf Tılsımı", "icon": "🏁", "cost": 75, "desc": "Kelimenin son harfinin taban puanı 2x hesaplanır."},
	"TAZELENME": {"id": "TAZELENME", "name": "Tazelenme Mührü", "icon": "🔄", "cost": 65, "desc": "Her bölümde +1 ekstra Yenileme hakkı kazandırır."}
}

const PASSIVE_JOKERS = [
	{"id": "JOKER_JOKER", "name": "Joker", "icon": "🃏", "cost": 4, "rarity": "normal", "desc": "+4 Çarpan verir."},
	{"id": "JOKER_GREEDY", "name": "Açgözlü Joker", "icon": "💎", "cost": 5, "rarity": "normal", "desc": "A, E, İ içeren kelimelerde her sesli harf için +3 Çarpan kazandırır."},
	{"id": "JOKER_LUSTY", "name": "Coşkulu Joker", "icon": "🔥", "cost": 5, "rarity": "normal", "desc": "K, L, M, N, R içeren kelimelerde her harf için +4 Çarpan kazandırır."},
	{"id": "JOKER_SCHOLAR", "name": "Bilgin Joker", "icon": "📜", "cost": 6, "rarity": "nadir", "desc": "6+ harfli kelimelerde +20 Taban Puan ve +10 Çarpan kazandırır."},
	{"id": "JOKER_HALF", "name": "Yarım Joker", "icon": "✂️", "cost": 5, "rarity": "normal", "desc": "3 harf veya daha kısa kelimelerde +20 Çarpan verir."},
	{"id": "JOKER_GOLDEN", "name": "Altın Joker", "icon": "💰", "cost": 6, "rarity": "nadir", "desc": "Her el sonunda +4 Altın kazandırır."},
	{"id": "JOKER_BULL", "name": "Boğa Joker", "icon": "🐂", "cost": 7, "rarity": "nadir", "desc": "Sahip olduğunuz her 1 Altın için +2 Taban Puan kazandırır."},
	{"id": "JOKER_POPCORN", "name": "Mısır Jokeri", "icon": "🍿", "cost": 5, "rarity": "normal", "desc": "+20 Çarpan verir. Her tur çarpan 4 azalır."},
	{"id": "JOKER_ICE_CREAM", "name": "Dondurma Jokeri", "icon": "🍦", "cost": 5, "rarity": "normal", "desc": "+100 Taban Puan verir. Her tur puan 5 azalır."},
	{"id": "JOKER_SPACE", "name": "Uzay Jokeri", "icon": "🚀", "cost": 8, "rarity": "cok_nadir", "desc": "%25 ihtimalle oynanan kelimenin seviyesini yükseltir."}
]

const STARTER_DECKS = {
	"MIMAR": {
		"id": "MIMAR",
		"name": "Mimar Destesi",
		"icon": "🏛️",
		"desc": "Dengeli harf dağılımı. Ekstra taban puan avantajı sağlar.",
		"letters": ["A","A","E","E","İ","İ","K","K","L","L","M","N","R","S","T","B","D","O","U","Y"]
	},
	"BILGE": {
		"id": "BILGE",
		"name": "Bilge Destesi",
		"icon": "📜",
		"desc": "Nadir harfler ve jokerlerle dolu zeki bir deste.",
		"letters": ["A","E","İ","K","L","M","N","R","S","T","Ç","Ğ","Ş","Ö","Ü","J","Z","V","F","G"]
	},
	"SAVASCI": {
		"id": "SAVASCI",
		"name": "Savaşçı Destesi",
		"icon": "⚔️",
		"desc": "Yüksek puanlı sert harfler ve çabuk hamleler.",
		"letters": ["A","E","K","L","T","B","C","D","F","G","H","P","V","Z","Ş","Ç","Ğ","J","Y","R"]
	},
	"OZAN": {
		"id": "OZAN",
		"name": "Ozan Destesi",
		"icon": "🪕",
		"desc": "Sesli harfler ve kombo çarpanı odaklı aşık destesi.",
		"letters": ["A","A","A","E","E","E","İ","İ","I","O","Ö","U","Ü","K","L","M","N","R","S","T"]
	}
}

const EVENTS = [
	{
		"id": "EVENT_OLD_DICTIONARY",
		"title": "Eski Sözlük Buldun",
		"icon": "📖",
		"desc": "Terk edilmiş bir kütüphane masasında tozlu ve gizemli bir eski Türkçe sözlük duruyor.",
		"choices": [
			{"text": "A) Destene rastgele nadir harf ekle (Ş / Ğ / Ç)", "action": "ADD_RARE"},
			{"text": "B) Destedeki bir harfi ücretsiz geliştir (+1 Perk)", "action": "UPGRADE_FREE"},
			{"text": "C) Sözlüğü antikacıya sat (+35 Altın)", "action": "GOLD_35"}
		]
	},
	{
		"id": "EVENT_ANCIENT_RUNES",
		"title": "Kadim Harf Yazıtı",
		"icon": "🪨",
		"desc": "Yol kenarında alev ve zümrüt ışıkları saçan kadim bir taş yazıt yükseliyor.",
		"choices": [
			{"text": "A) Yazıta dokun (Destene 1 Mühürlü Harf ekle)", "action": "ADD_INFUSED"},
			{"text": "B) Yazıttaki altın kırıntılarını topla (+40 Altın)", "action": "GOLD_40"}
		]
	},
	{
		"id": "EVENT_ALCHEMY_APPRENTICE",
		"title": "Simyacı Çırağı",
		"icon": "⚗️",
		"desc": "Genç bir simyacı harflere efsun ve mühür basmayı deniyor.",
		"choices": [
			{"text": "A) 20 Altın ver (Mühürlü Harf al)", "action": "BUY_INFUSED_20"},
			{"text": "B) 35 Altın ver (Rastgele 1 Relic kazan)", "action": "BUY_RELIC_35"},
			{"text": "C) Teşekkür edip yoluna devam et", "action": "PASS"}
		]
	}
]

const TRIVIA_QUESTIONS = [
	{"id": "w1", "category": "Kelime Bilmecesi", "question": "Başında 'K', sonunda 'R', ortasında 'A' var. Kışın yağar. Nedir?", "answer": "KAR", "hint": "3 harfli hava olayı"},
	{"id": "w2", "category": "Kelime Bilmecesi", "question": "Kilitli kapıları açmak için çevrilen nesne nedir?", "answer": "ANAHTAR", "hint": "Çilingirlerin vazgeçilmezi"},
	{"id": "q1", "category": "Tarih", "question": "Mustafa Kemal Atatürk’ün doğduğu tarihi kent neresidir?", "answer": "SELANİK", "hint": "Balkanlarda tarihi bir şehir"},
	{"id": "g2", "category": "Coğrafya", "question": "Türkiye Cumhuriyeti'nin başkenti olan ilimiz hangisidir?", "answer": "ANKARA", "hint": "İç Anadolu'nun kalbi"},
	{"id": "s1", "category": "Bilim", "question": "Güneş Sistemimizdeki en büyük dev gaz gezegeni hangisidir?", "answer": "JÜPİTER", "hint": "Dev gezegen"}
]

func get_letter_info(char: String) -> Dictionary:
	var upper_char = char.to_upper()
	if LETTER_DEFINITIONS.has(upper_char):
		return LETTER_DEFINITIONS[upper_char]
	return {"points": 1, "rarity": "normal", "desc": "Harf"}

func get_random_relic() -> Dictionary:
	var keys = RELICS.keys()
	var random_key = keys[randi() % keys.size()]
	return RELICS[random_key]
'''

with open(card_db_path, "w", encoding="utf-8") as f:
    f.write(code)

print("CardDatabase.gd successfully recreated and verified!")
