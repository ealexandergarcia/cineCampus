# CineCampus API

## env
MONGO_PROTOCOLO=mongodb://
MONGO_USER=root
MONGO_PSW=campus2023
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=cineCampus
MONGO_AUTH=authSource=admin
JWT_SECRET=zSev9kZVpQ3D9FnnLUJb7A0pZPl1o3HoC6Ol4zZj1XM=

## Base URL

http://localhost:5000/

## Login

### Autenticacion: Login de usuario

- **Método:** `POST`
- **Endpoint:** `/auth/login`
- **Descripción:** Autentica al usuario y genera un token JWT
- **Body:**

```json
{
  "email": "usuario@example.com",
  "contrasena": "password123"
}
```

#### Respuesta Exitosa (200):

```json
{
  "token": "jwt_token_aquí"
}
```

#### Bad Request (400):

```json
{
  "message": "Faltan credenciales"
}
```

#### Unauthorized (401):

```json
{
  "message": "Faltan credenciales"
}
```

## 1. Selección de Películas

### 1.1 API para Listar Películas

- **Método:** `GET`
- **Endpoint:** `movies/v1`
- **Descripción:** Obtiene una lista de todas las películas disponibles en el catálogo, junto con sus géneros, duración y horarios de proyección a partir de la fecha actual.

#### Respuesta Exitosa (200):

```json
[
  {
    "_id": "66cfbfe535e16ff0c2d5023d",
    "title": "La Tragedia de la Luna",
    "genre": ["Drama", "Romántico"],
    "duration": 140,
    "showings": [
      {
        "date": "2024-08-30",
        "time": "19:00"
      },
      {
        "date": "2024-08-31",
        "time": "21:00"
      }
    ]
  },
  {
    "_id": "66cfaf517e97f346d18d5cb0",
    "title": "El Viaje Fantástico",
    "genre": ["Aventura", "Fantasía"],
    "duration": 120,
    "showings": [
      {
        "date": "2024-08-29",
        "time": "18:00"
      }
    ]
  }
]
```

#### Errores Comunes:

- **500 Internal Server Error:** Error interno del servidor.

### 1.2 API para Obtener Detalles de Película

- **Método:** `GET`
- **Endpoint:** `movies/v1/:id`
- **Descripción:** Obtiene los detalles completos de una película específica según su id, incluyendo sinopsis y horarios de proyección.

#### Parámetros de Ruta:

- id: El identificador único de la película en MongoDB.

#### Respuesta Exitosa (200):

```json
{
  "_id": "66d10e5a4eb032980fd9468c",
  "title": "The Matrix",
  "genre": ["Action", "Sci-Fi"],
  "director": "Wachowskis",
  "duration": 136,
  "synopsis": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
}
```

#### Errores Comunes:

- **404 Not Found:** La película con el id especificado no fue encontrada.
- **500 Internal Server Error:** Error interno del servidor.

## 2. Compra de Boletos

### 2.1 API para Comprar Boletos:

- **Método:** `POST`
- **Endpoint:** `movements/v1/purchase`
- **Descripción:** Crea un nuevo movimiento para la compra de boletos, adenas de generar de manera automatica un proceso de pago
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:** Requiere token JWT en el encabezado.
  - Authorization: Bearer <tu_jwt_token>

#### Body:

```json
{
  "showingId": "ObjectId_de_la_función",
  "seats": ["A1", "A2"]
}
```

#### Respuestas

- **Movimiento creado exitosamente (201)**
  ```json
  {
    "message": "Compra realizada con éxito",
    "movement": {
      "_id": "ObjectId_del_movimiento",
      "user": "ObjectId_del_usuario",
      "showing": "ObjectId_de_la_función",
      "seats": ["A1", "A2"],
      "status": "pending"
    }
  }
  ```
- **Función no encontrada (404)**
  ```json
  {
    "message": "Función no encontrada"
  }
  ```
- **Alguno(s) de los asientos no están disponibles. (400)**
  ```json
  {
    "message": "Asientos no disponibles: A1"
  }
  ```

### 2.1.1 Actualizar el Estado del Pago:

- **Método:** `PUT`
- **Endpoint:** `/payments/:paymentId/status`
- **Descripción:** Actualiza el estado del pago y genera un nuevo movimiento con base en el estado del pago.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:** Requiere token JWT en el encabezado.
  - Authorization: Bearer <tu_jwt_token>

