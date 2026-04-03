import pool from "./db.js";

//cREATE sINGLE rEPEATABLE Trigger !;
export const create_update_at_trigger = async () => {
  try {
    const res = await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
      END;
    $$ LANGUAGE plpgsql;
        `);

    console.log(res);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

//-------------Store and Merchant -----------
export const create_merchant_table = async () => {
  try {
    const res = await pool.query(`
      -- Table
      CREATE TABLE IF NOT EXISTS merchants (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            phone VARCHAR(11) UNIQUE NOT NULL,
            phone_country_code VARCHAR(4) DEFAULT '234' ,
            avatar_url TEXT,
            name TEXT,
            email TEXT,
            email_verified BOOLEAN DEFAULT FALSE,
            subcribed_to_broadcast BOOLEAN DEFAULT TRUE,
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW()
            );   
            
            -- Triggers (update at!)
            DROP TRIGGER IF EXISTS trg_merchants_updated_at ON merchants;
            
            CREATE TRIGGER trg_merchants_updated_at
            BEFORE UPDATE ON merchants
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
            
            
            --INDEX on phone
            CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants(phone);
            
            `);
    console.log(res);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const create_store_table = async () => {
  try {
    const res = await pool.query(`
      --ENUMS
      DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'store_category_type') THEN
    CREATE TYPE store_category_type AS ENUM ('Shopping / Retails Store', 'Clothing & Apparel', 'Beauty, Cosmetic and personal Care', 'Restaurant', 'SuperMarket / Retails', 'Others');     
  END IF;
END$$;

--Table Construct
    CREATE TABLE IF NOT EXISTS stores (  
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        merchant_id UUID NOT NULL REFERENCES merchants ON DELETE CASCADE,
        category store_category_type NOT NULL DEFAULT 'Others',
        bio TEXT,
        logo TEXT,
        video_profile TEXT,
        name TEXT NOT NULL,
        address TEXT,
        slug VARCHAR(20)  NOT NULL, ---Text length must be greater than three, some many condition here
        
        CONSTRAINT store_slug_check CHECK (
        length(slug) >= 3
        AND slug ~ '^[a-z0-9-]+$' 
        AND slug !~ '^[0-9]+$' 
        ),

        CONSTRAINT store_slug_unique UNIQUE(slug),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        );   
        
        
        --Index
        CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_stores_updated_at ON stores;

         CREATE TRIGGER trg_stores_updated_at
         BEFORE UPDATE ON stores
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
         `);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const create_categories_table = async () => {
  try {
    const res = await pool.query(`
        --Table Construct
        CREATE TABLE IF NOT EXISTS category (  
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         store_id UUID  NOT NULL REFERENCES stores ON DELETE CASCADE,
         name TEXT NOT NULL,
         isVisible BOOLEAN NOT NULL DEFAULT TRUE,    
         updated_at TIMESTAMPTZ DEFAULT NOW(),
         created_at TIMESTAMPTZ DEFAULT NOW()
        );   
          
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_category_updated_at ON category;

         CREATE TRIGGER trg_category_updated_at
         BEFORE UPDATE ON category
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
        `);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
export const create_products_table = async () => {
  try {
    const res = await pool.query(`
        
        --Table Construct
        CREATE TABLE IF NOT EXISTS products (  
        id SERIAL PRIMARY KEY,
        store_id UUID NOT NULL REFERENCES stores ON DELETE CASCADE,
        category_id UUID REFERENCES category ON DELETE SET NULL,
        name TEXT NOT NULL,
        price NUMERIC(15, 2) NOT NULL,
        isVisible BOOLEAN NOT NULL DEFAULT FALSE,
        images TEXT[],
        description TEXT,
        quantity INTEGER,
        mark_soldout BOOLEAN NOT NULL DEFAULT FALSE, 
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        );   
        
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_products_updated_at ON products;

         CREATE TRIGGER trg_products_updated_at
         BEFORE UPDATE ON products
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       `);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
export const create_orders_table = async () => {
  try {
    const res = await pool.query(`    --ENUMS
     DO $$
     BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
     CREATE TYPE order_status AS ENUM('pending', 'processing', 'cancelled', 'completed', 'on delivery');    
  END IF;
END$$;

     
     --Table Construct
        CREATE TABLE IF NOT EXISTS orders (  
        id SERIAL PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customer_store(customer_id) ON DELETE SET NULL,
        store_id UUID NOT NULL REFERENCES stores ON DELETE CASCADE,
        total_amount NUMERIC(15, 2) NOT NULL,
        cart_items json NOT NULL,
        note TEXT,
        address TEXT,
        status order_status NOT NULL DEFAULT 'pending',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        );   
        
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;

         CREATE TRIGGER trg_orders_updated_at
         BEFORE UPDATE ON orders
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       `);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const create_customers_table = async () => {
  try {
    const res = await pool.query(`        
    --Table Construct
        CREATE TABLE IF NOT EXISTS customers (  
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(11) NOT NULL UNIQUE,
        isBanned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        update_at TIMESTAMPTZ DEFAULT NOW()
        );   

        --INDEX ON PHONE
        CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;

         CREATE TRIGGER trg_customers_updated_at
         BEFORE UPDATE ON customers
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       
      `);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
export const create_customer_store_table = async () => {
  try {
    const res = await pool.query(`       
    --Table Construct
    CREATE TABLE IF NOT EXISTS customer_store (  
       customer_id UUID UNIQUE NOT NULL REFERENCES customers ON DELETE CASCADE,
       store_id UUID  NOT NULL REFERENCES stores ON DELETE CASCADE,
       name TEXT,
       tag TEXT,
       total_orders INTEGER DEFAULT 0,
       total_orders_amount NUMERIC(15, 2) DEFAULT 0,
       blacklisted BOOLEAN DEFAULT FALSE,
       email text,
       PRIMARY KEY (store_id, customer_id),
       updated_at TIMESTAMPTZ DEFAULT NOW(),
       created_at TIMESTAMPTZ DEFAULT NOW()
      );   
           --INDEX
      CREATE INDEX IF NOT EXISTS idx_customer_store_store_id ON customer_store(store_id);
      CREATE INDEX IF NOT EXISTS idx_customer_store_customer_id ON customer_store(customer_id);

       
        --Triggers (update at!)
        DROP TRIGGER IF EXISTS trg_customer_store_updated_at ON customer_store;

         CREATE TRIGGER trg_customer_store_updated_at
         BEFORE UPDATE ON customer_store
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
       `);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

//-------------Authentication- -----------
export const create_login_tokens_table = async () => {
  try {
    const res = await pool.query(`
    --Table 
    CREATE TABLE IF NOT EXISTS login_tokens (
       id SERIAL PRIMARY KEY,
       identifier TEXT NOT NULL, ---Phone / merchant_id
       used BOOLEAN DEFAULT FALSE,
       token TEXT NOT NULL,  
       expires_at TIMESTAMPTZ 
    );   

    --INDEX
    CREATE INDEX IF NOT EXISTS idx_login_tokens_token ON login_tokens(token);
        
`);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
export const create_otp_code_table = async () => {
  try {
    const res = await pool.query(`
    --Table 
    CREATE TABLE IF NOT EXISTS otp_codes (
       id SERIAL PRIMARY KEY,
       identifier TEXT NOT NULL, --phone
       hashed_code VARCHAR(30) NOT NULL, --- length OF hash code!  
       used BOOLEAN DEFAULT FALSE,
       expires_at TIMESTAMPTZ
    );   

    --INDEX
    CREATE INDEX IF NOT EXISTS idx_login_tokens_token ON login_tokens(token);
        
`);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

//---------------------------------------

/// ---------- Subscription, Invoice and Payment (CANNOT BE DELETE BY MER) ------

/*
Automatically Create 'Subscription Table' immdeiately after 'Creating Merchant'
*/

export const create_subscription_table = async () => {
  try {
    const res = await pool.query(`
       --ENUM
       CREATE TYPE subscription_status AS ENUM ('active', 'non_renew', 'completed', 'trial');

      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        subscription_code TEXT,
        plan_code VARCHAR(20), --- 'trial | PLN_CODE'
        
        currency VARCHAR(4),
        amount INTEGER,
       
        status subscription_status NOT NULL DEFAULT 'active',
       
        --USER iDENTIFIER
        merchant_id UUID NOT NULL REFERENCES merchants ON DELETE SET NULL,
        customer_code TEXT,    
        email_token TEXT,

        --dATES 
        start_date TIMESTAMPTZ,
        end_date TIMESTAMPTZ,
        next_payment_date TIMESTAMPTZ,

        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        );  

      
         DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON subscriptions;

         CREATE TRIGGER trg_subscriptions_updated_at
         BEFORE UPDATE ON subscriptions
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log(res);
  } catch (e) {
    console.log(e);
    //THROW dB Error
  }
};

