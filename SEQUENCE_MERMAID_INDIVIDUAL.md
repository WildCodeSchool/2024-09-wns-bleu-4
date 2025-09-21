# 🔄 DIAGRAMMES DE SÉQUENCE MERMAID - COPIER-COLLER

Diagrammes de séquence optimisés pour utilisation directe sur mermaidchart.com.

---

## 1️⃣ INSCRIPTION ET AUTHENTIFICATION COMPLÈTE

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🌐 Frontend
    participant G as 📡 GraphQL API
    participant DB as 💾 Database
    participant E as 📧 EmailService
    participant R as 📬 Resend API
    
    Note over U,R: Phase 1: Inscription initiale
    U->>+F: Saisit email/password
    F->>F: Validation côté client
    F->>+G: mutation register(email, password, lang)
    
    G->>G: Validation des données
    G->>+DB: Vérifier unicité email
    DB-->>-G: ✅ Email disponible
    
    G->>G: Hash du password (argon2)
    G->>G: Génération code 8 chiffres
    G->>+DB: Créer TempUser{email, hashedPassword, code}
    DB-->>-G: ✅ TempUser créé
    
    G->>+E: sendVerificationEmail(email, code, lang)
    E->>+R: Envoyer template email confirmation
    R-->>-E: ✅ Email envoyé
    E-->>-G: Confirmation envoi
    
    G-->>-F: Success("Email de confirmation envoyé")
    F-->>-U: "Vérifiez votre boîte email 📧"
    
    Note over U,R: Phase 2: Confirmation email
    U->>U: Consulte boîte email + note le code
    U->>+F: Saisit code de vérification
    F->>+G: mutation confirmEmail(codeByUser)
    
    G->>+DB: SELECT TempUser WHERE randomCode = codeByUser
    DB-->>-G: ✅ TempUser trouvé
    
    G->>+DB: CREATE User FROM TempUser data
    DB-->>-G: ✅ User permanent créé
    
    G->>+DB: DELETE TempUser WHERE randomCode = codeByUser
    DB-->>-G: ✅ Données temporaires supprimées
    
    G->>G: Génération JWT avec user.id + role
    G->>G: Set-Cookie HttpOnly sécurisé
    
    G-->>-F: Success + JWT cookie + userData
    F->>F: Redirection automatique vers /files
    F-->>-U: "Compte créé avec succès! 🎉"
    
    Note over U,R: ✅ L'utilisateur est authentifié et redirigé
```

---

## 2️⃣ UPLOAD FICHIER AVEC VÉRIFICATIONS QUOTA

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🌐 Frontend
    participant G as 📡 GraphQL API
    participant S as 📁 Storage API
    participant FS as 💿 File System
    participant DB as 💾 Database
    participant SU as 🛠️ StorageUtils
    
    Note over U,SU: Vérifications préliminaires
    U->>+F: Drag & drop fichier ou Browse
    F->>F: Validation: taille < 20MB (user) ou illimitée (premium)
    F->>F: Validation: type de fichier accepté
    
    F->>+G: query getUserInfo (pour vérifier quota)
    G->>+DB: SELECT User LEFT JOIN Subscription
    DB-->>-G: User{id, email, subscription{status, endAt}}
    
    G->>+SU: calculateTotalStorageUsed(user.id)
    SU->>+DB: SELECT SUM(size) FROM Resource WHERE userId = ?
    DB-->>-SU: totalBytesUsed
    SU->>SU: calculateStoragePercentage(totalBytesUsed, hasSubscription)
    SU-->>-G: storageInfo{bytesUsed, percentage, maxStorage}
    
    G-->>-F: UserStorage + isSubscribed
    
    F->>F: maxSize = isSubscribed ? Infinity : 20971520 (20MB)
    F->>F: availableSpace = maxStorage - currentUsage
    
    alt Fichier trop volumineux OU quota dépassé
        F-->>U: ❌ "Fichier trop volumineux" OU "Espace insuffisant"
        F->>F: Afficher modal "Passer Premium" avec avantages
        F-->>U: "Passez Premium pour plus d'espace! 💎"
    else ✅ Validations passées
        Note over U,SU: Processus d'upload
        F->>+S: POST /upload + FormData{file} + JWT cookie
        S->>S: authMiddleware: vérification JWT cookie
        S->>S: multer: validation et parsing du fichier
        S->>S: Génération nom unique: timestamp_originalName
        
        S->>+FS: fs.writeFile(uniqueFileName, fileBuffer)
        FS-->>-S: ✅ Fichier physique sauvé
        
        S-->>-F: {filename, path, size, mimetype}
        
        Note over U,SU: Enregistrement métadonnées
        F->>+G: mutation createResource(name, description, size, path)
        G->>G: isAuth: vérification utilisateur connecté
        G->>G: Validation: Resource.name unique
        G->>G: Génération URL unique: /uploads/filename
        
        G->>+DB: validateStorageLimit(userId, fileSize)
        DB-->>-G: ✅ Limite respectée
        
        G->>+DB: INSERT Resource{name, path, url, size, userId, visibility: PRIVATE}
        DB-->>-G: ✅ Resource créée avec id
        
        G->>+DB: SystemLog.logEvent("SUCCESS", "Resource created", resourceId, userId)
        DB-->>-G: ✅ Événement loggé
        
        G-->>-F: Resource{id, name, url, formattedSize, createdAt}
        F->>F: Ajout à la liste des fichiers (temps réel)
        F-->>-U: ✅ "Fichier uploadé avec succès! 📁"
        
        F->>F: Rafraîchir quota utilisateur
    end
```

