import { Resend } from 'resend';

// Configuration du service Resend
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export interface EmailData {
  email: string;
  fullName: string;
  reservationNumber: string;
  numberOfPeople: number;
  vrType: string;
  duration: string;
  dateTime: Date;
  totalPrice: string;
}

export async function sendConfirmationEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la clé API est configurée
    if (!import.meta.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY non configurée - email non envoyé');
      return { success: false, error: 'Service email non configuré' };
    }

    // Formatage de la date
    const formattedDate = data.dateTime.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = data.dateTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Template HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de réservation VR</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .reservation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-row:last-child { border-bottom: none; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #6b7280; }
          .success-icon { color: #10B981; font-size: 48px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Réservation VR Confirmée ✅</h1>
          <p>Numéro de réservation : ${data.reservationNumber}</p>
        </div>
        
        <div class="content">
          <div class="success-icon">🎉</div>
          
          <h2>Bonjour ${data.fullName},</h2>
          
          <p>Votre réservation d'expérience de réalité virtuelle a été confirmée avec succès !</p>
          
          <div class="reservation-details">
            <h3>Détails de votre réservation :</h3>
            
            <div class="detail-row">
              <span>Nombre de personnes :</span>
              <span>${data.numberOfPeople} personne${data.numberOfPeople > 1 ? 's' : ''}</span>
            </div>
            
            <div class="detail-row">
              <span>Type de VR :</span>
              <span>${data.vrType}</span>
            </div>
            
            <div class="detail-row">
              <span>Durée :</span>
              <span>${data.duration} minutes</span>
            </div>
            
            <div class="detail-row">
              <span>Date :</span>
              <span>${formattedDate}</span>
            </div>
            
            <div class="detail-row">
              <span>Heure :</span>
              <span>${formattedTime}</span>
            </div>
            
            <div class="detail-row">
              <span>Prix total :</span>
              <span>${data.totalPrice} €</span>
            </div>
          </div>
          
          <h3>Informations importantes :</h3>
          <ul>
            <li>Merci d'arriver 10 minutes avant votre créneau</li>
            <li>Présentez ce mail ou votre numéro de réservation à l'accueil</li>
            <li>En cas d'empêchement, merci de nous prévenir 24h à l'avance</li>
            <li>L'expérience VR est déconseillée aux enfants de moins de 13 ans</li>
          </ul>
          
          <p>Nous avons hâte de vous faire vivre cette expérience immersive !</p>
          
          <p>L'équipe VR Experience</p>
        </div>
        
        <div class="footer">
          <p>Cet email de confirmation a été généré automatiquement.<br>
          Pour toute question, contactez-nous à : contact@vrexperience.fr</p>
        </div>
      </body>
      </html>
    `;

    // Version texte simple
    const textContent = `
      Confirmation de réservation VR
      
      Bonjour ${data.fullName},
      
      Votre réservation d'expérience de réalité virtuelle a été confirmée !
      
      Numéro de réservation : ${data.reservationNumber}
      
      Détails :
      - ${data.numberOfPeople} personne${data.numberOfPeople > 1 ? 's' : ''}
      - ${data.vrType}
      - ${data.duration} minutes
      - Le ${formattedDate} à ${formattedTime}
      - Prix total : ${data.totalPrice} €
      
      Informations importantes :
      - Arrivez 10 minutes avant votre créneau
      - Présentez ce mail à l'accueil
      - Prévenez-nous 24h à l'avance en cas d'empêchement
      
      L'équipe VR Experience
    `;

    // Envoi de l'email
    const result = await resend.emails.send({
      from: 'VR Experience <noreply@vrexperience.fr>',
      to: [data.email],
      subject: `Confirmation de réservation VR - ${data.reservationNumber}`,
      html: htmlContent,
      text: textContent,
    });

    console.log('Email envoyé avec succès:', result);
    return { success: true };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}
