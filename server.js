const mongoose = require('mongoose');

const app = require('./app');

const { DB_URI, PORT } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.info('Database connection successful');
    app.listen(PORT, () =>
      console.log('Server running. Use our API on port: 3000'),
    );
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
