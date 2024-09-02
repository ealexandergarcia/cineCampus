# CineCampus API

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
####  Bad Request (400):
```json
{
  "message": "Faltan credenciales"
}
```
####  Unauthorized (401):
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
    "genre": [
        "Action",
        "Sci-Fi"
    ],
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
  "status": "accepted",  // puede ser 'accepted', 'cancelled' o 'rejected'
  "paymentMethod": "credit_card"  // puede ser 'credit_card', 'debit_card' o 'paypal'
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
      "status": "purchased"  // según el estado del pago
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
- **Endpoint:** `movements/v1/reservation`
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
  "status": "accepted",  // puede ser 'accepted', 'cancelled' o 'rejected'
  "paymentMethod": "credit_card"  // puede ser 'credit_card', 'debit_card' o 'paypal'
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
      "status": "purchased"  // según el estado del pago
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