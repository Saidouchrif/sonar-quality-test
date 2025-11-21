# 🔐 FastAPI JWT Auth MongoDB

Application d'authentification moderne et sécurisée construite avec FastAPI, MongoDB et React. Ce projet met en place un système complet d'authentification JWT avec une interface utilisateur responsive et élégante.

![FastAPI](https://img.shields.io/badge/FastAPI-0.115.2-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📋 Table des Matières

- [Aperçu du Projet](#-aperçu-du-projet)
- [Architecture](#-architecture)
- [Diagrammes](#-diagrammes)
- [Technologies Utilisées](#-technologies-utilisées)
- [Structure du Projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [🐳 Utilisation avec Docker](#-utilisation-avec-docker)
- [Utilisation](#-utilisation)
- [API Endpoints](#-api-endpoints)
- [Sécurité](#-sécurité)
- [Contribution](#-contribution)

---

## 🎯 Aperçu du Projet

Ce projet est une application full-stack d'authentification qui démontre les meilleures pratiques en matière de :
- ✅ Authentification sécurisée avec JWT (JSON Web Tokens)
- ✅ Hashage des mots de passe avec Bcrypt
- ✅ Base de données NoSQL (MongoDB)
- ✅ API RESTful avec FastAPI
- ✅ Interface utilisateur moderne et responsive avec React
- ✅ Gestion d'état et routing côté client
- ✅ Protection CORS et sécurité des endpoints

---

## 🏗 Architecture

### Architecture Globale du Système

```mermaid
graph TB
    subgraph "Frontend - React"
        A[Navigateur Web] --> B[React Router]
        B --> C[Pages<br/>Home/Login/Register]
        C --> D[Composants<br/>Navbar/Forms]
        D --> E[Axios HTTP Client]
    end
    
    subgraph "Backend - FastAPI"
        F[API Gateway<br/>FastAPI] --> G[Routes<br/>Auth Endpoints]
        G --> H[Controllers<br/>Business Logic]
        H --> I[Models<br/>Pydantic Schemas]
        H --> J[Services<br/>Auth/Token]
    end
    
    subgraph "Base de Données"
        K[(MongoDB<br/>Database)]
        L[Collection: users]
    end
    
    subgraph "Sécurité"
        M[JWT Manager]
        N[Bcrypt Hash]
    end
    
    E -->|HTTP/HTTPS| F
    J --> M
    J --> N
    H --> K
    K --> L
    
    style A fill:#61DAFB
    style F fill:#009688
    style K fill:#47A248
    style M fill:#000000,color:#fff
```

### Architecture en Couches

```mermaid
graph LR
    subgraph "Couche Présentation"
        A[React Components]
        B[Tailwind CSS]
        C[React Router]
    end
    
    subgraph "Couche API"
        D[FastAPI Routes]
        E[Middleware CORS]
        F[Validation Pydantic]
    end
    
    subgraph "Couche Métier"
        G[Auth Logic]
        H[JWT Service]
        I[Password Hashing]
    end
    
    subgraph "Couche Données"
        J[Motor Driver]
        K[MongoDB]
    end
    
    A --> D
    B --> A
    C --> A
    D --> G
    E --> D
    F --> D
    G --> H
    G --> I
    G --> J
    J --> K
```

---

## 📊 Diagrammes

### 1. Diagramme de Séquence - Inscription (Register)

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🎨 Frontend React
    participant A as 🚀 FastAPI Backend
    participant B as 🔐 Bcrypt Service
    participant D as 💾 MongoDB
    
    U->>F: Remplit le formulaire d'inscription
    U->>F: Clique "S'inscrire"
    F->>F: Validation côté client
    
    F->>A: POST /auth/register<br/>{username, email, password}
    
    A->>A: Validation Pydantic Schema
    
    A->>D: Vérifie si email existe
    alt Email existe déjà
        D-->>A: Email trouvé
        A-->>F: 400 - Email déjà utilisé
        F-->>U: ❌ Message d'erreur
    else Email disponible
        D-->>A: Email non trouvé
        A->>B: hash_password(password)
        B-->>A: password_hashed
        
        A->>D: INSERT user<br/>{username, email, hashed_password}
        D-->>A: user_id
        
        A-->>F: 201 - Utilisateur créé
        F->>F: Affiche message succès
        F->>F: Redirection vers /login (2s)
        F-->>U: ✅ Compte créé avec succès
    end
```

### 2. Diagramme de Séquence - Connexion (Login)

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🎨 Frontend React
    participant A as 🚀 FastAPI Backend
    participant B as 🔐 Bcrypt Service
    participant J as 🎫 JWT Service
    participant D as 💾 MongoDB
    participant L as 📦 LocalStorage
    
    U->>F: Saisit email et mot de passe
    U->>F: Clique "Se connecter"
    F->>F: Validation des champs
    
    F->>A: POST /auth/login<br/>{email, password}
    
    A->>D: SELECT user WHERE email
    
    alt Utilisateur non trouvé
        D-->>A: NULL
        A-->>F: 401 - Email ou mot de passe incorrect
        F-->>U: ❌ Erreur de connexion
    else Utilisateur trouvé
        D-->>A: user_data
        A->>B: verify_password(password, hashed_password)
        
        alt Mot de passe incorrect
            B-->>A: False
            A-->>F: 401 - Email ou mot de passe incorrect
            F-->>U: ❌ Erreur de connexion
        else Mot de passe correct
            B-->>A: True
            
            A->>J: create_access_token(user_id)
            J->>J: Encode JWT avec secret key
            J-->>A: access_token
            
            A-->>F: 200 - {access_token, user_info}
            F->>L: localStorage.setItem("token", access_token)
            F->>F: Mise à jour état isLoggedIn
            F->>F: Redirection vers /home (1s)
            F-->>U: ✅ Connexion réussie
        end
    end
```

### 3. Diagramme de Séquence - Accès Page Protégée

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🎨 Frontend React
    participant A as 🚀 FastAPI Backend
    participant J as 🎫 JWT Service
    participant D as 💾 MongoDB
    participant L as 📦 LocalStorage
    
    U->>F: Accède à une page protégée
    F->>L: getItem("token")
    
    alt Token absent
        L-->>F: NULL
        F->>F: Redirection vers /login
        F-->>U: Page de connexion
    else Token présent
        L-->>F: access_token
        
        F->>A: GET /protected-route<br/>Authorization: Bearer {token}
        
        A->>J: verify_token(access_token)
        
        alt Token invalide/expiré
            J-->>A: Invalid/Expired
            A-->>F: 401 - Non autorisé
            F->>L: removeItem("token")
            F->>F: Redirection vers /login
            F-->>U: Session expirée
        else Token valide
            J-->>A: user_id
            A->>D: SELECT user WHERE id
            D-->>A: user_data
            
            A-->>F: 200 - {data}
            F-->>U: ✅ Contenu protégé affiché
        end
    end
```

### 4. Diagramme de Séquence - Déconnexion (Logout)

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🎨 Frontend React
    participant N as 🧭 Navbar Component
    participant L as 📦 LocalStorage
    
    U->>N: Clique "Déconnexion"
    N->>L: removeItem("token")
    L-->>N: Token supprimé
    
    N->>N: setIsLoggedIn(false)
    N->>F: navigate("/login")
    F-->>U: Redirection vers page de connexion
    U->>F: Voit la page de connexion
```

### 5. Flux de Communication Globale

```mermaid
graph TD
    A[Utilisateur accède à l'app] --> B{Token existe?}
    
    B -->|Non| C[Affiche Home Page<br/>avec CTA Login/Register]
    B -->|Oui| D[Affiche Home Page<br/>avec status connecté]
    
    C --> E{Action utilisateur}
    E -->|Clique Register| F[Page Register]
    E -->|Clique Login| G[Page Login]
    
    F --> H[Formulaire Inscription]
    H --> I[Submit Form]
    I --> J[API POST /auth/register]
    J --> K{Succès?}
    K -->|Oui| L[Redirection Login]
    K -->|Non| H
    
    G --> M[Formulaire Connexion]
    M --> N[Submit Form]
    N --> O[API POST /auth/login]
    O --> P{Succès?}
    P -->|Oui| Q[Stocke Token + Redirect Home]
    P -->|Non| M
    
    Q --> D
    D --> R{Action utilisateur}
    R -->|Navigation| S[Pages accessibles]
    R -->|Déconnexion| T[Supprime Token]
    T --> C
    
    style A fill:#4CAF50
    style D fill:#2196F3
    style C fill:#FF9800
    style Q fill:#4CAF50
    style T fill:#F44336
```

### 6. Architecture de Sécurité

```mermaid
graph TB
    subgraph "Couche Client"
        A[React App]
        B[LocalStorage<br/>Token JWT]
    end
    
    subgraph "Couche Transport"
        C[HTTPS]
        D[CORS Headers]
    end
    
    subgraph "Couche API"
        E[FastAPI Routes]
        F[JWT Middleware]
        G[Input Validation]
    end
    
    subgraph "Couche Sécurité"
        H[JWT Verification]
        I[Bcrypt Hashing]
        J[Secret Keys<br/>.env]
    end
    
    subgraph "Couche Données"
        K[(MongoDB)]
        L[Passwords Hashed]
    end
    
    A -->|Send Request| C
    B -.->|Include Token| C
    C --> D
    D --> E
    E --> F
    F --> H
    E --> G
    G --> I
    H --> J
    I --> J
    E --> K
    K --> L
    
    style J fill:#F44336,color:#fff
    style I fill:#FF9800,color:#fff
    style H fill:#FF5722,color:#fff
    style L fill:#4CAF50,color:#fff
```

---

## 🛠 Technologies Utilisées

### Backend
- **FastAPI** `0.115.2` - Framework web moderne et rapide pour construire des APIs
- **Uvicorn** `0.30.6` - Serveur ASGI pour FastAPI
- **Motor** `3.6.0` - Driver asynchrone MongoDB pour Python
- **Passlib + Bcrypt** `1.7.4` - Librairie de hashing de mots de passe
- **Python-Jose** `3.3.0` - Implémentation JWT pour Python
- **Pydantic** `2.9.2` - Validation des données avec Python type hints
- **Python-Dotenv** `1.0.1` - Gestion des variables d'environnement

### Frontend
- **React** `19.1.1` - Librairie JavaScript pour construire l'interface utilisateur
- **React Router DOM** `7.9.5` - Routing pour applications React
- **Axios** `1.13.2` - Client HTTP pour les requêtes API
- **TailwindCSS** - Framework CSS utility-first pour le styling
- **Vite** - Build tool rapide pour le développement frontend

### Base de Données
- **MongoDB** - Base de données NoSQL orientée documents

---

## 📁 Structure du Projet

```
fastapi-jwt-auth-mongodb/
│
├── backend/                          # Backend FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # Point d'entrée de l'application
│   │   ├── config.py                 # Configuration (MongoDB, JWT secret)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user.py               # Schémas Pydantic pour User
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── auth.py               # Routes d'authentification
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py       # Logique métier auth
│   │   │   └── jwt_service.py        # Gestion JWT
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── security.py           # Utilitaires de sécurité
│   ├── Dockerfile                    # Image Docker pour le backend
│   ├── .dockerignore                 # Fichiers ignorés lors du build Docker
│   ├── .env                          # Variables d'environnement
│   └── requirements.txt              # Dépendances Python
│
├── frontend/                         # Frontend React
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axois.js              # Configuration Axios
│   │   ├── components/
│   │   │   └── Navbar.jsx            # Composant Navbar
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Page d'accueil
│   │   │   ├── Login.jsx             # Page de connexion
│   │   │   └── Register.jsx          # Page d'inscription
│   │   ├── App.jsx                   # Composant principal
│   │   ├── App.css
│   │   ├── index.css                 # Styles globaux
│   │   └── main.jsx                  # Point d'entrée React
│   ├── Dockerfile                    # Image Docker pour le frontend
│   ├── .dockerignore                 # Fichiers ignorés lors du build Docker
│   ├── .gitignore
│   ├── index.html
│   ├── package.json                  # Dépendances npm
│   ├── tailwind.config.js            # Configuration Tailwind
│   └── vite.config.js                # Configuration Vite
│
├── docker-compose.yml                # Configuration Docker Compose
├── README.Docker.md                  # Guide Docker détaillé (optionnel)
└── README.md                         # Documentation (ce fichier)
```

---

## 🚀 Installation

### Prérequis

- **Python** 3.8+
- **Node.js** 16+ et npm
- **MongoDB** installé et en cours d'exécution

### 1. Cloner le Repository

```bash
git clone https://github.com/Saidouchrif/fastapi-jwt-auth-mongodb.git
cd fastapi-jwt-auth-mongodb
```

### 2. Installation du Backend

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Installation du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install
```

---

## ⚙ Configuration

### Configuration Backend (.env)

Créez un fichier `.env` dans le dossier `backend/` :

```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=fastapi_auth_db

# JWT Configuration
SECRET_KEY=votre_secret_key_super_securisee_ici_changez_la
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server Configuration
HOST=0.0.0.0
PORT=5000
```

⚠️ **Important**: Changez `SECRET_KEY` par une clé secrète forte et unique. Vous pouvez en générer une avec :

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Configuration Frontend

Le fichier `src/api/axois.js` est configuré pour pointer vers le backend :

```javascript
const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
```

---

## 🐳 Utilisation avec Docker

### Prérequis Docker

- **Docker** installé ([Télécharger Docker](https://www.docker.com/get-started))
- **Docker Compose** installé (inclus avec Docker Desktop)

### Démarrage Rapide avec Docker

Le projet inclut une configuration Docker complète pour exécuter tous les services (MongoDB, Backend, Frontend) en une seule commande.

#### 1. Construire et démarrer tous les services

```bash
# Depuis la racine du projet
docker-compose up --build
```

Cette commande va :
- ✅ Construire les images Docker pour le backend et le frontend
- ✅ Démarrer MongoDB dans un conteneur
- ✅ Démarrer le backend FastAPI
- ✅ Démarrer le frontend React/Vite
- ✅ Configurer automatiquement le réseau entre les services

#### 2. Démarrer en arrière-plan

```bash
docker-compose up -d --build
```

#### 3. Arrêter les services

```bash
docker-compose down
```

#### 4. Arrêter et supprimer les volumes (données MongoDB)

```bash
docker-compose down -v
```

⚠️ **Attention** : Cette commande supprimera toutes les données MongoDB stockées.

### Services Disponibles avec Docker

Une fois les conteneurs démarrés, les services sont accessibles sur :

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs
- **MongoDB** : localhost:27017

### Commandes Docker Utiles

#### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

#### Redémarrer un service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mongodb
```

#### Reconstruire un service spécifique

```bash
docker-compose up --build backend
docker-compose up --build frontend
```

#### Accéder au shell d'un conteneur

```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

### Configuration Docker

Le fichier `docker-compose.yml` configure :

- **MongoDB** : Service MongoDB avec persistance des données via volumes
- **Backend** : Service FastAPI avec hot-reload activé (modifications de code prises en compte automatiquement)
- **Frontend** : Service React/Vite avec hot-reload activé
- **Réseau** : Réseau Docker privé pour la communication entre services

### Variables d'Environnement Docker

Les variables d'environnement sont automatiquement configurées dans `docker-compose.yml` :

- **Backend** : `MONGO_URI=mongodb://mongodb:27017/fastapi_auth`
- **Frontend** : `VITE_API_URL=http://localhost:8000`

### Hot-Reload avec Docker

Les volumes sont configurés pour permettre le hot-reload :
- Les modifications dans `backend/` sont automatiquement reflétées dans le conteneur backend
- Les modifications dans `frontend/` sont automatiquement reflétées dans le conteneur frontend

### Persistance des Données

MongoDB utilise un volume Docker nommé `mongodb_data` pour persister les données. Les données sont conservées même après l'arrêt des conteneurs.

Pour supprimer complètement les données :

```bash
docker-compose down -v
```

### Structure des Fichiers Docker

```
fastapi-jwt-auth-mongodb/
│
├── docker-compose.yml          # Configuration Docker Compose
├── backend/
│   ├── Dockerfile              # Image Docker pour le backend
│   └── .dockerignore           # Fichiers ignorés lors du build
├── frontend/
│   ├── Dockerfile              # Image Docker pour le frontend
│   └── .dockerignore           # Fichiers ignorés lors du build
└── README.Docker.md            # Guide Docker détaillé (optionnel)
```

### Avantages de Docker

✅ **Installation simplifiée** : Pas besoin d'installer Python, Node.js ou MongoDB localement  
✅ **Environnement isolé** : Chaque service fonctionne dans son propre conteneur  
✅ **Reproductibilité** : Même environnement sur toutes les machines  
✅ **Déploiement facile** : Configuration prête pour la production  
✅ **Gestion des dépendances** : Toutes les dépendances sont encapsulées  

---

## 💻 Utilisation

### Démarrer MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Démarrer le Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Le backend sera accessible sur `http://localhost:5000`

Documentation API interactive : `http://localhost:5000/docs`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints d'Authentification

#### 1. Inscription d'un Utilisateur

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Réponse Succès (201):**
```json
{
  "msg": "Utilisateur créé avec succès",
  "user_id": "507f1f77bcf86cd799439011"
}
```

**Réponse Erreur (400):**
```json
{
  "detail": "Email déjà utilisé"
}
```

#### 2. Connexion

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Réponse Succès (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Réponse Erreur (401):**
```json
{
  "detail": "Email ou mot de passe incorrect"
}
```

#### 3. Obtenir le Profil (Protégé)

```http
GET /auth/me
Authorization: Bearer {access_token}
```

**Réponse Succès (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-11-07T14:30:00"
}
```

---

## 🔒 Sécurité

### Mesures de Sécurité Implémentées

1. **Hashage des Mots de Passe**
   - Utilisation de Bcrypt avec salt
   - Les mots de passe ne sont jamais stockés en clair

2. **Tokens JWT**
   - Tokens signés avec une clé secrète
   - Expiration configurable (30 minutes par défaut)
   - Stockage côté client dans localStorage

3. **CORS**
   - Configuration des origines autorisées
   - Protection contre les requêtes cross-origin non autorisées

4. **Validation des Données**
   - Validation avec Pydantic sur le backend
   - Validation HTML5 sur le frontend

5. **HTTPS (Production)**
   - Recommandé d'utiliser HTTPS en production
   - Certificats SSL/TLS

### Bonnes Pratiques

- ✅ Ne jamais commiter le fichier `.env`
- ✅ Utiliser des mots de passe forts
- ✅ Régénérer les tokens après un certain temps
- ✅ Implémenter un rate limiting en production
- ✅ Ajouter une authentification à deux facteurs (2FA)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📝 Licence

Ce projet est sous licence MIT.

---

## 👨‍💻 Auteur

**Saïd Ouchrif**

- GitHub: [@Saidouchrif](https://github.com/Saidouchrif)
- Projet: [fastapi-jwt-auth-mongodb](https://github.com/Saidouchrif/fastapi-jwt-auth-mongodb)

---

## 🙏 Remerciements

- FastAPI pour le framework backend incroyable
- React pour la librairie frontend puissante
- MongoDB pour la base de données flexible
- TailwindCSS pour le styling moderne

---

## 📚 Ressources Supplémentaires

- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Documentation React](https://react.dev/)
- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation JWT](https://jwt.io/introduction)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)

---

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile sur GitHub !**
