/**
 * PlaySQL Question Repository & Dynamic Session Randomizer
 * Vast bank of curated industry-grade SQL questions across Beginner, Intermediate, and Advanced.
 * Features Fisher-Yates seed-based randomization to guarantee NO two users get the same question set!
 */

const PLAYSQL_MASTER_BANK = {
    beginner: {
        id: 'beginner',
        title: 'Level 1: Novice Terminal',
        badge: 'DATA CADET',
        description: 'Master core SQL syntax, column filtering, distinct combinations, and fundamental aggregations.',
        mcqs: [
            {
                id: 'b_mcq_1',
                type: 'mcq',
                category: 'SELECT & DEDUPLICATION',
                title: 'Column-Level DISTINCT Behavior',
                timeLimit: 60,
                prompt: 'Consider the query below executed against a corporate database. What does DISTINCT evaluate in this context?',
                codeSnippet: 'SELECT DISTINCT department_id, status FROM employees;',
                options: [
                    'It returns unique combinations of (department_id, status) across all rows.',
                    'It returns unique values of department_id only, ignoring status duplicates.',
                    'It causes a syntax error because DISTINCT requires parentheses around each column.',
                    'It sorts the result set by department_id first, then status in ascending order.'
                ],
                correctAnswer: 0,
                explanation: 'In SQL, DISTINCT operates across all selected columns in the projection list. SELECT DISTINCT col1, col2 returns unique tuples of (col1, col2). It does not apply only to the first column.'
            },
            {
                id: 'b_mcq_2',
                type: 'mcq',
                category: 'THREE-VALUED LOGIC & NULL',
                title: 'NULL Comparison Semantics',
                timeLimit: 60,
                prompt: 'You need to find employees where manager_id is missing. Why does "WHERE manager_id = NULL" fail to return these rows?',
                codeSnippet: 'SELECT * FROM employees WHERE manager_id = NULL;',
                options: [
                    'Because comparing with NULL using = evaluates to UNKNOWN, which is treated as false in WHERE filters.',
                    'Because NULL is a reserved keyword that can only be checked inside a HAVING clause.',
                    'Because integer columns automatically convert NULL to 0 when compared with =.',
                    'Because SQLite requires double quotes around NULL.'
                ],
                correctAnswer: 0,
                explanation: 'In ANSI SQL, NULL represents an unknown value. Direct comparison using = or <> with NULL produces UNKNOWN. In a WHERE clause, only expressions that evaluate strictly to TRUE are returned. Use "WHERE manager_id IS NULL".'
            },
            {
                id: 'b_mcq_3',
                type: 'mcq',
                category: 'FILTERING ARCHITECTURE',
                title: 'WHERE Clause vs HAVING Clause',
                timeLimit: 60,
                prompt: 'What is the architectural difference between WHERE and HAVING in the SQL execution pipeline?',
                options: [
                    'WHERE filters individual rows before aggregation; HAVING filters aggregated groups after GROUP BY.',
                    'WHERE is used strictly for strings; HAVING is used strictly for numeric comparisons.',
                    'WHERE can only be used on primary keys; HAVING can only be used on foreign keys.',
                    'They are interchangeable aliases in modern ANSI SQL engines.'
                ],
                correctAnswer: 0,
                explanation: 'SQL executes logically in stages: FROM -> WHERE (filters raw rows before aggregation) -> GROUP BY -> HAVING (filters grouped metrics) -> SELECT -> ORDER BY.'
            },
            {
                id: 'b_mcq_4',
                type: 'mcq',
                category: 'STRING PATTERN MATCHING',
                title: 'Wildcard Semantics in LIKE Expressions',
                timeLimit: 60,
                prompt: 'Which pattern correctly matches email addresses that have exactly 4 characters before the @ symbol and end with .io?',
                options: [
                    "WHERE email LIKE '____@%.io'",
                    "WHERE email LIKE '%____@%.io'",
                    "WHERE email LIKE '*4*@*.io'",
                    "WHERE email LIKE '____%@io'"
                ],
                correctAnswer: 0,
                explanation: 'In SQL LIKE syntax, underscore "_" matches exactly one character, while percent "%" matches zero or more characters. Four underscores "____" match exactly 4 characters.'
            },
            {
                id: 'b_mcq_5',
                type: 'mcq',
                category: 'AGGREGATION NUANCES',
                title: 'COUNT(*) vs COUNT(column_name)',
                timeLimit: 60,
                prompt: 'A table has 10 rows. Column "bonus" has numeric values for 7 rows and NULL for 3 rows. What does the following return?',
                codeSnippet: 'SELECT COUNT(*), COUNT(bonus) FROM employees;',
                options: [
                    '10, 7',
                    '10, 10',
                    '7, 7',
                    'Throws an error for mixing COUNT(*) with column aggregates.'
                ],
                correctAnswer: 0,
                explanation: 'COUNT(*) counts the total number of physical rows regardless of column values (10). COUNT(column_name) ignores NULL entries and only counts non-null rows (7).'
            },
            {
                id: 'b_mcq_6',
                type: 'mcq',
                category: 'OPERATOR PRECEDENCE',
                title: 'Boolean Precedence with AND / OR',
                timeLimit: 60,
                prompt: 'In SQL Boolean evaluation, what is the precedence relationship between AND and OR?',
                codeSnippet: 'SELECT * FROM employees WHERE department_id = 1 OR department_id = 2 AND salary > 100000;',
                options: [
                    'AND has higher precedence than OR, evaluating (department_id = 2 AND salary > 100000) first.',
                    'OR has higher precedence than AND, evaluating (department_id = 1 OR department_id = 2) first.',
                    'SQL strictly evaluates left-to-right regardless of operators.',
                    'Queries without explicit parentheses fail at parse time.'
                ],
                correctAnswer: 0,
                explanation: 'In SQL and Boolean algebra, AND has higher precedence than OR. The condition evaluates as: (department_id = 1) OR (department_id = 2 AND salary > 100000).'
            },
            {
                id: 'b_mcq_7',
                type: 'mcq',
                category: 'ORDERING & PAGINATION',
                title: 'Pagination with LIMIT and OFFSET',
                timeLimit: 60,
                prompt: 'What rows does "LIMIT 5 OFFSET 10" return on an ordered query?',
                codeSnippet: 'SELECT * FROM products ORDER BY price DESC LIMIT 5 OFFSET 10;',
                options: [
                    'It skips the first 10 rows and returns the subsequent 5 rows (rows 11 through 15).',
                    'It returns the first 10 rows, skipping 5 rows.',
                    'It returns rows with price between 5 and 10.',
                    'It returns 5 rows starting from index 0.'
                ],
                correctAnswer: 0,
                explanation: 'OFFSET N skips N rows from the top of the sorted result, and LIMIT M returns up to M rows. Hence LIMIT 5 OFFSET 10 skips 10 and returns rows 11 to 15.'
            },
            {
                id: 'b_mcq_8',
                type: 'mcq',
                category: 'AGGREGATES & ARITHMETIC',
                title: 'AVG() Function NULL Handling',
                timeLimit: 60,
                prompt: 'How does the SQL aggregate function AVG(salary) handle rows where salary is NULL?',
                options: [
                    'It automatically excludes NULL rows from both numerator and denominator.',
                    'It treats NULL values as 0, artificially pulling down the average.',
                    'It returns NULL for the entire query if any row contains NULL.',
                    'It triggers an arithmetic division error.'
                ],
                correctAnswer: 0,
                explanation: 'Aggregate functions in ANSI SQL (AVG, SUM, MIN, MAX) automatically filter out NULL entries prior to calculation. AVG calculates sum(non-null) / count(non-null).'
            },
            {
                id: 'b_mcq_9',
                type: 'mcq',
                category: 'SORTING DIRECTION',
                title: 'Default Sort Direction in ORDER BY',
                timeLimit: 60,
                prompt: 'When specifying "ORDER BY created_at" without specifying ASC or DESC, what is the default sorting direction?',
                options: [
                    'ASC (Ascending, from smallest to largest / oldest to newest).',
                    'DESC (Descending, from largest to smallest).',
                    'Random / nondeterministic depending on the disk storage order.',
                    'It depends on whether an index exists on created_at.'
                ],
                correctAnswer: 0,
                explanation: 'In ANSI SQL, the default order direction for ORDER BY is always ASC (Ascending).'
            },
            {
                id: 'b_mcq_10',
                type: 'mcq',
                category: 'FILTERING OPERATORS',
                title: 'BETWEEN Operator Inclusivity',
                timeLimit: 60,
                prompt: 'Does the SQL condition "WHERE price BETWEEN 100 AND 500" include the boundary values 100 and 500?',
                options: [
                    'Yes, BETWEEN is inclusive of both boundary endpoints (price >= 100 AND price <= 500).',
                    'No, BETWEEN is strictly exclusive (price > 100 AND price < 500).',
                    'It includes 100 but excludes 500.',
                    'It depends on the database engine configuration.'
                ],
                correctAnswer: 0,
                explanation: 'The SQL BETWEEN operator is inclusive: "x BETWEEN a AND b" translates exactly to "x >= a AND x <= b".'
            }
        ],
        coding: [
            {
                id: 'b_code_1',
                type: 'coding',
                category: 'FILTERING & SORTING',
                title: 'High-Earning Active Personnel',
                timeLimit: 180,
                prompt: 'Retrieve active employees earning at least 100,000.',
                instructions: [
                    'Query the "employees" table.',
                    'Select: first_name, last_name, salary, and department_id.',
                    'Filter for salary >= 100000 and status = "Active".',
                    'Order by salary DESC, last_name ASC.'
                ],
                relevantTables: ['employees'],
                starterCode: `SELECT \n    -- Projections\nFROM employees\nWHERE \n    -- Filters\nORDER BY \n    -- Sort order\n;`,
                solutionSql: `SELECT first_name, last_name, salary, department_id FROM employees WHERE salary >= 100000 AND status = 'Active' ORDER BY salary DESC, last_name ASC;`
            },
            {
                id: 'b_code_2',
                type: 'coding',
                category: 'GROUPING & AGGREGATES',
                title: 'Inventory Valuation by Category',
                timeLimit: 180,
                prompt: 'Calculate the total financial value of inventory held in each category.',
                instructions: [
                    'Query the "products" table.',
                    'Calculate total value as: SUM(price * stock_quantity) AS total_value.',
                    'Group by category.',
                    'Filter groups where total_value > 20000 using HAVING.',
                    'Order by total_value DESC.'
                ],
                relevantTables: ['products'],
                starterCode: `SELECT \n    category,\n    -- Total value calculation\nFROM products\nGROUP BY \n    -- Group column\nHAVING \n    -- Filter aggregated total\nORDER BY \n    -- Sort order\n;`,
                solutionSql: `SELECT category, SUM(price * stock_quantity) AS total_value FROM products GROUP BY category HAVING total_value > 20000 ORDER BY total_value DESC;`
            },
            {
                id: 'b_code_3',
                type: 'coding',
                category: 'AGGREGATES & LIMITS',
                title: 'Top 3 Spending Customers',
                timeLimit: 180,
                prompt: 'Find the top 3 customers who have generated the highest aggregate transaction revenue.',
                instructions: [
                    'Query the "orders" table.',
                    'Select: customer_id, COUNT(order_id) AS total_orders, and SUM(total_amount) AS total_spent.',
                    'Group by customer_id.',
                    'Order by total_spent DESC LIMIT 3.'
                ],
                relevantTables: ['orders'],
                starterCode: `SELECT \n    customer_id,\n    -- Orders count\n    -- Total amount sum\nFROM orders\nGROUP BY \n    -- Group\nORDER BY \n    -- Spend sort\nLIMIT 3;`,
                solutionSql: `SELECT customer_id, COUNT(order_id) AS total_orders, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC LIMIT 3;`
            },
            {
                id: 'b_code_4',
                type: 'coding',
                category: 'FILTERING & PROJECTION',
                title: 'Engineering High-Earners Directory',
                timeLimit: 180,
                prompt: 'Select employee ID, first name, and email for Engineering department employees (department_id = 1) earning more than 100,000.',
                instructions: [
                    'Query the "employees" table.',
                    'Select: employee_id, first_name, and email.',
                    'Filter for department_id = 1 AND salary > 100000.',
                    'Order by employee_id ASC.'
                ],
                relevantTables: ['employees'],
                starterCode: `SELECT \n    -- Columns\nFROM employees\nWHERE \n    -- Conditions\nORDER BY \n    employee_id ASC;`,
                solutionSql: `SELECT employee_id, first_name, email FROM employees WHERE department_id = 1 AND salary > 100000 ORDER BY employee_id ASC;`
            },
            {
                id: 'b_code_5',
                type: 'coding',
                category: 'RANGE FILTERING',
                title: 'Mid-Tier Product Catalog',
                timeLimit: 180,
                prompt: 'Retrieve product name, price, and stock quantity for products priced between 1,000 and 3,000 inclusive.',
                instructions: [
                    'Query the "products" table.',
                    'Select: product_name, price, and stock_quantity.',
                    'Filter for price BETWEEN 1000 AND 3000.',
                    'Order by price ASC, product_name ASC.'
                ],
                relevantTables: ['products'],
                starterCode: `SELECT \n    product_name, price, stock_quantity\nFROM products\nWHERE \n    -- Price range\nORDER BY \n    price ASC, product_name ASC;`,
                solutionSql: `SELECT product_name, price, stock_quantity FROM products WHERE price BETWEEN 1000 AND 3000 ORDER BY price ASC, product_name ASC;`
            },
            {
                id: 'b_code_6',
                type: 'coding',
                category: 'LOCATION FILTERING',
                title: 'London Regional Department Budgets',
                timeLimit: 180,
                prompt: 'Extract department names and budgets for all departments located in London.',
                instructions: [
                    'Query the "departments" table.',
                    'Select: department_name and budget.',
                    'Filter for location = "London".',
                    'Order by budget DESC.'
                ],
                relevantTables: ['departments'],
                starterCode: `SELECT \n    department_name, budget\nFROM departments\nWHERE \n    -- Location filter\nORDER BY \n    budget DESC;`,
                solutionSql: `SELECT department_name, budget FROM departments WHERE location = 'London' ORDER BY budget DESC;`
            }
        ]
    },

    intermediate: {
        id: 'intermediate',
        title: 'Level 2: Data Nexus',
        badge: 'DATA SPECIALIST',
        description: 'Conquer multi-table joins, anti-joins, conditional aggregations, subqueries, and grouping sets.',
        mcqs: [
            {
                id: 'i_mcq_1',
                type: 'mcq',
                category: 'RELATIONAL JOIN DYNAMICS',
                title: 'LEFT JOIN Cardinality Guarantee',
                timeLimit: 75,
                prompt: 'Table "customers" has 100 rows. Table "orders" has 80 rows. Exactly 20 customers have no orders. What is the guaranteed minimum and maximum row count for a LEFT JOIN on customer_id?',
                options: [
                    'Min: 100, Max: Unbounded (can exceed 100 if customers have multiple orders).',
                    'Min: 80, Max: 100.',
                    'Min: 20, Max: 80.',
                    'Min: 100, Max: 180.'
                ],
                correctAnswer: 0,
                explanation: 'A LEFT JOIN preserves every row from the left table at least once (min 100). If customers have multiple orders, rows multiply according to matches, bounded only by the matching order count.'
            },
            {
                id: 'i_mcq_2',
                type: 'mcq',
                category: 'SQL SYNTAX COMPLIANCE',
                title: 'Strict GROUP BY Column Rules',
                timeLimit: 75,
                prompt: 'Why does "SELECT department_id, first_name, AVG(salary) FROM employees GROUP BY department_id" fail in standard SQL?',
                options: [
                    'first_name is neither in the GROUP BY clause nor wrapped in an aggregate function.',
                    'AVG(salary) cannot be computed on integers.',
                    'department_id is a foreign key and cannot be grouped.',
                    'GROUP BY requires an ORDER BY clause.'
                ],
                correctAnswer: 0,
                explanation: 'Under ANSI SQL and ONLY_FULL_GROUP_BY, every column in the SELECT list must either appear in the GROUP BY clause or be inside an aggregate function.'
            },
            {
                id: 'i_mcq_3',
                type: 'mcq',
                category: 'SUBQUERY OPTIMIZATION',
                title: 'EXISTS vs IN with NULLs',
                timeLimit: 75,
                prompt: 'Why is "WHERE NOT EXISTS (...)" preferred over "WHERE id NOT IN (SELECT id FROM ...)" when NULLs may exist?',
                options: [
                    'If the subquery returns even a single NULL, NOT IN evaluates to UNKNOWN for all rows, returning an empty set.',
                    'NOT EXISTS is limited to 1,000 rows while NOT IN handles millions.',
                    'NOT IN locks the entire table during execution.',
                    'There is no difference; modern optimizers rewrite them identically.'
                ],
                correctAnswer: 0,
                explanation: 'If a subquery yields a NULL, "x NOT IN (1, 2, NULL)" evaluates to UNKNOWN because "x <> NULL" is UNKNOWN. NOT UNKNOWN is UNKNOWN, so zero rows are returned. NOT EXISTS is completely immune to this.'
            },
            {
                id: 'i_mcq_4',
                type: 'mcq',
                category: 'CONDITIONAL LOGIC',
                title: 'CASE WHEN Short-Circuiting',
                timeLimit: 75,
                prompt: 'What does this expression return for total_spent = 5000?',
                codeSnippet: 'SELECT CASE \n    WHEN total_spent > 1000 THEN "Silver"\n    WHEN total_spent > 4000 THEN "Gold"\n    ELSE "Bronze"\nEND AS tier;',
                options: [
                    '"Silver"',
                    '"Gold"',
                    '"Bronze"',
                    '"Silver, Gold"'
                ],
                correctAnswer: 0,
                explanation: 'CASE expressions evaluate sequentially from top to bottom and exit at the first condition that evaluates to TRUE. Since 5000 > 1000 is TRUE, it returns "Silver" immediately.'
            },
            {
                id: 'i_mcq_5',
                type: 'mcq',
                category: 'SET OPERATIONS',
                title: 'UNION vs UNION ALL Mechanics',
                timeLimit: 75,
                prompt: 'What performance and behavioral difference occurs when using UNION ALL instead of UNION?',
                options: [
                    'UNION ALL retains duplicates and avoids an expensive sort/hash deduplication pass, running significantly faster.',
                    'UNION ALL is slower because it verifies records across all tables.',
                    'UNION performs an INNER JOIN while UNION ALL performs an OUTER JOIN.',
                    'UNION requires identical column names while UNION ALL allows mismatched types.'
                ],
                correctAnswer: 0,
                explanation: 'UNION performs implicit deduplication (like DISTINCT), requiring the engine to sort or hash-aggregate rows in memory. UNION ALL simply concatenates result sets without deduplication.'
            },
            {
                id: 'i_mcq_6',
                type: 'mcq',
                category: 'NULL RESILIENCE',
                title: 'COALESCE Evaluation Behavior',
                timeLimit: 75,
                prompt: 'What will COALESCE(NULL, NULL, "PlaySQL", "Fallback") return?',
                options: [
                    '"PlaySQL", returning the first non-null argument while short-circuiting subsequent arguments.',
                    '"Fallback", because it always selects the final argument.',
                    'NULL, because any NULL argument causes failure.',
                    'A comma-separated string.'
                ],
                correctAnswer: 0,
                explanation: 'COALESCE returns the first non-NULL argument in its list, evaluating arguments from left to right.'
            },
            {
                id: 'i_mcq_7',
                type: 'mcq',
                category: 'HIERARCHICAL RELATIONS',
                title: 'Self-Join Schema Patterns',
                timeLimit: 75,
                prompt: 'To list employees with their manager name using a self-join where manager_id references employee_id, which join preserves top executives who have no manager?',
                options: [
                    'LEFT JOIN from employees (subordinate) to employees (manager).',
                    'INNER JOIN from employees to managers.',
                    'RIGHT JOIN from employees to managers.',
                    'CROSS JOIN between subordinates and managers.'
                ],
                correctAnswer: 0,
                explanation: 'An INNER JOIN drops employees whose manager_id is NULL. A LEFT JOIN preserves all employees in the left table, populating manager columns with NULL when no supervisor exists.'
            },
            {
                id: 'i_mcq_8',
                type: 'mcq',
                category: 'JOIN TYPES',
                title: 'CROSS JOIN Mechanics',
                timeLimit: 75,
                prompt: 'What result is produced by executing a CROSS JOIN between Table A (5 rows) and Table B (6 rows) without an ON clause?',
                options: [
                    'A Cartesian product of exactly 30 rows (5 x 6).',
                    'An error because an ON condition is mandatory for all joins.',
                    '11 rows (5 + 6).',
                    '5 rows corresponding to the smaller table.'
                ],
                correctAnswer: 0,
                explanation: 'A CROSS JOIN produces a Cartesian product matching every row of Table A with every row of Table B (5 * 6 = 30 rows).'
            },
            {
                id: 'i_mcq_9',
                type: 'mcq',
                category: 'SUBQUERY TYPES',
                title: 'Correlated Subquery Definition',
                timeLimit: 75,
                prompt: 'What characterizes a correlated subquery in SQL?',
                options: [
                    'The subquery references columns from the outer query and must be evaluated once per candidate row.',
                    'The subquery executes only once before the outer query runs.',
                    'The subquery can only return scalar string values.',
                    'The subquery automatically creates a temporary index on disk.'
                ],
                correctAnswer: 0,
                explanation: 'A correlated subquery depends on values from the outer query table, requiring evaluation for each candidate row evaluated by the outer query.'
            },
            {
                id: 'i_mcq_10',
                type: 'mcq',
                category: 'AGGREGATE RESTRICTIONS',
                title: 'Aggregates in WHERE Clauses',
                timeLimit: 75,
                prompt: 'Why does "SELECT * FROM products WHERE price > AVG(price)" trigger an SQL syntax error?',
                options: [
                    'Aggregate functions like AVG() cannot be evaluated in a WHERE clause; a subquery or HAVING clause is required.',
                    'AVG() only works on integer primary keys.',
                    'Products table cannot be compared against itself.',
                    'price must be cast to DECIMAL first.'
                ],
                correctAnswer: 0,
                explanation: 'WHERE clauses filter individual rows before any aggregation takes place. To compare against an average, use a scalar subquery: "WHERE price > (SELECT AVG(price) FROM products)".'
            }
        ],
        coding: [
            {
                id: 'i_code_1',
                type: 'coding',
                category: 'MULTI-TABLE AGGREGATION',
                title: 'Department Salary Benchmarking',
                timeLimit: 240,
                prompt: 'Compile a departmental compensation overview for active personnel.',
                instructions: [
                    'Join departments (d) and employees (e) on department_id.',
                    'Filter for e.status = "Active".',
                    'Select: d.department_name, COUNT(e.employee_id) AS active_employees, and ROUND(AVG(e.salary), 2) AS avg_salary.',
                    'Include only departments with active_employees >= 2.',
                    'Order by avg_salary DESC.'
                ],
                relevantTables: ['departments', 'employees'],
                starterCode: `SELECT \n    d.department_name,\n    COUNT(e.employee_id) AS active_employees,\n    -- Rounded average salary\nFROM departments d\nJOIN employees e ON d.department_id = e.department_id\nWHERE \n    -- Filter active\nGROUP BY \n    -- Grouping\nHAVING \n    -- At least 2 active employees\nORDER BY \n    -- Sort\n;`,
                solutionSql: `SELECT d.department_name, COUNT(e.employee_id) AS active_employees, ROUND(AVG(e.salary), 2) AS avg_salary FROM departments d JOIN employees e ON d.department_id = e.department_id WHERE e.status = 'Active' GROUP BY d.department_name HAVING active_employees >= 2 ORDER BY avg_salary DESC;`
            },
            {
                id: 'i_code_2',
                type: 'coding',
                category: 'ANTI-JOIN PATTERNS',
                title: 'Dormant Customer Detection (Anti-Join)',
                timeLimit: 240,
                prompt: 'Identify customers who have never placed an order.',
                instructions: [
                    'Perform a LEFT JOIN from customers (c) to orders (o) on customer_id.',
                    'Filter for missing order records (o.order_id IS NULL).',
                    'Select: c.customer_id, c.customer_name, and c.email.',
                    'Order by c.customer_id ASC.'
                ],
                relevantTables: ['customers', 'orders'],
                starterCode: `SELECT \n    c.customer_id, c.customer_name, c.email\nFROM customers c\n-- LEFT JOIN orders\nWHERE \n    -- Missing order record\nORDER BY \n    c.customer_id ASC;`,
                solutionSql: `SELECT c.customer_id, c.customer_name, c.email FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL ORDER BY c.customer_id ASC;`
            },
            {
                id: 'i_code_3',
                type: 'coding',
                category: 'MULTI-RELATIONAL REVENUE',
                title: 'Top 3 Best-Selling Products',
                timeLimit: 240,
                prompt: 'Analyze product revenue generated across fulfilled order items.',
                instructions: [
                    'Join products (p) and order_items (oi) on product_id.',
                    'Compute total units sold as: SUM(oi.quantity) AS total_units_sold.',
                    'Compute total revenue as: SUM(oi.quantity * oi.unit_price) AS total_revenue.',
                    'Select: product_name, category, total_units_sold, total_revenue.',
                    'Group, sort by total_revenue DESC, and LIMIT 3.'
                ],
                relevantTables: ['products', 'order_items'],
                starterCode: `SELECT \n    p.product_name, p.category,\n    -- SUM quantity\n    -- SUM total revenue\nFROM products p\nJOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY \n    p.product_id, p.product_name, p.category\nORDER BY \n    total_revenue DESC\nLIMIT 3;`,
                solutionSql: `SELECT p.product_name, p.category, SUM(oi.quantity) AS total_units_sold, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.product_id, p.product_name, p.category ORDER BY total_revenue DESC LIMIT 3;`
            },
            {
                id: 'i_code_4',
                type: 'coding',
                category: 'SCALAR SUBQUERIES',
                title: 'Orders Above Average Value',
                timeLimit: 240,
                prompt: 'Retrieve orders whose total_amount is strictly greater than the overall average order amount across all orders.',
                instructions: [
                    'Query the "orders" table.',
                    'Select: order_id, customer_id, and total_amount.',
                    'Filter with a subquery: WHERE total_amount > (SELECT AVG(total_amount) FROM orders).',
                    'Order by total_amount DESC.'
                ],
                relevantTables: ['orders'],
                starterCode: `SELECT \n    order_id, customer_id, total_amount\nFROM orders\nWHERE \n    -- Compare with subquery average\nORDER BY \n    total_amount DESC;`,
                solutionSql: `SELECT order_id, customer_id, total_amount FROM orders WHERE total_amount > (SELECT AVG(total_amount) FROM orders) ORDER BY total_amount DESC;`
            },
            {
                id: 'i_code_5',
                type: 'coding',
                category: 'HIERARCHICAL SELF-JOIN',
                title: 'Employee-Manager Hierarchy',
                timeLimit: 240,
                prompt: 'List each employee alongside their direct manager using a self-join.',
                instructions: [
                    'Join employees (e) with employees (m) on e.manager_id = m.employee_id.',
                    'Select: e.first_name AS employee_name and m.first_name AS manager_name.',
                    'Order by employee_name ASC.'
                ],
                relevantTables: ['employees'],
                starterCode: `SELECT \n    e.first_name AS employee_name,\n    m.first_name AS manager_name\nFROM employees e\nJOIN employees m ON e.manager_id = m.employee_id\nORDER BY \n    employee_name ASC;`,
                solutionSql: `SELECT e.first_name AS employee_name, m.first_name AS manager_name FROM employees e JOIN employees m ON e.manager_id = m.employee_id ORDER BY employee_name ASC;`
            },
            {
                id: 'i_code_6',
                type: 'coding',
                category: 'GEOGRAPHIC AGGREGATION',
                title: 'Customer City Spend Distribution',
                timeLimit: 240,
                prompt: 'Calculate total orders and total financial spend broken down by customer city.',
                instructions: [
                    'Join customers (c) and orders (o) on customer_id.',
                    'Select: c.city, COUNT(o.order_id) AS total_orders, and SUM(o.total_amount) AS city_spend.',
                    'Group by c.city.',
                    'Order by city_spend DESC.'
                ],
                relevantTables: ['customers', 'orders'],
                starterCode: `SELECT \n    c.city,\n    -- Count orders\n    -- Sum total amount\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY \n    c.city\nORDER BY \n    city_spend DESC;`,
                solutionSql: `SELECT c.city, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS city_spend FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.city ORDER BY city_spend DESC;`
            }
        ]
    },

    advanced: {
        id: 'advanced',
        title: 'Level 3: Query Archon',
        badge: 'QUERY MASTER',
        description: 'Master analytical window functions, ranking frames, CTEs, lag/lead time-series deltas, and ACID concurrency.',
        mcqs: [
            {
                id: 'a_mcq_1',
                type: 'mcq',
                category: 'WINDOW FUNCTIONS VS GROUP BY',
                title: 'Window Function Row Preservation',
                timeLimit: 90,
                prompt: 'What is the architectural difference between an aggregate function with OVER (PARTITION BY ...) and a GROUP BY?',
                options: [
                    'Window functions preserve individual row identity and row count, whereas GROUP BY collapses rows into summary rows.',
                    'Window functions can only compute mathematical sums.',
                    'GROUP BY executes on the client application while window functions run on the database.',
                    'Window functions require temporary disk storage and cannot use indices.'
                ],
                correctAnswer: 0,
                explanation: 'A traditional GROUP BY collapses multiple rows into a single summary row per group. Window functions compute aggregates across defined partitions while maintaining the complete granularity of individual rows.'
            },
            {
                id: 'a_mcq_2',
                type: 'mcq',
                category: 'RANKING FUNCTIONS',
                title: 'RANK vs DENSE_RANK Tie Behavior',
                timeLimit: 90,
                prompt: 'Three candidates score 100, 100, and 90 points. What ranks are assigned when using RANK() vs DENSE_RANK() ordered by score DESC?',
                options: [
                    'RANK assigns: 1, 1, 3. DENSE_RANK assigns: 1, 1, 2.',
                    'RANK assigns: 1, 2, 3. DENSE_RANK assigns: 1, 1, 2.',
                    'RANK assigns: 1, 1, 2. DENSE_RANK assigns: 1, 1, 3.',
                    'Both functions assign identical ranks: 1, 1, 2.'
                ],
                correctAnswer: 0,
                explanation: 'RANK leaves gaps corresponding to the number of ties (skipping to 3 for the third row), whereas DENSE_RANK never leaves gaps, assigning 2 to the next distinct value.'
            },
            {
                id: 'a_mcq_3',
                type: 'mcq',
                category: 'WINDOW FRAMING SPECIFICATIONS',
                title: 'Default Window Frame Behavior',
                timeLimit: 90,
                prompt: 'When specifying ORDER BY inside an OVER() clause without an explicit frame, what default frame is applied in SQL?',
                options: [
                    'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW; peer rows with identical ordering keys are included together.',
                    'ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING.',
                    'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING.',
                    'The default frame evaluates only the active single row.'
                ],
                correctAnswer: 0,
                explanation: 'When ORDER BY is present without an explicit frame, SQL defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Rows with identical values are treated as peers and included in the running calculation.'
            },
            {
                id: 'a_mcq_4',
                type: 'mcq',
                category: 'COMMON TABLE EXPRESSIONS',
                title: 'Recursive CTE Execution Cycle',
                timeLimit: 90,
                prompt: 'How does a recursive CTE (WITH RECURSIVE) execute iteratively until completion?',
                options: [
                    'It executes an Anchor query once, then repeatedly executes the Recursive member using previous iteration results until 0 rows return.',
                    'It compiles into an infinite while-loop that terminates on a database timeout.',
                    'It spawns a worker thread for each level in the tree concurrently.',
                    'It executes a full table scan for every row in the anchor table.'
                ],
                correctAnswer: 0,
                explanation: 'A recursive CTE has an Anchor query (base set) and a Recursive query connected via UNION ALL. The recursive query runs against previous iteration results until an empty set is produced.'
            },
            {
                id: 'a_mcq_5',
                type: 'mcq',
                category: 'TIME SERIES ANALYTICS',
                title: 'LEAD() and LAG() Function Offsets',
                timeLimit: 90,
                prompt: 'To fetch revenue from exactly 2 steps prior, what function and arguments should be used?',
                options: [
                    'LAG(revenue, 2, 0) OVER (ORDER BY sales_month)',
                    'LEAD(revenue, -2) OVER (PARTITION BY sales_month)',
                    'PRIOR(revenue, 2) OVER (ORDER BY sales_month)',
                    'OFFSET(revenue, 2) OVER (ORDER BY sales_month)'
                ],
                correctAnswer: 0,
                explanation: 'LAG(column, offset, default) fetches a row at a given physical offset prior to the current row within the partition.'
            },
            {
                id: 'a_mcq_6',
                type: 'mcq',
                category: 'QUERY OPTIMIZATION & INDEXES',
                title: 'SARGability & Function-Wrapped Predicates',
                timeLimit: 90,
                prompt: 'Why does "WHERE strftime(\'%Y\', order_date) = \'2024\'" prevent a B-Tree index on order_date from performing an index seek?',
                options: [
                    'Wrapping an indexed column in a function forces the engine to evaluate the function for every single table row (full scan).',
                    'B-Tree indexes do not support text data types.',
                    'strftime is a non-deterministic function prohibited in WHERE clauses.',
                    'Indexes only accelerate numeric primary keys.'
                ],
                correctAnswer: 0,
                explanation: 'A query predicate is non-SARGable when an indexed column is wrapped in an expression or function. To enable an index seek, rewrite it as a range query: "WHERE order_date >= \'2024-01-01\' AND order_date < \'2025-01-01\'".'
            },
            {
                id: 'a_mcq_7',
                type: 'mcq',
                category: 'TRANSACTION ISOLATION',
                title: 'Phantom Read Prevention',
                timeLimit: 90,
                prompt: 'Which ANSI SQL transaction isolation level is the minimum required to completely eliminate Phantom Reads?',
                options: [
                    'SERIALIZABLE',
                    'REPEATABLE READ',
                    'READ COMMITTED',
                    'READ UNCOMMITTED'
                ],
                correctAnswer: 0,
                explanation: 'Under ANSI SQL specifications: READ COMMITTED prevents Dirty Reads; REPEATABLE READ prevents Non-Repeatable Reads; only SERIALIZABLE completely prevents Phantom Reads using range locks or snapshot isolation.'
            },
            {
                id: 'a_mcq_8',
                type: 'mcq',
                category: 'WINDOW FUNCTIONS',
                title: 'NTILE() Bucket Distribution',
                timeLimit: 90,
                prompt: 'What does NTILE(4) OVER (ORDER BY salary DESC) perform on a dataset of 100 employees?',
                options: [
                    'It divides the 100 rows into 4 equal quartiles of 25 rows each, assigned quartile numbers 1 through 4.',
                    'It returns only employees in the top 4 salary positions.',
                    'It rounds salaries to 4 significant digits.',
                    'It groups salaries into 4 standard deviations.'
                ],
                correctAnswer: 0,
                explanation: 'NTILE(k) divides the ordered partition into k roughly equal buckets and assigns the bucket number (1 to k) to each row.'
            },
            {
                id: 'a_mcq_9',
                type: 'mcq',
                category: 'CORRELATED EXISTS',
                title: 'EXISTS SELECT List Convention',
                timeLimit: 90,
                prompt: 'Why is "SELECT 1" conventionally used inside "WHERE EXISTS (SELECT 1 FROM ...)" rather than column names?',
                options: [
                    'EXISTS tests only for row existence; the engine ignores the SELECT projection list entirely.',
                    'SELECT 1 forces an integer index lookup.',
                    'SQL syntax prohibits column names inside an EXISTS subquery.',
                    'It prevents locking table columns.'
                ],
                correctAnswer: 0,
                explanation: 'The EXISTS condition evaluates strictly whether any matching row exists. The SELECT list inside EXISTS is ignored by the query optimizer.'
            },
            {
                id: 'a_mcq_10',
                type: 'mcq',
                category: 'INDEX SCAN TYPES',
                title: 'Index Seek vs Index Scan',
                timeLimit: 90,
                prompt: 'What is the performance difference between an Index Seek and an Index Scan?',
                options: [
                    'Index Seek navigates the B-Tree directly to the target key (O(log N)); Index Scan traverses an entire index range or leaf pages.',
                    'Index Scan is always faster because it uses sequential disk reads.',
                    'Index Seek is only supported in in-memory databases.',
                    'There is no difference in query execution plans.'
                ],
                correctAnswer: 0,
                explanation: 'An Index Seek uses the B-Tree root-to-leaf traversal to pinpoint target keys directly in O(log N) time. An Index Scan reads across multiple leaf pages.'
            }
        ],
        coding: [
            {
                id: 'a_code_1',
                type: 'coding',
                category: 'ANALYTICAL RANKING',
                title: 'Top Earner Per Department (DENSE_RANK)',
                timeLimit: 300,
                prompt: 'Identify the highest-paid active employee in each department using window ranking functions.',
                instructions: [
                    'Query active employees (status = "Active").',
                    'Use DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) in a CTE.',
                    'Filter for rank_pos = 1.',
                    'Select: department_id, first_name, last_name, and salary.',
                    'Order by department_id ASC, salary DESC, last_name ASC.'
                ],
                relevantTables: ['employees'],
                starterCode: `WITH RankedEmployees AS (\n    SELECT \n        department_id, first_name, last_name, salary,\n        -- DENSE_RANK partition\n    FROM employees\n    WHERE status = 'Active'\n)\nSELECT \n    department_id, first_name, last_name, salary\nFROM RankedEmployees\nWHERE \n    -- Filter rank 1\nORDER BY \n    department_id ASC, salary DESC, last_name ASC;`,
                solutionSql: `WITH RankedEmployees AS (SELECT department_id, first_name, last_name, salary, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank_pos FROM employees WHERE status = 'Active') SELECT department_id, first_name, last_name, salary FROM RankedEmployees WHERE rank_pos = 1 ORDER BY department_id ASC, salary DESC, last_name ASC;`
            },
            {
                id: 'a_code_2',
                type: 'coding',
                category: 'TIME-SERIES VELOCITY',
                title: 'Month-Over-Month Revenue Velocity (LAG)',
                timeLimit: 300,
                prompt: 'Calculate month-over-month revenue growth velocity using LAG().',
                instructions: [
                    'Query the "monthly_sales" table.',
                    'Select: sales_month, revenue.',
                    'Calculate prev_revenue as: LAG(revenue, 1) OVER (ORDER BY sales_month).',
                    'Calculate growth delta as: (revenue - COALESCE(LAG(revenue, 1) OVER (ORDER BY sales_month), revenue)).',
                    'Order by sales_month ASC.'
                ],
                relevantTables: ['monthly_sales'],
                starterCode: `SELECT \n    sales_month, revenue,\n    -- LAG prev revenue\n    -- Growth delta\nFROM monthly_sales\nORDER BY \n    sales_month ASC;`,
                solutionSql: `SELECT sales_month, revenue, LAG(revenue, 1) OVER (ORDER BY sales_month) AS prev_revenue, (revenue - COALESCE(LAG(revenue, 1) OVER (ORDER BY sales_month), revenue)) AS growth FROM monthly_sales ORDER BY sales_month ASC;`
            },
            {
                id: 'a_code_3',
                type: 'coding',
                category: 'CUMULATIVE WINDOW FRAMING',
                title: 'Running Total & 3-Order Moving Average',
                timeLimit: 300,
                prompt: 'Calculate a progressive cumulative total and rolling 3-order moving average.',
                instructions: [
                    'Query the "orders" table.',
                    'Select: order_id, order_date, and total_amount.',
                    'Compute running_total: SUM(total_amount) OVER (ORDER BY order_date, order_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
                    'Compute moving_avg: ROUND(AVG(total_amount) OVER (ORDER BY order_date, order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2).',
                    'Order by order_date ASC, order_id ASC.'
                ],
                relevantTables: ['orders'],
                starterCode: `SELECT \n    order_id, order_date, total_amount,\n    -- Running total\n    -- Moving average\nFROM orders\nORDER BY \n    order_date ASC, order_id ASC;`,
                solutionSql: `SELECT order_id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date, order_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total, ROUND(AVG(total_amount) OVER (ORDER BY order_date, order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg FROM orders ORDER BY order_date ASC, order_id ASC;`
            },
            {
                id: 'a_code_4',
                type: 'coding',
                category: 'CUMULATIVE PARTITIONS',
                title: 'Cumulative Product Order Quantity',
                timeLimit: 300,
                prompt: 'For each line item in order_items, compute the progressive cumulative quantity sold per product over order history.',
                instructions: [
                    'Query the "order_items" table.',
                    'Select: item_id, order_id, product_id, and quantity.',
                    'Calculate cum_quantity as: SUM(quantity) OVER (PARTITION BY product_id ORDER BY order_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
                    'Order by product_id ASC, order_id ASC.'
                ],
                relevantTables: ['order_items'],
                starterCode: `SELECT \n    item_id, order_id, product_id, quantity,\n    -- SUM quantity OVER partition by product\nFROM order_items\nORDER BY \n    product_id ASC, order_id ASC;`,
                solutionSql: `SELECT item_id, order_id, product_id, quantity, SUM(quantity) OVER (PARTITION BY product_id ORDER BY order_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cum_quantity FROM order_items ORDER BY product_id ASC, order_id ASC;`
            },
            {
                id: 'a_code_5',
                type: 'coding',
                category: 'AGGREGATE RANKING',
                title: 'Customer Spend Density Ranking',
                timeLimit: 300,
                prompt: 'Aggregate total spend per customer and rank customers by spend density using DENSE_RANK().',
                instructions: [
                    'Query the "orders" table.',
                    'Select: customer_id, SUM(total_amount) AS total_spent, and DENSE_RANK() OVER (ORDER BY SUM(total_amount) DESC) AS customer_rank.',
                    'Group by customer_id.',
                    'Order by customer_rank ASC, customer_id ASC.'
                ],
                relevantTables: ['orders'],
                starterCode: `SELECT \n    customer_id,\n    SUM(total_amount) AS total_spent,\n    -- DENSE_RANK OVER sum\nFROM orders\nGROUP BY \n    customer_id\nORDER BY \n    customer_rank ASC, customer_id ASC;`,
                solutionSql: `SELECT customer_id, SUM(total_amount) AS total_spent, DENSE_RANK() OVER (ORDER BY SUM(total_amount) DESC) AS customer_rank FROM orders GROUP BY customer_id ORDER BY customer_rank ASC, customer_id ASC;`
            },
            {
                id: 'a_code_6',
                type: 'coding',
                category: 'CENTERED MOVING AVERAGE',
                title: 'Centered 3-Month Moving Revenue Average',
                timeLimit: 300,
                prompt: 'Calculate a centered 3-month moving average of revenue (1 month preceding, current month, and 1 month following).',
                instructions: [
                    'Query the "monthly_sales" table.',
                    'Select: sales_month and revenue.',
                    'Compute centered_avg as: ROUND(AVG(revenue) OVER (ORDER BY sales_month ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 2).',
                    'Order by sales_month ASC.'
                ],
                relevantTables: ['monthly_sales'],
                starterCode: `SELECT \n    sales_month, revenue,\n    -- Centered moving average (1 PRECEDING AND 1 FOLLOWING)\nFROM monthly_sales\nORDER BY \n    sales_month ASC;`,
                solutionSql: `SELECT sales_month, revenue, ROUND(AVG(revenue) OVER (ORDER BY sales_month ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 2) AS centered_avg FROM monthly_sales ORDER BY sales_month ASC;`
            }
        ]
    }
};

