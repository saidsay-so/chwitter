# Structure de la base de données

## MessageSchema (Message)

### author

#### `UserSchema`

L'auteur du message.

### content

#### `string`

Contenu du message.

### likes

#### `number`

Nombre de likes pour ce message.

## UserSchema (Utilisateur)

### name

#### `string`

Nom d'utilisateur.

### password

#### `string`

Hash du mot de passe.

### displayName

#### `string`

Nom d'affichage.

### avatar

#### `Buffer`

Image de profil (format AVIF).

### description

#### `string`

Description.

### likedMessages

#### `Ref<MessageSchema>[]`

Messages likés par l'utilisateur.

### friends

#### `Ref<UserSchema>[]`

Utilisateurs amis.
