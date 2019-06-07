import { IonContent, IonPage, IonButton } from '@ionic/react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../../logic/contexts/main-context';

export default function Superadmin() {
  
  const ctx = useContext(MainContext)

  return (
    <IonPage id="admin-settings">
      <IonContent>
        <h1>Settings admin</h1>
        <IonButton onClick={ctx.logout}>Logout</IonButton>
        
      </IonContent>
    </IonPage>
  );
}