#### Body:

```json
{
  "status": "accepted", // puede ser 'accepted', 'cancelled' o 'rejected'
  "paymentMethod": "credit_card" // puede ser 'credit_card', 'debit_card' o 'paypal'
}
```

#### Respuestas

- **Estado del pago actualizado y movimiento generado (200)**
  ```json
  {
    "message": "Estado del pago actualizado",
    "newMovement": {
      "_id": "ObjectId_del_nuevo_movimiento",
      "user": "ObjectId_del_usuario",
      "showing": "ObjectId_de_la_función",
      "seats": ["A1", "A2"],
      "status": "purchased" // según el estado del pago
    }
  }
  ```
- **Estado o método de pago inválido (400)**
  ```json
  {
    "message": "Estado o método de pago inválido"
  }
  ```
- **Pago no encontrado (404)**
  ```json
  {
    "message": "Pago no encontrado"
  }
  ```

### 2.2 API para Verificar Disponibilidad de Asientos

- **Método:** `GET`
- **Endpoint:** `/showings/:id/availability`
- **Descripción:** Consulta la disponibilidad de asientos para una función específica.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:** Requiere token JWT en el encabezado.
  - Authorization: Bearer <tu_jwt_token>

#### Respuestas

- **Devuelve los asientos disponibles para la función (200)**

  ```json
  {
    "showingId": "ObjectId_de_la_función",
    "date": "2024-08-30T00:00:00.000Z",
    "seats": [
      {
        "name": "A1",
        "price": 15,
        "type": "VIP"
      },
      {
        "name": "A2",
        "price": 15,
        "type": "VIP"
      },
      {
        "name": "B1",
        "price": 10,
        "type": "Regular"
      }
    ]
  }
  ```

- **Pago no encontrado (404)**
  ```json
  {
    "message": "Funcion no encontrado"
  }
  ```

## 3. Asignación de Asientos

### 3.1 API para Reservar Asientos:

- **Método:** `POST`
- **Endpoint:** `movements/v1/reserve`
- **Descripción:** Reserva asientos para una función específica. Crea un movimiento con estado 'reserved'.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:**
  - Authorization: Bearer <tu_jwt_token>

#### Body:

```json
{
  "showingId": "ObjectId_de_la_función",
  "seats": ["A1", "A2"]
}
```

#### Respuestas

- **Movimiento creado exitosamente (201)**
  ```json
  {
    "message": "Compra realizada con éxito",
    "movement": {
      "_id": "ObjectId_del_movimiento",
      "user": "ObjectId_del_usuario",
      "showing": "ObjectId_de_la_función",
      "seats": ["A1", "A2"],
      "status": "reserved"
    }
  }
  ```
- **Función no encontrada (404)**
  ```json
  {
    "message": "Función no encontrada"
  }
  ```
- **Alguno(s) de los asientos no están disponibles. (400)**
  ```json
  {
    "message": "Asientos no disponibles: A1"
  }
  ```

### 3.1.1 Iniciar Pago para una Reserva:

- **Método:** `POST`
- **Endpoint:** `/payments/v1/initiate/:reservationId`
- **Descripción:** Inicia el proceso de pago para una reserva. Crea un registro de pago con estado 'pending'.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:** Requiere token JWT en el encabezado.
  - Authorization: Bearer <tu_jwt_token>
- **Params:**
  - reservationId: ID del movimiento de reserva

#### Body:

```json
{
  "paymentMethod": "credit_card"
}
```

#### Respuestas

- **Proceso de pago iniciado (201)**
  ```json
  {
    "message": "Proceso de pago iniciado",
    "payment": {
      "movement": "ObjectId",
      "paymentMethod": "string",
      "status": "pending"
    }
  }
  ```
- **Estado o método de pago inválido (400)**
  ```json
  {
    "message": "Estado o método de pago inválido"
  }
  ```
- **Pago no encontrado (404)**
  ```json
  {
    "message": "Reserva no encontrada o ya procesada"
  }
  ```

### 3.1.2 Actualizar el Estado del Pago:

- **Método:** `PUT`
- **Endpoint:** `/payments/:paymentId/status`
- **Descripción:** Actualiza el estado del pago y genera un nuevo movimiento con base en el estado del pago.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:** Requiere token JWT en el encabezado.
  - Authorization: Bearer <tu_jwt_token>

