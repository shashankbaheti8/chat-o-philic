require('dotenv').config();

console.log('Environment Variables Check:');
console.log('============================');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set (hidden)' : '✗ NOT SET');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Set (hidden)' : '✗ NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('============================');

if (!process.env.JWT_SECRET) {
  console.error('\n❌ ERROR: JWT_SECRET is not defined!');
  console.error('Make sure your .env file has JWT_SECRET=<your-secret>');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are loaded correctly!');
}
