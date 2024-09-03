const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Database = require('./server/utils/db'); // Asegúrate de que la conexión a DB esté configurada
const moviesRoutes = require('./server/routes/moviesRoutes'); // Importa las rutas de películas
const showingsRouter = require('./server/routes/showingsRouter');
const authRoutes = require('./server/routes/authRoutes');
const movementsRoutes = require('./server/routes/movementsRouter');
const paymentsRouter = require('./server/routes/paymentsRouter');
const cardsRoutes = require('./server/routes/cardsRoutes');
const userRouter = require('./server/routes/userRouter');
const confirmationRoutes = require('./server/routes/confirmationRoutes');



app.use(cors());
app.use(express.json());

// Conectar a la base de datos
Database.getInstance(); // Llama para inicializar la conexión

app.use(bodyParser.json());
app.use('/movies', moviesRoutes); // Usa las rutas de películas en la API
app.use('/showings', showingsRouter);
app.use('/auth', authRoutes);
app.use('/movements', movementsRoutes);
app.use('/payments', paymentsRouter);
app.use('/card', cardsRoutes);
app.use('/users', userRouter);
app.use('/purchase', confirmationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});