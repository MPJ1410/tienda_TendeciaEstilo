# 🛍️ Tendencia y Estilo - Tienda Online

Tienda de ropa online moderna con sistema de gestión de inventario para el negocio de venta de ropa.

## ✨ Características

### 🏪 Tienda Principal (`index.html`)
- **Catálogo de productos** con imágenes, precios y tallas
- **Filtrado por categorías** (Mujer / Hombre)
- **Detalles de productos** en modal interactivo
- **Integración con WhatsApp** para consultas y pedidos
- **Formulario de contacto** directo a WhatsApp
- **Diseño responsive** para móviles y tablets
- **Animaciones suaves** y efectos modernos

### 📊 Panel de Administración (`admin.html`)
- **Dashboard con estadísticas** en tiempo real
- **Gestión completa de productos** (Agregar, Editar, Eliminar)
- **Control de inventario** con alertas de stock bajo
- **Visualización de datos** con gráficos
- **Almacenamiento local** (localStorage) - no requiere base de datos

## 🚀 Cómo Usar

### 1. Abrir la Tienda
Simplemente abre el archivo `index.html` en tu navegador favorito.

### 2. Acceder al Panel de Administración
- Haz clic en "Admin" en el menú de navegación
- O abre directamente `admin.html`

### 3. Gestionar Productos

#### Agregar un Nuevo Producto:
1. En el panel de administración, haz clic en "Agregar Producto"
2. Completa el formulario:
   - Nombre del producto
   - Categoría (Mujer/Hombre)
   - Precio
   - Stock disponible
   - Tallas (separadas por coma: S, M, L, XL)
   - Descripción
   - Ruta de la imagen (coloca la imagen en la carpeta `assets/`)
3. Haz clic en "Guardar Producto"

#### Editar un Producto:
1. En la tabla de productos, haz clic en el ícono de editar (lápiz)
2. Modifica los campos necesarios
3. Guarda los cambios

#### Eliminar un Producto:
1. Haz clic en el ícono de eliminar (papelera)
2. Confirma la eliminación

### 4. Agregar Tus Propias Imágenes

Para reemplazar las imágenes de ejemplo:
1. Coloca tus fotos de productos en la carpeta `assets/`
2. Nombra las imágenes de forma descriptiva (ej: `vestido-floral.jpg`)
3. En el panel de administración, edita el producto
4. Actualiza la ruta de la imagen (ej: `assets/vestido-floral.jpg`)

## 📱 Configuración de WhatsApp

El número de WhatsApp actual es: **+51 906 174 278**

Para cambiar el número:
1. Abre `script.js`
2. Busca la línea: `const phoneNumber = '51906174278';`
3. Reemplaza con tu número (sin espacios ni guiones, incluye código de país)
4. Guarda el archivo

También actualiza en `admin-script.js` si es necesario.

## 🎨 Personalización

### Cambiar Colores:
Edita las variables CSS en `styles.css` y `admin-styles.css`:
```css
:root {
    --primary: #d4a574;        /* Color principal */
    --primary-dark: #b8885a;   /* Color principal oscuro */
    --secondary: #2c2c2c;      /* Color secundario */
}
```

### Cambiar el Nombre de la Tienda:
1. En `index.html`, busca "Tendencia & Estilo"
2. Reemplaza con el nombre de tu tienda
3. Actualiza también el título de la página (`<title>`)

## 📂 Estructura de Archivos

```
TENDENCIA Y ESTILO/
│
├── index.html              # Página principal de la tienda
├── styles.css              # Estilos de la tienda
├── script.js               # Funcionalidad de la tienda
│
├── admin.html              # Panel de administración
├── admin-styles.css        # Estilos del panel admin
├── admin-script.js         # Funcionalidad del panel admin
│
├── assets/                 # Carpeta de imágenes
│   ├── category-women.jpg
│   ├── category-men.jpg
│   ├── product-1.jpg
│   ├── product-2.jpg
│   └── ...
│
└── README.md              # Este archivo
```

## 💡 Consejos

1. **Fotos de Calidad**: Usa imágenes de buena calidad con fondo blanco o neutro
2. **Descripciones Detalladas**: Incluye información completa de cada producto
3. **Actualiza el Stock**: Mantén el inventario actualizado regularmente
4. **Responde Rápido**: Atiende los mensajes de WhatsApp con prontitud
5. **Backup Regular**: Exporta tus datos periódicamente (desde la consola del navegador: `localStorage.getItem('products')`)

## 🔧 Solución de Problemas

### Las imágenes no se ven:
- Verifica que las imágenes estén en la carpeta `assets/`
- Revisa que la ruta en el producto sea correcta
- Asegúrate de que los nombres de archivo coincidan

### Los productos no se guardan:
- Verifica que el navegador permita localStorage
- No uses modo incógnito/privado
- Limpia la caché del navegador si es necesario

### WhatsApp no abre:
- Verifica que el número esté en formato correcto (código país + número)
- Asegúrate de tener WhatsApp instalado o WhatsApp Web disponible

## 📞 Soporte

Si necesitas ayuda adicional, puedes:
- Revisar el código fuente (está comentado)
- Consultar la documentación de HTML, CSS y JavaScript
- Contactar a un desarrollador web local

## 🎉 ¡Listo para Vender!

Tu tienda está lista para recibir clientes. Comparte el enlace de tu sitio web y comienza a vender.

**¡Mucho éxito con tu negocio! 🚀**

---

Desarrollado con ❤️ para el negocio de tu mamá
