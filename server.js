const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const Database = require('./server/utils/db'); // Asegúrate de que la conexión a DB esté configurada
const moviesRoutes = require('./server/routes/moviesRoutes'); // Importa las rutas de películas
const transactionsRoutes = require('./server/routes/transactionsRoutes'); // Importa las rutas de películas
const authRoutes = require('./server/routes/authRoutes'); // Importa las rutas de películas


app.use(cors());
app.use(express.json());

// Conectar a la base de datos
Database.getInstance(); // Llama para inicializar la conexión

app.use(bodyParser.json());
app.use('/peliculas', moviesRoutes); // Usa las rutas de películas en la API
app.use('/transactions', transactionsRoutes); // Rutas de transacciones
app.use('/auth', authRoutes); // Usa las rutas de autenticación en la API
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});