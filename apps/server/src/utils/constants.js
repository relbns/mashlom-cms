const UserRoles = {
    ORG_ADMIN: 'org_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer',
}

const Stages = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    DEMO: 'demo'
}

const UserStatuses = {
    INVITED: 'invited',
    REGISTERED: 'registered',
    ARCHIVED: 'archived'
}

const OrgStatuses = {
    ACTIVE: 'active',
    DISABLED: 'disabled'
}

const TokenTypes = {
    EMAIL_CONFIRMATION: 'email_confirmation',
    PASSWORD_RESET: 'password_reset',
};

module.exports = {
    Stages,
    UserRoles,
    UserStatuses,
    OrgStatuses,
    TokenTypes
}