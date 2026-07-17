# TrabajoGrupalWeb — Migración a Helidon 4.5 + React

##  Integrantes

| Nombre | Cédula       |
|---|--------------|
| Jhon Laverde | _1726633660_ |
| David Reyes | _1727605600_ |
| Diego Osorio | _0504372244_ |
| Joel Guamangallo | _1725616724_ |



---

##  Descripción
Proyecto grupal que migra un backend basado en **Jakarta EE (JAX-RS con RESTEasy, Hibernate ORM y DeltaSpike)** hacia **Helidon 4.5 (Nima/SE)**, junto con un frontend en **React + TypeScript + Vite** que consume la API REST expuesta por el nuevo servidor. El dominio gestiona `Users`, `Posts`, `Comments`, `Albums`, `Photos` y `Todos`.

---

##  Tabla de mapeo: Framework eliminado → Módulo Helidon 4.5

| Componente Jakarta EE (eliminado) | Rol que cumplía | Módulo Helidon 4.5 (reemplazo) | Notas |
|---|---|---|---|
| **JAX-RS** (`javax.ws.rs` / `jakarta.ws.rs`) | Definición de endpoints REST vía anotaciones (`@Path`, `@GET`, `@POST`, etc.) | `io.helidon.webserver:helidon-webserver` | Enrutamiento explícito y programático mediante `HttpRules` y `HttpService` (ver `UserHandler`, `PostHandler`, `AlbumHandler`, etc.) |
| **RESTEasy** | Implementación/motor de JAX-RS (manejo de requests/responses HTTP) | `io.helidon.webserver` (servidor reactivo Níma) | Helidon 4.5 usa su propio servidor basado en hilos virtuales, sin necesidad de un motor JAX-RS externo |
| **Hibernate ORM (JPA)** | Mapeo objeto-relacional, `EntityManager`, `@Entity` | `io.helidon.dbclient` + `io.helidon.dbclient-jdbc` + `io.helidon.dbclient-hikari` | Acceso a datos mediante SQL explícito (`DbClient.createQuery/createInsert/createUpdate/createDelete`) sin capa ORM; mapeo manual fila→objeto (`mapRowToX`) |
| **DeltaSpike** | Inyección de dependencias, gestión de configuración y ciclo de vida (CDI extendido) | `io.helidon.config` + `io.helidon.config-yaml` + inyección manual por constructor | Configuración centralizada en `application.yaml`; wiring de dependencias hecho a mano en `HelidonServerMain` (sin contenedor CDI) |
| **CDI / `@Inject`, `@ApplicationScoped`** | Inyección de dependencias | Constructores explícitos (`new UserRepository(dbClient)`, `new UserServiceImpl(userRepository)`, etc.) | Se adopta un patrón manual de capas: `Repository → Service → Handler`, ensamblado en `HelidonServerMain.main()` |
| **`web.xml` / `beans.xml`** | Configuración de despliegue y activación de CDI | `application.yaml` (Helidon Config) | Puerto, CORS, logging y conexión a base de datos declarados en YAML |
| **Bean Validation (`javax.validation`)** | Validación declarativa de entidades | Excepciones personalizadas (`ResourceNotFoundException`, `ConflictException`, `BadRequestException`) + `GlobalExceptionHandler` | Validación manual en la capa de `Service` (existencia de FKs, duplicados de ID, etc.) |
| **Servidor de aplicaciones (WildFly/Payara/etc.)** | Contenedor de despliegue Jakarta EE | Aplicación standalone con `main()` | `helidon-server` es un JAR ejecutable (`application` plugin de Gradle), sin necesidad de servidor de aplicaciones |
| **Jackson vía JAX-RS providers** | Serialización JSON automática | `io.helidon.http.media:helidon-http-media-jackson` + `jackson-databind` | Serialización/deserialización JSON explícita vía `request.content().as(Clase.class)` y `response.send(objeto)` |

---

##  Tabla de versiones del Frontend

| Tecnología | Versión |
|---|---|
| React | ^19.2.7 |
| React DOM | ^19.2.7 |
| Vite | ^8.1.1 |
| @vitejs/plugin-react | ^6.0.3 |
| React Router DOM | ^7.18.1 |
| Gestor de estado | React `useState` / `useEffect` (estado local por componente, sin librería externa como Redux/Zustand) |
| TypeScript | ~6.0.2 |
| Cliente HTTP | axios ^1.18.1 |
| UI Framework | @mui/material ^9.2.0 / @mui/icons-material ^9.2.0 |
| Linter | oxlint ^1.71.0 |