#### Body:

```json
{
  "status": "accepted", // puede ser 'accepted', 'cancelled' o 'rejected'
  "paymentMethod": "credit_card" // puede ser 'credit_card', 'debit_card' o 'paypal'
}
```

#### Respuestas

- **Estado del pago actualizado y movimiento generado (200)**
  ```json
  {
    "message": "Estado del pago actualizado",
    "newMovement": {
      "_id": "ObjectId_del_nuevo_movimiento",
      "user": "ObjectId_del_usuario",
      "showing": "ObjectId_de_la_función",
      "seats": ["A1", "A2"],
      "status": "purchased" // según el estado del pago
    }
  }
  ```
- **Estado o método de pago inválido (400)**
  ```json
  {
    "message": "Estado o método de pago inválido"
  }
  ```
- **Pago no encontrado (404)**
  ```json
  {
    "message": "Pago no encontrado"
  }
  ```

### 3.2 API para Cancelar Reserva de Asientos:

- **Método:** `PUT`
- **Endpoint:** `movements/v1/reserve/cancel/:reservationId`
- **Descripción:** Permite la cancelación de una reserva de asiento ya realizada. La cancelación solo es posible si la reserva no tiene un pago asociado.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:**
  - Authorization: Bearer <tu_jwt_token>
- **Params:**
  - reservationId: ID del movimiento de reserva

#### Respuestas

- **Reserva cancelada con éxito (200)**
  ```json
  {
    "message": "Reserva cancelada con éxito",
    "reservation": {
      "_id": "64f5f7c9123abc001c8b789e",
      "user": "64f4d5e525e4f5405a4b82a2",
      "showing": "64f5f55a25e4f5405a4b829c",
      "seats": ["A1", "A2"],
      "status": "cancelled",
      "date": "2024-09-02T18:25:43.511Z",
      "__v": 0
    }
  }
  ```
- **Función no encontrada (404)**
  ```json
  {
    "message": "Reserva no encontrada"
  }
  ```
- **Alguno(s) de los asientos no están disponibles. (400)**
  ```json
  {
    "message": "No se puede cancelar una reserva con un pago asociado"
  }
  ```

## 4. Descuentos y Tarjetas VIP

### 4.1 API para Aplicar Descuentos:

- **Descripción:** Esta API se encarga de iniciar el proceso de pago para una reserva de asientos, gestionando de forma interna la aplicación de descuentos si el usuario tiene una tarjeta VIP válida. El proceso de validación del descuento está integrado en la lógica de creación del pago y no requiere una API intermedia separada para verificar la validez de la tarjeta.

#### Proceso Interno de Validación y Aplicación de Descuentos::

1. **Cálculo del Monto Total:** Se determina el monto total a pagar sumando el valor de la sala y el valor de cada uno de los asientos reservados.
2. **Verificación de Tarjeta VIP:** Se verifica si el usuario tiene una tarjeta VIP
3. **Aplicación del Descuento:**

- La validación de la tarjeta VIP se realiza como parte del proceso de creación del pago. Se busca la tarjeta VIP asociada al usuario y se verifica su validez. La validez de la tarjeta se determina comparando su fecha de vencimiento con la fecha actual.
- Si el usuario tiene una tarjeta VIP válida, se calcula el descuento aplicable y se ajusta el monto total. Si no hay una tarjeta válida, el monto total permanece sin descuento.

4. **Creación del Pago**:
   Se genera un nuevo registro de pago con el monto total ajustado y el descuento aplicado (si corresponde). El estado del pago se establece inicialmente como 'pending'.

### 4.2 API para Verificar Tarjeta VIP:

- **Método:** `GET`
- **Endpoint:** `/card/v1/verify`
- **Descripción:** Verifica el estado de la tarjeta VIP del usuario autenticado. Proporciona información sobre si la tarjeta está activa, ha expirado, o si el usuario no tiene tarjeta VIP.
- **Autenticación:** Requiere token JWT en el encabezado.
- **Headers:**
  - Authorization: Bearer <tu_jwt_token>

#### Respuestas

- **Tarjeta VIP activa (200)**
  ```json
  {
    "message": "Tu tarjeta VIP está activa y tiene un descuento del 15%."
  }
  ```
- **Tarjeta VIP expiró (400)**
  ```json
  {
    "message": "Tu tarjeta VIP ha expirado. La tarjeta caducó el 2023-01-01. Por favor, renueva tu tarjeta para seguir disfrutando de los beneficios."
  }
  ```
