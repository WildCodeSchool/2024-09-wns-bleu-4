# 🔄 DIAGRAMMES DE SÉQUENCE PARTAGE DE FICHIER - WILD TRANSFER

Emetteur :

```
sequenceDiagram
    participant U1 as Utilisateur 👤
    participant F as Frontend 🌐
    participant G as GraphQL API 📡
    participant DB as Database 💾
    
    Note over U1,F: Sélection du fichier
    U1->>F: Clique "Partager"
    activate F
    F->>G: query getMyContacts
    activate G
    G->>DB: SELECT contacts acceptés
    activate DB
    DB-->>G: contacts
    deactivate DB
    G-->>F: contacts
    deactivate G
    F-->>U1: Liste contacts
    deactivate F
    
    Note over U1,F: Choix contacts
    U1->>F: Sélectionne 3 contacts
    activate F
    F->>G: mutation createUserAccess(resource, contacts)
    activate G
    loop Chaque contact
        G->>DB: INSERT user_resource_access
        activate DB
        DB-->>G: ok
        deactivate DB
    end
    G-->>F: success
    deactivate G
    F-->>U1: ✅ "Partagé avec 3 contacts"
    deactivate F
```

Récepteur :

```
sequenceDiagram
    participant U2 as Contact utilisateur 👥
    participant F2 as Contact Frontend 🌐
    participant G as GraphQL API 📡
    participant DB as Database 💾
    
    Note over U2,F2: Accès au fichier partagé
    U2->>F2: Va dans "Fichiers partagés"
    activate F2
    F2->>G: query getUserSharedResources
    activate G
    G->>DB: SELECT ressources partagées
    activate DB
    DB-->>G: resources
    deactivate DB
    G-->>F2: resources
    deactivate G
    F2-->>U2: Liste fichiers partagés
    deactivate F2
    
    U2->>F2: Clique "Télécharger"
    activate F2
    F2->>G: getResourceById
    activate G
    G->>DB: Vérif accès
    activate DB
    DB-->>G: ok
    deactivate DB
    G-->>F2: url + metadata
    deactivate G
    F2-->>U2: ✅ Téléchargement
    deactivate F2
```