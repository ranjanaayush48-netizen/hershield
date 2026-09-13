import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { DataStore } from '../storage/dataStore';

const router = Router();

// GET /api/contacts - List only current user's contacts
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const contacts = await DataStore.getContacts(userId);
    res.json({ contacts });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve contacts', details: err.message });
  }
});

// POST /api/contacts - Add contact
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { 
      name, 
      relationship, 
      phone, 
      is_emergency, 
      isEmergency, 
      is_active, 
      isActive,
      notify_on_sos, 
      notifyOnSos, 
      notify_on_location_share,
      notifyOnLocationShare 
    } = req.body;

    if (!name || !phone) {
      res.status(400).json({ error: 'Contact name and phone number are required.' });
      return;
    }

    const emergencyFlag = is_emergency !== undefined ? Boolean(is_emergency) : (isEmergency !== undefined ? Boolean(isEmergency) : true);
    const activeFlag = is_active !== undefined ? Boolean(is_active) : (isActive !== undefined ? Boolean(isActive) : true);
    const sosFlag = notify_on_sos !== undefined ? Boolean(notify_on_sos) : (notifyOnSos !== undefined ? Boolean(notifyOnSos) : true);
    const locationFlag = notify_on_location_share !== undefined ? Boolean(notify_on_location_share) : (notifyOnLocationShare !== undefined ? Boolean(notifyOnLocationShare) : true);

    const contact = await DataStore.addContact(userId, {
      name: String(name).trim(),
      relationship: (relationship ? String(relationship) : 'Friend').trim(),
      phone: String(phone).trim(),
      is_active: activeFlag,
      is_emergency: emergencyFlag,
      notify_on_sos: sosFlag,
      notify_on_location_share: locationFlag,
    });

    res.status(201).json({ contact, message: 'Trusted contact securely added.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add contact', details: err.message });
  }
});

// PUT /api/contacts/:id - Update contact
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const contactId = req.params.id;
    const rawUpdates = req.body;

    const sanitizedUpdates: any = {};
    if (rawUpdates.name !== undefined) sanitizedUpdates.name = String(rawUpdates.name).trim();
    if (rawUpdates.relationship !== undefined) sanitizedUpdates.relationship = String(rawUpdates.relationship).trim();
    if (rawUpdates.phone !== undefined) sanitizedUpdates.phone = String(rawUpdates.phone).trim();
    if (rawUpdates.is_active !== undefined) sanitizedUpdates.is_active = Boolean(rawUpdates.is_active);
    if (rawUpdates.isActive !== undefined) sanitizedUpdates.is_active = Boolean(rawUpdates.isActive);
    if (rawUpdates.is_emergency !== undefined) sanitizedUpdates.is_emergency = Boolean(rawUpdates.is_emergency);
    if (rawUpdates.isEmergency !== undefined) sanitizedUpdates.is_emergency = Boolean(rawUpdates.isEmergency);
    if (rawUpdates.notify_on_sos !== undefined) sanitizedUpdates.notify_on_sos = Boolean(rawUpdates.notify_on_sos);
    if (rawUpdates.notifyOnSos !== undefined) sanitizedUpdates.notify_on_sos = Boolean(rawUpdates.notifyOnSos);
    if (rawUpdates.notify_on_location_share !== undefined) sanitizedUpdates.notify_on_location_share = Boolean(rawUpdates.notify_on_location_share);
    if (rawUpdates.notifyOnLocationShare !== undefined) sanitizedUpdates.notify_on_location_share = Boolean(rawUpdates.notifyOnLocationShare);

    const updated = await DataStore.updateContact(userId, contactId, sanitizedUpdates);
    if (!updated) {
      res.status(404).json({ error: 'Contact not found or does not belong to you.' });
      return;
    }

    res.json({ contact: updated, message: 'Contact updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update contact', details: err.message });
  }
});

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const contactId = req.params.id;

    const success = await DataStore.deleteContact(userId, contactId);
    if (!success) {
      res.status(404).json({ error: 'Contact not found.' });
      return;
    }

    res.json({ success: true, message: 'Contact removed from safety network.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete contact', details: err.message });
  }
});

export default router;
