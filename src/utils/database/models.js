import pool from "./db";

//cREATE sINGLE rEPEATABLE Trigger !;
const create_update_at_trigger = async () => {
  try {
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
        `);
  } catch (e) {
    throw new Error(e);
  }
};

//Complete before going to school tomorrow: Check chatgpt and complete blunders

//Create Tables
const create_merchant_table = async () => {
  try {
    await pool.query(`
        -- Table
        CREATE TABLE IF NOT EXISTS merchants (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            phone VARCHAR(11) UNIQUE NOT NULL,
            avatar_url TEXT,
            name TEXT,
            email TEXT,
            email_verified BOOLEAN DEFAULT FALSE,
            subcribed_to_broadcast BOOLEAN DEFAULT TRUE,
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW()
            )   
            
        --Triggers (update at!)
         DROP TRIGGER IF EXISTS trg_merchants_updated_at ON merchants;

         CREATE TRIGGER trg_merchants_updated_at
         BEFORE UPDATE ON merchants
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
         
         
         --INDEX on phone
         CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants(phone);
         
        `);
  } catch (e) {
    throw new Error(e);
  }
};

const create_store_table = () => {
  try {
    return `
       --ENUMS
       DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'store_category_type') THEN
    CREATE TYPE store_category_type AS ENUM ('Supermarket & Retails', 'Clothing & Apparel', 'Others');     
  END IF;
END$$;

--Table Construct
    CREATE TABLE IF NOT EXISTS stores (  
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        --- (m) STORE TO 1 MERCHANT 
        merchant_id UUID NOT NULL REFERENCES merchants ON DELETE CASCADE,
        category store_category_type NOT NULL DEFAULT 'Others',
        bio TEXT,
        logo TEXT,
        video_profile TEXT,
        name TEXT NOT NULL,
        address TEXT,
        slug VARCHAR(30) UNIQUE NOT NULL, ---Text length must be greater than three, some many condition here
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        )   
        
        
        --Index
        CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug)
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_stores_updated_at ON stores;

         CREATE TRIGGER trg_stores_updated_at
         BEFORE UPDATE ON stores
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
         `;
  } catch (e) {}
};

const create_categories_table = () => {
  try {
    return `    
        --Table Construct
        CREATE TABLE IF NOT EXISTS category (  
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         merchant_id UUID  NOT NULL REFERENCES merchants ON DELETE CASCADE,
         name TEXT NOT NULL,
         isVisible BOOLEAN NOT NULL DEFAULT TRUE,    
         updated_at TIMESTAMPTZ DEFAULT NOW(),
         created_at TIMESTAMPTZ DEFAULT NOW()
        )   
          
        --Function: cannot be more than 50!
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_category_updated_at ON category;

         CREATE TRIGGER trg_category_updated_at
         BEFORE UPDATE ON category
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
        `;
  } catch (e) {}
};
const create_products_table = () => {
  try {
    return `
        
        --Table Construct
        CREATE TABLE IF NOT EXISTS products (  
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        merchant_id UUID NOT NULL REFERENCES merchants ON DELETE CASCADE,
        category_id UUID REFERENCES category ON SET NULL,
        name TEXT NOT NULL,
        price NUMERIC(15, 2) NOT NULL,
        images TEXT[],
        description TEXT,
        quantity INTEGER,
        mark_soldout BOOLEAN NOT NULL DEFAULT FALSE, 
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        )   
        
        --Function to add / image dynamically
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_products_updated_at ON products;

         CREATE TRIGGER trg_products_updated_at
         BEFORE UPDATE ON products
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       `;
  } catch (e) {}
};
const create_orders_table = () => {
  try {
    return `        
     --ENUMS
     DO $$
     BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
     CREATE TYPE order_status AS ENUM('pending', 'processing', 'cancelled', 'completed', 'on delivery');    
  END IF;
END$$;

     
     --Table Construct
        CREATE TABLE IF NOT EXISTS orders (  
        id SERIAL PRIMARY KEY,
        merchant_id UUID NOT NULL REFERENCES merchants ON DELETE CASCADE,
        customer_id UUID  NOT NULL REFERENCES customer_store(customer_id) ON SET NULL,
        store_id UUID REFERENCES stores ON SET NULL,
        total_amount NUMERIC(15, 2) NOT NULL,
        cart_items jsonb NOT NULL,
        note TEXT,
        address TEXT,
        status order_status NOT NULL DEFAULT 'pending',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        )   
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;

         CREATE TRIGGER trg_orders_updated_at
         BEFORE UPDATE ON orders
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       `;
  } catch (e) {}
};

const create_customers_table = () => {
  try {
    return `        
    --Table Construct
        CREATE TABLE IF NOT EXISTS customers (  
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(11) NOT NULL UNIQUE,
        isBanned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        update_at TIMESTAMPTZ DEFAULT NOW()
        )   

        --INDEX ON PHONE
        CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)

        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;

         CREATE TRIGGER trg_customers_updated_at
         BEFORE UPDATE ON customers
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       
      `;
  } catch (e) {}
};
const create_customer_store_table = () => {
  try {
    return `
        
    --Table Construct
    CREATE TABLE IF NOT EXISTS customer_store (  
       customer_id UUID NOT REFERENCES customers ON DELETE CASCADE,
       store_id UUID NOT NULL REFERENCES stores ON DELETE CASCADE,
       name TEXT,
       tag TEXT,
       blacklisted BOOLEAN DEFAULT FALSE,
       email text,
       PRIMARY KEY (store_id, customer_id),
       updated_at TIMESTAMPTZ DEFAULT NOW(),
       created_at TIMESTAMPTZ DEFAULT NOW()
      )   
          
       
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_customer_store_updated_at ON customer_store;

         CREATE TRIGGER trg_customer_store_updated_at
         BEFORE UPDATE ON customer_store
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       `;
  } catch (e) {}
};

const create_subcription_table = () => {};
const create_usage_log_table = () => {};
const create_whatsapp_state_table = () => {};