- **Usuario no tiene tarjeta VIP (404)**
  ```json
  {
    "message": "Este usuario no cuenta con una tarjeta VIP. Te invitamos a adquirir una para obtener descuentos."
  }
  ```
- **Error en el servido (500)**
  ```json
  {
    "message": "Error en el servidor al verificar la tarjeta VIP."
  }
  ```

## 5. Roles Definidos

### 5.1 API para Crear Usuario:

- **Método:** `POST`
- **Endpoint:** `/users/register`
- **Descripción:** Permite la creación de un nuevo usuario en el sistema. Al crear un usuario, se verifica si el correo electrónico ya está registrado. La contraseña del usuario se encripta antes de ser almacenada en la base de datos. El usuario se guarda en la colección de users y se crea un usuario en MongoDB Atlas con los permisos adecuados.
- **Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "password": "tuContraseñaSegura",
  "phone": "1234567890"
}
```

#### Respuestas

- **Usuario creado con éxito (201)**
  ```json
  {
    "message": "Usuario creado con éxito",
    "user": {
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
      "phone": "1234567890",
      "role": "standard",
      "__v": 0
    }
  }
  ```
- **Correo Electrónico Duplicado (400)**
  ```json
  {
    "message": "El correo electrónico ya está registrado"
  }
  ```
- **Error en el servido (500)**
  ```json
  {
    "message": "Error al crear el usuario",
    "error": "Detalles del error"
  }
  ```

### 5.2 Obtener Detalles de Usuario:

- **Método:** `GET`
- **Endpoint:** `/users/:id`
- **Descripción:** Obtiene los detalles de un usuario específico basado en su id.
- **Params:**
  - usersId: ID del usuario

#### Respuestas

- **Retorna los detalles del usuario (200)**
  ```json
  {
    "user": {
      "name": "Juan Prez",
      "email": "ssssss@example.com",
      "password": "$2a$10$...",
      "phone": "1234567890",
      "role": "standard",
      "card": "ObjectId"
    }
  }
  ```
- **Usuario no encontrado (404)**
  ```json
  {
    "message": "Usuario no encontrado"
  }
  ```
- **Error en el servido (500)**
  ```json
  {
    "message": "Error en el servidor"
  }
  ```

### 5.3 API para Actualizar Rol de Usuario:

- **Método:** `PUT`
- **Endpoint:** `/users/:id`
- **Descripción:** Actualiza el rol a nivel de coleccion y de usuario de mongo.
- **Params:**
  - usersId: ID del usuario
- **Body:**
  ```json
  {
    "newRole": "VIP"
  }
  ```

#### Respuestas

- **Retorna los detalles del usuario (200)**
  ```json
  {
    "message": "Rol de usuario actualizado con éxito",
    "user": {
      "_id": "605c72efc72f241c1f1e4d8b",
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
      "phone": "1234567890",
      "role": "VIP",
      "__v": 0
    }
  }
  ```
- **Usuario no encontrado (400)**
  ```json
  {
    "message": "Rol inválido"
  }
  ```
- **Usuario no encontrado (404)**
  ```json
  {
    "message": "Usuario no encontrado"
  }
  ```
- **Error en el servido (500)**
  ```json
  {
    "message": "Error en el servidor"
  }
  ```

### 5.4 API para Listar Usuarios:

- **Método:** `GET`
- **Endpoint:** `/users` o `/users?role=VIP`
- **Descripción:** Lista todos los usuarios.

#### Respuestas

- **Usuarios recuperados exitosamente (200)**

  ```json
  {
    "message": "Users retrieved successfully",
    "users": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Juan Pérez",
        "email": "juan.perez@example.com",
        "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
        "phone": "1234567890",
        "role": "standard",
        "__v": 0
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Ana López",
        "email": "ana.lopez@example.com",
        "password": "$2a$10$KUuVYNo5kXj2eJRzLLHAfOr/..P1xaTXGvVYmCiUcS3ekJiDt/HnG",
        "phone": "0987654321",
        "role": "VIP",
        "__v": 0
      }
    ]
  }
  ```

- **Error en el servido (500)**
  ```json
  {
    "message": "Error en el servidor"
  }
  ```

## 6. Compras en Línea

### 6.1 API para Procesar Pagos:

- **Método:** `PUT`
- **Endpoint:** `/payments/:paymentId/status`
- **Descripción:** Actualiza el estado de un pago y crea un nuevo movimiento asociado a ese pago. Maneja la lógica para estados de pago como 'accepted', 'rejected' y 'cancelled', administrando la disponibilidad de los asientos.
- **Params:**
  - paymentId : ID del pago que se va a actualizar.
- **Body:**

```json
{
  "status": "cancelled", // puede ser 'accepted', 'cancelled' o 'rejected'
  "paymentMethod": "credit_card" // puede ser 'credit_card', 'debit_card' o 'paypal'
}
```

#### Respuestas

- **Pago actualizado y nuevo movimiento creado (200)**

  ```json
  {
    "message": "Payment updated and new movement created",
    "payment": {
      "_id": "12345",
      "status": "accepted",
      "movement": {
        "user": "67890",
        "showing": "54321",
        "seats": ["A1", "A2"],
        "date": "2024-09-03T14:00:00.000Z",
        "status": "purchased"
      }
    },
    "newMovement": {
      "_id": "67890",
      "user": "67890",
      "showing": "54321",
      "seats": ["A1", "A2"],
      "date": "2024-09-03T14:00:00.000Z",
      "status": "purchased"
    }
  }
  ```

- **Pago no encontrado (404)**
  ```json
  {
    "message": "Payment not found"
  }
  ```
- **Estado de pago ya actualizado (400)**
  ```json
  {
    "message": "Payment status already updated"
  }
  ```
- **Estado inválido (400)**
  ```json
  {
    "message": "Invalid status"
  }
  ```
- **Error en el servidor (500)**
  ```json
  {
    "message": "Error en el servidor",
    "error": "Error details here"
  }
  ```

### 6.2 API para Iniciar el Proceso de Pago de Reservación:

- **Método:** `POST`
- **Endpoint:** `payments/v1/initiate/:reservationId`
- **Descripción:** Inicia el proceso de pago para una reservación. Calcula el monto total a pagar, aplicando descuentos si el usuario tiene una tarjeta VIP válida, y crea un nuevo registro de pago.
- **Params:**
  - reservationId : ID de la reservación que se va a pagar.
- **Body:**

```json
{
  "paymentMethod": "credit_card" // puede ser 'credit_card', 'debit_card' o 'paypal'
}
```

#### Respuestas

- **Proceso de pago iniciado exitosamente (201)**
  ```json
  {
    "message": "Proceso de pago iniciado",
    "payment": {
      "_id": "67890",
      "movement": "12345",
      "paymentMethod": "credit_card",
      "amount": 100.0,
      "discount": 10,
      "status": "pending",
      "__v": 0
    }
  }
  ```
- **Reservación no encontrada o ya procesada (404)**
  ```json
  {
    "message": "Reservation not found or already processed"
  }
  ```
- **Proyección no encontrada (404)**
  ```json
  {
    "message": "Showing not found"
  }
  ```
- **Error en el servidor (500)**
  ```json
  {
    "message": "Error en el servidor",
    "error": "Error details here"
  }
  ```

### 6.3 API para Confirmación de Compra:

- **Método:** `GET`
- **Endpoint:** `purchase/v1/confirmation/:paymentId`
- **Descripción:** Recupera los detalles de una compra en función del ID de pago. La respuesta incluye la película, la función, la sala, los asientos, el importe total y el estado del pago.
- **Params:**
  - paymentId : ID del pago.

#### Respuestas

- **Purchase confirmed successfully (200)**
  ```json
  {
    "message": "Purchase confirmed",
    "ticket": {
      "movie": {
        "title": "Movie Title",
        "genre": "Action",
        "duration": "120 minutes"
      },
      "showing": {
        "date": "2024-09-15",
        "time": "19:00"
      },
      "room": {
        "name": "Room 1",
        "price": 10
      },
      "seats": ["A1", "A2"],
      "totalAmount": 20,
      "status": "purchased"
    }
  }
  ```
- **Pago no confirmado como comprado (400)**
  ```json
  {
    "message": "Payment not found"
  }
  ```
- **Pago no encontrada (404)**
  ```json
  {
    "message": "Payment not found"
  }
  ```
- **Error en el servidor (500)**
  ```json
  {
    "message": "Error en el servidor",
    "error": "Error details here"
  }
  ```
