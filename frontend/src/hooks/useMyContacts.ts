import { GetMyContactsDocument } from '@/generated/graphql-types';
import { useQuery } from '@apollo/client';

export const useMyContacts = () => {
    const { data, loading, error, refetch } = useQuery(GetMyContactsDocument, {
        fetchPolicy: 'cache-and-network',
    });

    return {
        myContacts: data?.getMyContacts || {
            acceptedContacts: [],
            pendingRequestsReceived: [],
            pendingRequestsSent: [],
        },
        acceptedContacts: data?.getMyContacts?.acceptedContacts || [],
        pendingRequestsReceived:
            data?.getMyContacts?.pendingRequestsReceived || [],
        pendingRequestsSent: data?.getMyContacts?.pendingRequestsSent || [],
        loading,
        error,
        refetch,
    };
};
