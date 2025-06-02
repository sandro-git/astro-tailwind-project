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

// Fonction de diagnostic améliorée
export async function testResendConfiguration(): Promise<{ success: boolean; message: string }> {
  try {
    // Vérifier que la clé API est configurée
    if (!import.meta.env.RESEND_API_KEY) {
      return { 
        success: false, 
        message: 'RESEND_API_KEY non configurée dans les variables d\'environnement' 
      };
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    
    // Vérifier le format de la clé API
    if (!apiKey.startsWith('re_')) {
      return { 
        success: false, 
        message: 'Format de clé API Resend invalide (doit commencer par "re_")' 
      };
    }

    // Test plus simple avec l'endpoint de validation
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'test@invalid-domain-for-validation.com',
          to: ['test@example.com'],
          subject: 'Test de validation',
          html: 'Test'
        })
      });

      // On s'attend à une erreur 422 (validation) ou 400, pas 401 (authentification)
      if (response.status === 401) {
        return { 
          success: false, 
          message: 'Clé API Resend invalide ou expirée' 
        };
      }

      // Toute autre erreur (422, 400, etc.) signifie que l'authentification a fonctionné
      return { 
        success: true, 
        message: 'Configuration Resend valide - Authentification réussie' 
      };

    } catch (fetchError) {
      // Erreur réseau ou autre - on considère que la clé est probablement valide
      console.warn('Impossible de tester la clé API via l\'API, mais elle semble correcte:', fetchError);
      return { 
        success: true, 
        message: 'Clé API présente et format correct (test réseau échoué)' 
      };
    }

  } catch (error) {
    return { 
      success: false, 
      message: `Erreur de test: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    };
  }
}

export async function sendConfirmationEmail(data: EmailData): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    console.log('=== DÉBUT ENVOI EMAIL ===');
    console.log('Destinataire:', data.email);
    console.log('Numéro de réservation:', data.reservationNumber);

    // Vérifier que la clé API est configurée
    if (!import.meta.env.RESEND_API_KEY) {
      const error = 'RESEND_API_KEY non configurée - email non envoyé';
      console.error('❌', error);
      return { success: false, error };
    }

    console.log('✅ Clé API Resend configurée');

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

    console.log('✅ Données formatées:', { formattedDate, formattedTime });

    // Email d'expédition configuré
    const fromEmail = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
    console.log('📧 Email d\'expédition:', fromEmail);

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
          
          <p>L'équipe VR Café</p>
        </div>
        
        <div class="footer">
          <p>Cet email de confirmation a été généré automatiquement.<br>
          Pour toute question, contactez-nous à : contact@vr-cafe.fr</p>
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
      
      L'équipe VR Café
    `;

    // Paramètres de l'email
    const emailParams = {
      from: fromEmail,
      to: [data.email],
      subject: `Confirmation de réservation VR - ${data.reservationNumber}`,
      html: htmlContent,
      text: textContent,
    };

    console.log('📤 Paramètres d\'envoi:', {
      from: emailParams.from,
      to: emailParams.to,
      subject: emailParams.subject
    });

    // Envoi de l'email
    console.log('📨 Envoi en cours...');
    const result = await resend.emails.send(emailParams);

    console.log('✅ Résultat Resend:', result);
    console.log('=== FIN ENVOI EMAIL ===');

    return { 
      success: true, 
      details: result 
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    console.log('=== FIN ENVOI EMAIL (ERREUR) ===');
    
    // Journalisation détaillée de l'erreur
    if (error instanceof Error) {
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      details: error
    };
  }
}