# Diagramme de Classe - Wild Transfer

Ce diagramme représente la structure des données de l'application Wild Transfer, une plateforme de partage de fichiers.

## Architecture des Données

```mermaid
classDiagram
    class User {
        +number id
        +string email
        +string password
        +string profilePicture?
        +Date lastLoggedAt
        +UserRole role
        +string stripeCustomerId?
        +Date createdAt
    }
    
    class TempUser {
        +number id
        +string email
        +string password
        +string randomCode
    }
    
    class Resource {
        +number id
        +string name
        +string path
        +string url
        +FileVisibility visibility
        +string description
        +number size
        +string formattedSize
        +Date expireAt?
        +Date createdAt
    }
    
    class Contact {
        +number id
        +ContactStatus status
        +Date createdAt
    }
    
    class Subscription {
        +number id
        +Date paidAt
        +Date endAt
        +string stripeSubscriptionId?
        +string stripePriceId?
        +SubscriptionStatus status
    }
    
    class Comment {
        +number id
        +string content
        +Date createdAt
    }
    
    class Like {
        +number id
    }
    
    class Report {
        +number id
        +string content?
        +Reason reason
        +Date createdAt
    }
    
    class SystemLog {
        +number id
        +LogType type
        +string message
        +string details?
        +string userId?
        +Date createdAt
    }

    %% Énumérations
    class UserRole {
        <<enumeration>>
        USER
        ADMIN
    }
    
    class FileVisibility {
        <<enumeration>>
        PRIVATE
        PUBLIC
    }
    
    class ContactStatus {
        <<enumeration>>
        PENDING
        ACCEPTED
        REFUSED
    }
    
    class SubscriptionStatus {
        <<enumeration>>
        ACTIVE
        CANCELLED
        PAST_DUE
        UNPAID
    }
    
    class Reason {
        <<enumeration>>
        CORRUPTED
        DISPLAY
        INAPPROPRIATE
        HARASSMENT
        SPAM
        OTHER
        NONE
    }
    
    class LogType {
        <<enumeration>>
        SUCCESS
        ERROR
        WARNING
        INFO
    }

    %% Relations principales
    User ||--o| Subscription : "possède"
    User ||--o{ Resource : "possède"
    User }o--o{ Resource : "accès partagé"
    User ||--o{ Comment : "écrit"
    User ||--o{ Like : "aime"
    User ||--o{ Report : "signale"
    
    %% Relations Contact (auto-référentielle)
    User ||--o{ Contact : "sourceUser"
    User ||--o{ Contact : "targetUser"
    
    %% Relations Resource
    Resource ||--o{ Comment : "reçoit"
    Resource ||--o{ Like : "reçoit"
    Resource ||--o{ Report : "fait l'objet de"
    
    %% Contraintes
    Like : "Unique(user, resource)"
    
    %% Entités autonomes
    SystemLog : "Logs système indépendants"
    TempUser : "Utilisateurs temporaires (inscription)"
```

## Description des Entités

### Entités Principales

**User** - Utilisateurs de la plateforme
- Gère l'authentification avec email/password
- Rôles : utilisateur standard ou administrateur
- Intégration Stripe pour les paiements
- Photo de profil optionnelle

**Resource** - Fichiers partagés
- Métadonnées des fichiers (nom, taille, chemin)
- Visibilité publique ou privée
- Système d'expiration optionnel
- URL unique pour le partage

**Subscription** - Abonnements premium
- Intégration complète avec Stripe
- Gestion des statuts d'abonnement
- Dates de paiement et d'expiration

### Entités Relationnelles

**Contact** - Relations entre utilisateurs
- Système d'amis avec demandes
- Statuts : en attente, accepté, refusé

**Comment** - Commentaires sur les fichiers
- Contenu textuel limité à 500 caractères
- Horodatage automatique

**Like** - Système d'appréciation
- Relation unique utilisateur-fichier
- Pas de stockage de données supplémentaires

**Report** - Signalements de contenu
- Catégorisation des raisons de signalement
- Contenu optionnel pour détails

### Entités Utilitaires

**SystemLog** - Journalisation système
- Différents types de logs (succès, erreur, warning, info)
- Traçabilité des actions administratives

**TempUser** - Inscription temporaire
- Stockage temporaire lors de l'inscription
- Code de validation pour vérification email

## Relations Clés

### Relations Un-à-Plusieurs (1:N)
- Un utilisateur possède plusieurs fichiers
- Un fichier reçoit plusieurs commentaires/likes/reports
- Un utilisateur peut faire plusieurs commentaires/likes/reports

### Relations Plusieurs-à-Plusieurs (N:N)
- Utilisateurs ↔ Fichiers (partage d'accès)

### Relations Un-à-Un (1:1)
- Utilisateur ↔ Abonnement (optionnel)

### Relations Auto-référentielles
- Contact : sourceUser et targetUser référencent la même entité User

## Contraintes et Règles Métier

1. **Unicité** : Email des utilisateurs, nom et URL des fichiers
2. **Cascade** : Suppression des fichiers → suppression des likes/comments/reports associés
3. **Contrainte unique** : Un utilisateur ne peut liker qu'une fois le même fichier
4. **Validation** : Longueurs maximales pour les champs texte
5. **Énumérations** : Types stricts pour les statuts et rôles