# Integração TheirStack API

## Visão Geral

A aplicação agora utiliza duas fontes de dados para vagas de emprego:
1. **TheirStack API** (Principal) - Vagas do LinkedIn, Indeed, Google Jobs e outros sites
2. **SerpAPI** (Fallback) - Google Jobs via SerpAPI
3. **Dados Mock** (Último recurso) - Vagas de demonstração

## APIs Utilizadas

### TheirStack API
- **URL**: https://api.theirstack.com/v1/jobs/search
- **Autenticação**: Bearer Token
- **Fontes**: LinkedIn, Indeed, Google Jobs, e mais
- **Vantagens**: 
  - Dados mais ricos e atualizados
  - Informações detalhadas das empresas
  - Filtros avançados
  - Melhor qualidade dos dados

### SerpAPI (Fallback)
- **URL**: https://serpapi.com/search.json
- **Engine**: google_jobs
- **Uso**: Fallback quando TheirStack falha ou não retorna resultados

## Arquivos Modificados/Criados

### Novos Arquivos
- `src/services/theirstack.service.ts` - Serviço para integração com TheirStack API
- `src/utils/testJobsAPI.ts` - Utilitário para testar as integrações
- `src/docs/THEIRSTACK_INTEGRATION.md` - Esta documentação

### Arquivos Modificados
- `src/services/jobs.service.ts` - Integração das duas APIs com fallback inteligente
- `src/store/slices/jobsSlice.ts` - Melhor tratamento de erros e status das APIs
- `src/screens/jobs/JobsScreen.tsx` - Indicadores visuais da fonte dos dados

## Como Funciona

### Fluxo de Busca de Vagas
1. **Primeira tentativa**: TheirStack API
   - Se retorna resultados → Exibe vagas do TheirStack
   - Se falha → Continua para próximo passo

2. **Segunda tentativa**: SerpAPI
   - Se retorna resultados → Exibe vagas do Google Jobs
   - Se falha → Continua para próximo passo

3. **Terceira tentativa**: Dados Mock
   - Sempre retorna vagas de demonstração
   - Garantia de que o usuário sempre vê conteúdo

### Transformação de Dados
- Ambas as APIs retornam dados em formatos diferentes
- O sistema transforma tudo para o formato interno unificado
- Preserva informações específicas de cada fonte

## Configurações

### Credenciais
```typescript
// TheirStack API
const THEIRSTACK_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
const THEIRSTACK_BASE_URL = 'https://api.theirstack.com/v1'

// SerpAPI
const SERP_API_KEY = '32c2077982745b4e01ebd5bd31b71d0b515e394647a09e0bbfa9ee0911802b0d'
const SERP_API_BASE_URL = 'https://serpapi.com/search.json'
```

### Parâmetros Padrão TheirStack
```typescript
{
  page: 0,
  limit: 20,
  posted_at_max_age_days: 30,
  blur_company_data: false,
  order_by: [{ desc: true, field: 'date_posted' }],
  job_country_code_or: ['BR'],
  include_total_results: false
}
```

## Filtros Suportados

### Filtros de Busca
- **search**: Termo de busca (título, descrição)
- **location**: Localização das vagas
- **type**: Tipo de trabalho (remote, hybrid, onsite)
- **level**: Nível de senioridade (junior, pleno, senior, lead)

### Mapeamento de Níveis
```typescript
TheirStack → Interno
'junior' → 'junior'
'mid_level' → 'pleno'
'senior' → 'senior'
'staff' → 'senior'
'c_level' → 'lead'
```

### Campos da API TheirStack
```typescript
// Campos corretos para filtros
job_title_pattern_or: string[]     // Busca por padrões no título
job_location_pattern_or: string[]  // Busca por padrões na localização
job_seniority_or: string[]         // Níveis de senioridade
job_country_code_or: string[]      // Códigos de países
remote: boolean                    // Trabalho remoto
hybrid: boolean                    // Trabalho híbrido
```

## Indicadores Visuais

A interface agora mostra a origem dos dados:
- 🔥 **"Vagas do TheirStack (LinkedIn, Indeed, Google)"** - Dados do TheirStack
- 📊 **"Vagas do Google Jobs via SerpAPI"** - Dados do SerpAPI
- 🎯 **"Mostrando vagas de demonstração"** - Dados mock

## Testes

### Teste Manual
```bash
# Teste rápido da API
curl -X POST "https://api.theirstack.com/v1/jobs/search" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"page": 0, "limit": 5, "posted_at_max_age_days": 15, "job_country_code_or": ["BR"]}'
```

### Teste no Código
```typescript
import { testJobsIntegration } from '../utils/testJobsAPI';

// Execute o teste
const result = await testJobsIntegration();
console.log(result);
```

## Monitoramento

### Logs Importantes
- `TheirStack API Request:` - Parâmetros enviados para TheirStack
- `Found X jobs from TheirStack` - Sucessso do TheirStack
- `Falling back to SerpAPI` - Fallback ativo
- `SerpAPI search failed:` - Falha do SerpAPI

### Status das APIs
O Redux store agora mantém o status das APIs:
```typescript
apiStatus: {
  theirStack: boolean | null,
  serpAPI: boolean | null
}
```

## Próximos Passos

1. **Cache Inteligente**: Implementar cache baseado em filtros
2. **Rate Limiting**: Respeitar limites das APIs
3. **Analytics**: Rastrear uso e performance das APIs
4. **Configuração**: Permitir escolher fonte preferencial
5. **Offline**: Cache para funcionamento offline

## Correções Implementadas

### Erros de Validação da API (Corrigido)
**Problema**: API retornava erro 422 com campos inválidos como `job_title_contains_or`
**Solução**: Mapeamento correto dos campos da API:
- `job_title_contains_or` → `job_title_pattern_or`
- `location_contains_or` → `job_location_pattern_or`  
- `seniority_or` → `job_seniority_or`
- Valores de senioridade corrigidos: `'c_level', 'staff', 'senior', 'junior', 'mid_level'`

## Troubleshooting

### Problema: Erro 422 - Validation Error
- **Causa**: Campos incorretos na requisição
- **Solução**: Verificar se os nomes dos campos seguem a especificação da API
- **Exemplo**: Usar `job_title_pattern_or` em vez de `job_title_contains_or`

### Problema: Nenhuma vaga encontrada
- Verifique se as APIs estão respondendo
- Confirme se os tokens estão válidos
- Verifique os filtros aplicados
- Teste com filtros mais amplos primeiro

### Problema: Dados incorretos
- Confirme a transformação de dados
- Verifique os mapeamentos de campos
- Teste cada API individualmente

### Problema: Performance lenta
- Verifique timeout das APIs
- Considere reduzir limite de resultados
- Implemente cache se necessário