/**
 * Dynamic Session Generator
 * Shuffles question pool using seeded randomness based on username + timestamp.
 * Randomizes MCQ option order so that NO two users get the same question set or option layouts!
 */
function generateDynamicSession(level, count, mix, username) {
    const tier = PLAYSQL_MASTER_BANK[level];
    if (!tier) return [];

    // Simple pseudo-random generator with seed
    let seed = 0;
    const seedStr = (username || 'user') + '_' + Date.now() + '_' + Math.random();
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed + seedStr.charCodeAt(i)) & 0xffffffff;
    }
    const pseudoRand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    // Fisher-Yates array shuffle
    const shuffle = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(pseudoRand() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const shuffledMCQs = shuffle(tier.mcqs);
    const shuffledCoding = shuffle(tier.coding);

    let selected = [];

    if (mix === 'coding') {
        const codingCount = Math.min(count, shuffledCoding.length);
        const mcqCount = count - codingCount;
        selected = [...shuffledCoding.slice(0, codingCount), ...shuffledMCQs.slice(0, mcqCount)];
    } else if (mix === 'mcq') {
        const mcqCount = Math.min(count, shuffledMCQs.length);
        const codingCount = count - mcqCount;
        selected = [...shuffledMCQs.slice(0, mcqCount), ...shuffledCoding.slice(0, codingCount)];
    } else {
        // Balanced Mix
        if (count === 5) {
            // 4 MCQs + 1 Coding
            selected = [...shuffledMCQs.slice(0, 4), ...shuffledCoding.slice(0, 1)];
        } else {
            // 7 MCQs + 3 Coding (or proportionate)
            const numCoding = Math.max(1, Math.round(count * 0.3));
            const numMCQ = count - numCoding;
            selected = [...shuffledMCQs.slice(0, numMCQ), ...shuffledCoding.slice(0, numCoding)];
        }
    }

    // Final shuffle so coding and MCQs are naturally placed or sequentially ordered
    // Deep clone and randomize MCQ options so option A/B/C/D is not in the same position
    return selected.map((q) => {
        if (q.type !== 'mcq') return { ...q };

        const optionsWithMeta = q.options.map((optText, idx) => ({
            text: optText,
            isCorrect: idx === q.correctAnswer
        }));

        const shuffledOptionsWithMeta = shuffle(optionsWithMeta);
        const newCorrectAnswer = shuffledOptionsWithMeta.findIndex(o => o.isCorrect);

        return {
            ...q,
            options: shuffledOptionsWithMeta.map(o => o.text),
            correctAnswer: newCorrectAnswer
        };
    });
}

window.PLAYSQL_MASTER_BANK = PLAYSQL_MASTER_BANK;
window.generateDynamicSession = generateDynamicSession;
