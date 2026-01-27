-- Update tracking table untuk menambahkan kolom admin_username
ALTER TABLE tracking 
ADD COLUMN admin_username VARCHAR(100) AFTER pegawai_id;

-- Update existing records (optional)
UPDATE tracking SET admin_username = 'admin' WHERE pegawai_id IS NULL;
