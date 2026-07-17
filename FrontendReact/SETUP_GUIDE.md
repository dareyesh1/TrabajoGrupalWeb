# Frontend React - Guía de Uso

## Resumen de Cambios

Se ha creado un frontend React completo que consume todos los endpoints del servidor Helidon.

### 📁 Archivos Creados

#### Modelos TypeScript (`src/models/`)
- **Post.ts** - Modelos para Post y Comment
- **Album.ts** - Modelos para Album y Photo
- **Todo.ts** - Modelo para Todo

#### Páginas React (`src/pages/`)
- **Posts.tsx** - Listado de posts con opción de ver comentarios
- **Comments.tsx** - Listado de comentarios
- **Albums.tsx** - Listado de álbumes con fotos
- **Photos.tsx** - Galería de fotos en grid
- **Todos.tsx** - Lista de tareas con opción de marcar completadas y eliminar

#### Componentes Actualizados
- **NavBar.tsx** - Navegación actualizada con botones para todas las secciones
- **App.tsx** - Rutas agregadas para todas las nuevas páginas

## 🚀 Endpoints Consumidos

El frontend consume los siguientes endpoints del servidor Helidon:

- `GET /api/users` - Obtener usuarios
- `GET /api/posts` - Obtener posts
- `GET /api/comments` - Obtener comentarios
- `GET /api/albums` - Obtener álbumes
- `GET /api/photos` - Obtener fotos
- `GET /api/todos` - Obtener tareas
- `PUT /api/todos/:id` - Actualizar tarea (marcar completada)
- `DELETE /api/todos/:id` - Eliminar tarea

## 🎨 Características

### Posts
- Lista de posts en tarjetas
- Muestra título, body y autor
- Botones para ver detalle y comentarios

### Comentarios
- Lista de comentarios en tarjetas
- Muestra name, email y body

### Álbumes
- Tarjetas con título del álbum
- Muestra cantidad de fotos
- Enlaces a galería de fotos

### Fotos
- Galería responsiva en grid (1-3 columnas según pantalla)
- Muestra miniatura y título

### Tareas (Todos)
- Checkbox para marcar completadas
- Botones para editar y eliminar
- Tareas completadas con efecto visual (opacidad)

## 📦 Dependencias Utilizadas

- **axios** - Para hacer requests HTTP
- **@mui/material** - Componentes UI
- **@mui/icons-material** - Iconos
- **react-router-dom** - Navegación

## 🏃 Cómo Correr

1. Asegurate que el servidor Helidon esté corriendo en `http://localhost:8080`
2. En la terminal dentro de `FrontendReact/`:
   ```bash
   npm install  # Si no lo has hecho aún
   npm run dev
   ```
3. Abre `http://localhost:5173` en tu navegador

## 📝 Notas

- Todo es **simple y limpio** como pediste
- Cada página sigue el mismo patrón de diseño
- Responsive y funcional en móvil y desktop
- Los iconos en la barra de navegación ayudan a identificar cada sección