---

## 3️⃣ PAIEMENT STRIPE PREMIUM COMPLET

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🌐 Frontend
    participant G as 📡 GraphQL API
    participant SS as 💳 StripeService
    participant ST as 🏦 Stripe API
    participant DB as 💾 Database
    participant W as 🔔 Webhook
    
    Note over U,W: Phase 1: Création PaymentIntent
    U->>+F: Clique "Devenir Premium - 9€/mois"
    F->>F: Affichage loader "Préparation du paiement..."
    
    F->>+G: mutation createPaymentIntent(amount: 900, currency: "eur", description: "Abonnement Premium")
    G->>G: isAuth: vérification JWT cookie
    G->>+SS: createPaymentIntent({amount: 900, currency: "eur", description})
    
    SS->>+DB: getOrCreateStripeCustomer(user)
    alt stripeCustomerId existe déjà
        DB-->>SS: stripeCustomerId from User table
    else Premier paiement utilisateur
        SS->>+ST: POST /v1/customers {email: user.email, name: user.email}
        ST-->>-SS: Customer{id: "cus_xxxxx"}
        SS->>+DB: UPDATE User SET stripeCustomerId = "cus_xxxxx"
        DB-->>-SS: ✅ Customer ID sauvé
    end
    
    SS->>+ST: POST /v1/payment_intents {amount: 900, currency: "eur", customer: customerId}
    ST-->>-SS: PaymentIntent{id, client_secret, status: "requires_payment_method"}
    SS-->>-G: {clientSecret, paymentIntentId}
    
    G-->>-F: clientSecret pour Stripe Elements
    F->>F: Initialisation Stripe Elements avec clientSecret
    F-->>-U: Formulaire de paiement sécurisé
    
    Note over U,W: Phase 2: Saisie et confirmation paiement
    U->>F: Saisit numéro carte, CVC, date expiration
    F->>F: Validation temps réel Stripe Elements
    U->>+F: Clique "Payer 9,00 €"
    F->>F: Affichage loader "Traitement du paiement..."
    
    F->>+ST: stripe.confirmPayment(clientSecret, {payment_method: {card: elements}})
    ST->>ST: Vérification carte + autorisation bancaire
    
    alt Paiement refusé
        ST-->>F: PaymentIntent{status: "requires_payment_method", error}
        F-->>U: ❌ "Paiement refusé: " + error.message
        F-->>U: "Vérifiez vos informations bancaires"
    else Paiement accepté
        ST-->>-F: PaymentIntent{status: "succeeded"}
        F-->>-U: ✅ "Paiement accepté! Activation en cours... ⏳"
    end
    
    Note over U,W: Phase 3: Webhook traitement asynchrone
    ST->>+W: POST /webhooks/stripe + Event{type: "payment_intent.succeeded"}
    W->>W: Vérification signature Stripe (sécurité)
    
    W->>+G: handleStripeWebhook(event)
    G->>+SS: handleWebhook(event)
    SS->>SS: switch(event.type)
    
    alt payment_intent.succeeded
        SS->>+DB: SELECT User WHERE stripeCustomerId = paymentIntent.customer
        DB-->>-SS: User trouvé
        
        SS->>+DB: INSERT/UPDATE Subscription {userId, paidAt: now(), endAt: now() + 30 days, status: ACTIVE, stripePaymentIntentId}
        DB-->>-SS: ✅ Abonnement Premium activé
        
        SS->>+DB: SystemLog.logEvent("SUCCESS", "Premium subscription activated", userId)
        DB-->>-SS: ✅ Activation loggée
        
    else payment_intent.payment_failed
        SS->>+DB: SystemLog.logEvent("ERROR", "Payment failed", paymentIntent.customer)
        DB-->>-SS: ✅ Échec loggé
    end
    
    SS-->>-G: Webhook traité avec succès
    G-->>-W: 200 OK
    W-->>-ST: ✅ Webhook acknowledgment
    
    Note over U,W: Phase 4: Mise à jour interface utilisateur
    F->>F: Polling getUserInfo toutes les 2 secondes
    F->>+G: query getUserInfo
    G->>+DB: SELECT User LEFT JOIN Subscription WHERE User.id = userId
    DB-->>-G: User{subscription{status: ACTIVE, endAt}}
    G-->>-F: isSubscribed: true, subscriptionEndDate
    
    F->>F: Mise à jour UI: badge "Premium", fonctionnalités débloquées
    F-->>-U: 🎉 "Bienvenue dans Wild Transfer Premium!"
    F-->>U: "✨ Upload illimité débloqué ✨"