---

## Diagrama de paquetes — Backend (`helidon-server`)

```
com.programacion.web
│
├── HelidonServerMain.java            → Punto de entrada, wiring y arranque del WebServer
│
├── config
│   └── DbConfig.java                 → Construcción del DbClient a partir de application.yaml
│
├── db                                → Modelos de dominio (POJOs con Lombok)
│   ├── User.java
│   ├── Address.java
│   ├── Geo.java
│   ├── Company.java
│   ├── Post.java
│   ├── Comment.java
│   ├── Album.java
│   ├── Photo.java
│   └── Todo.java
│
├── repository
│   ├── interf
│   │   └── Repository.java           → Contrato genérico CRUD (findAll, findById, save, update, delete)
│   └── impl
│       ├── UserRepository.java
│       ├── PostRepository.java
│       ├── CommentRepository.java
│       ├── AlbumRepository.java
│       ├── PhotoRepository.java
│       └── TodoRepository.java       → Acceso a datos vía DbClient (SQL nativo, sin ORM)
│
├── services
│   ├── interf
│   │   └── Service.java              → Contrato genérico de lógica de negocio
│   └── impl
│       ├── UserServiceImpl.java
│       ├── PostServiceImpl.java
│       ├── CommentServiceImpl.java
│       ├── AlbumServiceImpl.java
│       ├── PhotoServiceImpl.java
│       └── TodoServiceImpl.java      → Reglas de negocio y validación de integridad referencial
│
├── handler                           → Capa HTTP (equivalente a los antiguos JAX-RS Resources)
│   ├── UserHandler.java
│   ├── PostHandler.java
│   ├── CommentHandler.java
│   ├── AlbumHandler.java
│   ├── PhotoHandler.java
│   └── TodoHandler.java              → Enrutamiento (HttpRules) y delegación a Services
│
└── exception
    ├── ResourceNotFoundException.java
    ├── ConflictException.java
    ├── BadRequestException.java
    ├── GlobalExceptionHandler.java   → Traducción centralizada de excepciones a respuestas HTTP
    └── dto
        └── ApiErrorDto.java          → Formato estándar de error JSON
```

**Flujo de dependencias:** `Handler → Service → Repository → DbClient → PostgreSQL`

---

## Diagrama de paquetes — Frontend (`FrontendReact`)

```
src
│
├── main.tsx                          → Entry point (StrictMode + BrowserRouter)
├── App.tsx                           → Definición de rutas (react-router-dom) y ThemeProvider (MUI)
│
├── models                            → Interfaces TypeScript (contrato con la API)
│   ├── User.ts
│   ├── Post.ts
│   ├── Album.ts
│   └── Todo.ts
│
├── components
│   └── NavBar.tsx                    → Barra de navegación global
│
└── pages
    ├── Home.tsx
    ├── User.tsx                      → Listado de usuarios
    ├── Posts.tsx / Comments.tsx / Albums.tsx / Photos.tsx / Todos.tsx  → Listados por entidad
    │
    ├── agregar/                      → Formularios de creación (POST)
    │   ├── AddUser.tsx
    │   ├── AddPost.tsx
    │   ├── AddComment.tsx
    │   ├── AddAlbums.tsx
    │   ├── AddPhotos.tsx
    │   └── AddTodo.tsx
    │
    └── editar/                       → Formularios de edición/detalle (GET + PUT)
        ├── UserDetail.tsx
        ├── PostsDetail.tsx
        ├── CommentDetail.tsx
        ├── AlbumDetail.tsx
        ├── PhotoDetail.tsx
        └── TodoDetail.tsx
```

**Flujo de datos:** `Page/Component → axios → /api/* (proxy Vite) → Helidon Server → PostgreSQL`

---

##  Endpoints del Backend

> Base URL: `http://localhost:8080/api`

Recursos expuestos: `/users`, `/posts`, `/comments`, `/albums`, `/photos`, `/todos`, con operaciones `GET /`, `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`, más rutas anidadas de relación (`/users/{id}/posts`, `/users/{id}/albums`, `/users/{id}/todos`, `/posts/{id}/comments`, `/albums/{id}/photos`).

*(Sección a completar con las 30 capturas/transcripciones de curl o HTTPie, request y response de cada endpoint)*


