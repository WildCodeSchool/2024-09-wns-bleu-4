import { gql } from '@apollo/client';

export const GET_ALL_RESOURCES = gql`
    query GetAllResources {
        getAllResources {
            id
            name
            description
            path
            url
            size
            formattedSize
            user {
                id
                email
            }
        }
    }
`;

export const GET_RESOURCES_BY_USER_ID = gql`
    query GetResourcesByUserId($userId: ID!) {
        getResourcesByUserId(userId: $userId) {
            description
            id
            name
            path
            url
            size
            formattedSize
        }
    }
`;

export const GET_RESOURCES_BY_USER_ID_PAGINATED = gql`
    query GetResourcesByUserIdPaginated($userId: ID!, $pagination: PaginationInput!) {
        getResourcesByUserIdPaginated(userId: $userId, pagination: $pagination) {
            resources {
                description
                id
                name
                path
                url
                size
                formattedSize
                user {
                    id
                    email
                    createdAt
                    profilePicture
                }
            }
            totalCount
            totalPages
            currentPage
            hasNextPage
            hasPreviousPage
        }
    }
`;

export const GET_SHARED_RESOURCES = gql`
    query GetUserSharedResources($userId: ID!) {
        getUserSharedResources(userId: $userId) {
            id
            name
            description
            path
            url
            size
            formattedSize
            user {
                id
                email
                createdAt
                profilePicture
            }
        }
    }
`;

export const GET_SHARED_RESOURCES_PAGINATED = gql`
    query GetUserSharedResourcesPaginated($userId: ID!, $pagination: PaginationInput!) {
        getUserSharedResourcesPaginated(userId: $userId, pagination: $pagination) {
            resources {
                id
                name
                description
                path
                url
                size
                formattedSize
                user {
                    id
                    email
                    createdAt
                    profilePicture
                }
            }
            totalCount
            totalPages
            currentPage
            hasNextPage
            hasPreviousPage
        }
    }
`;

export const GET_RESOURCE_STATS = gql`
    query GetResourceStats {
        getAllResources {
            id
        }
    }
`;

export const GET_USER_TOTAL_FILE_SIZE = gql`
    query GetUserTotalFileSize($userId: ID!) {
        getUserTotalFileSize(userId: $userId)
    }
`;

export const GET_USERS_WITH_ACCESS = gql`
    query GetUsersWithAccess($resourceId: ID!) {
        getUsersWithAccess(resourceId: $resourceId) {
            id
            email
        }
    }
`;

export const SEARCH_RESOURCES_BY_USER_ID = gql`
    query SearchResourcesByUserId($userId: ID!, $search: SearchInput!) {
        searchResourcesByUserId(userId: $userId, search: $search) {
            resources {
                description
                id
                name
                path
                url
                size
                formattedSize
                user {
                    id
                    email
                    createdAt
                    profilePicture
                }
            }
            totalCount
            totalPages
            currentPage
            hasNextPage
            hasPreviousPage
        }
    }
`;

// Get VT scan status for a resource and update it server-side if progressing
export const GET_RESOURCE_SCAN_STATUS = gql`
    query GetResourceScanStatus($resourceId: ID!) {
        getResourceScanStatus(resourceId: $resourceId) {
            id
            name
            scanStatus
            scanAnalysisId
            scanDate
            threatCount
            scanError
        }
    }
`;

export const GET_RESOURCE_SCAN_RESULT = gql`
    query GetResourceScanResult($resourceId: ID!) {
        getResourceScanResult(resourceId: $resourceId) {
            resourceId
            status
            analysisId
            scanDate
            threatCount
            error
            isProcessing
        }
    }
`;