export const create_subscription_invoice_table = async () => {
  try {
    const res = await pool.query(`
       --ENUM
DO $$
     BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
     CREATE TYPE payment_status AS ENUM ('pending', 'failed', 'paid');
  END IF;
END$$;


      CREATE TABLE IF NOT EXISTS subscription_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        invoice_code TEXT NOT NULL UNIQUE,
        subscription_code TEXT,
        subscription_id UUID REFERENCES subscriptions ON DELETE SET NULL,
          
        period_start TIMESTAMPTZ NOT NULL,  
        period_end TIMESTAMPTZ NOT NULL,  
        
        amount INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL,
       
        status payment_status NOT NULL DEFAULT 'pending',
        
        paid_at TIMESTAMPTZ,
        
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
        );  

         DROP TRIGGER IF EXISTS trg_subscription_invoices_updated_at ON subscription_invoices;

         CREATE TRIGGER trg_subscription_invoices_updated_at
         BEFORE UPDATE ON subscription_invoices
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();
        
        `);
    console.log(res);
  } catch (e) {
    console.log(e);
    //THROW dB Error
  }
};

export const create_subscription_payment_table = async () => {
  try {
    const res = await pool.query(`
          CREATE TABLE IF NOT EXISTS subscription_payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),   
            merchant_id UUID REFERENCES merchants ON DELETE SET NULL,
            invoice_code TEXT,
            reference TEXT NOT NULL UNIQUE,
            amount INTEGER NOT NULL,
            status TEXT NOT NULL,
            paid_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
            );  
            
            CREATE INDEX idx_payment_reference ON subscription_payments(reference);
            `);
    console.log(res);
  } catch (e) {
    console.log(e);
    //THROW dB Error
  }
};

/* 
Track Credit usage(Limiting chat usage!)
nOT aDDING yET!
*/
export const create_usage_log_table = async () => {
  try {
    await pool.query(`
      CREATE TYPE usage_action_type AS ENUM (
      'create_product',
      'update_order',
      'update_customer',
      'update_store',
      'update_orders',
      'view_products',
      'view_customers',
      'view_orders',
      )  
      CREATE TABLE IF NOT EXISTS usage_log (
      id SERIAL PRIMARY KEY,
      merchant_id UUID REFERENCES merchants ON DELETE SET NULL,
      action_type usage_action_type NOT NULL,
      action_statement text,
      credit_used INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW(),
      );  
    `);
    console.log(res);
  } catch (e) {
    console.log(e);
    //THROW dB Error
  }
};

export const create_whatsapp_state_table = async () => {
  try {
    const res = await pool.query(`  
      CREATE TABLE IF NOT EXISTS conversation_state (
        merchant_id UUID PRIMARY KEY REFERENCES merchants ON DELETE CASCADE, 
        current_intent TEXT,
        step TEXT,
        data JSONB,
        updated_at TIMESTAMP      
      );  
  
    `);
    console.log(res);
  } catch (e) {
    console.log(e);
    //THROW dB Error
  }
};
