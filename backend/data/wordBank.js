// backend/data/wordBank.js
// BluffHunt Curated Global Word-Pair Pool
// EXACTLY 1,000 UNIQUE PAIRS
//
// Category Distribution:
// - Bollywood + famous actors: 200 pairs (20%)
// - Sports: 100 pairs (10%)
// - Cartoons famous in India: 50 pairs (5%)
// - Superheroes + famous Hollywood: 50 pairs (5%)
// - Extremely recognizable mainstream references: 300 pairs (30%)
// - Famous brands: 50 pairs (5%)
// - Indian festivals + popular Indian cultural references: 150 pairs (15%)
// - Famous foods: 100 pairs (10%)
//
// Difficulty Distribution:
// - Easy: 500 pairs (50%)
// - Medium: 300 pairs (30%)
// - Hard: 200 pairs (20%)

const wordBank = [
  {
    "id": "deewar::sholay",
    "agent": "Sholay",
    "imposter": "Deewar",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "don::zanjeer",
    "agent": "Don",
    "imposter": "Zanjeer",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "dilwale dulhania le jayenge::kuch kuch hota hai",
    "agent": "Dilwale Dulhania Le Jayenge",
    "imposter": "Kuch Kuch Hota Hai",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "hum aapke hain koun::kabhi khushi kabhie gham",
    "agent": "Hum Aapke Hain Koun",
    "imposter": "Kabhi Khushi Kabhie Gham",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "3 idiots::taare zameen par",
    "agent": "3 Idiots",
    "imposter": "Taare Zameen Par",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "lagaan::swades",
    "agent": "Lagaan",
    "imposter": "Swades",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "hera pheri::welcome",
    "agent": "Hera Pheri",
    "imposter": "Welcome",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "lage raho munna bhai::munna bhai mbbs",
    "agent": "Munna Bhai MBBS",
    "imposter": "Lage Raho Munna Bhai",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "dhamaal::golmaal",
    "agent": "Golmaal",
    "imposter": "Dhamaal",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "dabangg::singham",
    "agent": "Dabangg",
    "imposter": "Singham",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "jab we met::yeh jawaani hai deewani",
    "agent": "Jab We Met",
    "imposter": "Yeh Jawaani Hai Deewani",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "dil chahta hai::zindagi na milegi dobara",
    "agent": "Zindagi Na Milegi Dobara",
    "imposter": "Dil Chahta Hai",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "chak de india::dangal",
    "agent": "Dangal",
    "imposter": "Chak De India",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bajrangi bhaijaan::sultan",
    "agent": "Bajrangi Bhaijaan",
    "imposter": "Sultan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "omg oh my god::pk",
    "agent": "PK",
    "imposter": "OMG Oh My God",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "pathaan::war",
    "agent": "War",
    "imposter": "Pathaan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "jawan::pathaan",
    "agent": "Pathaan",
    "imposter": "Jawan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "animal::kabir singh",
    "agent": "Animal",
    "imposter": "Kabir Singh",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "border::gadar",
    "agent": "Gadar",
    "imposter": "Border",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bhool bhulaiyaa::stree",
    "agent": "Bhool Bhulaiyaa",
    "imposter": "Stree",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "andhadhun::drishyam",
    "agent": "Drishyam",
    "imposter": "Andhadhun",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "shershaah::uri the surgical strike",
    "agent": "Uri The Surgical Strike",
    "imposter": "Shershaah",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "baahubali::kgf",
    "agent": "Baahubali",
    "imposter": "KGF",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kgf::pushpa",
    "agent": "KGF",
    "imposter": "Pushpa",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "baahubali::rrr",
    "agent": "RRR",
    "imposter": "Baahubali",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "12th fail::3 idiots",
    "agent": "12th Fail",
    "imposter": "3 Idiots",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "fighter::war",
    "agent": "Fighter",
    "imposter": "War",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "brahmastra::krrish",
    "agent": "Brahmastra",
    "imposter": "Krrish",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "koi mil gaya::krrish",
    "agent": "Koi Mil Gaya",
    "imposter": "Krrish",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "main hoon na::om shanti om",
    "agent": "Main Hoon Na",
    "imposter": "Om Shanti Om",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kal ho naa ho::veer-zaara",
    "agent": "Kal Ho Naa Ho",
    "imposter": "Veer-Zaara",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "dil to pagal hai::mohabbatein",
    "agent": "Mohabbatein",
    "imposter": "Dil To Pagal Hai",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "devdas::hum dil de chuke sanam",
    "agent": "Hum Dil De Chuke Sanam",
    "imposter": "Devdas",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kaho naa pyaar hai::karan arjun",
    "agent": "Kaho Naa Pyaar Hai",
    "imposter": "Karan Arjun",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "baazigar::darr",
    "agent": "Baazigar",
    "imposter": "Darr",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "chup chup ke::hulchul",
    "agent": "Chup Chup Ke",
    "imposter": "Hulchul",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bhagam bhag::garam masala",
    "agent": "Garam Masala",
    "imposter": "Bhagam Bhag",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "singh is kinng::welcome",
    "agent": "Welcome",
    "imposter": "Singh Is Kinng",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "dabangg::rowdy rathore",
    "agent": "Rowdy Rathore",
    "imposter": "Dabangg",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "simmba::sooryavanshi",
    "agent": "Simmba",
    "imposter": "Sooryavanshi",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "chennai express::happy new year",
    "agent": "Chennai Express",
    "imposter": "Happy New Year",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "english vinglish::queen",
    "agent": "Queen",
    "imposter": "English Vinglish",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "3 idiots::chhichhore",
    "agent": "Chhichhore",
    "imposter": "3 Idiots",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "barfi::rockstar",
    "agent": "Rockstar",
    "imposter": "Barfi",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bhaag milkha bhaag::dangal",
    "agent": "Bhaag Milkha Bhaag",
    "imposter": "Dangal",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bajirao mastani::padmaavat",
    "agent": "Padmaavat",
    "imposter": "Bajirao Mastani",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "mr. india::shaan",
    "agent": "Mr. India",
    "imposter": "Shaan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "maine pyar kiya::qayamat se qayamat tak",
    "agent": "Qayamat Se Qayamat Tak",
    "imposter": "Maine Pyar Kiya",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "pardes::taal",
    "agent": "Pardes",
    "imposter": "Taal",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "brahmastra::kalki 2898 ad",
    "agent": "Kalki 2898 AD",
    "imposter": "Brahmastra",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "salman khan::shah rukh khan",
    "agent": "Shah Rukh Khan",
    "imposter": "Salman Khan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "aamir khan::salman khan",
    "agent": "Salman Khan",
    "imposter": "Aamir Khan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "aamir khan::shah rukh khan",
    "agent": "Shah Rukh Khan",
    "imposter": "Aamir Khan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "amitabh bachchan::dharmendra",
    "agent": "Amitabh Bachchan",
    "imposter": "Dharmendra",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "amitabh bachchan::rishi kapoor",
    "agent": "Amitabh Bachchan",
    "imposter": "Rishi Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "hrithik roshan::tiger shroff",
    "agent": "Hrithik Roshan",
    "imposter": "Tiger Shroff",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "ajay devgn::akshay kumar",
    "agent": "Akshay Kumar",
    "imposter": "Ajay Devgn",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "akshay kumar::suniel shetty",
    "agent": "Akshay Kumar",
    "imposter": "Suniel Shetty",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bobby deol::sunny deol",
    "agent": "Sunny Deol",
    "imposter": "Bobby Deol",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "govinda::salman khan",
    "agent": "Govinda",
    "imposter": "Salman Khan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "ranbir kapoor::ranveer singh",
    "agent": "Ranbir Kapoor",
    "imposter": "Ranveer Singh",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "hrithik roshan::ranbir kapoor",
    "agent": "Ranbir Kapoor",
    "imposter": "Hrithik Roshan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kartik aaryan::ranbir kapoor",
    "agent": "Kartik Aaryan",
    "imposter": "Ranbir Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "ranbir kapoor::shahid kapoor",
    "agent": "Shahid Kapoor",
    "imposter": "Ranbir Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "sidharth malhotra::varun dhawan",
    "agent": "Varun Dhawan",
    "imposter": "Sidharth Malhotra",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "ayushmann khurrana::rajkummar rao",
    "agent": "Ayushmann Khurrana",
    "imposter": "Rajkummar Rao",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "johnny lever::paresh rawal",
    "agent": "Paresh Rawal",
    "imposter": "Johnny Lever",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "johnny lever::rajpal yadav",
    "agent": "Rajpal Yadav",
    "imposter": "Johnny Lever",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "paresh rawal::rajpal yadav",
    "agent": "Paresh Rawal",
    "imposter": "Rajpal Yadav",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "nawazuddin siddiqui::pankaj tripathi",
    "agent": "Pankaj Tripathi",
    "imposter": "Nawazuddin Siddiqui",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "arshad warsi::sanjay dutt",
    "agent": "Arshad Warsi",
    "imposter": "Sanjay Dutt",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "anil kapoor::jackie shroff",
    "agent": "Anil Kapoor",
    "imposter": "Jackie Shroff",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "ranveer singh::vicky kaushal",
    "agent": "Vicky Kaushal",
    "imposter": "Ranveer Singh",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "akshay kumar::saif ali khan",
    "agent": "Saif Ali Khan",
    "imposter": "Akshay Kumar",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "alia bhatt::deepika padukone",
    "agent": "Deepika Padukone",
    "imposter": "Alia Bhatt",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "deepika padukone::katrina kaif",
    "agent": "Deepika Padukone",
    "imposter": "Katrina Kaif",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kareena kapoor::katrina kaif",
    "agent": "Katrina Kaif",
    "imposter": "Kareena Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kareena kapoor::priyanka chopra",
    "agent": "Kareena Kapoor",
    "imposter": "Priyanka Chopra",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "alia bhatt::shraddha kapoor",
    "agent": "Alia Bhatt",
    "imposter": "Shraddha Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kiara advani::shraddha kapoor",
    "agent": "Shraddha Kapoor",
    "imposter": "Kiara Advani",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kiara advani::kriti sanon",
    "agent": "Kiara Advani",
    "imposter": "Kriti Sanon",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "anushka sharma::deepika padukone",
    "agent": "Anushka Sharma",
    "imposter": "Deepika Padukone",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kajol::madhuri dixit",
    "agent": "Kajol",
    "imposter": "Madhuri Dixit",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "aishwarya rai::sushmita sen",
    "agent": "Aishwarya Rai",
    "imposter": "Sushmita Sen",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "preity zinta::rani mukerji",
    "agent": "Rani Mukerji",
    "imposter": "Preity Zinta",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "juhi chawla::madhuri dixit",
    "agent": "Madhuri Dixit",
    "imposter": "Juhi Chawla",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "madhuri dixit::sridevi",
    "agent": "Sridevi",
    "imposter": "Madhuri Dixit",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "janhvi kapoor::sara ali khan",
    "agent": "Sara Ali Khan",
    "imposter": "Janhvi Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "ananya panday::sara ali khan",
    "agent": "Ananya Panday",
    "imposter": "Sara Ali Khan",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "rashmika mandanna::samantha",
    "agent": "Rashmika Mandanna",
    "imposter": "Samantha",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kangana ranaut::vidya balan",
    "agent": "Vidya Balan",
    "imposter": "Kangana Ranaut",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "karisma kapoor::raveena tandon",
    "agent": "Karisma Kapoor",
    "imposter": "Raveena Tandon",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "kajol::kareena kapoor",
    "agent": "Kareena Kapoor",
    "imposter": "Kajol",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "anushka sharma::priyanka chopra",
    "agent": "Priyanka Chopra",
    "imposter": "Anushka Sharma",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "aishwarya rai::preity zinta",
    "agent": "Preity Zinta",
    "imposter": "Aishwarya Rai",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "hema malini::rekha",
    "agent": "Hema Malini",
    "imposter": "Rekha",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "janhvi kapoor::khushi kapoor",
    "agent": "Janhvi Kapoor",
    "imposter": "Khushi Kapoor",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "disha patani::kriti sanon",
    "agent": "Kriti Sanon",
    "imposter": "Disha Patani",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "bhumi pednekar::taapsee pannu",
    "agent": "Taapsee Pannu",
    "imposter": "Bhumi Pednekar",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "raveena tandon::shilpa shetty",
    "agent": "Shilpa Shetty",
    "imposter": "Raveena Tandon",
    "category": "bollywood",
    "difficulty": "easy"
  },
  {
    "id": "anand::deewar",
    "agent": "Anand",
    "imposter": "Deewar",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "mughal-e-azam::sholay",
    "agent": "Mughal-E-Azam",
    "imposter": "Sholay",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "amar akbar anthony::don",
    "agent": "Amar Akbar Anthony",
    "imposter": "Don",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "lagaan::rang de basanti",
    "agent": "Rang De Basanti",
    "imposter": "Lagaan",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "desi boyz::dostana",
    "agent": "Dostana",
    "imposter": "Desi Boyz",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "namastey london::singh is kinng",
    "agent": "Namastey London",
    "imposter": "Singh Is Kinng",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "hum aapke hain koun::hum saath-saath hain",
    "agent": "Hum Saath-Saath Hain",
    "imposter": "Hum Aapke Hain Koun",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "rockstar::sanju",
    "agent": "Sanju",
    "imposter": "Rockstar",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "badhaai ho::shubh mangal saavdhan",
    "agent": "Badhaai Ho",
    "imposter": "Shubh Mangal Saavdhan",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "bajirao mastani::tanhaji",
    "agent": "Tanhaji",
    "imposter": "Bajirao Mastani",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "gully boy::rockstar",
    "agent": "Gully Boy",
    "imposter": "Rockstar",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "dunki::swades",
    "agent": "Dunki",
    "imposter": "Swades",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "bhediya::stree",
    "agent": "Bhediya",
    "imposter": "Stree",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "kantara::pushpa",
    "agent": "Kantara",
    "imposter": "Pushpa",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "chupke chupke::golmaal",
    "agent": "Chupke Chupke",
    "imposter": "Golmaal",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "jaane tu ya jaane na::yeh jawaani hai deewani",
    "agent": "Jaane Tu Ya Jaane Na",
    "imposter": "Yeh Jawaani Hai Deewani",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "dil chahta hai::wake up sid",
    "agent": "Wake Up Sid",
    "imposter": "Dil Chahta Hai",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "delhi belly::fukrey",
    "agent": "Delhi Belly",
    "imposter": "Fukrey",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "dhamaal::fukrey",
    "agent": "Fukrey",
    "imposter": "Dhamaal",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "khakee::singham",
    "agent": "Khakee",
    "imposter": "Singham",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "baby::special 26",
    "agent": "Special 26",
    "imposter": "Baby",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "a wednesday::drishyam",
    "agent": "A Wednesday",
    "imposter": "Drishyam",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "article 15::badhaai do",
    "agent": "Article 15",
    "imposter": "Badhaai Do",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "andhadhun::ludo (film)",
    "agent": "Ludo (Film)",
    "imposter": "Andhadhun",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "bhool bhulaiyaa 3::stree 2",
    "agent": "Stree 2",
    "imposter": "Bhool Bhulaiyaa 3",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "simmba::singham again",
    "agent": "Singham Again",
    "imposter": "Simmba",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "tiger 3::war",
    "agent": "Tiger 3",
    "imposter": "War",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "ranveer singh::varun dhawan",
    "agent": "Ranveer Singh",
    "imposter": "Varun Dhawan",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "ayushmann khurrana::kartik aaryan",
    "agent": "Kartik Aaryan",
    "imposter": "Ayushmann Khurrana",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "sidharth malhotra::vicky kaushal",
    "agent": "Vicky Kaushal",
    "imposter": "Sidharth Malhotra",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "tiger shroff::vidyut jammwal",
    "agent": "Tiger Shroff",
    "imposter": "Vidyut Jammwal",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "boman irani::paresh rawal",
    "agent": "Boman Irani",
    "imposter": "Paresh Rawal",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "manoj bajpayee::pankaj tripathi",
    "agent": "Manoj Bajpayee",
    "imposter": "Pankaj Tripathi",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "manoj bajpayee::nawazuddin siddiqui",
    "agent": "Nawazuddin Siddiqui",
    "imposter": "Manoj Bajpayee",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "kader khan::shakti kapoor",
    "agent": "Kader Khan",
    "imposter": "Shakti Kapoor",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "johnny lever::kader khan",
    "agent": "Johnny Lever",
    "imposter": "Kader Khan",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "sanjay dutt::suniel shetty",
    "agent": "Sanjay Dutt",
    "imposter": "Suniel Shetty",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "anil kapoor::govinda",
    "agent": "Govinda",
    "imposter": "Anil Kapoor",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "anil kapoor::rishi kapoor",
    "agent": "Rishi Kapoor",
    "imposter": "Anil Kapoor",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "emraan hashmi::himesh reshammiya",
    "agent": "Emraan Hashmi",
    "imposter": "Himesh Reshammiya",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "abhishek bachchan::uday chopra",
    "agent": "Abhishek Bachchan",
    "imposter": "Uday Chopra",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "jimmy sheirgill::sharman joshi",
    "agent": "Jimmy Sheirgill",
    "imposter": "Sharman Joshi",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "r madhavan::sharman joshi",
    "agent": "R Madhavan",
    "imposter": "Sharman Joshi",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "chunky pandey::gulshan grover",
    "agent": "Chunky Pandey",
    "imposter": "Gulshan Grover",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "sanjay mishra::vijay raaz",
    "agent": "Sanjay Mishra",
    "imposter": "Vijay Raaz",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "kajol::preity zinta",
    "agent": "Preity Zinta",
    "imposter": "Kajol",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "karisma kapoor::urmila matondkar",
    "agent": "Urmila Matondkar",
    "imposter": "Karisma Kapoor",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "alia bhatt::kriti sanon",
    "agent": "Kriti Sanon",
    "imposter": "Alia Bhatt",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "nayanthara::samantha",
    "agent": "Nayanthara",
    "imposter": "Samantha",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "taapsee pannu::yami gautam",
    "agent": "Yami Gautam",
    "imposter": "Taapsee Pannu",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "tabu::vidya balan",
    "agent": "Tabu",
    "imposter": "Vidya Balan",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "jacqueline fernandez::sonam kapoor",
    "agent": "Sonam Kapoor",
    "imposter": "Jacqueline Fernandez",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "kiara advani::nushrratt bharuccha",
    "agent": "Nushrratt Bharuccha",
    "imposter": "Kiara Advani",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "fatima sana shaikh::sanya malhotra",
    "agent": "Fatima Sana Shaikh",
    "imposter": "Sanya Malhotra",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "kalki koechlin::konkona sen sharma",
    "agent": "Kalki Koechlin",
    "imposter": "Konkona Sen Sharma",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "dimple kapadia::jaya bachchan",
    "agent": "Dimple Kapadia",
    "imposter": "Jaya Bachchan",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "asha parekh::waheeda rehman",
    "agent": "Waheeda Rehman",
    "imposter": "Asha Parekh",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "amrita rao::genelia d'souza",
    "agent": "Amrita Rao",
    "imposter": "Genelia D'Souza",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "dia mirza::lara dutta",
    "agent": "Dia Mirza",
    "imposter": "Lara Dutta",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "disha patani::pooja hegde",
    "agent": "Pooja Hegde",
    "imposter": "Disha Patani",
    "category": "bollywood",
    "difficulty": "medium"
  },
  {
    "id": "lagaan::sholay",
    "agent": "Sholay",
    "imposter": "Lagaan",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "3 idiots::ddlj",
    "agent": "DDLJ",
    "imposter": "3 Idiots",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "hera pheri::munna bhai mbbs",
    "agent": "Hera Pheri",
    "imposter": "Munna Bhai MBBS",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "golmaal::welcome",
    "agent": "Golmaal",
    "imposter": "Welcome",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "chak de india::jo jeeta wohi sikandar",
    "agent": "Jo Jeeta Wohi Sikandar",
    "imposter": "Chak De India",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "baahubali::sholay",
    "agent": "Baahubali",
    "imposter": "Sholay",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "gadar::kgf",
    "agent": "KGF",
    "imposter": "Gadar",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "animal::jawan",
    "agent": "Jawan",
    "imposter": "Animal",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "dil chahta hai::kabhi khushi kabhie gham",
    "agent": "Kabhi Khushi Kabhie Gham",
    "imposter": "Dil Chahta Hai",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "swades::taare zameen par",
    "agent": "Taare Zameen Par",
    "imposter": "Swades",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "border::lagaan",
    "agent": "Border",
    "imposter": "Lagaan",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "chupke chupke::padosan",
    "agent": "Chupke Chupke",
    "imposter": "Padosan",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "chalti ka naam gaadi::padosan",
    "agent": "Chalti Ka Naam Gaadi",
    "imposter": "Padosan",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "anand::guide",
    "agent": "Guide",
    "imposter": "Anand",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "mother india::mughal-e-azam",
    "agent": "Mother India",
    "imposter": "Mughal-E-Azam",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "kaagaz ke phool::pyaasa",
    "agent": "Kaagaz Ke Phool",
    "imposter": "Pyaasa",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "deewar::trishul",
    "agent": "Deewar",
    "imposter": "Trishul",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "agneepath::deewar",
    "agent": "Agneepath",
    "imposter": "Deewar",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "satte pe satta::sholay",
    "agent": "Satte Pe Satta",
    "imposter": "Sholay",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "karan arjun::ram lakhan",
    "agent": "Karan Arjun",
    "imposter": "Ram Lakhan",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "baazigar::khalnayak",
    "agent": "Khalnayak",
    "imposter": "Baazigar",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "baby::sarfarosh",
    "agent": "Sarfarosh",
    "imposter": "Baby",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "gangs of wasseypur::satya",
    "agent": "Gangs of Wasseypur",
    "imposter": "Satya",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "company::satya",
    "agent": "Company",
    "imposter": "Satya",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "stree::tumbbad",
    "agent": "Tumbbad",
    "imposter": "Stree",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "gangs of wasseypur::masaan",
    "agent": "Masaan",
    "imposter": "Gangs of Wasseypur",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "drishyam::kahaani",
    "agent": "Kahaani",
    "imposter": "Drishyam",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "piku::the lunchbox",
    "agent": "Piku",
    "imposter": "The Lunchbox",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "english vinglish::nil battey sannata",
    "agent": "English Vinglish",
    "imposter": "Nil Battey Sannata",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "article 15::newton",
    "agent": "Newton",
    "imposter": "Article 15",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "amitabh bachchan::shah rukh khan",
    "agent": "Shah Rukh Khan",
    "imposter": "Amitabh Bachchan",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "dharmendra::salman khan",
    "agent": "Salman Khan",
    "imposter": "Dharmendra",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "aamir khan::dilip kumar",
    "agent": "Aamir Khan",
    "imposter": "Dilip Kumar",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "dev anand::ranbir kapoor",
    "agent": "Ranbir Kapoor",
    "imposter": "Dev Anand",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "ranveer singh::shammi kapoor",
    "agent": "Ranveer Singh",
    "imposter": "Shammi Kapoor",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "amol palekar::ayushmann khurrana",
    "agent": "Ayushmann Khurrana",
    "imposter": "Amol Palekar",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "pankaj tripathi::sanjeev kumar",
    "agent": "Pankaj Tripathi",
    "imposter": "Sanjeev Kumar",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "naseeruddin shah::nawazuddin siddiqui",
    "agent": "Nawazuddin Siddiqui",
    "imposter": "Naseeruddin Shah",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "manoj bajpayee::om puri",
    "agent": "Manoj Bajpayee",
    "imposter": "Om Puri",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "deepika padukone::hema malini",
    "agent": "Deepika Padukone",
    "imposter": "Hema Malini",
    "category": "bollywood",
    "difficulty": "hard"
  },
  {
    "id": "rohit sharma::virat kohli",
    "agent": "Virat Kohli",
    "imposter": "Rohit Sharma",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ms dhoni::virat kohli",
    "agent": "MS Dhoni",
    "imposter": "Virat Kohli",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ms dhoni::rohit sharma",
    "agent": "MS Dhoni",
    "imposter": "Rohit Sharma",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "sachin tendulkar::virat kohli",
    "agent": "Sachin Tendulkar",
    "imposter": "Virat Kohli",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ms dhoni::sachin tendulkar",
    "agent": "Sachin Tendulkar",
    "imposter": "MS Dhoni",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "jasprit bumrah::mohammed shami",
    "agent": "Jasprit Bumrah",
    "imposter": "Mohammed Shami",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "hardik pandya::ravindra jadeja",
    "agent": "Hardik Pandya",
    "imposter": "Ravindra Jadeja",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "kl rahul::shubman gill",
    "agent": "KL Rahul",
    "imposter": "Shubman Gill",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ishan kishan::rishabh pant",
    "agent": "Rishabh Pant",
    "imposter": "Ishan Kishan",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "rinku singh::suryakumar yadav",
    "agent": "Suryakumar Yadav",
    "imposter": "Rinku Singh",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "shubman gill::yashasvi jaiswal",
    "agent": "Shubman Gill",
    "imposter": "Yashasvi Jaiswal",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ravichandran ashwin::ravindra jadeja",
    "agent": "Ravindra Jadeja",
    "imposter": "Ravichandran Ashwin",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "kuldeep yadav::yuzvendra chahal",
    "agent": "Kuldeep Yadav",
    "imposter": "Yuzvendra Chahal",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "mohammed shami::mohammed siraj",
    "agent": "Mohammed Shami",
    "imposter": "Mohammed Siraj",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "suresh raina::yuvraj singh",
    "agent": "Yuvraj Singh",
    "imposter": "Suresh Raina",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "gautam gambhir::virender sehwag",
    "agent": "Virender Sehwag",
    "imposter": "Gautam Gambhir",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "rahul dravid::sourav ganguly",
    "agent": "Sourav Ganguly",
    "imposter": "Rahul Dravid",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "anil kumble::harbhajan singh",
    "agent": "Anil Kumble",
    "imposter": "Harbhajan Singh",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "kapil dev::sunil gavaskar",
    "agent": "Kapil Dev",
    "imposter": "Sunil Gavaskar",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "kapil dev::ms dhoni",
    "agent": "Kapil Dev",
    "imposter": "MS Dhoni",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ab de villiers::chris gayle",
    "agent": "AB de Villiers",
    "imposter": "Chris Gayle",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "david warner::steve smith",
    "agent": "David Warner",
    "imposter": "Steve Smith",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ab de villiers::glenn maxwell",
    "agent": "Glenn Maxwell",
    "imposter": "AB de Villiers",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "jasprit bumrah::lasith malinga",
    "agent": "Lasith Malinga",
    "imposter": "Jasprit Bumrah",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ben stokes::hardik pandya",
    "agent": "Ben Stokes",
    "imposter": "Hardik Pandya",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "mitchell starc::pat cummins",
    "agent": "Pat Cummins",
    "imposter": "Mitchell Starc",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "rashid khan::yuzvendra chahal",
    "agent": "Rashid Khan",
    "imposter": "Yuzvendra Chahal",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "brett lee::shoaib akhtar",
    "agent": "Shoaib Akhtar",
    "imposter": "Brett Lee",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "ricky ponting::sourav ganguly",
    "agent": "Ricky Ponting",
    "imposter": "Sourav Ganguly",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "brian lara::sachin tendulkar",
    "agent": "Brian Lara",
    "imposter": "Sachin Tendulkar",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "cristiano ronaldo::lionel messi",
    "agent": "Lionel Messi",
    "imposter": "Cristiano Ronaldo",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "lionel messi::neymar",
    "agent": "Neymar",
    "imposter": "Lionel Messi",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "cristiano ronaldo::neymar",
    "agent": "Cristiano Ronaldo",
    "imposter": "Neymar",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "erling haaland::kylian mbappé",
    "agent": "Kylian Mbappé",
    "imposter": "Erling Haaland",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "kylian mbappé::lionel messi",
    "agent": "Lionel Messi",
    "imposter": "Kylian Mbappé",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "cristiano ronaldo::erling haaland",
    "agent": "Cristiano Ronaldo",
    "imposter": "Erling Haaland",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "cristiano ronaldo::david beckham",
    "agent": "David Beckham",
    "imposter": "Cristiano Ronaldo",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "neymar::ronaldinho",
    "agent": "Ronaldinho",
    "imposter": "Neymar",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "diego maradona::pelé",
    "agent": "Diego Maradona",
    "imposter": "Pelé",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "lionel messi::sunil chhetri",
    "agent": "Sunil Chhetri",
    "imposter": "Lionel Messi",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "chennai super kings::mumbai indians",
    "agent": "Chennai Super Kings",
    "imposter": "Mumbai Indians",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "chennai super kings::royal challengers bengaluru",
    "agent": "Royal Challengers Bengaluru",
    "imposter": "Chennai Super Kings",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "mumbai indians::royal challengers bengaluru",
    "agent": "Mumbai Indians",
    "imposter": "Royal Challengers Bengaluru",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "chennai super kings::kolkata knight riders",
    "agent": "Kolkata Knight Riders",
    "imposter": "Chennai Super Kings",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "kolkata knight riders::rajasthan royals",
    "agent": "Rajasthan Royals",
    "imposter": "Kolkata Knight Riders",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "boundary (four)::sixer",
    "agent": "Sixer",
    "imposter": "Boundary (Four)",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "bouncer::yorker",
    "agent": "Yorker",
    "imposter": "Bouncer",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "doosra::googly",
    "agent": "Googly",
    "imposter": "Doosra",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "free hit::super over",
    "agent": "Super Over",
    "imposter": "Free Hit",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "bowler::wicketkeeper",
    "agent": "Wicketkeeper",
    "imposter": "Bowler",
    "category": "sports",
    "difficulty": "easy"
  },
  {
    "id": "rishabh pant::sanju samson",
    "agent": "Sanju Samson",
    "imposter": "Rishabh Pant",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "arshdeep singh::jasprit bumrah",
    "agent": "Arshdeep Singh",
    "imposter": "Jasprit Bumrah",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "axar patel::ravindra jadeja",
    "agent": "Axar Patel",
    "imposter": "Ravindra Jadeja",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "kl rahul::shreyas iyer",
    "agent": "Shreyas Iyer",
    "imposter": "KL Rahul",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "ashish nehra::zaheer khan",
    "agent": "Zaheer Khan",
    "imposter": "Ashish Nehra",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "irfan pathan::yusuf pathan",
    "agent": "Irfan Pathan",
    "imposter": "Yusuf Pathan",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "kane williamson::steve smith",
    "agent": "Kane Williamson",
    "imposter": "Steve Smith",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "david warner::travis head",
    "agent": "Travis Head",
    "imposter": "David Warner",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "faf du plessis::virat kohli",
    "agent": "Faf du Plessis",
    "imposter": "Virat Kohli",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "jos buttler::sanju samson",
    "agent": "Jos Buttler",
    "imposter": "Sanju Samson",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "mitchell starc::trent boult",
    "agent": "Trent Boult",
    "imposter": "Mitchell Starc",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "andre russell::kieron pollard",
    "agent": "Andre Russell",
    "imposter": "Kieron Pollard",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "rashid khan::sunil narine",
    "agent": "Sunil Narine",
    "imposter": "Rashid Khan",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "dwayne bravo::hardik pandya",
    "agent": "Dwayne Bravo",
    "imposter": "Hardik Pandya",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "dale steyn::shoaib akhtar",
    "agent": "Dale Steyn",
    "imposter": "Shoaib Akhtar",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "ben stokes::jacques kallis",
    "agent": "Jacques Kallis",
    "imposter": "Ben Stokes",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "muttiah muralitharan::shane warne",
    "agent": "Muttiah Muralitharan",
    "imposter": "Shane Warne",
    "category": "sports",
    "difficulty": "medium"
  },
  
  {
    "id": "erling haaland::robert lewandowski",
    "agent": "Robert Lewandowski",
    "imposter": "Erling Haaland",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "kylian mbappé::mohamed salah",
    "agent": "Mohamed Salah",
    "imposter": "Kylian Mbappé",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "kevin de bruyne::luka modric",
    "agent": "Kevin De Bruyne",
    "imposter": "Luka Modric",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "luis suárez::neymar",
    "agent": "Luis Suárez",
    "imposter": "Neymar",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "david beckham::zinedine zidane",
    "agent": "Zinedine Zidane",
    "imposter": "David Beckham",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "delhi capitals::punjab kings",
    "agent": "Delhi Capitals",
    "imposter": "Punjab Kings",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "gujarat titans::sunrisers hyderabad",
    "agent": "Sunrisers Hyderabad",
    "imposter": "Gujarat Titans",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "gujarat titans::lucknow super giants",
    "agent": "Lucknow Super Giants",
    "imposter": "Gujarat Titans",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "eden gardens::wankhede stadium",
    "agent": "Wankhede Stadium",
    "imposter": "Eden Gardens",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "chinnaswamy stadium::narendra modi stadium",
    "agent": "Narendra Modi Stadium",
    "imposter": "Chinnaswamy Stadium",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "century::hat-trick",
    "agent": "Hat-trick",
    "imposter": "Century",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "free kick::penalty kick",
    "agent": "Penalty Kick",
    "imposter": "Free Kick",
    "category": "sports",
    "difficulty": "medium"
  },
  {
    "id": "cristiano ronaldo::virat kohli",
    "agent": "Virat Kohli",
    "imposter": "Cristiano Ronaldo",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "lionel messi::rohit sharma",
    "agent": "Rohit Sharma",
    "imposter": "Lionel Messi",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "ms dhoni::neymar",
    "agent": "MS Dhoni",
    "imposter": "Neymar",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "hardik pandya::kylian mbappé",
    "agent": "Hardik Pandya",
    "imposter": "Kylian Mbappé",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "erling haaland::jasprit bumrah",
    "agent": "Jasprit Bumrah",
    "imposter": "Erling Haaland",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "diego maradona::sachin tendulkar",
    "agent": "Sachin Tendulkar",
    "imposter": "Diego Maradona",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "kapil dev::pelé",
    "agent": "Kapil Dev",
    "imposter": "Pelé",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "ronaldinho::yuvraj singh",
    "agent": "Yuvraj Singh",
    "imposter": "Ronaldinho",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "david beckham::kl rahul",
    "agent": "KL Rahul",
    "imposter": "David Beckham",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "sunil chhetri::virat kohli",
    "agent": "Sunil Chhetri",
    "imposter": "Virat Kohli",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "cover drive::helicopter shot",
    "agent": "Cover Drive",
    "imposter": "Helicopter Shot",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "reverse sweep::switch hit",
    "agent": "Reverse Sweep",
    "imposter": "Switch Hit",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "leg spin::off spin",
    "agent": "Leg Spin",
    "imposter": "Off Spin",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "run out::stump out",
    "agent": "Stump Out",
    "imposter": "Run Out",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "caught behind::lbw",
    "agent": "LBW",
    "imposter": "Caught Behind",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "no ball::wide ball",
    "agent": "Wide Ball",
    "imposter": "No Ball",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "red card::yellow card",
    "agent": "Yellow Card",
    "imposter": "Red Card",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "offside::penalty corner",
    "agent": "Offside",
    "imposter": "Penalty Corner",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "goalkeeper::striker",
    "agent": "Goalkeeper",
    "imposter": "Striker",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "lord's cricket ground::melbourne cricket ground",
    "agent": "Lord's Cricket Ground",
    "imposter": "Melbourne Cricket Ground",
    "category": "sports",
    "difficulty": "hard"
  },
  {
    "id": "chhota bheem::motu patlu",
    "agent": "Chhota Bheem",
    "imposter": "Motu Patlu",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "doraemon::shinchan",
    "agent": "Shinchan",
    "imposter": "Doraemon",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "oggy and the cockroaches::tom & jerry",
    "agent": "Tom & Jerry",
    "imposter": "Oggy and the Cockroaches",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "donald duck::mickey mouse",
    "agent": "Mickey Mouse",
    "imposter": "Donald Duck",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "chhota bheem::doraemon",
    "agent": "Chhota Bheem",
    "imposter": "Doraemon",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "motu patlu::tom & jerry",
    "agent": "Motu Patlu",
    "imposter": "Tom & Jerry",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "mr. bean::shinchan",
    "agent": "Shinchan",
    "imposter": "Mr. Bean",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "ninja hattori::perman",
    "agent": "Ninja Hattori",
    "imposter": "Perman",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "ben 10::chhota bheem",
    "agent": "Ben 10",
    "imposter": "Chhota Bheem",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "chacha chaudhary::sabu",
    "agent": "Chacha Chaudhary",
    "imposter": "Sabu",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "akbar birbal::tenali rama",
    "agent": "Akbar Birbal",
    "imposter": "Tenali Rama",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "mr. bean::tom & jerry",
    "agent": "Mr. Bean",
    "imposter": "Tom & Jerry",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "motu patlu::shinchan",
    "agent": "Motu Patlu",
    "imposter": "Shinchan",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "mickey mouse::tom & jerry",
    "agent": "Tom & Jerry",
    "imposter": "Mickey Mouse",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "ninja hattori::shinchan",
    "agent": "Shinchan",
    "imposter": "Ninja Hattori",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "chhota bheem::roll no 21",
    "agent": "Roll No 21",
    "imposter": "Chhota Bheem",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "donald duck::goofy",
    "agent": "Donald Duck",
    "imposter": "Goofy",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "bugs bunny::daffy duck",
    "agent": "Bugs Bunny",
    "imposter": "Daffy Duck",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "scooby-doo::tom & jerry",
    "agent": "Scooby-Doo",
    "imposter": "Tom & Jerry",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "johnny bravo::popeye",
    "agent": "Popeye",
    "imposter": "Johnny Bravo",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "ben 10::dexter's laboratory",
    "agent": "Dexter's Laboratory",
    "imposter": "Ben 10",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "powerpuff girls::shinchan",
    "agent": "Powerpuff Girls",
    "imposter": "Shinchan",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "doraemon::kiteretsu",
    "agent": "Kiteretsu",
    "imposter": "Doraemon",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "chhota bheem::krishna(cartoon)",
    "agent": "Chhota Bheem",
    "imposter": "Krishna (Cartoon)",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "motu patlu::roll no 21",
    "agent": "Roll No 21",
    "imposter": "Motu Patlu",
    "category": "cartoons",
    "difficulty": "easy"
  },
  {
    "id": "tenali rama::vikram betal",
    "agent": "Vikram Betal",
    "imposter": "Tenali Rama",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "chacha chaudhary::tenali rama",
    "agent": "Chacha Chaudhary",
    "imposter": "Tenali Rama",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "doraemon::perman",
    "agent": "Perman",
    "imposter": "Doraemon",
    "category": "cartoons",
    "difficulty": "medium"
  },
  
  {
    "id": "mr. bean::horrid henry",
    "agent": "Mr. Bean",
    "imposter": "horrid henry",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "bob the builder::thomas the tank engine",
    "agent": "Bob the Builder",
    "imposter": "Thomas the Tank Engine",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "dennis the menace::richie rich",
    "agent": "Richie Rich",
    "imposter": "Dennis the Menace",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "ben 10::phineas and ferb",
    "agent": "Phineas and Ferb",
    "imposter": "Ben 10",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "courage the cowardly dog::scooby-doo",
    "agent": "Courage the Cowardly Dog",
    "imposter": "Scooby-Doo",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "ducktales::richie rich",
    "agent": "Richie Rich",
    "imposter": "DuckTales",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "the jungle book::the lion king",
    "agent": "The Jungle Book",
    "imposter": "The Lion King",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "mowgli::tarzan",
    "agent": "Mowgli",
    "imposter": "Tarzan",
    "category": "cartoons",
    "difficulty": "medium"
  },
  {
    "id": "noddy::peppa-pig",
    "agent": "Noddy",
    "imposter": "peppa-pig",
    "category": "cartoons",
    "difficulty": "medium"
  },
  
  
  {
    "id": "dennis the menace::shinchan",
    "agent": "Shinchan",
    "imposter": "Dennis the Menace",
    "category": "cartoons",
    "difficulty": "hard"
  },
  {
    "id": "aladdin::doraemon",
    "agent": "Doraemon",
    "imposter": "Aladdin",
    "category": "cartoons",
    "difficulty": "hard"
  },
  {
    "id": "garfield::oggy",
    "agent": "Oggy",
    "imposter": "Garfield",
    "category": "cartoons",
    "difficulty": "hard"
  },
  {
    "id": "dholakpur::furfuri nagar",
    "agent": "Dholakpur",
    "imposter": "Furfuri Nagar",
    "category": "cartoons",
    "difficulty": "hard"
  },
  {
    "id": "nobita::shinchan",
    "agent": "Nobita",
    "imposter": "Shinchan",
    "category": "cartoons",
    "difficulty": "hard"
  },
  {
    "id": "krrish::shaktimaan",
    "agent": "Shaktimaan",
    "imposter": "Krrish",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "batman::spider-man",
    "agent": "Spider-Man",
    "imposter": "Batman",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "batman::superman",
    "agent": "Batman",
    "imposter": "Superman",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "captain america::iron man",
    "agent": "Iron Man",
    "imposter": "Captain America",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "hulk::thor",
    "agent": "Thor",
    "imposter": "Hulk",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "krrish::ra.one",
    "agent": "Ra.One",
    "imposter": "Krrish",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "shaktimaan::spider-man",
    "agent": "Shaktimaan",
    "imposter": "Spider-Man",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "iron man::spider-man",
    "agent": "Spider-Man",
    "imposter": "Iron Man",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "batman::iron man",
    "agent": "Batman",
    "imposter": "Iron Man",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "superman::thor",
    "agent": "Superman",
    "imposter": "Thor",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "deadpool::wolverine",
    "agent": "Deadpool",
    "imposter": "Wolverine",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "batman::joker",
    "agent": "Joker",
    "imposter": "Batman",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "iron man::thanos",
    "agent": "Thanos",
    "imposter": "Iron Man",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "avengers::justice league",
    "agent": "Avengers",
    "imposter": "Justice League",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "avatar::titanic",
    "agent": "Titanic",
    "imposter": "Avatar",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "harry potter::lord of the rings",
    "agent": "Harry Potter",
    "imposter": "Lord of the Rings",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "avatar::jurassic park",
    "agent": "Jurassic Park",
    "imposter": "Avatar",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "inception::interstellar",
    "agent": "Inception",
    "imposter": "Interstellar",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "fast and furious::mission impossible",
    "agent": "Fast and Furious",
    "imposter": "Mission Impossible",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "gladiator::titanic",
    "agent": "Gladiator",
    "imposter": "Titanic",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "harry potter::spider-man",
    "agent": "Spider-Man",
    "imposter": "Harry Potter",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "aladdin::the lion king",
    "agent": "The Lion King",
    "imposter": "Aladdin",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "iron man::transformers",
    "agent": "Transformers",
    "imposter": "Iron Man",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "james bond::mission impossible",
    "agent": "James Bond",
    "imposter": "Mission Impossible",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "black panther::captain america",
    "agent": "Black Panther",
    "imposter": "Captain America",
    "category": "superheroes_hollywood",
    "difficulty": "easy"
  },
  {
    "id": "shaktimaan::superman",
    "agent": "Shaktimaan",
    "imposter": "Superman",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "flying jatt::krrish",
    "agent": "Krrish",
    "imposter": "Flying Jatt",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "flying jatt::shaktimaan",
    "agent": "Flying Jatt",
    "imposter": "Shaktimaan",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "captain vyom::shaktimaan",
    "agent": "Captain Vyom",
    "imposter": "Shaktimaan",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "dr. strange::harry potter",
    "agent": "Dr. Strange",
    "imposter": "Harry Potter",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "doctor strange::iron man",
    "agent": "Doctor Strange",
    "imposter": "Iron Man",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "ant-man::spider-man",
    "agent": "Ant-Man",
    "imposter": "Spider-Man",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "green arrow::hawkeye",
    "agent": "Hawkeye",
    "imposter": "Green Arrow",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "aquaman::thor",
    "agent": "Aquaman",
    "imposter": "Thor",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "black widow::wonder woman",
    "agent": "Wonder Woman",
    "imposter": "Black Widow",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "spider-man::venom",
    "agent": "Venom",
    "imposter": "Spider-Man",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "loki::thor",
    "agent": "Loki",
    "imposter": "Thor",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "inception::matrix",
    "agent": "Matrix",
    "imposter": "Inception",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "avengers::the dark knight",
    "agent": "The Dark Knight",
    "imposter": "Avengers",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "pirates of the caribbean::titanic",
    "agent": "Pirates of the Caribbean",
    "imposter": "Titanic",
    "category": "superheroes_hollywood",
    "difficulty": "medium"
  },
  {
    "id": "iron man::shaktimaan",
    "agent": "Shaktimaan",
    "imposter": "Iron Man",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "krrish::spider-man",
    "agent": "Krrish",
    "imposter": "Spider-Man",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "joker::thanos",
    "agent": "Joker",
    "imposter": "Thanos",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "bruce wayne::tony stark",
    "agent": "Bruce Wayne",
    "imposter": "Tony Stark",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "clark kent::peter parker",
    "agent": "Clark Kent",
    "imposter": "Peter Parker",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "g.one (ra.one)::terminator",
    "agent": "G.One (Ra.One)",
    "imposter": "Terminator",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "avatar::avengers",
    "agent": "Avatar",
    "imposter": "Avengers",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "inception::titanic",
    "agent": "Titanic",
    "imposter": "Inception",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "godzilla::jurassic park",
    "agent": "Jurassic Park",
    "imposter": "Godzilla",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "harry potter::percy jackson",
    "agent": "Harry Potter",
    "imposter": "Percy Jackson",
    "category": "superheroes_hollywood",
    "difficulty": "hard"
  },
  {
    "id": "aeroplane::train",
    "agent": "Train",
    "imposter": "Aeroplane",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bicycle::motorcycle",
    "agent": "Bicycle",
    "imposter": "Motorcycle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "aeroplane::helicopter",
    "agent": "Helicopter",
    "imposter": "Aeroplane",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bus::train",
    "agent": "Bus",
    "imposter": "Train",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "auto rickshaw::taxi",
    "agent": "Auto Rickshaw",
    "imposter": "Taxi",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "boat::truck",
    "agent": "Boat",
    "imposter": "trcuk",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "yatch::submarine",
    "agent": "Submarine",
    "imposter": "yatch",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "tractor::truck",
    "agent": "Truck",
    "imposter": "Tractor",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bicycle::scooter",
    "agent": "Scooter",
    "imposter": "Bicycle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "local train::metro",
    "agent": "Metro",
    "imposter": "Local Train",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "ambulance::police car",
    "agent": "Ambulance",
    "imposter": "Police Car",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "ambulance::fire engine",
    "agent": "Fire Engine",
    "imposter": "Ambulance",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bullock cart::tractor",
    "agent": "Bullock Cart",
    "imposter": "Tractor",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "auto rickshaw::horse carriage",
    "agent": "Horse Carriage",
    "imposter": "Auto Rickshaw",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cable car::ferris wheel",
    "agent": "Cable Car",
    "imposter": "Ferris Wheel",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "hospital::school",
    "agent": "Hospital",
    "imposter": "School",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "airport::railway station",
    "agent": "Airport",
    "imposter": "Railway Station",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cinema hall::shopping mall",
    "agent": "Cinema Hall",
    "imposter": "Shopping Mall",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bank::post office",
    "agent": "Bank",
    "imposter": "Post Office",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "hotel::restaurant",
    "agent": "Hotel",
    "imposter": "Restaurant",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "courtroom::police station",
    "agent": "Police Station",
    "imposter": "Courtroom",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "court room::library",
    "agent": "court room",
    "imposter": "library",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "church::temple",
    "agent": "Temple",
    "imposter": "church",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "church::mosque",
    "agent": "Mosque",
    "imposter": "Church",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "circus::zoo",
    "agent": "Zoo",
    "imposter": "Circus",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "Food court::museum",
    "agent": "Museum",
    "imposter": "Food court",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "garden::farm",
    "agent": "farm",
    "imposter": "Garden",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "Water-park::stadium",
    "agent": "Water-park",
    "imposter": "Stadium",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "swimming pool::garden",
    "agent": "Swimming Pool",
    "imposter": "garden",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "gym::yoga centre",
    "agent": "Gym",
    "imposter": "Yoga Centre",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "petrol pump::Garage",
    "agent": "Petrol Pump",
    "imposter": "garage",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "market::Hospital",
    "agent": "Market",
    "imposter": "Hospital",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "hospital::supermarket",
    "agent": "Supermarket",
    "imposter": "Hospital",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bakery::sweet shop",
    "agent": "Bakery",
    "imposter": "Sweet Shop",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "college::school",
    "agent": "College",
    "imposter": "School",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "red fort::taj mahal",
    "agent": "Taj Mahal",
    "imposter": "Red Fort",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "india gate::qutub minar",
    "agent": "Qutub Minar",
    "imposter": "India Gate",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "gateway of india::howrah bridge",
    "agent": "Gateway of India",
    "imposter": "Howrah Bridge",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "golden temple::statue of unity",
    "agent": "Golden Temple",
    "imposter": "Statue of Unity",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "charminar::laal killa",
    "agent": "Charminar",
    "imposter": "laal killa",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "gateway of india::red fort",
    "agent": "Red Fort",
    "imposter": "Gateway of India",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "qutub minar::taj mahal",
    "agent": "Taj Mahal",
    "imposter": "Qutub Minar",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "howrah bridge::victoria memorial",
    "agent": "Victoria Memorial",
    "imposter": "Howrah Bridge",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "goa beach::marine drive",
    "agent": "Marine Drive",
    "imposter": "Goa Beach",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "dal lake::himalyas",
    "agent": "Dal Lake",
    "imposter": "himalyas",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "himalayas::mount everest",
    "agent": "Mount Everest",
    "imposter": "Himalayas",
    "category": "mainstream",
    "difficulty": "easy"
  },
  
  {
    "id": "laptop::mobile phone",
    "agent": "Mobile Phone",
    "imposter": "Laptop",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cinema projector::television",
    "agent": "Television",
    "imposter": "Cinema Projector",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "smartwatch::wall clock",
    "agent": "Smartwatch",
    "imposter": "Wall Clock",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "microwave oven::refrigerator",
    "agent": "Refrigerator",
    "imposter": "Microwave Oven",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "dishwasher::oven",
    "agent": "oven",
    "imposter": "Dishwasher",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "air conditioner::tubelight",
    "agent": "tubelight",
    "imposter": "Air Conditioner",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "camera::mobile phone",
    "agent": "Camera",
    "imposter": "Mobile Phone",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "earphones::headphones",
    "agent": "Headphones",
    "imposter": "Earphones",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "computer mouse::keyboard",
    "agent": "Computer Mouse",
    "imposter": "Keyboard",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "laptop::tablet (ipad)",
    "agent": "Tablet (iPad)",
    "imposter": "Laptop",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "candle::torch (flashlight)",
    "agent": "Torch (Flashlight)",
    "imposter": "Candle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "iron (press)::washing machine",
    "agent": "Iron (Press)",
    "imposter": "Washing Machine",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "mixer grinder::printer",
    "agent": "Mixer Grinder",
    "imposter": "printer",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "refrigerator::water purifier",
    "agent": "Water Purifier",
    "imposter": "Refrigerator",
    "category": "mainstream",
    "difficulty": "easy"
  },
 
  
  {
    "id": "earphones::sunglasses",
    "agent": "Sunglasses",
    "imposter": "Eyeglasses",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cap::helmet",
    "agent": "Helmet",
    "imposter": "Cap",
    "category": "mainstream",
    "difficulty": "easy"
  },
  
  
  {
    "id": "chair::sofa",
    "agent": "Chair",
    "imposter": "Sofa",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "dining table::study table",
    "agent": "Dining Table",
    "imposter": "Study Table",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bed::mat",
    "agent": "Bed",
    "imposter": "Mat",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "blanket::pillow",
    "agent": "Pillow",
    "imposter": "Blanket",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bedsheet::towel",
    "agent": "Towel",
    "imposter": "Bedsheet",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bucket::glass",
    "agent": "Bucket",
    "imposter": "glass",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "soap::toothbrush",
    "agent": "Toothbrush",
    "imposter": "Soap",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": " oil::shampoo",
    "agent": "Shampoo",
    "imposter": " Oil",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "comb::hairbrush",
    "agent": "Comb",
    "imposter": "Hairbrush",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "spoon::scissors",
    "agent": "Scissors",
    "imposter": "spoon",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "key::lock",
    "agent": "Lock",
    "imposter": "Key",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "pen::pencil",
    "agent": "Pen",
    "imposter": "Pencil",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "diary::notebook",
    "agent": "Notebook",
    "imposter": "Diary",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "eraser::sharpener",
    "agent": "Eraser",
    "imposter": "Sharpener",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "school bag::water bottle",
    "agent": "School Bag",
    "imposter": "Water Bottle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "lunch box::water bottle",
    "agent": "Lunch Box",
    "imposter": "Water Bottle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bed cover::curtains",
    "agent": "Curtains",
    "imposter": "Bed Cover",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "lion::squirrel",
    "agent": "squirrel",
    "imposter": "Lion",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "camel::elephant",
    "agent": "Elephant",
    "imposter": "Camel",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cat::mouse",
    "agent": "mouse",
    "imposter": "Cat",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "donkey::horse",
    "agent": "Horse",
    "imposter": "Donkey",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "sheep::cow",
    "agent": "Cow",
    "imposter": "sheep",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "fox::sheep",
    "agent": "fox",
    "imposter": "Sheep",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "chimpanzee::Lion",
    "agent": "Lion",
    "imposter": "Chimpanzee",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "parrot::peacock",
    "agent": "Peacock",
    "imposter": "Parrot",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "crow::pigeon",
    "agent": "Crow",
    "imposter": "Pigeon",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "eagle::sparrow",
    "agent": "Eagle",
    "imposter": "Sparrow",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "duck::piegon",
    "agent": "Duck",
    "imposter": "piegon",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "lizard::snake",
    "agent": "Snake",
    "imposter": "Lizard",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "Turtle::crocodile",
    "agent": "Crocodile",
    "imposter": "Turtle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  
  {
    "id": "rabbit::Turtle",
    "agent": "Rabbit",
    "imposter": "Turtle",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "Cat::zebra",
    "agent": "Cat",
    "imposter": "Zebra",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "elephant::giraffe",
    "agent": "Giraffe",
    "imposter": "Elephant",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bear::panda",
    "agent": "Bear",
    "imposter": "Panda",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "dog::wolf",
    "agent": "Wolf",
    "imposter": "dog",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "dolphin::Shark",
    "agent": "Dolphin",
    "imposter": "Shark",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "doctor::nurse",
    "agent": "Doctor",
    "imposter": "Nurse",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "professor::teacher",
    "agent": "Teacher",
    "imposter": "Professor",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "air hostess::pilot",
    "agent": "Pilot",
    "imposter": "Air Hostess",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "police officer::soldier",
    "agent": "Police Officer",
    "imposter": "Soldier",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "judge::lawyer",
    "agent": "Lawyer",
    "imposter": "Judge",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "chef::waiter",
    "agent": "Chef",
    "imposter": "Waiter",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "farmer::gardener",
    "agent": "Farmer",
    "imposter": "Gardener",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "conductor::driver",
    "agent": "Driver",
    "imposter": "Conductor",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "writer::postman",
    "agent": "Postman",
    "imposter": "Writer",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "electrician::plumber",
    "agent": "Electrician",
    "imposter": "Plumber",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "carpenter::electrician",
    "agent": "Carpenter",
    "imposter": "electrician",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "fashion designer:: barber",
    "agent": "Barber",
    "imposter": "Fashion Designer",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "astronaut::scientist",
    "agent": "Astronaut",
    "imposter": "Scientist",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "firefighter::police officer",
    "agent": "Firefighter",
    "imposter": "Police Officer",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cameraman::director",
    "agent": "director",
    "imposter": "Cameraman",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "moon::sun",
    "agent": "Sun",
    "imposter": "Moon",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "planets::cloud",
    "agent": "cloud",
    "imposter": "Planets",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "cloud::star",
    "agent": "Cloud",
    "imposter": "star",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "snow::thunder",
    "agent": "Thunder",
    "imposter": "snow",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "rainbow::sunrise",
    "agent": "Rainbow",
    "imposter": "Sunrise",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "sunrise::sunset",
    "agent": "Sunset",
    "imposter": "Sunrise",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "hill::building",
    "agent": "building",
    "imposter": "Hill",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "ocean::iceberg",
    "agent": "iceberg",
    "imposter": "Ocean",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "lake::hill",
    "agent": "hill",
    "imposter": "Lake",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "forest::river bank",
    "agent": "Forest",
    "imposter": "river bank",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "desert::island",
    "agent": "Desert",
    "imposter": "Island",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "hailstorm::heatwave",
    "agent": "Heatwave",
    "imposter": "Hailstorm",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "evening::morning",
    "agent": "Morning",
    "imposter": "Evening",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "summer::winter",
    "agent": "Summer",
    "imposter": "Winter",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "monsoon::spring",
    "agent": "Monsoon",
    "imposter": "Spring",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bicycle::skateboard",
    "agent": "Bicycle",
    "imposter": "Skateboard",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "coffee shop::tapri",
    "agent": "Coffee Shop",
    "imposter": "Tapri",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "elevator (lift)::escalator",
    "agent": "Elevator (Lift)",
    "imposter": "Escalator",
    "category": "mainstream",
    "difficulty": "easy"
  },
  
  {
    "id": "ceiling::floor",
    "agent": "floor",
    "imposter": "Ceiling",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "shoe::watch",
    "agent": "Shoe",
    "imposter": "watch",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "jeans::t-shirt",
    "agent": "Jeans",
    "imposter": "T-Shirt",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "jacket::hat",
    "agent": "hat",
    "imposter": "Jacket",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "belt::tie",
    "agent": "Belt",
    "imposter": "Tie",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "necklace::ring",
    "agent": "Ring",
    "imposter": "Necklace",
    "category": "mainstream",
    "difficulty": "easy"
  },
  {
    "id": "bus stand::railway station",
    "agent": "Railway Station",
    "imposter": "Bus Stand",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "airport::metro station",
    "agent": "Metro Station",
    "imposter": "Airport",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "courier office::post office",
    "agent": "Post Office",
    "imposter": "Courier Office",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "toll plaza::traffic signal",
    "agent": "Toll Plaza",
    "imposter": "Traffic Signal",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "flyover::underpass",
    "agent": "Flyover",
    "imposter": "Underpass",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "bridge::tunnel",
    "agent": "Bridge",
    "imposter": "Tunnel",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "high court::police station",
    "agent": "High Court",
    "imposter": "Supreme Court",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  {
    "id": "embassy::passport office",
    "agent": "Embassy",
    "imposter": "Passport Office",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  {
    "id": "lighthouse:: submarine",
    "agent": "Lighthouse",
    "imposter": "submarine",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "fort::palace",
    "agent": "Fort",
    "imposter": "Palace",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  
  {
    "id": "beach::dam",
    "agent": "beach",
    "imposter": "Dam",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "lake::reservoir",
    "agent": "Reservoir",
    "imposter": "Lake",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "briefcase::wallet",
    "agent": "wallet",
    "imposter": "Briefcase",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "backpack::wallet",
    "agent": "wallet",
    "imposter": "Backpack",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "handbag::pocket",
    "agent": "Handbag",
    "imposter": "pocket",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "bottle opener::pocket knife",
    "agent": "Pocket Knife",
    "imposter": "Bottle Opener",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  
  {
    "id": "carrom coin::carrom striker",
    "agent": "Carrom Striker",
    "imposter": "Carrom Coin",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "chess knight::chess pawn",
    "agent": "Chess Pawn",
    "imposter": "Chess Knight",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "board game::playing card",
    "agent": "Playing Card",
    "imposter": "Board Game",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "coin::dice",
    "agent": "Dice",
    "imposter": "Coin",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "measuring tape:: pechkas",
    "agent": "Measuring Tape",
    "imposter": "pechkas",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "abacus::calculator",
    "agent": "Calculator",
    "imposter": "Abacus",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "sharpner::stapler",
    "agent": "Stapler",
    "imposter": "sharpner",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "glue ::remover",
    "agent": "Glue ",
    "imposter": "remover",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "envelope::Debit card",
    "agent": "Envelope",
    "imposter": "Debit card",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "signature::stamp",
    "agent": "Stamp",
    "imposter": "Signature",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "cheque book::Passport",
    "agent": "Cheque Book",
    "imposter": "Passport",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "ghat::beach",
    "agent": "Ghat",
    "imposter": "beach",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  {
    "id": "glacier::iceberg",
    "agent": "Glacier",
    "imposter": "Iceberg",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  {
    "id": "cave:: mountain",
    "agent": "Cave",
    "imposter": "mountain",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "geyser::volcano",
    "agent": "Volcano",
    "imposter": "Geyser",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "island::peninsula",
    "agent": "Peninsula",
    "imposter": "Island",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "bay::gulf",
    "agent": "Bay",
    "imposter": "Gulf",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "plain::plateau",
    "agent": "Plateau",
    "imposter": "Plain",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "equator::tropic of cancer",
    "agent": "Equator",
    "imposter": "Tropic of Cancer",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "cyclone::tornado",
    "agent": "Cyclone",
    "imposter": "Tornado",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "earthquake::tsunami",
    "agent": "Earthquake",
    "imposter": "Tsunami",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "drought::flood",
    "agent": "Drought",
    "imposter": "Flood",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "lunar eclipse::solar eclipse",
    "agent": "Solar Eclipse",
    "imposter": "Lunar Eclipse",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "comet::shooting star",
    "agent": "Shooting Star",
    "imposter": "Comet",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "joint family::nuclear family",
    "agent": "Joint Family",
    "imposter": "Nuclear Family",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "town ::village ",
    "agent": "Village ",
    "imposter": "Town )",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  {
    "id": "bungalow::society building",
    "agent": "Society Building",
    "imposter": "Bungalow",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "balcony::room",
    "agent": "room",
    "imposter": "Balcony",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "courtyard ::terrace",
    "agent": "Courtyard ",
    "imposter": "terrace",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "dining room::kitchen",
    "agent": "Kitchen",
    "imposter": "Dining Room",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "bed room::living room",
    "agent": "Living Room",
    "imposter": "Bed Room",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "Dining table::basement",
    "agent": "Dining table",
    "imposter": "Basement",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "garage::porch",
    "agent": "Garage",
    "imposter": "Porch",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "gatekeeper :: electrician",
    "agent": "Gatekeeper ",
    "imposter": "electrician",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "garbage collector::washing machine",
    "agent": "washing machine",
    "imposter": "Garbage Collector",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "milkman ::newspaper delivery boy",
    "agent": "Milkman",
    "imposter": "Newspaper Delivery Boy",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "fruit vendor::vegetable vendor",
    "agent": "Vegetable Vendor ",
    "imposter": "Fruit Vendor",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "water-purifier::dry cleaner",
    "agent": "water-purifier",
    "imposter": "Dry Cleaner",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "farming::camping",
    "agent": "camping",
    "imposter": "Farming",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "baking::refrigirating",
    "agent": "refrigirating",
    "imposter": "Baking",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "dancing::running",
    "agent": "running",
    "imposter": "Dancing",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "painting::breaking",
    "agent": "Painting",
    "imposter": "breaking",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "reading::writing",
    "agent": "Reading",
    "imposter": "Writing",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "sky-diving::swimming",
    "agent": "Swimming",
    "imposter": "Sky-Diving",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "cycling::running",
    "agent": "Cycling",
    "imposter": "Running",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "camping::movie",
    "agent": "movie",
    "imposter": "Camping",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "boating::bunjee-jumping",
    "agent": "bunjee-jumping",
    "imposter": "Boating",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "bird watching::fishing",
    "agent": "Bird Watching",
    "imposter": "fishing",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "photography::cooking",
    "agent": "Photography",
    "imposter": "cooking",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "acting::directing",
    "agent": "Acting",
    "imposter": "Directing",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "magic show::puppet show",
    "agent": "Magic Show",
    "imposter": "Puppet Show",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "street play::theatre play",
    "agent": "Street Play ",
    "imposter": "Theatre Play",
    "category": "mainstream",
    "difficulty": "medium"
  },
  
  {
    "id": "passport::liabrary-card",
    "agent": "Passport",
    "imposter": "liabrary-card",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "aadhaar card::pan card",
    "agent": "Aadhaar Card",
    "imposter": "PAN Card",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "driving licence::voter id",
    "agent": "Voter ID",
    "imposter": "Driving Licence",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "atm machine::bank branch",
    "agent": "ATM Machine",
    "imposter": "Bank Branch",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "electricity bill::water bill",
    "agent": "Electricity Bill",
    "imposter": "Water Bill",
    "category": "mainstream",
    "difficulty": "medium"
  },
  {
    "id": "submarine::train",
    "agent": "Train",
    "imposter": "Submarine",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "aeroplane::satellite",
    "agent": "Aeroplane",
    "imposter": "Satellite",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "bicycle::bullock cart",
    "agent": "Bicycle",
    "imposter": "Bullock Cart",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "eiffel tower::taj mahal",
    "agent": "Taj Mahal",
    "imposter": "Eiffel Tower",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "great wall of china::red fort",
    "agent": "Red Fort",
    "imposter": "Great Wall of China",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "moon::mount everest",
    "agent": "Mount Everest",
    "imposter": "Moon",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "amazon river::ganga river",
    "agent": "Ganga River",
    "imposter": "Amazon River",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "doctor::judge",
    "agent": "Doctor",
    "imposter": "Judge",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "astronaut::pilot",
    "agent": "Pilot",
    "imposter": "Astronaut",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "detective::police officer",
    "agent": "Police Officer",
    "imposter": "Detective",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "librarian::teacher",
    "agent": "Teacher",
    "imposter": "Librarian",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "chef::farmer",
    "agent": "Chef",
    "imposter": "Farmer",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "hospital::hotel",
    "agent": "Hospital",
    "imposter": "Hotel",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "prison::school",
    "agent": "School",
    "imposter": "Prison",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "airport::space station",
    "agent": "Airport",
    "imposter": "Space Station",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "internet::library",
    "agent": "Library",
    "imposter": "Internet",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "cinema hall::stadium",
    "agent": "Cinema Hall",
    "imposter": "Stadium",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "bank::casino",
    "agent": "Bank",
    "imposter": "Casino",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "pyramid::temple",
    "agent": "Temple",
    "imposter": "Pyramid",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "national park::zoo",
    "agent": "Zoo",
    "imposter": "National Park",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "mobile phone::typewriter",
    "agent": "Mobile Phone",
    "imposter": "Typewriter",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "radio::television",
    "agent": "Television",
    "imposter": "Radio",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "smartwatch::sundial",
    "agent": "Smartwatch",
    "imposter": "Sundial",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "earthen pot (matka)::refrigerator",
    "agent": "Refrigerator",
    "imposter": "Earthen Pot (Matka)",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "air conditioner::hand fan (pankha)",
    "agent": "Air Conditioner",
    "imposter": "Hand Fan (Pankha)",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "camera::microscope",
    "agent": "Camera",
    "imposter": "Microscope",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "camera::telescope",
    "agent": "Telescope",
    "imposter": "camera",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "night vision goggles::sunglasses",
    "agent": "Sunglasses",
    "imposter": "Night Vision Goggles",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "parachute::umbrella",
    "agent": "Umbrella",
    "imposter": "Parachute",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "backpack::treasure chest",
    "agent": "Backpack",
    "imposter": "Treasure Chest",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "crown::helmet",
    "agent": "Helmet",
    "imposter": "Crown",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "safe (locker)::wallet",
    "agent": "Wallet",
    "imposter": "Safe (Locker)",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "mirror::periscope",
    "agent": "Mirror",
    "imposter": "Periscope",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "handcuffs::lock",
    "agent": "Lock",
    "imposter": "Handcuffs",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "clock::hourglass",
    "agent": "Clock",
    "imposter": "Hourglass",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "compass::gps",
    "agent": "Compass",
    "imposter": "GPS",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "newspaper::scroll",
    "agent": "Newspaper",
    "imposter": "Scroll",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "book::tablet (device)",
    "agent": "Book",
    "imposter": "Tablet (Device)",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "email::letter",
    "agent": "Letter",
    "imposter": "Email",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "coin::credit card",
    "agent": "Coin",
    "imposter": "Credit Card",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "dragon::tiger",
    "agent": "Tiger",
    "imposter": "Dragon",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "elephant::mammoth",
    "agent": "Elephant",
    "imposter": "Mammoth",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "peacock::phoenix",
    "agent": "Peacock",
    "imposter": "Phoenix",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "cow::deer",
    "agent": "Cow",
    "imposter": "Deer",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "dog::wolf",
    "agent": "Dog",
    "imposter": "Wolf",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "dolphin::mermaid",
    "agent": "Dolphin",
    "imposter": "Mermaid",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "bonfire::sun",
    "agent": "Sun",
    "imposter": "Bonfire",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "mirror::moon",
    "agent": "Moon",
    "imposter": "Mirror",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "prism::rainbow",
    "agent": "Rainbow",
    "imposter": "Prism",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "electric shock::lightning",
    "agent": "Lightning",
    "imposter": "Electric Shock",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "fountain::waterfall",
    "agent": "Waterfall",
    "imposter": "Fountain",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "beach::desert",
    "agent": "Desert",
    "imposter": "Beach",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "forest::garden",
    "agent": "Forest",
    "imposter": "Garden",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "island::ship",
    "agent": "Island",
    "imposter": "Ship",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "earthquake::roller coaster",
    "agent": "Earthquake",
    "imposter": "Roller Coaster",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "morning alarm::school bell",
    "agent": "Morning Alarm",
    "imposter": "School Bell",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "lighthouse::traffic light",
    "agent": "Traffic Light",
    "imposter": "Lighthouse",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "banner::flag",
    "agent": "Flag",
    "imposter": "Banner",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "boarding pass::passport",
    "agent": "Passport",
    "imposter": "Boarding Pass",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "medal::trophy",
    "agent": "Trophy",
    "imposter": "Medal",
    "category": "mainstream",
    "difficulty": "hard"
  },
  {
    "id": "amul butter::coca-cola",
    "agent": "Amul Butter",
    "imposter": "coca-cola",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "yippe noodles::parle-g",
    "agent": "Parle-G",
    "imposter": "yippe noodles",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "britannia bourbon::oreo",
    "agent": "Britannia Bourbon",
    "imposter": "Oreo",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "maggi noodles::top ramen",
    "agent": "Maggi Noodles",
    "imposter": "Top Ramen",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "maggi noodles::Frankie",
    "agent": "Maggi Noodles",
    "imposter": "Frankie",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "Belgian waffle::haldiram's bhujia",
    "agent": "Haldiram's Bhujia",
    "imposter": "Belgian waffle",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "kurkure::lays chips",
    "agent": "Kurkure",
    "imposter": "Lays Chips",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "bingo mad angles:: jeera rice",
    "agent": "Bingo Mad Angles",
    "imposter": "jeera rice",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "frooti::coffee",
    "agent": "Frooti",
    "imposter": "coffee",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "maaza::jeera soda",
    "agent": "Maaza",
    "imposter": "jeera soda",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "neem juice::thums up",
    "agent": "Thums Up",
    "imposter": "neem juice",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "limca::Feastables",
    "agent": "Limca",
    "imposter": "Feastables",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "coca-cola::rose sharbat",
    "agent": "rose sharbat",
    "imposter": "Coca-Cola",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "5 star::dairy milk",
    "agent": "Dairy Milk",
    "imposter": "5 Star",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "kitkat::crunchex",
    "agent": "KitKat",
    "imposter": "crunchex",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "Bounty bar::pulse candy",
    "agent": "Pulse Candy",
    "imposter": "Bounty Bar",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "dettol::clinic plus",
    "agent": "Dettol",
    "imposter": "clinic plus",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "lux soap::vaseline",
    "agent": "vaseline",
    "imposter": "Lux Soap",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "colgate::patanjali",
    "agent": "Colgate",
    "imposter": "patanjali",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "Dolo 360::zandu balm",
    "agent": "Zandu Balm",
    "imposter": "Dolo 360",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "iodex::nicotex",
    "agent": "Nicotex",
    "imposter": "Iodex",
    "category": "brands",
    "difficulty": "easy"
  },
  
  {
    "id": "airtel::Boat",
    "agent": "Boat",
    "imposter": "Airtel",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "instagram::whatsapp",
    "agent": "WhatsApp",
    "imposter": "Instagram",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "swiggy::zomato",
    "agent": "Swiggy",
    "imposter": "Zomato",
    "category": "brands",
    "difficulty": "easy"
  },
  {
    "id": "aashirvaad atta::tata salt",
    "agent": "Tata Salt",
    "imposter": "Aashirvaad Atta",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "red label tea::Davidoff coffee",
    "agent": "Davidoff coffee",
    "imposter": "Red Label Tea",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "taj mahal tea::wagh bakri tea",
    "agent": "Taj Mahal Tea",
    "imposter": "Wagh Bakri Tea",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "bru coffee::chai",
    "agent": "chai",
    "imposter": "Bru Coffee",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "bournvita::horlicks",
    "agent": "Bournvita",
    "imposter": "Horlicks",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "bournvita::complan",
    "agent": "Complan",
    "imposter": "Bournvita",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "boroline::vicco turmeric",
    "agent": "Vicco Turmeric",
    "imposter": "Boroline",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "vicks::vaseline",
    "agent": "Vaseline",
    "imposter": "vicks",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "navratna oil::parachute coconut oil",
    "agent": "Navratna Oil",
    "imposter": "Parachute Coconut Oil",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "bajaj almond drops::dabur amla oil",
    "agent": "Bajaj Almond Drops",
    "imposter": "Dabur Amla Oil",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "google pay::phonepe",
    "agent": "PhonePe",
    "imposter": "Google Pay",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "paytm::phonepe",
    "agent": "Paytm",
    "imposter": "PhonePe",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "amazon::flipkart",
    "agent": "Amazon",
    "imposter": "Flipkart",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "blinkit::zepto",
    "agent": "Blinkit",
    "imposter": "Zepto",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "ola::uber",
    "agent": "Uber",
    "imposter": "Ola",
    "category": "brands",
    "difficulty": "medium"
  },
  {
    "id": "amul::tata",
    "agent": "Amul",
    "imposter": "Tata",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "amul butter::parle-g",
    "agent": "Parle-G",
    "imposter": "Amul Butter",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "kurkure::maggi noodles",
    "agent": "Maggi Noodles",
    "imposter": "Kurkure",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "frooti::thums up",
    "agent": "Frooti",
    "imposter": "Thums Up",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "colgate::dettol",
    "agent": "Dettol",
    "imposter": "Colgate",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "jio::whatsapp",
    "agent": "Jio",
    "imposter": "WhatsApp",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "netflix::youtube",
    "agent": "YouTube",
    "imposter": "Netflix",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "amazon::swiggy",
    "agent": "Swiggy",
    "imposter": "Amazon",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "bata::woodland",
    "agent": "Bata",
    "imposter": "Woodland",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "bajaj auto::hero motocorp",
    "agent": "Hero MotoCorp",
    "imposter": "Bajaj Auto",
    "category": "brands",
    "difficulty": "hard"
  },
  {
    "id": "diwali::holi",
    "agent": "Diwali",
    "imposter": "Holi",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  
  {
    "id": "ganesh chaturthi::navratri",
    "agent": "Ganesh Chaturthi",
    "imposter": "Navratri",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "diwali::eid ul-fitr",
    "agent": "Eid ul-Fitr",
    "imposter": "Diwali",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "christmas::eid",
    "agent": "Christmas",
    "imposter": "Eid",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "christmas::diwali",
    "agent": "Christmas",
    "imposter": "Diwali",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "janmashtami::mahashivratri",
    "agent": "Mahashivratri",
    "imposter": "Janmashtami",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
 
  
  {
    "id": "jagannath rath yatra::kumbh mela",
    "agent": "Jagannath Rath Yatra",
    "imposter": "Kumbh Mela",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "basant panchami::holi",
    "agent": "Holi",
    "imposter": "Basant Panchami",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "diya::rangoli",
    "agent": "Diya",
    "imposter": "Rangoli",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "firecrackers:: rangoli",
    "agent": "Firecrackers",
    "imposter": "rangoli",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "gulal::pichkari",
    "agent": "Pichkari",
    "imposter": "Gulal",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "dandiya::garba",
    "agent": "Dandiya",
    "imposter": "Garba",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "modak::puri",
    "agent": "Modak",
    "imposter": "puri",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "matcha::thandai",
    "agent": "matcha",
    "imposter": "Thandai",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "kheer::chaas",
    "agent": "chaas",
    "imposter": "Kheer",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "rakhi::sweets",
    "agent": "Rakhi",
    "imposter": "Sweets",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "ganga aarti::ganpati pandal",
    "agent": "Ganga Aarti",
    "imposter": "ganpati Pandal",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  
  {
    "id": "dhol tasha::garba",
    "agent": "Dhol Tasha",
    "imposter": "Garba",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "carrom::ludo",
    "agent": "Ludo",
    "imposter": "Carrom",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "carrom::chess",
    "agent": "Chess",
    "imposter": "Carrom",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "ludo::snakes and ladders",
    "agent": "Snakes and Ladders",
    "imposter": "Ludo",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "antakshari::dumb charades",
    "agent": "Antakshari",
    "imposter": "Dumb Charades",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "ludo::tambola (housie)",
    "agent": "Tambola (Housie)",
    "imposter": "Ludo",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "kabaddi::kho-kho",
    "agent": "Kho-Kho",
    "imposter": "Kabaddi",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "cricket::gilli danda",
    "agent": "Gilli Danda",
    "imposter": "Cricket",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "hide and seek::musical chairs",
    "agent": "Hide and Seek",
    "imposter": "Musical Chairs",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "antakshri::uno",
    "agent": "UNO",
    "imposter": "antakshri",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "business (board game)::UNO",
    "agent": "UNO",
    "imposter": "Business (Board Game)",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "gilli danda::ludo",
    "agent": "ludo",
    "imposter": "Gilli Danda",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "hide and seek:: chess",
    "agent": "chess",
    "imposter": "Hide and Seek",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "kabaddi::tug of war",
    "agent": "Tug of War",
    "imposter": "Kabaddi",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "kurta::sari",
    "agent": "Sari",
    "imposter": "Kurta",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "dhoti:: bandage",
    "agent": "Dhoti",
    "imposter": "bandage",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "hat::turban (pagri)",
    "agent": "Turban (Pagri)",
    "imposter": "hat",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "bangles (choodi)::jhumka",
    "agent": "Jhumka",
    "imposter": "Bangles (Choodi)",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "agarbatti:: candle",
    "agent": "Agarbatti",
    "imposter": "candle",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "rudraksha:: badam",
    "agent": "Rudraksha",
    "imposter": "badam",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "shankh (conch)::temple bell (ghanti)",
    "agent": "Shankh (Conch)",
    "imposter": "Temple Bell (Ghanti)",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "coconut (shreefal):: orange",
    "agent": "orange",
    "imposter": "Coconut (Shreefal)",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "laddoo:: chewing-gum",
    "agent": "chewing-gum",
    "imposter": "Laddoo",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "haldi ceremony::divorce",
    "agent": "Haldi Ceremony",
    "imposter": "divorce",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  {
    "id": "baraat::sangeet",
    "agent": "Baraat",
    "imposter": "Sangeet",
    "category": "festivals_culture",
    "difficulty": "easy"
  },
  
  {
    "id": "karwa chauth::raksha bandhan",
    "agent": "Karwa Chauth",
    "imposter": "Raksha Bandhan",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "chhath puja::makar sankranti",
    "agent": "Makar Sankranti",
    "imposter": "Chhath Puja",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "onam:: independence day",
    "agent": "Onam",
    "imposter": "independence day",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "dussehra::ram navami",
    "agent": "Dussehra",
    "imposter": "Ram Navami",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "ganesh chaturthi::janmashtami",
    "agent": "Janmashtami",
    "imposter": "Ganesh Chaturthi",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "mahashivratri::navratri",
    "agent": "Mahashivratri",
    "imposter": "Navratri",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "buddha purnima::mahavir jayanti",
    "agent": "Buddha Purnima",
    "imposter": "Mahavir Jayanti",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "easter::good friday",
    "agent": "Good Friday",
    "imposter": "Easter",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "bhai dooj:: Diwali",
    "agent": " Diwali",
    "imposter": "Bhai Dooj",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "bhai dooj::govardhan puja",
    "agent": "Govardhan Puja",
    "imposter": "Bhai Dooj",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "kite flying::Holi",
    "agent": "Kite Flying",
    "imposter": "Holi",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "holika dahan:: makar-sankranti",
    "agent": "Holika Dahan",
    "imposter": "Makar sankranti",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "kite-festival::ganesh visarjan",
    "agent": "Ganesh Visarjan",
    "imposter": "kite-festival",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  
  {
    "id": "ganga ghat::kedarnath",
    "agent": "Ganga Ghat",
    "imposter": "kedarnath",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  
  {
    "id": "bhangra::hip-hop",
    "agent": "Bhangra",
    "imposter": "hip-hop",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "garba::lavani",
    "agent": "Lavani",
    "imposter": "Garba",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  
  
  {
    "id": "flute (bansuri)::shehnai",
    "agent": "Flute (Bansuri)",
    "imposter": "Shehnai",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "harmonium::tabla",
    "agent": "Harmonium",
    "imposter": "Tabla",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "carrom board::chess board",
    "agent": "Carrom Board",
    "imposter": "Chess Board",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "ludo dice::snakes and ladders board",
    "agent": "Ludo Dice",
    "imposter": "Snakes and Ladders Board",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "poker::teen patti",
    "agent": "Teen Patti",
    "imposter": "Poker",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "bridge::rummy",
    "agent": "Rummy",
    "imposter": "Bridge",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "kabaddi::wrestling (kushti)",
    "agent": "Kabaddi",
    "imposter": "Wrestling (Kushti)",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "akhada::stadium",
    "agent": "Akhada",
    "imposter": "Stadium",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
 
   
  
  {
    "id": "bhang::thandai",
    "agent": "Bhang",
    "imposter": "Thandai",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
    
  {
    "id": "ayurveda::yoga",
    "agent": "Ayurveda",
    "imposter": "Yoga",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "meditation::pranayama",
    "agent": "Pranayama",
    "imposter": "Meditation",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "bow::namaskar",
    "agent": "Namaskar",
    "imposter": "Bow",
    "category": "festivals_culture",
    "difficulty": "medium"
  },
  {
    "id": "diwali::lantern festival",
    "agent": "Diwali",
    "imposter": "Lantern Festival",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "holi::la tomatina",
    "agent": "Holi",
    "imposter": "La Tomatina",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "dussehra::halloween",
    "agent": "Dussehra",
    "imposter": "Halloween",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "friendship day::raksha bandhan",
    "agent": "Raksha Bandhan",
    "imposter": "Friendship Day",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "ganesh chaturthi::thanksgiving",
    "agent": "Ganesh Chaturthi",
    "imposter": "Thanksgiving",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "kumbh mela::mecca pilgrimage (hajj)",
    "agent": "Kumbh Mela",
    "imposter": "Mecca Pilgrimage (Hajj)",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "carnival of rio::durga puja",
    "agent": "Durga Puja",
    "imposter": "Carnival of Rio",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "lohri::winter solstice",
    "agent": "Lohri",
    "imposter": "Winter Solstice",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "karwa chauth::valentine's day",
    "agent": "Karwa Chauth",
    "imposter": "Valentine's Day",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "easter::janmashtami",
    "agent": "Janmashtami",
    "imposter": "Easter",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "candle::diya",
    "agent": "Diya",
    "imposter": "Candle",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "mosaic art::rangoli",
    "agent": "Rangoli",
    "imposter": "Mosaic Art",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "dandiya stick::drumstick",
    "agent": "Dandiya Stick",
    "imposter": "Drumstick",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "communion bread::prasad",
    "agent": "Prasad",
    "imposter": "Communion Bread",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "bonfire::havan kund",
    "agent": "Havan Kund",
    "imposter": "Bonfire",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "ludo::monopoly",
    "agent": "Ludo",
    "imposter": "Monopoly",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "billiards (pool)::carrom",
    "agent": "Carrom",
    "imposter": "Billiards (Pool)",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "kabaddi::rugby",
    "agent": "Kabaddi",
    "imposter": "Rugby",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "baseball::gilli danda",
    "agent": "Gilli Danda",
    "imposter": "Baseball",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "kho-kho::tag (catch-catch)",
    "agent": "Kho-Kho",
    "imposter": "Tag (Catch-Catch)",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "antakshari::karaoke",
    "agent": "Antakshari",
    "imposter": "Karaoke",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "dumb charades::pictionary",
    "agent": "Dumb Charades",
    "imposter": "Pictionary",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "bingo::tambola",
    "agent": "Tambola",
    "imposter": "Bingo",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  
  {
    "id": "mehndi::tattoo",
    "agent": "Mehndi",
    "imposter": "Tattoo",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "handshake::namaste",
    "agent": "Namaste",
    "imposter": "Handshake",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "baraat::carnival parade",
    "agent": "Baraat",
    "imposter": "Carnival Parade",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "langar::soup kitchen",
    "agent": "Langar",
    "imposter": "Soup Kitchen",
    "category": "festivals_culture",
    "difficulty": "hard"
  },
  {
    "id": "samosa::sandwich",
    "agent": "Samosa",
    "imposter": "Sandwich",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "dosa::pav bhaji",
    "agent": "Dosa",
    "imposter": "Pav Bhaji",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "kachori::samosa",
    "agent": "Samosa",
    "imposter": "Kachori",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "bhel puri::pani puri",
    "agent": "Pani Puri",
    "imposter": "Bhel Puri",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "burger::vada pav",
    "agent": "Vada Pav",
    "imposter": "Burger",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "dosa::idli",
    "agent": "Dosa",
    "imposter": "Idli",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "chole bhature::pizza",
    "agent": "Chole Bhature",
    "imposter": "Pizza",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "fried rice::veg biryani",
    "agent": "Veg Biryani",
    "imposter": "Fried Rice",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "aloo paratha::paneer paratha",
    "agent": "Aloo Paratha",
    "imposter": "Paneer Paratha",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "gulab jamun::rasgulla",
    "agent": "Gulab Jamun",
    "imposter": "Rasgulla",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "jalebi::rabri",
    "agent": "Jalebi",
    "imposter": "Rabri",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "besan ladoo::kaju katli",
    "agent": "Kaju Katli",
    "imposter": "Besan Ladoo",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "burger::pizza",
    "agent": "Burger",
    "imposter": "Pizza",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "noodles::pasta",
    "agent": "Pasta",
    "imposter": "Noodles",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "aloo tikki::french fries",
    "agent": "French Fries",
    "imposter": "Aloo Tikki",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "momos::spring roll",
    "agent": "Momos",
    "imposter": "Spring Roll",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "dahi puri::pani puri",
    "agent": "Pani Puri",
    "imposter": "Dahi Puri",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "bhel puri::sev puri",
    "agent": "Sev Puri",
    "imposter": "Bhel Puri",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "idli::medu vada",
    "agent": "Idli",
    "imposter": "Medu Vada",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "dosa::uttapam",
    "agent": "Uttapam",
    "imposter": "Dosa",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "dhokla::khandvi",
    "agent": "Dhokla",
    "imposter": "Khandvi",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "fafda::jalebi",
    "agent": "Fafda",
    "imposter": "Jalebi",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "poha::upma",
    "agent": "Poha",
    "imposter": "Upma",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "misal pav::pav bhaji",
    "agent": "Misal Pav",
    "imposter": "Pav Bhaji",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "poha::sabudana khichdi",
    "agent": "Sabudana Khichdi",
    "imposter": "Poha",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "kadi chawal::rajma chawal",
    "agent": "Rajma Chawal",
    "imposter": "Kadi Chawal",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "dal makhani::shahi paneer",
    "agent": "Dal Makhani",
    "imposter": "Shahi Paneer",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "butter naan::tandoori roti",
    "agent": "Butter Naan",
    "imposter": "Tandoori Roti",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "ice cream::kulfi",
    "agent": "Ice Cream",
    "imposter": "Kulfi",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "gajar ka halwa::moong dal halwa",
    "agent": "Gajar Ka Halwa",
    "imposter": "Moong Dal Halwa",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "gulab jamun::rasmalai",
    "agent": "Rasmalai",
    "imposter": "Gulab Jamun",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "rasgulla::sandesh",
    "agent": "Sandesh",
    "imposter": "Rasgulla",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "gajar ka halwa::kheer",
    "agent": "Kheer",
    "imposter": "Gajar Ka Halwa",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "mango::watermelon",
    "agent": "Mango",
    "imposter": "Watermelon",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "apple::banana",
    "agent": "Apple",
    "imposter": "Banana",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "coconut::pineapple",
    "agent": "Coconut",
    "imposter": "Pineapple",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "grapes::orange",
    "agent": "Grapes",
    "imposter": "Orange",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "potato::tomato",
    "agent": "Potato",
    "imposter": "Tomato",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "garlic::onion",
    "agent": "Onion",
    "imposter": "Garlic",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "mushroom::paneer",
    "agent": "Paneer",
    "imposter": "Mushroom",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "nachos::popcorn",
    "agent": "Popcorn",
    "imposter": "Nachos",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "chowmein::manchurian",
    "agent": "Chowmein",
    "imposter": "Manchurian",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "chilli paneer::paneer tikka",
    "agent": "Chilli Paneer",
    "imposter": "Paneer Tikka",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "chaas::lassi",
    "agent": "Lassi",
    "imposter": "Chaas",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "nimbu pani::sugarcane juice",
    "agent": "Nimbu Pani",
    "imposter": "Sugarcane Juice",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "badam milk::thandai",
    "agent": "Badam Milk",
    "imposter": "Thandai",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "aam panna::jaljeera",
    "agent": "Aam Panna",
    "imposter": "Jaljeera",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "croissant::donut",
    "agent": "Donut",
    "imposter": "Croissant",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "pancake::waffle",
    "agent": "Pancake",
    "imposter": "Waffle",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "burger::hot dog",
    "agent": "Hot Dog",
    "imposter": "Burger",
    "category": "foods",
    "difficulty": "easy"
  },
  {
    "id": "samosa::spring roll",
    "agent": "Samosa",
    "imposter": "Spring Roll",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "dabeli::vada pav",
    "agent": "Vada Pav",
    "imposter": "Dabeli",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "aloo tikki::pani puri",
    "agent": "Pani Puri",
    "imposter": "Aloo Tikki",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "chole bhature::poori bhaji",
    "agent": "Chole Bhature",
    "imposter": "Poori Bhaji",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "masala dosa::rava dosa",
    "agent": "Masala Dosa",
    "imposter": "Rava Dosa",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "hyderabadi biryani::pulao",
    "agent": "Hyderabadi Biryani",
    "imposter": "Pulao",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "dal makhani::dal tadka",
    "agent": "Dal Makhani",
    "imposter": "Dal Tadka",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "palak paneer::paneer butter masala",
    "agent": "Paneer Butter Masala",
    "imposter": "Palak Paneer",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "dum aloo::malai kofta",
    "agent": "Malai Kofta",
    "imposter": "Dum Aloo",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "makki ki roti::sarson ka saag",
    "agent": "Sarson Ka Saag",
    "imposter": "Makki Ki Roti",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "dal baati churma::litti chokha",
    "agent": "Litti Chokha",
    "imposter": "Dal Baati Churma",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "aloo paratha::methi thepla",
    "agent": "Methi Thepla",
    "imposter": "Aloo Paratha",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "bedmi puri::kachori",
    "agent": "Kachori",
    "imposter": "Bedmi Puri",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "dahi bhalla::papdi chaat",
    "agent": "Dahi Bhalla",
    "imposter": "Papdi Chaat",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "frankie::kathi roll",
    "agent": "Frankie",
    "imposter": "Kathi Roll",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "garlic bread::pizza",
    "agent": "Garlic Bread",
    "imposter": "Pizza",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "red sauce pasta::white sauce pasta",
    "agent": "White Sauce Pasta",
    "imposter": "Red Sauce Pasta",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "chowmein::hakka noodles",
    "agent": "Hakka Noodles",
    "imposter": "Chowmein",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "falooda::kulfi",
    "agent": "Falooda",
    "imposter": "Kulfi",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "rabri::shrikhand",
    "agent": "Shrikhand",
    "imposter": "Rabri",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "ladoo::modak",
    "agent": "Modak",
    "imposter": "Ladoo",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "malpua::rasgulla",
    "agent": "Puran Poli",
    "imposter": "Rasgulla",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "besan ladoo::mysore pak",
    "agent": "Mysore Pak",
    "imposter": "Besan Ladoo",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "guava::strawberry",
    "agent": "Strawberry",
    "imposter": "Guava",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "papaya::pomegranate",
    "agent": "Papaya",
    "imposter": "Pomegranate",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "carrot::cucumber",
    "agent": "Cucumber",
    "imposter": "Carrot",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "cabbage::capsicum",
    "agent": "Capsicum",
    "imposter": "Cabbage",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "baingan (eggplant)::bhindi (okra)",
    "agent": "Bhindi (Okra)",
    "imposter": "Baingan (Eggplant)",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "peanuts::sweet corn",
    "agent": "Sweet Corn",
    "imposter": "Peanuts",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "makhana::popcorn",
    "agent": "Makhana",
    "imposter": "Popcorn",
    "category": "foods",
    "difficulty": "medium"
  },
  {
    "id": "pizza::samosa",
    "agent": "Samosa",
    "imposter": "Pizza",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "dosa::waffle",
    "agent": "Dosa",
    "imposter": "Waffle",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "biryani::risotto",
    "agent": "Biryani",
    "imposter": "Risotto",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "chocolate brownie::gulab jamun",
    "agent": "Gulab Jamun",
    "imposter": "Chocolate Brownie",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "jalebi::pretzel",
    "agent": "Jalebi",
    "imposter": "Pretzel",
    "category": "foods",
    "difficulty": "hard"
  },
  ,
  {
    "id": "kebab::vada pav",
    "agent": "Vada Pav",
    "imposter": "kebab",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "roti::tortilla",
    "agent": "Roti",
    "imposter": "Tortilla",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "khichdi::porridge",
    "agent": "Khichdi",
    "imposter": "Porridge",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "oatmeal::poha",
    "agent": "Poha",
    "imposter": "Oatmeal",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "lassi::milkshake",
    "agent": "Lassi",
    "imposter": "Milkshake",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "chai::green tea",
    "agent": "Chai",
    "imposter": "Green Tea",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "nachos::papad",
    "agent": "Papad",
    "imposter": "Nachos",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "achar (pickle)::chutney",
    "agent": "Achar (Pickle)",
    "imposter": "Chutney",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "butter::ghee",
    "agent": "Ghee",
    "imposter": "Butter",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "paneer::tofu",
    "agent": "Paneer",
    "imposter": "Tofu",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "broccoli::cauliflower",
    "agent": "Cauliflower",
    "imposter": "Broccoli",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "lettuce::spinach",
    "agent": "Spinach",
    "imposter": "Lettuce",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "almond::walnut",
    "agent": "Walnut",
    "imposter": "Almond",
    "category": "foods",
    "difficulty": "hard"
  },
  {
    "id": "cashew::pistachio",
    "agent": "Cashew",
    "imposter": "Pistachio",
    "category": "foods",
    "difficulty": "hard"
  }
];

module.exports = wordBank;
