ai-documentation-assistant/
├── backend
│   ├── cmd
│   │   └── server
│   │       └── main.go
│   ├── internal
│   │   ├── api
│   │   │   ├── handlers.go
│   │   │   ├── middleware.go
│   │   │   └── routes.go
│   │   ├── models
│   │   │   └── models.go
│   │   ├── services
│   │   │   ├── embeddings.go
│   │   │   ├── search.go
│   │   │   └── chat.go
│   │   ├── database
│   │   │   └── database.go
│   │   └── config
│   │       └── config.go
│   ├── migrations
│   │   └── 001_initial_schema.sql
│   ├── tests
│   │   ├── api_test.go
│   │   └── services_test.go
│   ├── go.mod
│   ├── go.sum
│   ├── .env.example
│   ├── Dockerfile
│   └── Makefile
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── SearchInterface.tsx
│   │   │   ├── Admin
│   │   │   │   └── DocumentUpload.tsx
│   │   │   └── Shared
│   │   │       └── Button.tsx
│   │   ├── services
│   │   │   ├── api.ts
│   │   │   └── websocket.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── pages
│   │   │   └── Home.tsx
│   │   ├── layouts
│   │   │   └── MainLayout.tsx
│   │   ├── hooks
│   │   │   └── useChat.ts
│   │   ├── utils
│   │   │   └── formatters.ts
│   │   ├── tests
│   │   │   ├── components
│   │   │   │   └── ChatInterface.test.tsx
│   │   │   └── services
│   │   │       └── api.test.ts
│   │   ├── styles
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── jest.config.js
│   ├── Dockerfile
│   └── Makefile
├── docker
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx
│   │   └── nginx.conf
│   └── postgres
│       └── init.sql
├── scripts
│   ├── deploy.sh
│   └── setup.sh
├── .github
│   └── workflows
│       └── ci.yml
├── README.md
├── .gitignore
└── Makefile
