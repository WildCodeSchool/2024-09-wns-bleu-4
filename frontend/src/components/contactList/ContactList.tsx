import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_CONTACTS } from '../../graphql/Contact/queries';
import './ContactList.scss';

interface Contact {
  id: number;
  status: string;
  createdAt: string;
  sourceUser: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  targetUser: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const ContactList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MY_CONTACTS);

  if (loading) return <div className="contact-list-loading">Chargement des contacts...</div>;
  if (error) return <div className="contact-list-error">Erreur: {error.message}</div>;

  const contacts = data?.getMyContacts || [];

  return (
    <div className="contact-list-container">
      <h2>Mes Contacts</h2>
      {contacts.length === 0 ? (
        <p className="no-contacts">Vous n'avez pas encore de contacts.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((contact: Contact) => (
            <li key={contact.id} className="contact-item">
              <div className="contact-info">
                <span className="contact-name">
                  {contact.targetUser.firstName} {contact.targetUser.lastName}
                </span>
                <span className="contact-email">{contact.targetUser.email}</span>
                <span className={`contact-status status-${contact.status.toLowerCase()}`}>
                  {contact.status === 'PENDING' ? 'En attente' : 
                   contact.status === 'ACCEPTED' ? 'Accepté' : 'Refusé'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList; 