```

---

## 4️⃣ PARTAGE DE FICHIER AVEC CONTACTS

```mermaid
sequenceDiagram
    participant U1 as 👤 Propriétaire
    participant F as 🌐 Frontend
    participant G as 📡 GraphQL API
    participant DB as 💾 Database
    participant U2 as 👥 Contact
    participant F2 as 🌐 Frontend Contact
    participant E as 📧 EmailService
    
    Note over U1,E: Phase 1: Sélection du fichier à partager
    U1->>+F: Clique icône "Partager" 🔗 sur un fichier
    F->>+G: query getMyContacts
    G->>G: isAuth: vérification propriétaire
    G->>+DB: SELECT Contact JOIN User WHERE status='ACCEPTED' AND (sourceUserId=? OR targetUserId=?)
    DB-->>-G: Liste contacts acceptés avec détails
    G-->>-F: contacts[{id, email, profilePicture, status}]
    
    F-->>-U1: Modal "Partager fichier" + liste contacts avec avatars
    
    Note over U1,E: Phase 2: Sélection des contacts
    U1->>+F: Sélectionne 3 contacts + clique "Partager"
    F->>+G: mutation createUserAccess(resourceId, contactUserIds[])
    G->>+DB: SELECT Resource WHERE id=resourceId AND userId=currentUserId
    DB-->>-G: ✅ Vérification: utilisateur = propriétaire du fichier
    
    loop Pour chaque contact sélectionné
        G->>+DB: INSERT user_resource_access {userId: contactId, resourceId}
        DB-->>-G: ✅ Permission d'accès accordée
        
        G->>+DB: SystemLog.logEvent("SUCCESS", "File shared", resourceId, contactId)
        DB-->>-G: ✅ Partage loggé
    end
    
    Note over U1,E: Phase 3: Notifications des contacts
    G->>+E: sendShareNotification(contactEmails, resourceName, ownerEmail)
    loop Pour chaque contact
        E->>E: Génération email "📁 X vous a partagé un fichier"
        E-->>E: Template avec nom fichier + lien direct
    end
    E-->>-G: ✅ Notifications envoyées à tous les contacts
    
    G-->>-F: {success: true, sharedWithCount: 3}
    F-->>-U1: ✅ "Fichier partagé avec 3 contacts! 📧"
    
    Note over U1,E: Phase 4: Accès par un contact
    U2->>U2: Reçoit email "Nouveau fichier partagé"
    U2->>+F2: Se connecte et va dans "Fichiers partagés"
    F2->>+G: query getUserSharedResources
    G->>+DB: SELECT Resource JOIN user_resource_access WHERE userId = currentUserId
    DB-->>-G: Liste fichiers partagés avec cet utilisateur
    G-->>-F2: sharedResources[{id, name, size, owner, sharedAt}]
    
    F2-->>-U2: Liste des fichiers partagés avec badge "Partagé par X"
    
    U2->>+F2: Clique "Télécharger" sur le fichier partagé
    F2->>+G: query getResourceById(resourceId)
    G->>+DB: SELECT Resource JOIN user_resource_access WHERE resourceId=? AND (userId=? OR resourceOwnerId=?)
    DB-->>-G: ✅ Accès autorisé (utilisateur dans la liste de partage)
    G-->>-F2: resourceUrl + metadata
    
    F2->>F2: Téléchargement automatique du fichier
    F2-->>-U2: ✅ "Téléchargement terminé! 📥"
