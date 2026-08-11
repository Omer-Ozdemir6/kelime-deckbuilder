// Ultra-comprehensive Turkish Dictionary with 50,000+ words & stemmer fallback

const EXPLICIT_TURKISH_WORDS = [
  // 2 Letters
  "AB", "AC", "AÇ", "AD", "AF", "AĞ", "AH", "AK", "AL", "AM", "AN", "AR", "AS", "AŞ", "AT", "AV", "AY", "AZ",
  "BA", "BE", "BU", "CE", "DA", "DE", "DO", "ED", "EH", "EK", "EL", "EM", "EN", "ER", "ES", "EŞ", "ET", "EV", "EY", "EZ",
  "FA", "FE", "HA", "HE", "IÇ", "IĞ", "IK", "IL", "IM", "IN", "IP", "IR", "IS", "IŞ", "IT", "IZ",
  "İÇ", "İĞ", "İK", "İL", "İM", "İN", "İP", "İR", "İS", "İŞ", "İT", "İZ",
  "LA", "LE", "ME", "Mİ", "MU", "MÜ", "NE", "OD", "OF", "OH", "OK", "OL", "OM", "ON", "OP", "OR", "OT", "OY",
  "ÖÇ", "ÖD", "ÖF", "ÖN", "ÖR", "ÖS", "ÖZ", "PE", "RE", "SE", "Sİ", "SU", "ŞU", "TA", "TE", "Tİ", "TU", "TÜ",
  "UN", "UR", "US", "UZ", "ÜÇ", "ÜN", "ÜS", "ÜT", "ÜZ", "VE", "YA", "YE", "YO", "ZA",

  // 3 Letters
  "ABA", "ABE", "ABİ", "ABU", "AÇI", "ADA", "ADE", "ADİ", "AFO", "AFT", "AĞA", "AĞI", "AHİ", "AİT", "AKA", "AKE", "AKİ", "AKS", "AKU", "AKÜ",
  "ALA", "ALİ", "ALO", "ALT", "AMA", "AMP", "ANA", "ANI", "ANİ", "ANT", "ARA", "ARI", "ARİ", "ARK", "ART", "ASA", "ASI", "ASİ", "ASK", "AST", "AŞK", "AŞI",
  "ATA", "ATE", "ATİ", "AUT", "AVA", "AVU", "AYA", "AYI", "AZİ", "AZO",
  "BAĞ", "BAL", "BAN", "BAR", "BAS", "BAŞ", "BAT", "BAZ", "BEK", "BEL", "BEN", "BEŞ", "BEY", "BİN", "BİR", "BİZ", "BOÇ", "BOK", "BOL", "BOZ", "BOŞ", "BOY", "BUM", "BUZ", "BÜL", "BÜK", "BÜY",
  "CAN", "CAR", "CAZ", "CEP", "CET", "CİK", "CİM", "CİN", "COP", "CÜZ",
  "ÇAĞ", "ÇAK", "ÇAL", "ÇAM", "ÇAN", "ÇAP", "ÇAR", "ÇAT", "ÇAY", "ÇEK", "ÇEL", "ÇEM", "ÇEN", "ÇEP", "ÇER", "ÇIĞ", "ÇİK", "ÇİL", "ÇİM", "ÇİP", "ÇİR", "ÇİS", "ÇİT", "ÇOK", "ÇÖP", "ÇÖZ",
  "DAĞ", "DAL", "DAM", "DAR", "DAZ", "DEF", "DEK", "DEM", "DEV", "DIŞ", "DİK", "DİL", "DİM", "DİN", "DİP", "DİŞ", "DİZ", "DOK", "DON", "DOST", "DOZ", "DUA", "DUL", "DUR", "DUY", "DUŞ", "DÜN", "DÜZ", "DÜŞ",
  "EDA", "EFE", "EGE", "EGO", "EĞE", "EKE", "EKİ", "EKO", "ELA", "ELE", "EME", "EMİ", "ENİ", "EPİ", "ERG", "ERK", "ERP", "ERT", "ESİ", "EŞİ", "ETA", "ETE", "ETİ", "EVE", "EVİ", "EZE", "EZİ",
  "FAK", "FAR", "FAS", "FAY", "FAZ", "FEN", "FER", "FES", "FIN", "FİÇ", "FİL", "FİN", "FİŞ", "FİT", "FOB", "FOK", "FOL", "FON", "FOT", "FOŞ", "FUT",
  "GAZ", "GEÇ", "GEL", "GEN", "GEZ", "GIC", "GIR", "GİB", "GİR", "GİZ", "GÖC", "GÖK", "GÖL", "GÖN", "GÖZ", "GÜC", "GÜL", "GÜM", "GÜN", "GÜR", "GÜZ",
  "HAK", "HAL", "HAM", "HAN", "HAP", "HAR", "HAS", "HAT", "HAV", "HAY", "HAZ", "HEM", "HER", "HEZ", "HIN", "HIC", "HİÇ", "HİS", "HİT", "HİZ", "HOŞ", "HUY", "HÜR", "HÜZ",
  "IRK", "IRZ", "IŞI", "ITR", "İBA", "İBİ", "İDE", "İFA", "İKA", "İKİ", "İLA", "İLE", "İLK", "İMA", "İMİ", "İNÇ", "İNİ", "İRA", "İRİ", "İSİ", "İŞİ", "İTA", "İTİ", "İZA", "İZİ",
  "JEL", "JET", "JÜR",
  "KAF", "KAK", "KAL", "KAM", "KAN", "KAP", "KAR", "KAS", "KAŞ", "KAT", "KAV", "KAY", "KAZ", "KEK", "KEL", "KEM", "KEP", "KER", "KES", "KEŞ", "KET", "KEZ", "KIL", "KIN", "KIR", "KIS", "KIŞ", "KIT", "KIZ", "KİK", "KİL", "KİM", "KİN", "KİP", "KİR", "KİS", "KİT", "KİZ", "KOD", "KOF", "KOK", "KOL", "KOM", "KOR", "KOŞ", "KOT", "KOY", "KOZ", "KÖK", "KÖS", "KÖY", "KÖZ", "KUL", "KUM", "KUR", "KUŞ", "KUT", "KUZ", "KÜL", "KÜM", "KÜN", "KÜR", "KÜS", "KÜT",
  "LAF", "LAK", "LAL", "LAM", "LAZ", "LEH", "LEK", "LEŞ", "LİF", "LİK", "LİM", "LİR", "LİS", "LOK", "LOP", "LOR", "LOŞ",
  "MAÇ", "MAL", "MAT", "MAV", "MAY", "MAZ", "MEÇ", "MEK", "MEL", "MEM", "MEN", "MET", "MEY", "MİÇ", "MİK", "MİL", "MİM", "MİR", "MİS", "MİT", "MİZ", "MOR", "MUÇ", "MUM", "MUT", "MÜÇ", "MÜL", "MÜŞ",
  "NAL", "NAM", "NAR", "NAS", "NAZ", "NEM", "NET", "NEY", "NİÇ", "NİK", "NİL", "NİM", "NİS", "NİŞ", "NOT", "NUR",
  "OBA", "ODA", "OĞU", "OJE", "OKA", "OKU", "OLA", "OLE", "OMA", "ONA", "ONS", "ORA", "ORK", "ORT", "OSA", "OYA", "ÖÇS", "ÖDE", "ÖKE", "ÖLE", "ÖNE", "ÖRE", "ÖRF", "ÖRÜ", "ÖTE", "ÖZÜ",
  "PAK", "PAL", "PAS", "PAT", "PAY", "PEK", "PES", "PEY", "PİK", "PİL", "PİN", "PİR", "PİS", "PİT", "POZ", "PUL", "PUS", "PÜR",
  "RAD", "RAF", "RAK", "RAM", "RAP", "RAS", "RAY", "RED", "REK", "REM", "REŞ", "REY", "RIZ", "RİC", "RİK", "RİM", "RİS", "RİT", "ROL", "ROZ", "RUH", "RUM", "RUS", "RÜZ",
  "SAC", "SAÇ", "SAF", "SAĞ", "SAK", "SAL", "SAM", "SAN", "SAP", "SAR", "SAS", "SAT", "SAV", "SAY", "SAZ", "SEK", "SEL", "SEM", "SEN", "SER", "SES", "SET", "SEV", "SEZ", "SIK", "SIR", "SİM", "SİN", "SİS", "SİZ", "SOK", "SOL", "SOM", "SON", "SOR", "SOY", "SÖZ", "SUB", "SUK", "SUL", "SUM", "SUN", "SUR", "SUS", "SÜK", "SÜL", "SÜN", "SÜR", "SÜS", "SÜT",
  "ŞAH", "ŞAK", "ŞAN", "ŞAP", "ŞAR", "ŞAT", "ŞEK", "ŞEM", "ŞEN", "ŞER", "ŞEY", "ŞIK", "ŞİR", "ŞİŞ", "ŞOK", "ŞOM", "ŞOV", "ŞUR",
  "TAÇ", "TAK", "TAL", "TAM", "TAN", "TAP", "TAR", "TAS", "TAŞ", "TAT", "TAV", "TAY", "TEK", "TEL", "TEM", "TEN", "TER", "TEZ", "TIK", "TİM", "TİP", "TİR", "TİZ", "TOK", "TOL", "TON", "TOP", "TOR", "TOZ", "TUL", "TUR", "TUŞ", "TUT", "TUZ", "TÜL", "TÜM", "TÜR", "TÜS", "TÜT", "TÜZ",
  "UCA", "UÇU", "UFA", "ULA", "ULU", "UMA", "UMU", "UNA", "URA", "USI", "UTA", "UYA", "UYU", "UZA", "ÜCE", "ÜÇÜ", "ÜLE", "ÜMİ", "ÜNÜ", "ÜRE", "ÜTE", "ÜTÜ", "ÜVE", "ÜYE",
  "VAH", "VAK", "VAN", "VAR", "VAZ", "VER", "VEY", "VIZ", "VİD", "VİR", "VİZ",
  "YAĞ", "YAK", "YAL", "YAM", "YAN", "YAP", "YAR", "YAS", "YAŞ", "YAT", "YAV", "YAY", "YAZ", "YEK", "YEL", "YEM", "YEN", "YER", "YEŞ", "YET", "YIK", "YIL", "YİT", "YOK", "YOL", "YOZ", "YUF", "YUM", "YUR", "YÜK", "YÜN", "YÜZ",
  "ZAM", "ZAN", "ZAR", "ZAT", "ZEK", "ZEM", "ZEN", "ZIT", "ZİL", "ZİR", "ZOR", "ZUM",

  // 4 Letters
  "ABAT", "ABLA", "ABRA", "ACAR", "ACEM", "ACİL", "ACUR", "AÇIK", "AÇIŞ", "AÇMA", "ADAK", "ADAM", "ADAY", "ADET", "ADIL", "ADIM", "ADLİ", "AFET", "AĞAC", "AĞAÇ", "AĞIS", "AĞIT", "AĞRI", "AİLE", "AJAN", "AKAK", "AKAN", "AKAR", "AKIL", "AKIM", "AKIN", "AKİS", "AKLI", "AKMA", "AKOR", "AKSE", "AKSİ", "AKŞAM", "AKUT", "ALAN", "ALAY", "ALEM", "ALEV", "ALGI", "ALIM", "ALIN", "ALIŞ", "ALMA", "ALTO", "AMAÇ", "AMAL", "AMBAR", "AMCA", "AMEL", "AMİN", "AMUT", "ANCA", "ANIZ", "ANIT", "ANMA", "ANNE", "AORT", "APEL", "APRE", "APSE", "ARAF", "ARAK", "ARAL", "ARAP", "ARAÇ", "ARDA", "ARIZ", "ARİF", "ARKA", "ARMA", "ARPA", "ARSA", "ARŞE", "ARTI", "ARZU", "ASAL", "ASAP", "ASIR", "ASIĞ", "ASİL", "ASLA", "ASLI", "ASLİ", "ASMA", "ASRİ", "AŞAR", "AŞIK", "AŞIM", "AŞİR", "AŞMA", "ATAK", "ATAR", "ATEŞ", "ATIK", "ATIL", "ATIM", "ATIŞ", "ATKI", "ATMA", "ATOM", "AVAM", "AVLU", "AVRO", "AYAK", "AYAL", "AYAR", "AYAZ", "AYET", "AYIK", "AYIN", "AYIP", "AYIT", "AYLA", "AYLI", "AYMA", "AYNA", "AZAP", "AZAR", "AZIK", "AZİM", "AZİZ", "AZMA",
  "BABA", "BACA", "BACI", "BADE", "BADİ", "BAGA", "BAĞI", "BAHT", "BAKI", "BALE", "BALO", "BAMU", "BANA", "BANK", "BANT", "BARI", "BARO", "BARS", "BASI", "BASK", "BASKI", "BAŞI", "BATI", "BATİ", "BAYİ", "BAZA", "BEBE", "BEKA", "BELİ", "BENİ", "BERİ", "BESİ", "BETA", "BETİ", "BEZE", "BEZİ", "BİDE", "BİLE", "BİLİ", "BİNA", "BİNİ", "BİRİ", "BİRE", "BİSE", "BİTİ", "BİZİ", "BLOK", "BOCA", "BOĞA", "BOLU", "BORA", "BORÇ", "BORU", "BOYA", "BOZA", "BÖCÜ", "BÖKE", "BÖLE", "BÖLÜ", "BÖRE", "BROM", "BURA", "BURÇ", "BURS", "BUĞU", "BÜRO", "BÜST", "BÜZÜ",
  "CABA", "CADI", "CAİZ", "CAMİ", "CANA", "CANI", "CARI", "CARİ", "CELP", "CENA", "CENK", "CENT", "CEZA", "CILK", "CIVI", "CİLA", "CİNS", "CİRİ", "CİRO", "CİSM", "CUMA", "CURA", "CÜCE", "CÜZİ",
  "ÇAĞA", "ÇAĞI", "ÇAKI", "ÇALI", "ÇAPA", "ÇARE", "ÇARK", "ÇATI", "ÇAYA", "ÇEKE", "ÇEKİ", "ÇELE", "ÇELİ", "ÇENE", "ÇENİ", "ÇERİ", "ÇETE", "ÇITI", "ÇIVI", "ÇIKI", "ÇIMA", "ÇIPA", "ÇIRA", "ÇİÇE", "ÇİFT", "ÇİLE", "ÇİNE", "ÇİNİ", "ÇİPA", "ÇİSE", "ÇİTA", "ÇİTİ", "ÇİZİ", "ÇOĞU", "ÇOKA", "ÇOMA", "ÇOPA", "ÇORB", "ÇUHA", "ÇUKA", "ÇUVA", "ÇÜNK", "ÇÜRÜ",
  "DADA", "DAĞI", "DAHA", "DAHİ", "DAİM", "DAİR", "DALI", "DAMA", "DANA", "DANG", "DARA", "DARI", "DATA", "DAVA", "DAYI", "DEDE", "DEFİ", "DEFO", "DEĞE", "DEĞİ", "DELİ", "DEME", "DEMİ", "DENİ", "DENK", "DEPO", "DERİ", "DERS", "DERT", "DEVE", "DEVİ", "DEVR", "DİKİ", "DİLİ", "DİNE", "DİNİ", "DİRE", "DİRİ", "DİSK", "DİŞİ", "DİVA", "DİYE", "DİZİ", "DOĞA", "DOĞU", "DOKU", "DOLU", "DOMUZ", "DONU", "DORU", "DOST", "DOYA", "DOZU", "DÖKÜ", "DÖNÜ", "DÖRT", "DÖŞE", "DÖVE", "DÖVÜ", "DRAM", "DUBA", "DURA", "DURU", "DUŞU", "DUTU", "DUYA", "DUYU", "DÜET", "DÜĞÜ", "DÜNY", "DÜRÜ", "DÜŞÜ", "DÜZE", "DÜZİ", "DÜZÜ",
  "EBAT", "EBED", "EBEL", "EBER", "EBET", "EBRU", "ECEL", "ECİR", "ECZA", "EDAT", "EDEP", "EDER", "EDİK", "EDİL", "EDİM", "EDİP", "EFEK", "EFOR", "EĞER", "EĞİK", "EĞİL", "EĞİM", "EĞİR", "EĞİŞ", "EĞME", "EĞRİ", "EHLİ", "EHİL", "EKER", "EKİM", "EKİN", "EKİP", "EKLİ", "EKME", "EKOL", "EKSİ", "EKŞİ", "ELBET", "ELÇİ", "ELDE", "ELEK", "ELEM", "ELİF", "ELİK", "ELİM", "ELİT", "ELLİ", "ELMA", "ELTİ", "EMEK", "EMEL", "EMİK", "EMİN", "EMİR", "EMİŞ", "EMME", "EMMİ", "EMRİ", "ENEC", "ENEK", "ENİK", "ENİŞ", "ENLİ", "ENSE", "ENVA", "EPİK", "ERAT", "ERCE", "ERCİ", "ERDE", "EREK", "EREM", "EREN", "ERGİN", "ERİL", "ERİM", "ERİN", "ERİŞ", "ERİZ", "ERKE", "ERME", "EROS", "ERTE", "ERZA", "ESAS", "ESER", "ESİK", "ESİL", "ESİM", "ESİN", "ESİR", "ESİŞ", "ESKİ", "ESMA", "ESME", "ESNA", "ESRA", "ESTİ", "EŞEK", "EŞİK", "EŞİL", "EŞİM", "EŞİN", "EŞİT", "EŞLİ", "EŞME", "ETAP", "ETÇİ", "ETER", "ETİK", "ETİL", "ETİN", "ETLİ", "ETME", "ETOL", "ETÜD", "ETÜT", "EVCE", "EVCİ", "EVET", "EVİK", "EVİL", "EVİM", "EVİN", "EVLA", "EVLİ", "EVRE", "EVRİ", "EYER", "EYGİ", "EYLE", "EYME", "EYÜP", "EZAN", "EZCİ", "EZEL", "EZGİ", "EZİK", "EZİL", "EZİM", "EZİN", "EZİŞ", "EZME",
  "FAİK", "FAİL", "FAİZ", "FAKR", "FAKS", "FALE", "FALİ", "FANK", "FANT", "FARÇ", "FARI", "FARS", "FARZ", "FASA", "FAŞO", "FATİ", "FAUL", "FAZA", "FELEK", "FENA", "FENE", "FENT", "FERD", "FERİ", "FERS", "FERT", "FEZA", "FIKIH", "FIRT", "FİDE", "FİKİR", "FİLE", "FİLM", "FİLO", "FİRE", "FİŞE", "FİTRE", "FLOR", "FLÖT", "FORA", "FORM", "FORS", "FOTO", "FÖTR", "FRAK", "FREN", "FUAR", "FÜZE",
  "GAGA", "GAİP", "GALA", "GALE", "GALİ", "GAMA", "GAMZ", "GANİ", "GARP", "GARK", "GAYE", "GAYR", "GAZA", "GAZİ", "GECE", "GEÇE", "GEÇİ", "GEDİ", "GELE", "GELİ", "GEMİ", "GENE", "GENİ", "GERİ", "GETO", "GEZE", "GEZİ", "GIDA", "GİBİ", "GİDE", "GİDİ", "GİNE", "GİRE", "GİRİ", "GİŞE", "GİZİ", "GOLF", "GONC", "GONG", "GÖCE", "GÖÇÜ", "GÖKÜ", "GÖLE", "GÖLÜ", "GÖNÜ", "GÖRE", "GÖRÜ", "GÖZE", "GÖZÜ", "GRAM", "GREV", "GRİP", "GRUP", "GURU", "GÜCÜ", "GÜLE", "GÜLÜ", "GÜME", "GÜMÜ", "GÜNE", "GÜNÜ", "GÜRÜ", "GÜVE", "GÜZE", "GÜZÜ",
  "TEMA", "TEOR", "TEPE", "TERE", "TERİ", "TERS", "TERZ", "TEST", "TESİ", "TİKİ", "TİRE", "TİPİ", "TİTR", "TREK", "TREN", "TRİO", "TRÜF", "TUĞA", "TUNA", "TURA", "TURP", "TÜRÜ",

  // 5 Letters & Key Words
  "NAKİL", "NAKIL", "NAKLİ", "NAKLA", "NAKLEN", "NAKLET", "AKİL", "ALİK", "ANİK", "ARİK", "ATİK", "ETİK", "İKNA", "İKRA", "İKTA", "İKAZ", "İLİK", "İNAK", "İNAÇ", "İNAN", "İNAZ", "İRAN", "İRİS", "İSAL", "İSKA", "İTKİ", "NAİF", "NAİP", "NAKİ", "NALİ", "NASİ", "NAZİ",
  "LAKİN", "İNKAR", "KİLİT", "LAKAP", "KAZAN", "SAKAL", "ASLAN", "KALE", "KLAN", "KLAS", "KASK", "LAKE", "LİRA", "LİSA", "RİCA", "SALA", "SARA", "SIRA", "TANE", "TARA",
  "TESİR", "TESİS", "TEMAŞ", "TEMEL", "TEMİZ", "TEMPO", "TEPİK", "TEPKİ", "TEPSİ", "TEREC", "TERFİ", "TERLİK", "TERÖR", "TESTİ", "TETİK", "TEZGA", "TEZÂT", "TILSIM", "TİLKİ", "TİPİK", "TİTİZ", "TOHUM", "TOKAT", "TORUN", "TORTU", "TOZLU", "TÖREN", "TÖRPÜ", "TÖVBE", "TRAFO", "TRAFİ", "TRAKİ", "TRANŞ", "TRİKO", "TROLİ", "TUĞLA", "TULUM", "TUNÇİ", "TURFA", "TURŞU", "TUTKU", "TUTUM", "TUTUŞ", "TUTAZ", "TUZAK", "TUZLU", "TUZSU", "TÜCCAR", "TÜFEK", "TÜNEL", "TÜRBE", "TÜRKÇ", "TÜTÜN", "TÜVEC",
  "RESİM", "RESMİ", "RESSA", "SEVGİ", "SEVİN", "SEVDA", "SEVGİ", "DENİZ", "DERYA", "DERGİ", "GÜNEŞ", "GÜNDÜ", "GÜZEL", "BİLGİ", "BİLİM", "BİLGE", "KİTAP", "KÂĞIT", "KALEM", "KELİM", "TÜRKÇ", "TOPLU", "TİYAT", "TÖREN", "İNSAN", "YAŞAM", "HAYAT", "ZAMAN", "ÇİÇEK", "AĞAÇL", "ORMAN", "TOPRA", "YILDI", "GEZEG", "ARKAD", "SEVGİ", "MELEK", "YAZAR", "OYUNC", "OYUNL", "KAREM", "KALEM", "MERAK", "KAMER", "SARKMA", "SARMA"
];

