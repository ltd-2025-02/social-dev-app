<div align="center">
  <img src="assets/post.png" alt="SocialDev Mobile App" width="800">
  
  <h1>📱 SocialDev Mobile App</h1>
  
  <p align="center">
    <strong>A experiência completa do SocialDev na palma da sua mão</strong>
  </p>
  
  <p align="center">
    <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.79.6-61DAFB?style=flat-square&logo=react">
    <img alt="Expo" src="https://img.shields.io/badge/Expo-53.0.22-000020?style=flat-square&logo=expo">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=flat-square&logo=typescript">
    <img alt="Redux" src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux">
  </p>

  <p align="center">
    <img alt="iOS" src="https://img.shields.io/badge/iOS-000000?style=flat-square&logo=ios">
    <img alt="Android" src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android">
    <img alt="Version" src="https://img.shields.io/badge/Version-1.0.0-green?style=flat-square">
  </p>
</div>

---

## 🚀 Sobre o Projeto

O **SocialDev Mobile App** é a versão nativa da plataforma SocialDev, desenvolvida com **React Native** e **Expo**. Oferece uma experiência móvel completa e otimizada para desenvolvedores, designers e estudantes se conectarem, compartilharem conhecimento e crescerem profissionalmente.

### ✨ Principais Características

- 📱 **Nativo para iOS e Android** - Performance otimizada para ambas as plataformas
- 🎨 **Design System Consistente** - Interface moderna usando React Native Paper
- 🔄 **Estado Global** - Gerenciamento robusto com Redux Toolkit
- 🌐 **Offline-First** - Funcionalidades disponíveis mesmo sem conexão
- 🔔 **Push Notifications** - Notificações em tempo real
- 📸 **Camera Integration** - Upload de imagens otimizado
- 🎯 **Performance** - Navegação fluida com React Navigation 7

## 🛠️ Stack Tecnológica

### **Frontend Mobile**
- **React Native 0.79.6** - Framework para desenvolvimento nativo
- **Expo 53** - Plataforma para desenvolvimento acelerado
- **TypeScript 5.3.3** - Tipagem estática para código mais robusto
- **React Navigation 7** - Navegação nativa otimizada

### **Estado e Dados**
- **Redux Toolkit 2.9** - Gerenciamento de estado previsível
- **React Redux 9.2** - Integração React com Redux
- **Supabase Client** - Backend-as-a-Service para dados em tempo real
- **Async Storage** - Persistência local de dados

### **UI/UX**
- **React Native Paper 5.14** - Material Design para React Native
- **Expo Linear Gradient** - Gradientes nativos
- **React Native Gesture Handler** - Gestos nativos fluidos
- **Expo Image** - Carregamento otimizado de imagens

### **Recursos Nativos**
- **Expo Image Picker** - Seleção de fotos e câmera
- **Expo Notifications** - Sistema de notificações push
- **NetInfo** - Detecção de conectividade
- **Expo Font** - Carregamento personalizado de fontes

## 📋 Funcionalidades

### 🏠 **Feed Principal**
- ✅ Posts em tempo real com scroll infinito
- ✅ Sistema de curtidas com animações nativas
- ✅ Comentários aninhados e interativos
- ✅ Pull-to-refresh para atualizações
- ✅ Cache inteligente para performance

### 👤 **Perfil e Autenticação**
- ✅ Sistema de login/registro seguro
- ✅ Perfis personalizáveis com upload de foto
- ✅ Biometria para acesso rápido
- ✅ Gestão de sessões com tokens JWT

### 💬 **Mensagens**
- ✅ Chat em tempo real com WebSockets
- ✅ Interface otimizada com Gifted Chat
- ✅ Indicadores de status (enviado, lido)
- ✅ Notificações push para novas mensagens

### 🔔 **Notificações**
- ✅ Push notifications configuráveis
- ✅ Central de notificações organizada
- ✅ Badges de contadores não lidas
- ✅ Deep linking para navegação

### 👥 **Conexões**
- ✅ Sistema de seguir/seguidores
- ✅ Busca de usuários com filtros
- ✅ Lista de conexões otimizada
- ✅ Sugestões baseadas em algoritmo

### 📸 **Mídia**
- ✅ Upload de imagens otimizado
- ✅ Compressão automática
- ✅ Galeria e câmera integradas
- ✅ Preview antes do envio

## 🏗️ Arquitetura do Projeto

```
socialdev-mobile-app/
├── assets/                  # Recursos estáticos
│   ├── images/             # Imagens da aplicação
│   ├── icons/              # Ícones customizados
│   └── fonts/              # Fontes personalizadas
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── common/         # Componentes comuns
│   │   ├── forms/          # Componentes de formulário
│   │   └── ui/             # Elementos de interface
│   ├── screens/            # Telas da aplicação
│   │   ├── Auth/           # Autenticação
│   │   ├── Feed/           # Feed principal
│   │   ├── Profile/        # Perfil do usuário
│   │   ├── Messages/       # Sistema de mensagens
│   │   └── Settings/       # Configurações
│   ├── navigation/         # Configuração de navegação
│   ├── store/              # Estado global Redux
│   │   ├── slices/         # Redux slices
│   │   └── middleware/     # Middlewares customizados
│   ├── services/           # Serviços externos
│   │   ├── api/            # APIs e endpoints
│   │   ├── auth/           # Autenticação
│   │   └── notifications/  # Sistema de notificações
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilitários e helpers
│   ├── types/              # Definições TypeScript
│   └── constants/          # Constantes da aplicação
├── App.tsx                 # Componente principal
├── app.json               # Configuração do Expo
└── package.json           # Dependências do projeto
```

