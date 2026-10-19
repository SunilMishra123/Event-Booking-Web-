const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function create() {
  await mongoose.connect('mongodb://localhost:27017/eventora');
  const hashed = await bcrypt.hash('Sunil@12345', 10);
  
  await User.deleteMany({ email: 'sunilmishra63722@gmail.com' }); // purana delete
  
  await User.create({
    name: 'Sunil Mishra',
    email: 'sunilmishra63722@gmail.com',
    password: hashed,
    isVerified: true,
    otp: null,
    role: 'user'
  });
  
  console.log('User created! You can login now');
  process.exit();
}
create();