// Dynamically generated word dictionary Set
const WORD_SET = new Set(EXPLICIT_TURKISH_WORDS.map(w => w.toUpperCase().trim()));

// Key explicit additions
["NAKİL", "NAKIL", "NAKLİ", "LAKİN", "TESİR", "TESİS", "TEST", "TESTİ", "TERZİ", "TESBİH", "TESCİL", "TESLİM", "TEŞKİLAT", "TESELLİ", "TESPİT", "TESADÜF", "RESİM", "RESMİ", "SEVGİ", "SEVİNÇ", "SEVDALI", "DENİZ", "GÜNEŞ", "BİLGİ", "BİLİM", "BİLGE", "KİTAP", "KALEM", "KELİME", "TÜRKÇE", "İNSAN", "ZAMAN", "ÇİÇEK", "DOĞA", "YILDIZ", "OYUN", "OYUNCU"].forEach(w => WORD_SET.add(w));

// Common roots for suffix expansion
const COMMON_ROOTS = [
  "NAKİL", "NAKIL", "NAK", "LAKİN", "AKIL", "FİKİR", "ŞEHİR", "RESİM", "METİN", "NEFİS", "ÖMÜR", "SABIR", "KAYIP", "KISIM", "KALE",
  "TESİR", "TESİS", "TEST", "TEMA", "TEPE", "TER", "TEK", "TEL", "TEN", "TERZİ", "TEMİZ", "TETİK", "TİLKİ", "TOZ", "TUZ", "TÜRK", "TÜFEK", "TÜR",
  "AK", "AL", "AN", "AR", "AS", "AT", "AV", "AY", "AZ",
  "BA", "BAL", "BAS", "BAŞ", "BAT", "BAY", "BEK", "BEL", "BEN", "BİR", "BİZ", "BOZ", "BOŞ", "BOY", "BUZ",
  "CAN", "CAZ", "CEP", "ÇAĞ", "ÇAK", "ÇAL", "ÇAM", "ÇAN", "ÇAP", "ÇAT", "ÇAY", "ÇEK", "ÇIĞ", "ÇOK", "ÇÖP", "ÇÖZ",
  "DAĞ", "DAL", "DAM", "DAR", "DEV", "DIŞ", "DİK", "DİL", "DİN", "DİŞ", "DİZ", "DOĞ", "DOST", "DUA", "DUR", "DUY", "DÜN", "DÜZ", "DÜŞ",
  "EK", "EL", "EM", "EN", "ER", "ES", "EŞ", "ET", "EV", "EY", "EZ",
  "GEÇ", "GEL", "GEZ", "GİR", "GİZ", "GÖK", "GÖL", "GÖZ", "GÜL", "GÜN", "GÜR", "GÜZ",
  "HAK", "HAL", "HAN", "HAP", "HAS", "HAT", "HAZ", "HEM", "HER", "HİÇ", "HİS", "HOŞ", "HUY", "HÜR",
  "IRK", "IŞI", "İÇ", "İKİ", "İL", "İM", "İN", "İP", "İR", "İS", "İŞ", "İT", "İZ",
  "KAL", "KAM", "KAN", "KAP", "KAR", "KAS", "KAŞ", "KAT", "KAV", "KAY", "KAZ", "KEK", "KEL", "KEM", "KEP", "KES", "KEŞ", "KET", "KEZ", "KIL", "KIN", "KIR", "KIS", "KIŞ", "KIT", "KIZ", "KİL", "KİM", "KİN", "KİR", "KOD", "KOL", "KOR", "KOŞ", "KOY", "KOZ", "KÖK", "KÖY", "KÖZ", "KUL", "KUM", "KUR", "KUŞ", "KUT", "KUZ", "KÜL", "KÜR", "KÜS",
  "LAF", "LAK", "LEK", "LİF", "LİK", "MAÇ", "MAL", "MAT", "MAV", "MAY", "MOR", "MUM", "MUT",
  "NAL", "NAM", "NAR", "NAZ", "NEM", "NET", "NEY", "NOT", "NUR",
  "OBA", "ODA", "OKU", "OL", "ON", "OR", "OT", "OY", "ÖN", "ÖR", "ÖZ",
  "PAK", "PAS", "PAT", "PAY", "PEK", "PES", "PİK", "PİL", "PİN", "PİR", "PİS", "POZ", "PUL", "PUS",
  "RAF", "RAK", "RAY", "RED", "RESİM", "ROL", "RUH", "RUS",
  "SAÇ", "SAF", "SAĞ", "SAK", "SAL", "SAN", "SAP", "SAR", "SAT", "SAV", "SAY", "SAZ", "SEK", "SEL", "SEN", "SER", "SES", "SET", "SEV", "SEVGİ", "SEZ", "SIK", "SIR", "SİM", "SİN", "SİS", "SİZ", "SOK", "SOL", "SON", "SOR", "SOY", "SÖZ", "SU", "SÜR", "SÜS", "SÜT",
  "ŞAH", "ŞAK", "ŞAN", "ŞAP", "ŞEN", "ŞER", "ŞEY", "ŞIK", "ŞİŞ", "ŞOK", "ŞOV",
  "TAÇ", "TAK", "TAM", "TAN", "TAP", "TAR", "TAS", "TAŞ", "TAT", "TAV", "TAY", "TEK", "TEL", "TEN", "TER", "TEZ", "TIK", "TİM", "TİP", "TON", "TOP", "TOZ", "TUR", "TUŞ", "TUT", "TUZ", "TÜL", "TÜM", "TÜR",
  "UCA", "ULA", "ULU", "UMA", "UMU", "UNA", "URA", "UYA", "UYU", "UZA", "ÜÇ", "ÜN", "ÜRE", "ÜTÜ", "ÜYE",
  "VAH", "VAK", "VAN", "VAR", "VAZ", "VER", "VIZ",
  "YAĞ", "YAK", "YAL", "YAM", "YAN", "YAP", "YAR", "YAS", "YAŞ", "YAT", "YAV", "YAY", "YAZ", "YEK", "YEL", "YEM", "YEN", "YER", "YEŞ", "YET", "YIK", "YIL", "YİT", "YOK", "YOL", "YOZ", "YUK", "YUM", "YUR", "YÜK", "YÜN", "YÜZ", "ZAM", "ZAN", "ZAR", "ZAT", "ZEK", "ZEN", "ZİB", "ZİL", "ZİR", "ZOR"
];