```

---

## 5️⃣ GÉNÉRATION LIEN TEMPORAIRE PUBLIC

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🌐 Frontend
    participant S as 📁 Storage API
    participant FS as 💿 File System
    participant DB as 💾 JSON File
    participant EXT as 🌍 Utilisateur Externe
    participant C as 🤖 CleanupService
    
    Note over U,C: Phase 1: Upload pour partage temporaire
    U->>+F: Page "Partage rapide" + sélection fichier
    F->>F: Validation: fichier < 100MB pour partage temporaire
    F-->>U: "Génération du lien de partage... ⏳"
    
    F->>+S: POST /temp/upload + FormData{file}
    S->>S: Génération tempId unique (UUID v4)
    S->>S: Calcul expiration = now() + 24 heures
    S->>S: fileName = tempId + originalExtension
    
    S->>+FS: Sauvegarde dans /temp/{tempId}.ext
    FS-->>-S: ✅ Fichier temporaire sauvé
    
    S->>+DB: JSON.save({tempId, originalName, size, expiresAt, createdAt})
    DB-->>-S: ✅ Métadonnées temporaires sauvées
    
    S-->>-F: {tempId, shareUrl: `/temp/${tempId}`, expiresAt}
    
    F->>F: Génération QR Code pour l'URL
    F-->>-U: 🔗 Lien + QR Code + "Expire dans 24h"
    U-->>U: Copie lien et partage (email, SMS, etc.)
    
    Note over U,C: Phase 2: Accès par utilisateur externe
    EXT->>EXT: Reçoit le lien https://domain.com/temp/abc-123-def
    EXT->>+S: GET /temp/{tempId}
    S->>+DB: JSON.find(tempId)
    
    alt Fichier expiré ou inexistant
        DB-->>S: null OU expiresAt < now()
        S-->>EXT: 404 ❌ "Fichier expiré ou non trouvé"
        S-->>EXT: "Les liens temporaires expirent après 24h"
    else Fichier valide et accessible
        DB-->>-S: {originalName, size, expiresAt}
        S->>+FS: fs.readFile(/temp/{tempId})
        FS-->>-S: fileBuffer
        
        S->>S: Content-Disposition: attachment; filename="originalName"
        S->>S: Content-Type: application/octet-stream
        S-->>-EXT: ✅ Téléchargement direct du fichier
    end
    
    EXT-->>EXT: Fichier téléchargé avec nom original
    
    Note over U,C: Phase 3: Nettoyage automatique (CRON)
    C->>C: Tâche CRON toutes les heures
    C->>+DB: JSON.filter(file => file.expiresAt < now())
    DB-->>-C: Liste des fichiers expirés
    
    loop Pour chaque fichier expiré
        C->>+FS: fs.unlink(/temp/{tempId})
        FS-->>-C: ✅ Fichier physique supprimé
        
        C->>+DB: JSON.remove(tempId)
        DB-->>-C: ✅ Métadonnées supprimées
    end
    
    C->>C: console.log(`🗑️ Cleanup: ${count} fichiers supprimés`)
    
    Note over U,C: ✅ Système auto-nettoyant pour économiser l'espace disque
```

