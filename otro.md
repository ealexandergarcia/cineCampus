colecciones:
1. Tarjeta
1.1 descuento
1.2 nombre
1.3 validez enum
1.4 fecha de creacion

2. usuario
2.1 nombre
2.2 contraseña
2.3 correo electronico
2.4 rol enum
2.5 cel
2.6 card ObjectId

3. pelicula
3.1 title
3.2 genre
3.3 director
3.4 duration
3.5 synopsis"

4. rooms
4.1 name
4.2 price array de precios

5. showings
5.1 movie ObjectId
5.2 room ObjectId
5.3 date
5.4 time
5.5 availableSeats array

6. movements
6.1 user ObjectId
6.2 showing ObjectId
6.3 status enum
6.4 seats array

7. payments
7.1 date
7.2 movement ObjectId
7.3 discount": 10, // Este valor se obtiene según la tarjeta, no se como abordarlo, si con un object id o mediante una consulta al generar el pago revise si el user tiene tarjeta y lo agregue automaticamente
7.4 paymentMethod enum
7.5 status enum

8. tickets
8.1 user ObjectId
8.2 showing ObjectId
8.3 seats array
8.4 date 
8.5 status enum

db.cards.insertMany([
  {
    "validity": "2025-12-31",
    "discount": 10,
    "name": "Gold VIP Card",
    "issueDate": "2023-01-01"
  },
  {
    "validity": "2024-06-30",
    "discount": 5,
    "name": "Silver VIP Card",
    "issueDate": "2023-06-15"
  }
]);

db.users.insertMany([
  {
    "role": "VIP", // Puede ser 'standard', 'VIP', 'admin'
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "hashed_password_here",
    "phone": "+1234567890",
    "card": ObjectId("card1") // Reemplaza con el ObjectId real del documento de tarjeta
  },
  {
    "role": "standard",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "hashed_password_here",
    "phone": "+0987654321",
    "card": ObjectId("card2") // Reemplaza con el ObjectId real del documento de tarjeta
  }
]);

db.movies.insertMany([
  {
    "title": "Inception",
    "genre": ["Sci-Fi", "Thriller"],
    "director": "Christopher Nolan",
    "duration": 148,
    "synopsis": "A thief who steals corporate secrets through the use of dream-sharing technology is given a chance to have his criminal history erased if he can successfully implant an idea into a target's subconscious."
  },
  {
    "title": "The Matrix",
    "genre": ["Action", "Sci-Fi"],
    "director": "Wachowskis",
    "duration": 136,
    "synopsis": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
  }
]);

db.rooms.insertMany([
  {
    "name": "Room 1",
    "price": [10, 15] // Precios para diferentes tipos de asientos o sesiones
  },
  {
    "name": "Room 2",
    "price": [12, 18]
  }
]);

db.showings.insertMany([
  {
    "movie": ObjectId("movie1"), // Reemplaza con el ObjectId real del documento de película
    "room": ObjectId("room1"), // Reemplaza con el ObjectId real del documento de sala
    "date": "2024-08-30",
    "time": "19:00",
    "availableSeats": [
      { "name": "A1", "price": 10, "type": "VIP", "available": true },
      { "name": "A2", "price": 10, "type": "VIP", "available": true },
      { "name": "B1", "price": 15, "type": "Regular", "available": true }
    ]
  }
]);

db.movements.insertMany([
  {
    "user": ObjectId("user1"), // Reemplaza con el ObjectId real del documento de usuario
    "showing": ObjectId("showing1"), // Reemplaza con el ObjectId real del documento de función
    "status": "reserved", // Puede ser 'reserved', 'purchased', 'rejected', 'cancelled'
    "seats": ["A1", "A2"]
  }
]);

db.payments.insertMany([
  {
    "date": "2024-08-29",
    "movement": ObjectId("movement1"), // Reemplaza con el ObjectId real del documento de movimiento
    "discount": 10, // Este valor se obtiene según la tarjeta
    "paymentMethod": "credit_card", // Puede ser 'credit_card', 'debit_card', 'paypal', etc.
    "status": "accepted" // Puede ser 'accepted', 'not_accepted'
  }
]);

db.tickets.insertMany([
  {
    "user": ObjectId("user1"), // Reemplaza con el ObjectId real del documento de usuario
    "showing": ObjectId("showing1"), // Reemplaza con el ObjectId real del documento de función
    "seats": ["A1", "A2"],
    "date": "2024-08-29",
    "status": "issued" // Puede ser 'issued', 'cancelled'
  }
]);