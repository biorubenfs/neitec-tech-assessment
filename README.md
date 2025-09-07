# Neitec Prueba Técnica

## Descripción

Entregable de prueba técnica para puesto de desarrollar backend.

## Consideraciones previas

Se ha usado Gemini como agente de IA ya que actualmente OPEN AI no presenta un servicio gratuito. Esta problemática conllevó a pensar en la posibilidad de hacer pruebas con diferentes agentes de IA y consecuentemente a aislar la implementación del agente de IA del código de la aplicación, mediante la creación de un módulo dinámico en dónde se decide que implementación concreta del agente de IA se inyectará según se específique en las variables de entorno. Si en lugar de usar Gemini se decidiera usar OpenAi, bastaría con hacer la implementación concreta de este cliente, sin necesidad de tocar código adicional.

## Setup local

### Variables de entorno
La aplicación necesita las siguientes variables de entorno:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/neitec
OPEN_AI_API_KEY=
GEMINI_API_KEY=
AI_PROVIDER=gemini
```

Crea un fichero `.env` en el directorio raíz del proyecto con las variables del fichero `.env.example` y los valores que desees antes de ejecutar `docker-compose`.

### Docker Compose

El fichero `docker-compose.yml` pone en marcha dos contenedores: uno con la aplicación y otro con la base de datos.Para iniciarlos, ejecutar:

```bash
docker-compose up
```

Para detenerlos:

```bash
docker-compose down
```

## Servicios

### Análisis Preliminar

- `POST /analyses`

```bash
curl --location 'http://localhost:4000/analyses' \
--form 'file=@"/path/to/file/Balance de situacion 31-12-2023.Pdf"' \
--form 'type="preliminary"'
```

### Obtener Análisis
- `GET /analyses`
```bash
curl --location 'http://localhost:4000/analyses'
```

## Miscelánea

### Test

- Ejecutar tests unitarios:
```bash
pnpm run test
```

- Ejecutar análisis de cobertura:
```bash
pnpm run test:cov
```
