/**
 * CyberSQL Database Engine
 * Powers real in-browser SQLite execution via WebAssembly (sql.js).
 * Includes schema creation, seed datasets, result comparison, and table inspection.
 */
class CyberDatabase {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.isReady = false;
        this.readyPromise = null;
    }

    async init() {
        if (this.readyPromise) return this.readyPromise;

        this.readyPromise = (async () => {
            try {
                // Initialize sql.js with local wasm binary
                const config = {
                    locateFile: (file) => `js/${file}`
                };
                
                if (typeof initSqlJs !== 'undefined') {
                    this.SQL = await initSqlJs(config);
                } else if (window.initSqlJs) {
                    this.SQL = await window.initSqlJs(config);
                } else {
                    throw new Error('sql.js library not loaded yet');
                }

                this.db = new this.SQL.Database();
                this.seedDatabase();
                this.isReady = true;
                console.log('⚡ CyberSQL SQLite WebAssembly Engine initialized successfully');
                return true;
            } catch (err) {
                console.error('Failed to init SQLite engine:', err);
                this.isReady = false;
                throw err;
            }
        })();

        return this.readyPromise;
    }

    seedDatabase() {
        const schemaAndData = `
        -- DEPARTMENTS
        CREATE TABLE departments (
            department_id INTEGER PRIMARY KEY,
            department_name TEXT NOT NULL,
            budget INTEGER NOT NULL,
            location TEXT NOT NULL
        );

        INSERT INTO departments VALUES
        (1, 'Engineering', 2500000, 'San Francisco'),
        (2, 'Data Science', 1800000, 'New York'),
        (3, 'Product', 1200000, 'San Francisco'),
        (4, 'Marketing', 900000, 'London'),
        (5, 'Human Resources', 600000, 'Berlin'),
        (6, 'Legal', 750000, 'London');

        -- EMPLOYEES
        CREATE TABLE employees (
            employee_id INTEGER PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            department_id INTEGER,
            salary INTEGER NOT NULL,
            hire_date TEXT NOT NULL,
            status TEXT NOT NULL,
            manager_id INTEGER,
            FOREIGN KEY (department_id) REFERENCES departments(department_id)
        );

        INSERT INTO employees VALUES
        (101, 'Elena', 'Rostova', 'elena.rostova@nexus.io', 1, 145000, '2021-03-15', 'Active', NULL),
        (102, 'Marcus', 'Vance', 'marcus.vance@nexus.io', 1, 115000, '2022-01-10', 'Active', 101),
        (103, 'Aria', 'Chen', 'aria.chen@nexus.io', 2, 138000, '2020-07-01', 'Active', NULL),
        (104, 'Darius', 'Kovacs', 'darius.kovacs@nexus.io', 2, 98000, '2022-06-18', 'Active', 103),
        (105, 'Sora', 'Takahashi', 'sora.takahashi@nexus.io', 1, 120000, '2021-09-01', 'Active', 101),
        (106, 'Maya', 'Patel', 'maya.patel@nexus.io', 3, 110000, '2023-02-14', 'Active', NULL),
        (107, 'Liam', 'OConnor', 'liam.oconnor@nexus.io', 4, 82000, '2022-11-05', 'Active', NULL),
        (108, 'Zoe', 'Dubois', 'zoe.dubois@nexus.io', 4, 74000, '2023-04-12', 'Active', 107),
        (109, 'Kaelen', 'Voss', 'kaelen.voss@nexus.io', 1, 95000, '2023-08-20', 'Active', 102),
        (110, 'Chloe', 'Simmons', 'chloe.simmons@nexus.io', 5, 68000, '2021-10-10', 'Active', NULL),
        (111, 'Devon', 'Miles', 'devon.miles@nexus.io', 2, 138000, '2021-04-01', 'Active', 103),
        (112, 'Nia', 'Adebayo', 'nia.adebayo@nexus.io', 3, 105000, '2022-08-15', 'On Leave', 106),
        (113, 'Victor', 'Stone', 'victor.stone@nexus.io', 4, 52000, '2024-01-15', 'Terminated', 107);

        -- CATEGORIES
        CREATE TABLE categories (
            category_id INTEGER PRIMARY KEY,
            category_name TEXT NOT NULL
        );

        INSERT INTO categories VALUES
        (1, 'Cyberware'),
        (2, 'Neural Chips'),
        (3, 'Security Systems'),
        (4, 'Quantum Nodes');

        -- PRODUCTS
        CREATE TABLE products (
            product_id INTEGER PRIMARY KEY,
            product_name TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            stock_quantity INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
        );

        INSERT INTO products VALUES
        (201, 'Ocular HUD Implant v4', 1, 'Cyberware', 1250.00, 18),
        (202, 'Bionic Reflex Booster', 1, 'Cyberware', 2400.00, 7),
        (203, 'Cortex AI Coprocessor', 2, 'Neural Chips', 3100.00, 12),
        (204, 'Synapse Overdrive Chip', 2, 'Neural Chips', 1850.00, 25),
        (205, 'Quantum Enigma Firewall', 3, 'Security Systems', 4500.00, 5),
        (206, 'Biometric Grid Sentry', 3, 'Security Systems', 890.00, 30),
        (207, 'Photonic Lattice Core', 4, 'Quantum Nodes', 7200.00, 3),
        (208, 'Cryo-Cooling Node Hub', 4, 'Quantum Nodes', 950.00, 15);

        -- CUSTOMERS
        CREATE TABLE customers (
            customer_id INTEGER PRIMARY KEY,
            customer_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            city TEXT NOT NULL,
            country TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        INSERT INTO customers VALUES
        (301, 'Neo Anderson', 'neo@zion.net', 'Mega City', 'USA', '2023-01-15'),
        (302, 'Trinity Matrix', 'trinity@zion.net', 'Mega City', 'USA', '2023-02-01'),
        (303, 'Morpheus Dream', 'morpheus@neb.org', 'Zion', 'Global', '2023-01-20'),
        (304, 'Cipher Regan', 'cipher@cypher.io', 'Zurich', 'Switzerland', '2023-04-10'),
        (305, 'Niobe Logos', 'niobe@logos.net', 'Tokyo', 'Japan', '2023-05-18'),
        (306, 'Persephone Myth', 'persephone@chateau.fr', 'Paris', 'France', '2023-06-25'),
        (307, 'Seraph Key', 'seraph@teahouse.cn', 'Shanghai', 'China', '2023-07-30'),
        (308, 'Ghost Operator', 'ghost@logos.net', 'Tokyo', 'Japan', '2023-08-14');

        -- ORDERS
        CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            order_date TEXT NOT NULL,
            status TEXT NOT NULL,
            total_amount REAL NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        );

        INSERT INTO orders VALUES
        (1001, 301, '2024-01-10', 'Delivered', 3650.00),
        (1002, 302, '2024-01-15', 'Delivered', 4500.00),
        (1003, 301, '2024-02-04', 'Delivered', 1250.00),
        (1004, 303, '2024-02-18', 'Delivered', 7200.00),
        (1005, 305, '2024-03-01', 'Delivered', 2400.00),
        (1006, 301, '2024-03-12', 'Delivered', 6200.00),
        (1007, 302, '2024-04-05', 'Delivered', 1850.00),
        (1008, 305, '2024-04-22', 'Delivered', 3700.00),
        (1009, 303, '2024-05-10', 'Delivered', 890.00),
        (1010, 301, '2024-05-29', 'Delivered', 3100.00);

        -- ORDER ITEMS
        CREATE TABLE order_items (
            item_id INTEGER PRIMARY KEY,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );

        INSERT INTO order_items VALUES
        (1, 1001, 201, 1, 1250.00),
        (2, 1001, 202, 1, 2400.00),
        (3, 1002, 205, 1, 4500.00),
        (4, 1003, 201, 1, 1250.00),
        (5, 1004, 207, 1, 7200.00),
        (6, 1005, 202, 1, 2400.00),
        (7, 1006, 203, 2, 3100.00),
        (8, 1007, 204, 1, 1850.00),
        (9, 1008, 204, 2, 1850.00),
        (10, 1009, 206, 1, 890.00),
        (11, 1010, 203, 1, 3100.00);

        -- MONTHLY SALES (For Window Functions & Trend Analysis)
        CREATE TABLE monthly_sales (
            sales_month TEXT PRIMARY KEY,
            revenue INTEGER NOT NULL,
            orders_count INTEGER NOT NULL
        );

        INSERT INTO monthly_sales VALUES
        ('2024-01', 8150, 2),
        ('2024-02', 8450, 2),
        ('2024-03', 8600, 2),
        ('2024-04', 5550, 2),
        ('2024-05', 3990, 2),
        ('2024-06', 9400, 3),
        ('2024-07', 11200, 4),
        ('2024-08', 12500, 4);
        `;

        this.db.run(schemaAndData);
    }

    /**
     * Executes any SQL query and returns formatted result with performance stats
     */
    runQuery(sqlQuery) {
        if (!this.db) {
            return { error: 'Database engine not initialized.' };
        }

        const trimmed = sqlQuery.trim().replace(/;+$/, '');
        if (!trimmed) {
            return { error: 'Query is empty.' };
        }

        const startTime = performance.now();
        try {
            const results = this.db.exec(trimmed);
            const executionTime = (performance.now() - startTime).toFixed(2);

            if (!results || results.length === 0) {
                return {
                    columns: [],
                    values: [],
                    rowCount: 0,
                    executionTime,
                    message: 'Query executed successfully with 0 rows returned.'
                };
            }

            const res = results[0];
            return {
                columns: res.columns,
                values: res.values,
                rowCount: res.values.length,
                executionTime,
                error: null
            };
        } catch (err) {
            return {
                error: err.message || 'SQL Execution error'
            };
        }
    }

    /**
     * Verifies user's query against expected solution
     */
    verifyChallenge(userSql, solutionSql) {
        const userRes = this.runQuery(userSql);
        if (userRes.error) {
            return {
                success: false,
                userResult: userRes,
                error: userRes.error,
                reason: 'Syntax or Runtime Error in query.'
            };
        }

        const expectedRes = this.runQuery(solutionSql);
        if (expectedRes.error) {
            console.error('Fatal: Reference solution query error:', expectedRes.error);
            return {
                success: false,
                userResult: userRes,
                expectedResult: expectedRes,
                reason: 'Internal solution error: ' + expectedRes.error
            };
        }

        // 1. Check column count
        if (userRes.columns.length !== expectedRes.columns.length) {
            return {
                success: false,
                userResult: userRes,
                expectedResult: expectedRes,
                reason: `Column count mismatch: Expected ${expectedRes.columns.length} columns (${expectedRes.columns.join(', ')}), but your query returned ${userRes.columns.length} columns.`
            };
        }

        // 2. Check column names (case-insensitive)
        const userColsLower = userRes.columns.map(c => c.toLowerCase());
        const expColsLower = expectedRes.columns.map(c => c.toLowerCase());
        const mismatchedCols = expColsLower.filter(c => !userColsLower.includes(c));
        if (mismatchedCols.length > 0) {
            return {
                success: false,
                userResult: userRes,
                expectedResult: expectedRes,
                reason: `Missing or misnamed column(s): Expected columns [${expectedRes.columns.join(', ')}]. Please verify your column aliases.`
            };
        }

        // 3. Check row count
        if (userRes.values.length !== expectedRes.values.length) {
            return {
                success: false,
                userResult: userRes,
                expectedResult: expectedRes,
                reason: `Row count mismatch: Expected ${expectedRes.values.length} rows, but got ${userRes.values.length} rows.`
            };
        }

        // 4. Check data equality (handling float tolerances and column order differences)
        const colMapping = expectedRes.columns.map(expCol => {
            return userColsLower.indexOf(expCol.toLowerCase());
        });

        for (let r = 0; r < expectedRes.values.length; r++) {
            const expRow = expectedRes.values[r];
            const userRow = userRes.values[r];

            for (let c = 0; c < expRow.length; c++) {
                const userVal = userRow[colMapping[c]];
                const expVal = expRow[c];

                if (!this.areValuesEqual(userVal, expVal)) {
                    return {
                        success: false,
                        userResult: userRes,
                        expectedResult: expectedRes,
                        reason: `Data mismatch at row ${r + 1}, column "${expectedRes.columns[c]}": Expected "${expVal}", got "${userVal}". Check filtering or sorting order.`
                    };
                }
            }
        }

        return {
            success: true,
            userResult: userRes,
            expectedResult: expectedRes,
            reason: 'All checks passed! Query output perfectly matches target specification.'
        };
    }

    areValuesEqual(val1, val2) {
        if (val1 === val2) return true;
        if (val1 === null || val2 === null || val1 === undefined || val2 === undefined) {
            return val1 === val2;
        }

        // Handle numeric floating point precision (e.g. 115000 vs 115000.00)
        const num1 = Number(val1);
        const num2 = Number(val2);
        if (!isNaN(num1) && !isNaN(num2)) {
            return Math.abs(num1 - num2) < 0.01;
        }

        // String trim case insensitive comparison fallback if string
        if (typeof val1 === 'string' && typeof val2 === 'string') {
            return val1.trim() === val2.trim();
        }

        return false;
    }

    /**
     * Inspect all tables and return schemas + sample rows for explorer
     */
    getSchemaDetails() {
        if (!this.db) return [];
        const tablesRes = this.runQuery("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
        if (tablesRes.error || !tablesRes.values) return [];

        const schemas = [];
        tablesRes.values.forEach(([tableName]) => {
            const colsRes = this.runQuery(`PRAGMA table_info("${tableName}");`);
            const sampleRes = this.runQuery(`SELECT * FROM "${tableName}" LIMIT 5;`);

            const columns = (colsRes.values || []).map(row => ({
                cid: row[0],
                name: row[1],
                type: row[2],
                notnull: row[3] === 1,
                pk: row[5] === 1
            }));

            schemas.push({
                tableName,
                columns,
                sample: sampleRes
            });
        });

        return schemas;
    }
}

// Global Database Singleton
window.cyberDB = new CyberDatabase();
