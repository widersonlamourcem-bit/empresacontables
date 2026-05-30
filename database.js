/**
 * Database Service - Expertos Contables RD
 * Este servicio simula una base de datos real usando localStorage para persistencia.
 */

const DB = {
    // Claves para localStorage
    KEYS: {
        CONTACTS: 'expertos_db_contacts',
        ORDERS: 'expertos_db_orders',
        USERS: 'expertos_db_users',
        PRODUCTS: 'expertos_db_products'
    },

    // --- Métodos Genéricos ---
    _get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    _save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

    // --- Gestión de Contactos ---
    contacts: {
        save: (formData) => {
            const contacts = DB._get(DB.KEYS.CONTACTS);
            const newContact = {
                id: Date.now(),
                ...formData,
                status: 'No Revisado', // Traducido
                date: new Date().toISOString()
            };
            contacts.push(newContact);
            DB._save(DB.KEYS.CONTACTS, contacts);
            console.log('DB: Mensaje guardado', newContact);
            return newContact;
        },
        getAll: () => DB._get(DB.KEYS.CONTACTS),
        updateStatus: (id, newStatus) => {
            const contacts = DB._get(DB.KEYS.CONTACTS);
            const index = contacts.findIndex(c => c.id == id);
            if (index !== -1) {
                contacts[index].status = newStatus;
                DB._save(DB.KEYS.CONTACTS, contacts);
            }
        },
        delete: (id) => {
            const contacts = DB._get(DB.KEYS.CONTACTS);
            const filtered = contacts.filter(c => c.id != id);
            DB._save(DB.KEYS.CONTACTS, filtered);
            console.log('DB: Registro de contacto eliminado', id);
        }
    },

    // --- Gestión de Pedidos ---
    orders: {
        save: (orderData) => {
            const orders = DB._get(DB.KEYS.ORDERS);
            const newOrder = {
                id: 'ORD-' + Math.floor(Math.random() * 1000000),
                ...orderData,
                status: 'Pendiente', // Agregado
                date: new Date().toISOString()
            };
            orders.push(newOrder);
            DB._save(DB.KEYS.ORDERS, orders);
            console.log('DB: Pedido guardado', newOrder);
            return newOrder;
        },
        getAll: () => DB._get(DB.KEYS.ORDERS),
        updateStatus: (id, newStatus) => {
            const orders = DB._get(DB.KEYS.ORDERS);
            const index = orders.findIndex(o => o.id == id);
            if (index !== -1) {
                orders[index].status = newStatus;
                DB._save(DB.KEYS.ORDERS, orders);
            }
        },
        delete: (id) => {
            const orders = DB._get(DB.KEYS.ORDERS);
            const filtered = orders.filter(o => o.id != id);
            DB._save(DB.KEYS.ORDERS, filtered);
            console.log('DB: Registro de pedido eliminado', id);
        }
    },

    // --- Gestión de Usuarios / Empleados ---
    users: {
        init: () => {
            // Inicializar con datos por defecto si está vacío
            if (DB._get(DB.KEYS.USERS).length === 0) {
                const defaultUsers = [
                    { id: 1, name: 'Anderson Valdez', email: 'avaldez@expertos.com', role: 'admin', position: 'Gerente General', status: 'online' },
                    { id: 2, name: 'Danyele Santana', email: 'dsantana@expertos.com', role: 'employee', position: 'Dpto. Contabilidad', status: 'online' },
                    { id: 3, name: 'Gabriela Martinez', email: 'gmartinez@expertos.com', role: 'employee', position: 'Consultoría Estratégica', status: 'busy' },
                    { id: 4, name: 'Luiyi Estevez', email: 'lestevez@expertos.com', role: 'employee', position: 'Aliado Estratégico', status: 'online' }
                ];
                DB._save(DB.KEYS.USERS, defaultUsers);
            }
        },
        getAll: () => {
            DB.users.init();
            return DB._get(DB.KEYS.USERS);
        }
    },

    // --- Registro de Seguridad ---
    logs: {
        add: (action, details) => {
            const logs = DB._get('expertos_db_logs');
            const newLog = {
                id: Date.now(),
                user: sessionStorage.getItem('empID') || 'Sistema',
                action,
                details,
                timestamp: new Date().toISOString(),
                method: sessionStorage.getItem('loginMethod') || 'N/A'
            };
            logs.unshift(newLog); // Más recientes primero
            DB._save('expertos_db_logs', logs.slice(0, 100)); // Mantener últimos 100
            return newLog;
        },
        getAll: () => DB._get('expertos_db_logs')
    },

    // --- Exportación a Archivos ---
    exportToCSV: (type) => {
        let data = [];
        let filename = '';
        let headers = [];

        if (type === 'contacts') {
            data = DB.contacts.getAll();
            filename = 'Mensajes_Contacto_ExpertosContables.csv';
            headers = ['ID', 'Nombre', 'Email', 'Asunto', 'Mensaje', 'Fecha', 'Estado'];
        } else if (type === 'orders') {
            data = DB.orders.getAll();
            filename = 'Pedidos_Tienda_ExpertosContables.csv';
            headers = ['ID', 'Total', 'Metodo', 'Fecha', 'Estado'];
        }

        if (data.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        // Crear contenido CSV
        let csvContent = "\uFEFF"; // BOM para Excel (UTF-8)
        csvContent += headers.join(',') + "\n";

        data.forEach(item => {
            let row = [];
            if (type === 'contacts') {
                row = [
                    item.id,
                    `"${item.name}"`,
                    `"${item.email}"`,
                    `"${item.subject}"`,
                    `"${item.message.replace(/"/g, '""')}"`,
                    `"${new Date(item.date).toLocaleString()}"`,
                    item.status
                ];
            } else {
                row = [
                    item.id,
                    item.total,
                    item.method,
                    `"${new Date(item.date).toLocaleString()}"`,
                    'Pagado'
                ];
            }
            csvContent += row.join(',') + "\n";
        });

        // Crear enlace de descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // --- Inicialización Global ---
    init: () => {
        try {
            console.log('DB: Inicializando Base de Datos Local...');
            DB.users.init();
            // Asegurar que existan las claves básicas
            if (!localStorage.getItem('expertos_db_logs')) localStorage.setItem('expertos_db_logs', JSON.stringify([]));
            if (!localStorage.getItem(DB.KEYS.CONTACTS)) localStorage.setItem(DB.KEYS.CONTACTS, JSON.stringify([]));
            if (!localStorage.getItem(DB.KEYS.ORDERS)) localStorage.setItem(DB.KEYS.ORDERS, JSON.stringify([]));
        } catch (e) {
            console.error('Error al inicializar DB:', e);
        }
    }
};

// Auto-inicializar al cargar
DB.init();

// Exportar para uso global
window.ExpertosDB = DB;
