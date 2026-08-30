// backend/data/wordBank.js

const wordBank = [
  // 🍔 FOOD (Very different from each other)
  { agent: 'Samosa', imposter: 'Pizza' },
  { agent: 'Dosa', imposter: 'Burger' },
  { agent: 'Biryani', imposter: 'Sandwich' },
  { agent: 'Vada Pav', imposter: 'Pasta' },
  { agent: 'Gulab Jamun', imposter: 'French Fries' },
  { agent: 'Jalebi', imposter: 'Garlic Bread' },
  { agent: 'Pani Puri', imposter: 'Maggi' },
  { agent: 'Idli', imposter: 'Pav Bhaji' },
  { agent: 'Kachori', imposter: 'Milkshake' },
  { agent: 'Chole Bhature', imposter: 'Ice Cream' },
  { agent: 'Paratha', imposter: 'Momos' },
  { agent: 'Rajma', imposter: 'Pasta' },
  { agent: 'Paneer Tikka', imposter: 'Noodles' },
  { agent: 'Roti', imposter: 'Nachos' },
  { agent: 'Lassi', imposter: 'Pizza' },
  { agent: 'Dhokla', imposter: 'Tacos' },
  { agent: 'Upma', imposter: 'Sandwich' },
  { agent: 'Poori', imposter: 'French Fries' },
  { agent: 'Halwa', imposter: 'Pav Bhaji' },
  { agent: 'Bhel Puri', imposter: 'Cake' },
  { agent: 'Kulfi', imposter: 'Pasta' },
  { agent: 'Popcorn', imposter: 'Biryani' },

  // 🏏 SPORTS (Different sports)
  { agent: 'Cricket', imposter: 'Badminton' },
  { agent: 'Tennis', imposter: 'Swimming' },
  { agent: 'Basketball', imposter: 'Boxing' },
  { agent: 'Volleyball', imposter: 'Cycling' },
  { agent: 'Hockey', imposter: 'Skateboarding' },
  { agent: 'Kabaddi', imposter: 'Golf' },
  { agent: 'Football', imposter: 'Table Tennis' },
  { agent: 'Baseball', imposter: 'Running' },
  { agent: 'IPL', imposter: 'Olympics' },

  // 🚗 PLACES & TRANSPORT (Different places/vehicles)
  { agent: 'Mumbai', imposter: 'Delhi' },
  { agent: 'Goa', imposter: 'Bengaluru' },
  { agent: 'Marine Drive', imposter: 'Gateway of India' },
  { agent: 'Juhu Beach', imposter: 'Lonavala' },
  { agent: 'Airport', imposter: 'Railway Station' },
  { agent: 'Hotel', imposter: 'Hospital' },
  { agent: 'Bank', imposter: 'Restaurant' },
  { agent: 'Temple', imposter: 'Cinema' },
  { agent: 'Shopping Mall', imposter: 'School' },
  { agent: 'Pharmacy', imposter: 'Supermarket' },
  { agent: 'Petrol Pump', imposter: 'Car Wash' },
  { agent: 'Car', imposter: 'Bicycle' },
  { agent: 'Motorcycle', imposter: 'Train' },
  { agent: 'Bus', imposter: 'Boat' },
  { agent: 'Truck', imposter: 'Airplane' },
  { agent: 'Auto', imposter: 'Scooter' },
  { agent: 'Taxi', imposter: 'Metro' },
  { agent: 'Local Train', imposter: 'Traffic Signal' },
  { agent: 'Monsoon', imposter: 'Summer' },
  { agent: 'Traffic', imposter: 'Pothole' },
  { agent: 'College', imposter: 'Office' },
  { agent: 'Classroom', imposter: 'Playground' },

  // 🌍 NATURE (Different natural elements)
  { agent: 'Mountain', imposter: 'Beach' },
  { agent: 'Waterfall', imposter: 'Forest' },
  { agent: 'River', imposter: 'Desert' },
  { agent: 'Swimming Pool', imposter: 'Snow' },
  { agent: 'Sunrise', imposter: 'Sunset' },
  { agent: 'Moon', imposter: 'Star' },
  { agent: 'Rain', imposter: 'Snowman' },
  { agent: 'Summer', imposter: 'Winter' },
  { agent: 'Day', imposter: 'Night' },
  { agent: 'Morning', imposter: 'Midnight' },

  // 🎬 BOLLYWOOD STARS (Different actors)
  { agent: 'Shah Rukh Khan', imposter: 'Aamir Khan' },
  { agent: 'Amitabh Bachchan', imposter: 'Ranbir Kapoor' },
  { agent: 'Salman Khan', imposter: 'Hrithik Roshan' },
  { agent: 'Akshay Kumar', imposter: 'Rajkummar Rao' },
  { agent: 'Ajay Devgn', imposter: 'Vicky Kaushal' },
  { agent: 'Ranveer Singh', imposter: 'Kartik Aaryan' },
  { agent: 'Sachin Tendulkar', imposter: 'Virat Kohli' },
  { agent: 'MS Dhoni', imposter: 'Rohit Sharma' },
  { agent: 'Kapil Dev', imposter: 'Hardik Pandya' },

  { agent: 'Sholay', imposter: 'Don' },
  { agent: 'Hera Pheri', imposter: 'Welcome' },
  { agent: '3 Idiots', imposter: 'Dangal' },
  { agent: 'Jawan', imposter: 'Pathaan' },
  { agent: 'Singham', imposter: 'Dabangg' },
  { agent: 'Animal', imposter: 'Kabir Singh' },
  { agent: 'Chennai Express', imposter: 'Bhool Bhulaiyaa' },
  { agent: 'Drishyam', imposter: 'Andhadhun' },
  { agent: 'Gully Boy', imposter: 'Rockstar' },
  { agent: 'Golmaal', imposter: 'Dhamaal' },
  { agent: 'Lagaan', imposter: 'Chak De India' },
  { agent: 'Border', imposter: 'Lakshya' },
  { agent: 'Stree', imposter: 'Bhediya' },
  { agent: 'Zindagi Na Milegi Dobara', imposter: 'Dil Chahta Hai' },

  // 🎬 HOLLYWOOD (Different superheroes/movies)
  { agent: 'Spider-Man', imposter: 'Batman' },
  { agent: 'Iron Man', imposter: 'Superman' },
  { agent: 'Hulk', imposter: 'Thor' },
  { agent: 'Avengers', imposter: 'Justice League' },
  { agent: 'Marvel', imposter: 'DC' },
  { agent: 'Harry Potter', imposter: 'Pokémon' },

  // 🎮 GAMING (Different games)
  { agent: 'Minecraft', imposter: 'GTA' },
  { agent: 'FIFA', imposter: 'PUBG' },
  { agent: 'Free Fire', imposter: 'Subway Surfers' },
  { agent: 'Mario', imposter: 'Sonic' },
  { agent: 'PlayStation', imposter: 'Xbox' },

  // 🎬 ENTERTAINMENT (Different genres)
  { agent: 'Anime', imposter: 'Bollywood' },
  { agent: 'Horror', imposter: 'Comedy' },
  { agent: 'Action', imposter: 'Romance' },
  { agent: 'Thriller', imposter: 'Cartoon' },
  { agent: 'Cinema', imposter: 'Theatre' },
  { agent: 'Movie', imposter: 'Web Series' },
  { agent: 'Concert', imposter: 'Cricket Match' },

  // 🙏 FESTIVALS (Different festivals)
  { agent: 'Diwali', imposter: 'Holi' },
  { agent: 'Ganesh Chaturthi', imposter: 'Navratri' },
  { agent: 'Raksha Bandhan', imposter: 'Wedding' },
  { agent: 'Christmas', imposter: 'New Year' },

  // 📚 EDUCATION (Different school concepts)
  { agent: 'Homework', imposter: 'Exam' },
  { agent: 'Notebook', imposter: 'Calculator' },
  { agent: 'Blackboard', imposter: 'Library' },
  { agent: 'Uniform', imposter: 'ID Card' },
  { agent: 'Professor', imposter: 'Principal' },
  { agent: 'Scholarship', imposter: 'Tuition' },

  // 💻 TECHNOLOGY (Different tech items)
  { agent: 'Smartphone', imposter: 'Television' },
  { agent: 'Laptop', imposter: 'Camera' },
  { agent: 'Keyboard', imposter: 'Webcam' },
  { agent: 'Mouse', imposter: 'Microphone' },
  { agent: 'Charger', imposter: 'Headphones' },
  { agent: 'Earphones', imposter: 'Speaker' },
  { agent: 'Wi-Fi', imposter: 'Bluetooth' },
  { agent: 'Google', imposter: 'ChatGPT' },
  { agent: 'YouTube', imposter: 'Instagram' },
  { agent: 'WhatsApp', imposter: 'Snapchat' },
  { agent: 'Netflix', imposter: 'Spotify' },
  { agent: 'Facebook', imposter: 'Reddit' },
  { agent: 'Meme', imposter: 'Cartoon' },
  { agent: 'Selfie', imposter: 'Password' },
  { agent: 'Screenshot', imposter: 'Username' },

  // 👨‍👩‍👧 RELATIONSHIPS (Different people)
  { agent: 'Father', imposter: 'Teacher' },
  { agent: 'Mother', imposter: 'Doctor' },
  { agent: 'Brother', imposter: 'Friend' },
  { agent: 'Cousin', imposter: 'Neighbor' },
  { agent: 'Student', imposter: 'Teacher' },
  { agent: 'Patient', imposter: 'Doctor' },
  { agent: 'Driver', imposter: 'Passenger' },
  { agent: 'Chef', imposter: 'Waiter' },
  { agent: 'Actor', imposter: 'Director' },
  { agent: 'Singer', imposter: 'Dancer' },
  { agent: 'Photographer', imposter: 'Journalist' },

  // 🏥 PROFESSIONS (Different jobs)
  { agent: 'Police', imposter: 'Pilot' },
  { agent: 'Nurse', imposter: 'Firefighter' },
  { agent: 'Soldier', imposter: 'Chef' },

  // 🛋️ HOUSEHOLD (Different objects)
  { agent: 'Bed', imposter: 'Fan' },
  { agent: 'Chair', imposter: 'Refrigerator' },
  { agent: 'Table', imposter: 'Microwave' },
  { agent: 'Sofa', imposter: 'Washing Machine' },
  { agent: 'Toothbrush', imposter: 'Comb' },
  { agent: 'Mirror', imposter: 'Clock' },
  { agent: 'Door', imposter: 'Window' },
  { agent: 'Pillow', imposter: 'Blanket' },

  // 👕 FASHION (Different accessories)
  { agent: 'Shoes', imposter: 'Sunglasses' },
  { agent: 'Shirt', imposter: 'Watch' },
  { agent: 'Jacket', imposter: 'Ring' },
  { agent: 'Wallet', imposter: 'Cap' },
  { agent: 'Jeans', imposter: 'Backpack' },

  // 📚 STATIONERY (Different items)
  { agent: 'Book', imposter: 'Scissors' },
  { agent: 'Pencil', imposter: 'Glue' },
  { agent: 'Eraser', imposter: 'Bottle' },
  { agent: 'Lunchbox', imposter: 'Plate' },

  // 🍴 KITCHEN (Different utensils/ingredients)
  { agent: 'Knife', imposter: 'Fork' },
  { agent: 'Spoon', imposter: 'Chopsticks' },
  { agent: 'Salt', imposter: 'Ketchup' },
  { agent: 'Sugar', imposter: 'Mayonnaise' },

  // 🍍 FRUITS (Different fruits)
  { agent: 'Mango', imposter: 'Apple' },
  { agent: 'Banana', imposter: 'Orange' },
  { agent: 'Watermelon', imposter: 'Strawberry' },
  { agent: 'Coconut', imposter: 'Pineapple' },
  { agent: 'Lemon', imposter: 'Coconut Water' },

  // ☕ BEVERAGES (Different drinks)
  { agent: 'Tea', imposter: 'Lassi' },
  { agent: 'Coffee', imposter: 'Milkshake' },

  // 🚀 NATURE & SPACE (Different elements)
  { agent: 'Sunrise', imposter: 'Moon' },
  { agent: 'Star', imposter: 'Rain' },
  { agent: 'Summer', imposter: 'Snowman' }
];

module.exports = wordBank;