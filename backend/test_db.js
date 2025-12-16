const mongoose = require('mongoose');

// We are HARDCODING the connection string here to rule out .env issues
// Password is 'floris123'
const uri = "mongodb+srv://sansidhairya11_db_user:floris123@florisherbals.o4fb38d.mongodb.net/floris?retryWrites=true&w=majority&appName=florisherbals";

console.log("⏳ Attempting to connect...");

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS! The password and link are correct.");
    process.exit(0);
  })
  .catch(err => {
    console.log("❌ CONNECTION FAILED");
    console.log("Error Name:", err.name);
    console.log("Error Code:", err.code); // 8000 = Bad Auth
    console.log("Message:", err.message);
    process.exit(1);
  });
