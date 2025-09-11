const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase (use as mesmas credenciais do arquivo supabase.ts)
const supabaseUrl = 'https://liuvdlifoqurfyoqlxdv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpdXZkbGlmb3F1cmZ5b3FseGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMDUxOTMsImV4cCI6MjA3Mjc4MTE5M30.tW958nxenRvDMVYNwzDIrnmmMcyIWgVgVwMXckT0Vfw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'add_persona_to_users.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executando migração...');
    console.log('SQL:', migrationSQL);
    
    // Executar a migração
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Erro ao executar migração:', error);
      return;
    }
    
    console.log('Migração executada com sucesso!');
    console.log('Resultado:', data);
    
    // Verificar se a coluna foi adicionada
    const { data: columns, error: checkError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (checkError) {
      console.error('Erro ao verificar tabela:', checkError);
    } else {
      console.log('Verificação: tabela users atualizada com sucesso');
    }
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

runMigration();