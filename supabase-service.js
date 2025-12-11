// ===== SUPABASE DATABASE SERVICE =====
// Este archivo maneja todas las operaciones con la base de datos Supabase

const SupabaseService = {
    // ===== PRODUCTOS =====

    // Obtener todos los productos
    async getProducts() {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('✅ Productos cargados desde Supabase:', data.length);
            return data || [];
        } catch (error) {
            console.error('❌ Error al cargar productos:', error);
            return [];
        }
    },

    // Obtener productos por categoría
    async getProductsByCategory(category) {
        try {
            if (category === 'todos') {
                return await this.getProducts();
            }

            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('❌ Error al filtrar productos:', error);
            return [];
        }
    },

    // Obtener un producto por ID
    async getProductById(id) {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('❌ Error al obtener producto:', error);
            return null;
        }
    },

    // Agregar un nuevo producto
    async addProduct(product) {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .insert([product])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Producto agregado:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error al agregar producto:', error);
            return { success: false, error: error.message };
        }
    },

    // Actualizar un producto
    async updateProduct(id, updates) {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Producto actualizado:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error al actualizar producto:', error);
            return { success: false, error: error.message };
        }
    },

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            console.log('✅ Producto eliminado:', id);
            return { success: true };
        } catch (error) {
            console.error('❌ Error al eliminar producto:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== STORAGE (IMÁGENES) =====

    // Subir imagen al storage
    async uploadImage(file, productName) {
        try {
            // Generar nombre único para el archivo
            const timestamp = Date.now();
            const fileName = `${productName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.${file.name.split('.').pop()}`;
            const filePath = `products/${fileName}`;

            // Subir archivo
            const { data, error } = await supabaseClient.storage
                .from('product-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Obtener URL pública
            const { data: { publicUrl } } = supabaseClient.storage
                .from('product-images')
                .getPublicUrl(filePath);

            console.log('✅ Imagen subida:', publicUrl);
            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('❌ Error al subir imagen:', error);
            return { success: false, error: error.message };
        }
    },

    // Eliminar imagen del storage
    async deleteImage(imageUrl) {
        try {
            // Extraer el path de la URL
            const urlParts = imageUrl.split('/');
            const bucketIndex = urlParts.indexOf('product-images');
            if (bucketIndex === -1) return { success: false, error: 'URL inválida' };

            const filePath = urlParts.slice(bucketIndex + 1).join('/');

            const { error } = await supabaseClient.storage
                .from('product-images')
                .remove([filePath]);

            if (error) throw error;

            console.log('✅ Imagen eliminada:', filePath);
            return { success: true };
        } catch (error) {
            console.error('❌ Error al eliminar imagen:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== CATEGORÍAS =====

    // Obtener todas las categorías
    async getCategories() {
        try {
            const { data, error } = await supabaseClient
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('❌ Error al cargar categorías:', error);
            return [];
        }
    },

    // ===== MIGRACIÓN DESDE LOCALSTORAGE =====

    // Migrar productos de localStorage a Supabase
    async migrateFromLocalStorage() {
        try {
            const localProducts = localStorage.getItem('products');
            if (!localProducts) {
                console.log('ℹ️ No hay productos en localStorage para migrar');
                return { success: true, migrated: 0 };
            }

            const products = JSON.parse(localProducts);
            let migratedCount = 0;

            for (const product of products) {
                // Remover el ID local ya que Supabase generará uno nuevo
                const { id, ...productData } = product;

                const result = await this.addProduct(productData);
                if (result.success) {
                    migratedCount++;
                }
            }

            console.log(`✅ Migración completada: ${migratedCount} productos migrados`);
            return { success: true, migrated: migratedCount };
        } catch (error) {
            console.error('❌ Error en la migración:', error);
            return { success: false, error: error.message };
        }
    }
};

// Exportar para uso global
window.SupabaseService = SupabaseService;

console.log('✅ Supabase Service inicializado');