// Turkish Vowels
const HARD_VOWELS = new Set(["A", "I", "O", "U"]);
const SOFT_VOWELS = new Set(["E", "İ", "Ö", "Ü"]);

function getLastVowel(str) {
  for (let i = str.length - 1; i >= 0; i--) {
    const ch = str[i].toUpperCase();
    if (HARD_VOWELS.has(ch) || SOFT_VOWELS.has(ch)) return ch;
  }
  return 'E';
}

const SUFFIXES_HARD = ["A", "I", "U", "AN", "IK", "UK", "IM", "UM", "IN", "UN", "LA", "LI", "LU", "LAR", "LIK", "LUK", "MA", "MAK", "SIZ", "SUZ", "CI", "CU", "CA", "DAN", "TAN", "DA", "TA", "YOR", "DI", "TI", "DU", "TU", "ACAK", "MİŞ", "MIŞ"];
const SUFFIXES_SOFT = ["E", "İ", "Ü", "EN", "İK", "ÜK", "İM", "ÜM", "İN", "ÜN", "LE", "Lİ", "LÜ", "LER", "LİK", "LÜK", "ME", "MEK", "SİZ", "SÜZ", "Cİ", "CÜ", "CE", "DEN", "TEN", "DE", "TE", "YOR", "Dİ", "Tİ", "DÜ", "TÜ", "ECEK", "MİŞ", "MÜŞ"];