---

## 6️⃣ WORKFLOW SIGNALEMENT ET MODÉRATION

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant F as 🌐 Frontend
    participant G as 📡 GraphQL API
    participant DB as 💾 Database
    participant A as 👮 Admin
    participant AF as 🖥️ Admin Frontend
    participant E as 📧 EmailService
    
    Note over U,E: Phase 1: Signalement par utilisateur
    U->>+F: Survole un fichier → clique "⚠️ Signaler"
    F-->>-U: Modal avec raisons: Contenu inapproprié, Spam, Harcèlement, Autre
    
    U->>+F: Sélectionne "Contenu inapproprié" + commentaire optionnel
    F->>+G: mutation createReportByIds(resourceId, reason: "INAPPROPRIATE", content: "...")
    G->>G: isAuth: vérification utilisateur connecté
    
    G->>+DB: Vérifier absence de doublon WHERE userId=? AND resourceId=?
    DB-->>-G: ✅ Pas de signalement existant
    
    G->>+DB: INSERT Report{userId, resourceId, reason, content, createdAt}
    DB-->>-G: ✅ Report ID=123 créé
    
    G->>+DB: SystemLog.logEvent("WARNING", "Content reported", reportId=123, userId)
    DB-->>-G: ✅ Signalement loggé
    
    G-->>-F: {success: true, message: "Signalement enregistré"}
    F-->>-U: ✅ "Merci pour votre signalement. Notre équipe va l'examiner."
    
    Note over U,E: Phase 2: Notification automatique admin
    G->>+E: sendAdminAlert("Nouveau signalement", reportDetails)
    E->>E: Email vers admin@wildtransfer.cloud
    E-->>-G: ✅ Admin notifié immédiatement
    
    Note over U,E: Phase 3: Modération par admin
    A->>+AF: Se connecte à l'interface admin /admin/reports
    AF->>+G: query getAllReports (ADMIN ONLY)
    G->>G: Vérification rôle ADMIN
    G->>+DB: SELECT Report JOIN User JOIN Resource ORDER BY createdAt DESC
    DB-->>-G: Liste complète des signalements avec contexte
    G-->>-AF: reports[{id, reason, content, reporter, resource, createdAt}]
    
    AF-->>-A: Dashboard de modération avec signalements triés par priorité
    
    A->>+AF: Clique sur signalement "Contenu inapproprié" 
    AF->>+G: query getReportDetails(reportId)
    G->>+DB: Récupérer Report + Resource + Tous les signalements de cette ressource
    DB-->>-G: Contexte complet pour décision éclairée
    G-->>-AF: {report, resource, ownerInfo, allReportsForResource}
    
    AF-->>-A: Vue détaillée: fichier, historique, utilisateur propriétaire
    
    Note over U,E: Phase 4: Décision de modération
    alt Action: Supprimer le fichier (signalement justifié)
        A->>+AF: Clique "🗑️ Supprimer le fichier"
        AF->>AF: Confirmation: "Êtes-vous sûr ? Cette action est irréversible"
        A->>AF: Confirme la suppression
        
        AF->>+G: mutation deleteResource(resourceId, reason: "Content violation")
        G->>+DB: DELETE Resource WHERE id=resourceId (CASCADE delete comments, likes, reports)
        DB-->>-G: ✅ Resource et données associées supprimées
        
        G->>+DB: SystemLog.logEvent("SUCCESS", "Resource deleted by admin", resourceId, adminUserId)
        DB-->>-G: ✅ Action d'administration loggée
        
        G->>+E: notifyUserResourceDeleted(resourceOwnerId, resourceName, reason)
        E-->>-G: ✅ Propriétaire notifié de la suppression
        
        G-->>-AF: {success: true, message: "Fichier supprimé"}
        AF-->>A: ✅ "Fichier supprimé pour violation de contenu"
        
    else Action: Rejeter le signalement (non justifié)
        A->>+AF: Clique "❌ Rejeter le signalement"
        AF->>+G: mutation deleteReport(reportId, adminComment: "Signalement non justifié")
        
        G->>+DB: DELETE Report WHERE id=reportId
        DB-->>-G: ✅ Signalement supprimé
        
        G->>+DB: SystemLog.logEvent("INFO", "Report rejected by admin", reportId, adminUserId)
        DB-->>-G: ✅ Rejet loggé
        
        G-->>-AF: {success: true, message: "Signalement rejeté"}
        AF-->>A: ✅ "Signalement marqué comme non justifié"
    end
    
    AF->>AF: Mise à jour de la liste des signalements en temps réel
    AF-->>A: Interface rafraîchie, signalement traité retiré de la liste
