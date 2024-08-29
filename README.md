# CineCampus API

## Base URL
http://localhost:5000/


## Selección de Películas

### 1. API para Listar Películas

- **Método:** `GET`
- **Endpoint:** `/`
- **Descripción:** Obtiene una lista de todas las películas disponibles en el catálogo, junto con sus géneros, duración y horarios de proyección.

#### Respuesta Exitosa (200):
```json
[
  {
    "_id": "66cfbfe535e16ff0c2d5023d",
    "titulo": "La Tragedia de la Luna",
    "genero": ["Drama", "Romántico"],
    "duracion": 140,
    "funciones": [
      {
        "fecha": "30-08-2024",
        "hora": "19:00"
      },
      {
        "fecha": "31-08-2024",
        "hora": "21:00"
      }
    ]
  },
  {
    "_id": "66cfaf517e97f346d18d5cb0",
    "titulo": "El Viaje Fantástico",
    "genero": ["Aventura", "Fantasía"],
    "duracion": 120,
    "funciones": [
      {
        "fecha": "29-08-2024",
        "hora": "18:00"
      }
    ]
  }
]
```
#### Errores Comunes:
- **500 Internal Server Error:** Error interno del servidor.

### 2. API para Obtener Detalles de Película

- **Método:** `GET`
- **Endpoint:** `/:id`
- **Descripción:** Obtiene los detalles completos de una película específica según su id, excluyendo los horarios de proyección.

#### Parámetros de Ruta:
- id: El identificador único de la película en MongoDB.

#### Respuesta Exitosa (200):
```json
{
  "_id": "66cfbfe535e16ff0c2d5023d",
  "titulo": "La Tragedia de la Luna",
  "director": "Ana García",
  "duracion": 140,
  "sinopsis": "Un drama profundo sobre los secretos de una familia.",
  "estado": "Próximamente",
  "genero": ["Drama", "Romántico"]
}
```
#### Errores Comunes:
- **404 Not Found:** La película con el id especificado no fue encontrada.
- **500 Internal Server Error:** Error interno del servidor.