COMMON_ROOTS.forEach(root => {
  WORD_SET.add(root);
  const lastV = getLastVowel(root);
  const suffixList = HARD_VOWELS.has(lastV) ? SUFFIXES_HARD : SUFFIXES_SOFT;

  suffixList.forEach(suf1 => {
    const word1 = root + suf1;
    if (word1.length <= 10) WORD_SET.add(word1);

    suffixList.forEach(suf2 => {
      const word2 = word1 + suf2;
      if (word2.length <= 10) WORD_SET.add(word2);
    });
  });
});

/**
 * Turkish Stemmer & Consonant Softening Fallback Validator
 */
function isMorphologicallyValidTurkishWord(word) {
  if (word.length < 2) return false;
  let testStr = word.toUpperCase().trim();

  if (WORD_SET.has(testStr)) return true;

  // Vowel drop fallback (e.g. NAKLİ -> NAKİL, FİKRİ -> FİKİR, AKLI -> AKIL)
  if (testStr.length >= 4) {
    const narrowVowels = ['İ', 'I', 'U', 'Ü'];
    for (const nv of narrowVowels) {
      const inserted = testStr.substring(0, testStr.length - 2) + nv + testStr.substring(testStr.length - 2);
      if (WORD_SET.has(inserted)) return true;
    }
  }

  const suffixes = [
    "LARINI", "LERİNİ", "LARIN", "LERİN", "LERDE", "LARDA", "LARDAN", "LERDEN", "LERİM", "LARIM", "LARIN", "LERİN",
    "LAR", "LER", "LİK", "LİK", "LUK", "LÜK", "Lİ", "LI", "LU", "LÜ", "SİZ", "SİZ", "SUZ", "SÜZ",
    "DEN", "DAN", "TEN", "TAN", "DE", "DA", "TE", "TA", "YE", "YA", "NE", "NA", "Yİ", "YI", "YU", "YÜ",
    "MİŞ", "MIŞ", "MUŞ", "MÜŞ", "Dİ", "Dİ", "DU", "DÜ", "Tİ", "Tİ", "TU", "TÜ", "CEK", "CAK", "ECEK", "ACAK",
    "YOR", "MAK", "MEK", "EN", "AN", "İR", "İR", "UR", "ÜR", "ER", "AR",
    "İM", "İM", "UM", "ÜM", "İN", "İN", "UN", "ÜN", "İ", "I", "U", "Ü", "E", "A"
  ];

  for (let i = 2; i < testStr.length; i++) {
    const prefix = testStr.substring(0, i);
    const suffix = testStr.substring(i);

    if (suffixes.includes(suffix)) {
      if (WORD_SET.has(prefix)) return true;

      const lastChar = prefix[prefix.length - 1];
      let restoredPrefix = prefix;
      if (lastChar === 'Ğ') restoredPrefix = prefix.slice(0, -1) + 'K';
      else if (lastChar === 'D') restoredPrefix = prefix.slice(0, -1) + 'T';
      else if (lastChar === 'B') restoredPrefix = prefix.slice(0, -1) + 'P';
      else if (lastChar === 'C') restoredPrefix = prefix.slice(0, -1) + 'Ç';

      if (WORD_SET.has(restoredPrefix)) return true;
    }
  }

  return false;
}

export function isWordValid(word) {
  if (!word || typeof word !== 'string') return false;
  const cleanWord = word.toUpperCase().trim();
  if (WORD_SET.has(cleanWord)) return true;
  return isMorphologicallyValidTurkishWord(cleanWord);
}

export function getDictionarySize() {
  return WORD_SET.size;
}
