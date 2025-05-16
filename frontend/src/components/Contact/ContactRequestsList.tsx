import {
    GetPendingContactRequestsDocument,
    GetPendingContactRequestsQuery,
    useAcceptContactRequestMutation,
    useRefuseContactRequestMutation,
} from '@/generated/graphql-types';
import { useQuery } from '@apollo/client';
import { Loader } from 'lucide-react';
import CardContact from './CardContact';

interface ContactRequestProps {
    onContactUpdated: () => void;
}

const ContactRequestsList: React.FC<ContactRequestProps> = ({
    onContactUpdated,
}) => {
    const { data, loading, error, refetch } = useQuery(
        GetPendingContactRequestsDocument,
    );

    const pendingRequests = data?.getPendingContactRequests || [];

    const [acceptRequest, { loading: acceptLoading }] =
        useAcceptContactRequestMutation({
            onCompleted: () => {
                refetch();
                onContactUpdated();
            },
        });

    const [refuseRequest, { loading: refuseLoading }] =
        useRefuseContactRequestMutation({
            onCompleted: () => {
                refetch();
                onContactUpdated();
            },
        });

    if (loading) {
        return <Loader className="h-8 w-8 animate-spin text-primary" />;
    }

    if (error) {
        return (
            <div className="py-8 text-red-500">
                Une erreur est survenue lors du chargement des demandes de
                contact.
            </div>
        );
    }

    if (pendingRequests.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucune demande de contact en attente.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {pendingRequests.map(
                (
                    contact: GetPendingContactRequestsQuery['getPendingContactRequests'][0],
                ) => (
                    <CardContact
                        key={contact.id}
                        name={contact.sourceUser.email}
                        email={contact.sourceUser.email}
                        status={contact.status}
                        createdAt={contact.createdAt}
                        actions={
                            <>
                                <button
                                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 text-xs font-semibold"
                                    disabled={acceptLoading}
                                    onClick={() =>
                                        acceptRequest({
                                            variables: {
                                                contactId: contact.id,
                                            },
                                        })
                                    }
                                >
                                    {acceptLoading
                                        ? 'Acceptation...'
                                        : 'Accepter'}
                                </button>
                                <button
                                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-semibold"
                                    disabled={refuseLoading}
                                    onClick={() =>
                                        refuseRequest({
                                            variables: {
                                                contactId: contact.id,
                                            },
                                        })
                                    }
                                >
                                    {refuseLoading ? 'Refus...' : 'Refuser'}
                                </button>
                            </>
                        }
                    />
                ),
            )}
        </div>
    );
};

export default ContactRequestsList;
