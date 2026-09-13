export interface ContactRecipient {
  id: string;
  name: string;
  phone: string;
}

export interface SosDeliveryResult {
  contact_id: string;
  contact_name: string;
  phone: string;
  status: 'delivered' | 'failed' | 'simulated_local';
  timestamp: string;
  provider_info: string;
}

export const NotificationService = {
  /**
   * Dispatches emergency notification to active trusted contacts via Fast2SMS.
   * Falls back to backend log recording when FAST2SMS_API_KEY is not configured.
   * Does not log sensitive data (API keys, phone numbers, SMS content, GPS coordinates).
   */
  async sendEmergencySos(
    contacts: ContactRecipient[],
    messageText: string,
    locationData: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      address?: string;
    }
  ): Promise<{
    success: boolean;
    sentCount: number;
    results: SosDeliveryResult[];
    disclaimer: string;
  }> {
    const results: SosDeliveryResult[] = [];
    const fast2smsKey = process.env.FAST2SMS_API_KEY;

    const mapsLink = `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
    const fullMessage = `${messageText} - GPS: ${mapsLink} (Acc: ±${Math.round(locationData.accuracy || 10)}m)`;

    for (const contact of contacts) {
      if (!contact.phone || contact.phone.trim().length < 5) {
        results.push({
          contact_id: contact.id,
          contact_name: contact.name,
          phone: contact.phone || 'N/A',
          status: 'failed',
          timestamp: new Date().toISOString(),
          provider_info: 'Invalid phone number format provided.',
        });
        continue;
      }

      if (fast2smsKey) {
        try {
          let cleanedPhone = contact.phone.replace(/[^0-9]/g, '');
          if (cleanedPhone.length === 12 && cleanedPhone.startsWith('91')) {
            cleanedPhone = cleanedPhone.substring(2);
          } else if (cleanedPhone.length === 11 && cleanedPhone.startsWith('0')) {
            cleanedPhone = cleanedPhone.substring(1);
          }

          const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
              'authorization': fast2smsKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              route: 'q',
              message: fullMessage,
              language: 'english',
              flash: 0,
              numbers: cleanedPhone,
            }),
          });

          let data: any = null;
          try {
            data = await response.json();
          } catch (_) {
            // Handled via response status check
          }

          const isAccepted = response.ok && data && data.return === true;
          let providerMsg = 'Sent via Fast2SMS Gateway';
          if (!isAccepted) {
            const rawErrMsg = data ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : null;
            providerMsg = `Fast2SMS Error: ${rawErrMsg || response.statusText || 'Delivery Failed'}`;
          }

          results.push({
            contact_id: contact.id,
            contact_name: contact.name,
            phone: contact.phone,
            status: isAccepted ? 'delivered' : 'failed',
            timestamp: new Date().toISOString(),
            provider_info: providerMsg,
          });
        } catch (err: any) {
          results.push({
            contact_id: contact.id,
            contact_name: contact.name,
            phone: contact.phone,
            status: 'failed',
            timestamp: new Date().toISOString(),
            provider_info: `Network Exception: ${err.message || 'Failed to connect to carrier'}`,
          });
        }
      } else {
        // Fallback transparent simulator when FAST2SMS_API_KEY is not configured
        console.log(`[EMERGENCY SOS BROADCAST SIMULATION] -> To contact ID: ${contact.id}`);
        results.push({
          contact_id: contact.id,
          contact_name: contact.name,
          phone: contact.phone,
          status: 'simulated_local',
          timestamp: new Date().toISOString(),
          provider_info: 'Recorded in backend SOS event logs. Add FAST2SMS_API_KEY in .env to dispatch live cellular SMS.',
        });
      }
    }

    const deliveredOrSimulated = results.filter(r => r.status === 'delivered' || r.status === 'simulated_local').length;

    return {
      success: true,
      sentCount: deliveredOrSimulated,
      results,
      disclaimer: 'In an immediate life-threatening emergency, contact official emergency services (Dial 112 or 181 in India) directly.'
    };
  }
};
