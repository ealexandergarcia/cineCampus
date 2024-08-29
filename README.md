# CineCampus API

## Base URL
http://localhost:5000/


## Selección de Películas

### 1. API para Listar Películas

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

### 2. API para Obtener Detalles de Película

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