```

---

## 7️⃣ SYSTÈME WEBHOOK STRIPE COMPLET

```mermaid
sequenceDiagram
    participant ST as 🏦 Stripe
    participant W as 🔔 Webhook /webhooks/stripe
    participant G as 📡 GraphQL API
    participant SS as 💳 StripeService
    participant DB as 💾 Database
    participant U as 👤 Utilisateur
    participant E as 📧 EmailService
    
    Note over ST,E: Événement déclenché côté Stripe
    ST->>ST: Événement: payment_intent.succeeded
    ST->>+W: POST /webhooks/stripe + JSON payload + Stripe-Signature header
    
    W->>W: Récupération signature dans header
    W->>W: stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
    
    alt Signature invalide (sécurité)
        W-->>ST: 400 Bad Request "Invalid signature"
        Note over ST,W: Stripe va retry l'événement
    else Signature valide ✅
        W->>+G: handleStripeWebhook(validatedEvent)
        G->>+SS: handleWebhook(event)
        SS->>SS: console.log(`Processing event: ${event.type}`)
        
        alt event.type === "payment_intent.succeeded"
            Note over SS,E: Paiement réussi - Activer Premium
            SS->>SS: paymentIntent = event.data.object
            SS->>+DB: SELECT User WHERE stripeCustomerId = paymentIntent.customer
            DB-->>-SS: User trouvé avec ID
            
            SS->>+DB: UPSERT Subscription SET {userId, paidAt: now(), endAt: now() + 30 days, status: 'ACTIVE', stripeSubscriptionId: paymentIntent.id}
            DB-->>-SS: ✅ Premium activé pour 1 mois
            
            SS->>+E: sendPaymentSuccessEmail(user, {amount: paymentIntent.amount, endDate})
            E->>E: Template "🎉 Bienvenue Premium! Votre paiement de 9€ a été accepté"
            E-->>-SS: ✅ Email de confirmation envoyé
            
            SS->>+DB: SystemLog.logEvent("SUCCESS", `Premium activated for user ${user.email}`, paymentIntent.id)
            DB-->>-SS: ✅ Activation loggée
            
        else event.type === "payment_intent.payment_failed" 
            Note over SS,E: Paiement échoué - Notifier l'utilisateur
            SS->>SS: paymentIntent = event.data.object
            SS->>+DB: SELECT User WHERE stripeCustomerId = paymentIntent.customer
            DB-->>-SS: User trouvé
            
            SS->>+E: sendPaymentFailedEmail(user, paymentIntent.last_payment_error)
            E->>E: Template "❌ Paiement échoué - Veuillez réessayer"
            E-->>-SS: ✅ Email d'échec envoyé
            
            SS->>+DB: SystemLog.logEvent("ERROR", `Payment failed for user ${user.email}`, paymentIntent.last_payment_error)
            DB-->>-SS: ✅ Échec loggé
            
        else event.type === "customer.subscription.updated"
            Note over SS,E: Changement d'abonnement (renouvellement, modification)
            SS->>SS: subscription = event.data.object
            SS->>+DB: SELECT Subscription WHERE stripeSubscriptionId = subscription.id
            DB-->>-SS: Subscription trouvée
            
            SS->>SS: Mapper statut Stripe → enum local
            SS->>+DB: UPDATE Subscription SET {status: mappedStatus, endAt: subscription.current_period_end}
            DB-->>-SS: ✅ Abonnement mis à jour
            
            SS->>+DB: SystemLog.logEvent("INFO", "Subscription updated", subscription.id)
            DB-->>-SS: ✅ Modification loggée
            
        else event.type === "customer.subscription.deleted"
            Note over SS,E: Annulation d'abonnement
            SS->>SS: subscription = event.data.object
            SS->>+DB: SELECT Subscription WHERE stripeSubscriptionId = subscription.id
            DB-->>-SS: Subscription trouvée
            
            SS->>+DB: UPDATE Subscription SET {status: 'CANCELLED', endAt: now()}
            DB-->>-SS: ✅ Abonnement annulé immédiatement
            
            SS->>+E: sendSubscriptionCancelledEmail(user, subscription.canceled_at)
            E->>E: Template "📪 Abonnement annulé - Merci pour votre confiance"
            E-->>-SS: ✅ Email d'annulation envoyé
            
            SS->>+DB: SystemLog.logEvent("WARNING", "Subscription cancelled", subscription.id)
            DB-->>-SS: ✅ Annulation loggée
            
        else
            SS->>+DB: SystemLog.logEvent("INFO", `Unhandled webhook: ${event.type}`, event.id)
            DB-->>-SS: ✅ Événement non géré loggé
        end
        
        SS-->>-G: {success: true, processedEventType: event.type}
        G-->>-W: Webhook traité avec succès
        W-->>-ST: 200 OK
    end
    
    Note over ST,E: Stripe marque l'événement comme "successfully processed"
    
    Note over ST,E: Mise à jour temps réel côté utilisateur (si connecté)
    opt Utilisateur connecté pendant le processus
        U->>+G: query getUserInfo (polling automatique toutes les 5s)
        G->>+DB: SELECT User LEFT JOIN Subscription WHERE User.id = ?
        DB-->>-G: Données utilisateur mises à jour avec nouveau statut
        G-->>-U: {isSubscribed: true, subscription: {status: "ACTIVE", endAt}}
        
        U->>U: Interface mise à jour automatiquement
        U->>U: Notification push "Premium activé! 🎉"
        U->>U: Déblocage fonctionnalités: upload illimité, badge premium
    end