### Users
![img.png](img/Httpie/User/img.png)
![img_1.png](img/Httpie/User/img_1.png)
![img_2.png](img/Httpie/User/img_2.png)
![img_3.png](img/Httpie/User/img_3.png)
![img_4.png](img/Httpie/User/img_4.png)


### Posts

![img.png](img/Httpie/Post/img.png)
![img_1.png](img/Httpie/Post/img_1.png)
![img_2.png](img/Httpie/Post/img_2.png)
![img_3.png](img/Httpie/Post/img_3.png)
![img_4.png](img/Httpie/Post/img_4.png)


### Albums
![img.png](img/Httpie/Albums/img.png)
![img_1.png](img/Httpie/Albums/img_1.png)
![img_2.png](img/Httpie/Albums/img_2.png)
![img_3.png](img/Httpie/Albums/img_3.png)
![img_4.png](img/Httpie/Albums/img_4.png)


### Comments
![img.png](img/Httpie/Comments/img.png)
![img_1.png](img/Httpie/Comments/img_1.png)
![img_2.png](img/Httpie/Comments/img_2.png)
![img_3.png](img/Httpie/Comments/img_3.png)
![img_4.png](img/Httpie/Comments/img_4.png)


### Todos

![img.png](img/Httpie/Todos/img.png)
![img_1.png](img/Httpie/Todos/img_1.png)
![img_2.png](img/Httpie/Todos/img_2.png)
![img_3.png](img/Httpie/Todos/img_3.png)
![img_4.png](img/Httpie/Todos/img_4.png)















---

## Evidencia de la aplicación web (CRUD)

*(Sección a completar — capturas de pantalla de operaciones CRUD sobre Users, Posts y Comments)*
### Usuarios CRUD
![Screenshot 2026-07-17 043140.png](img/Screenshot%202026-07-17%20043140.png)
![Screenshot 2026-07-17 043157.png](img/Screenshot%202026-07-17%20043157.png)
![Screenshot 2026-07-17 043220.png](img/Screenshot%202026-07-17%20043220.png)
![Screenshot 2026-07-17 044117.png](img/Screenshot%202026-07-17%20044117.png)

### Post CRUD
![Screenshot 2026-07-17 043406.png](img/Screenshot%202026-07-17%20043406.png)

![Screenshot 2026-07-17 043318.png](img/Screenshot%202026-07-17%20043318.png)
![Screenshot 2026-07-17 043335.png](img/Screenshot%202026-07-17%20043335.png)
![Screenshot 2026-07-17 043347.png](img/Screenshot%202026-07-17%20043347.png)
![Screenshot 2026-07-17 043354.png](img/Screenshot%202026-07-17%20043354.png)

### Comment CRUD
![Screenshot 2026-07-17 043419.png](img/Screenshot%202026-07-17%20043419.png)
![Screenshot 2026-07-17 043433.png](img/Screenshot%202026-07-17%20043433.png)
![Screenshot 2026-07-17 043446.png](img/Screenshot%202026-07-17%20043446.png)
![Screenshot 2026-07-17 043454.png](img/Screenshot%202026-07-17%20043454.png)
![Screenshot 2026-07-17 043503.png](img/Screenshot%202026-07-17%20043503.png)


---

##  Instrucciones de ejecución

### 1. Requisitos previos
- JDK 21
- Node.js (compatible con `^20.19.0 || >=22.12.0`)
- PostgreSQL corriendo en `localhost:5432`, base de datos `posts`, usuario/contraseña configurados en `helidon-server/src/main/resources/application.yaml`

### 2. Orden de arranque

**Paso 1 — Levantar la base de datos PostgreSQL** (debe estar disponible antes de iniciar el backend).

**Paso 2 — Backend (Helidon)**

Desde la raíz del proyecto:

```bash
./gradlew run
```

En Windows:

```bash
gradlew.bat run
```

El servidor inicia en `http://localhost:8080`.

**Paso 3 — Frontend (React + Vite)**

Desde la carpeta `FrontendReact/`:

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

> El frontend usa un proxy configurado en `vite.config.ts` que redirige las peticiones `/api/*` hacia `http://localhost:8080`, por lo que el backend **debe estar corriendo antes** de iniciar el frontend.

### 3. Orden resumido

```
PostgreSQL → gradlew run (backend :8080) → npm run dev (frontend :5173)
```