## 🚀 Como Começar

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) ou Android Studio
- Dispositivo físico com Expo Go (opcional)

### **Instalação**

1. **Clone o repositório**
```bash
git clone https://github.com/estevam5s/social-dev.git
cd social-dev/socialdev-mobile-app
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm start
# ou
yarn start
```

### **Executar em Dispositivos**

```bash
# iOS Simulator (apenas macOS)
npm run ios

# Android Emulator/Dispositivo
npm run android

# Web (desenvolvimento)
npm run web
```

## 📱 Builds de Produção

### **Android (APK/AAB)**
```bash
# Build para Play Store
npm run build:android

# Submit para Play Store
npm run submit:android
```

### **iOS (IPA)**
```bash
# Build para App Store
npm run build:ios

# Submit para App Store
npm run submit:ios
```

## 🔧 Configuração do Ambiente

### **Variáveis de Ambiente**
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=sua_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_URL=https://api.socialdev.com

# Push Notifications
EXPO_PUBLIC_PUSH_TOKEN=seu_token_push
```

### **EAS Build Configuration**
O projeto está configurado para usar **Expo Application Services (EAS)** para builds otimizados:

- **iOS**: Bundle identifier `com.socialdev.app`
- **Android**: Package name `com.socialdev.app`
- **Permissions**: Câmera, galeria, notificações, internet

## 📊 Performance e Otimizações

### **Estratégias Implementadas**
- ✅ **Lazy Loading** - Carregamento sob demanda de componentes
- ✅ **Image Optimization** - Compressão e cache de imagens
- ✅ **Memory Management** - Limpeza automática de recursos
- ✅ **Bundle Splitting** - Otimização do tamanho do app
- ✅ **Offline Support** - Cache inteligente com Async Storage

### **Métricas de Performance**
- 📈 **Startup Time**: < 3 segundos
- 📈 **Bundle Size**: < 25MB (iOS/Android)
- 📈 **Memory Usage**: < 150MB durante uso normal
- 📈 **Battery Impact**: Otimizado para baixo consumo

## 🔒 Segurança

### **Medidas Implementadas**
- 🔐 **Biometric Authentication** - Touch ID / Face ID
- 🔐 **Token Security** - JWT com refresh automático
- 🔐 **Data Encryption** - Dados sensíveis criptografados
- 🔐 **Certificate Pinning** - Proteção contra man-in-the-middle
- 🔐 **App Security** - Proteção contra debugging em produção

## 🧪 Testes

### **Estratégia de Testes**
```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E (Detox)
npm run test:e2e
```

### **Cobertura**
- ✅ **Componentes**: 90%+ cobertura
- ✅ **Hooks**: 85%+ cobertura
- ✅ **Utilitários**: 95%+ cobertura
- ✅ **Redux**: 80%+ cobertura

## 📈 Roadmap

### **🔄 Em Desenvolvimento**
- 🔄 **Dark Mode** - Tema escuro completo
- 🔄 **Stories** - Compartilhamento de momentos
- 🔄 **Voice Messages** - Mensagens de áudio
- 🔄 **Video Calls** - Chamadas de vídeo integradas

### **🎯 Próximas Features**
- 📅 **Events** - Sistema de eventos da comunidade
- 📊 **Analytics** - Dashboard pessoal de atividades
- 🎮 **Gamification** - Sistema de conquistas
- 🌍 **i18n** - Suporte a múltiplos idiomas
- 📱 **Watch App** - Extensão para Apple Watch

### **🚀 Melhorias Técnicas**
- ⚡ **Performance** - Otimizações contínuas
- 🔧 **CodePush** - Atualizações over-the-air
- 📊 **Crash Reporting** - Monitoramento avançado
- 🛡️ **Security** - Auditoria de segurança completa

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

### **Como Contribuir**
1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Desenvolvimento**
- 📝 **Commits**: Siga o padrão Conventional Commits
- 🧪 **Testes**: Adicione testes para novas funcionalidades
- 📚 **Documentação**: Mantenha a documentação atualizada
- 🎨 **Code Style**: Use ESLint + Prettier configurados

### **Áreas que Precisam de Ajuda**
- 🎨 **UI/UX**: Melhorias de interface
- 🔧 **Performance**: Otimizações
- 🧪 **Testing**: Cobertura de testes
- 📱 **Acessibilidade**: Melhorias de a11y
- 🌍 **Localização**: Tradução para outros idiomas

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## 👨‍💻 Equipe de Desenvolvimento

**Desenvolvido com 💜 por:**

- **LTD - Estacio**
- 📧 **Email**: contato@estevamsouza.com.br
- 💼 **LinkedIn**: [estevam-souza](https://www.linkedin.com/in/estevam-souza/)
- 🐙 **GitHub**: [@estevam5s](https://github.com/estevam5s)

## 🙏 Agradecimentos

Agradecimentos especiais à comunidade open source e aos contribuidores:

- **React Native Team** - Por criar uma tecnologia incrível
- **Expo Team** - Por simplificar o desenvolvimento mobile
- **Supabase** - Por fornecer uma backend excelente
- **Comunidade SocialDev** - Por feedback constante e sugestões

---

<div align="center">
  <p>
    <strong>⭐ Se este projeto te ajudou, considere dar uma estrela!</strong>
  </p>
  <p>
    Feito com 🧡 e muito ☕ para conectar desenvolvedores ao redor do mundo 🌍
  </p>
  
  <p>
    <a href="#top">⬆️ Voltar ao topo</a>
  </p>
</div>