```

---

## 📋 GUIDE D'UTILISATION

### 🚀 Pour utiliser sur mermaidchart.com :

1. **Copiez** un diagramme complet ci-dessus
2. **Allez** sur https://mermaidchart.com  
3. **Collez** le code dans l'éditeur
4. **Ajustez** si besoin la taille d'affichage
5. **Exportez** en PNG/SVG/PDF

### 💡 Conseils par diagramme :

| Diagramme | Complexité | Durée réelle | Usage recommandé |
|-----------|------------|--------------|------------------|
| **Inscription** | ⭐⭐⭐ | ~30 secondes | Documentation onboarding |
| **Upload fichier** | ⭐⭐⭐⭐ | ~5-30 secondes | Documentation technique |
| **Paiement Stripe** | ⭐⭐⭐⭐⭐ | ~2-5 minutes | Intégration paiement |
| **Partage fichier** | ⭐⭐⭐ | ~10 secondes | Fonctionnalités sociales |
| **Lien temporaire** | ⭐⭐ | ~5 secondes | Partage rapide |
| **Signalement** | ⭐⭐⭐⭐ | ~1-24h | Processus modération |
| **Webhook Stripe** | ⭐⭐⭐⭐ | ~1-5 secondes | Architecture backend |

### 🎨 Personnalisation :

- **Couleurs** : Modifiez les emojis et participants
- **Détails** : Ajoutez/retirez des étapes selon vos besoins
- **Messages** : Adaptez les textes à votre contexte

---

**🎯 Prêt pour mermaidchart.com - Copier/Coller direct !**