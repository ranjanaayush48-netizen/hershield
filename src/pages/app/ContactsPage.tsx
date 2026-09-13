import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Contact } from '../../types';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Trash2, 
  Edit3, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, toggleContactActive, testAlertContact } = useSafety();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [isEmergency, setIsEmergency] = useState(true);
  const [notifyOnSos, setNotifyOnSos] = useState(true);
  const [notifyOnLocationShare, setNotifyOnLocationShare] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('Family');
    setIsEmergency(true);
    setNotifyOnSos(true);
    setNotifyOnLocationShare(true);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setIsEmergency(contact.isEmergency);
    setNotifyOnSos(contact.notifyOnSos !== false);
    setNotifyOnLocationShare(contact.notifyOnLocationShare !== false);
    setIsActive(contact.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);

    try {
      if (editingContact) {
        await updateContact(editingContact.id, {
          name,
          phone,
          relationship,
          isEmergency,
          notifyOnSos,
          notifyOnLocationShare,
          isActive
        });
      } else {
        await addContact({
          name,
          phone,
          relationship,
          isEmergency,
          notifyOnSos,
          notifyOnLocationShare,
          isActive: true
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('[Contacts] Save failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contact: Contact) => {
    if (window.confirm(`Are you sure you want to remove ${contact.name} from your trusted safety network?`)) {
      try {
        await deleteContact(contact.id);
      } catch (err) {
        console.error('[Contacts] Delete failed:', err);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">
            Safety Circle Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Trusted Contacts
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
            Trusted contacts receive real-time notifications and GPS links when you activate an emergency action.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-lg font-bold text-xs text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#B8B5C9]">
        <ShieldCheck className="w-5 h-5 text-[#2DD4BF] shrink-0" />
        <span>
          Contacts designated as <strong className="text-white">Primary Emergency</strong> will automatically receive high-priority SMS and live tracking coordinates during an SOS broadcast.
        </span>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-[#A78BFA]/40 transition-colors"
          >
            <div className="space-y-4">
              
              {/* Card Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#30263D] text-[#A78BFA] font-bold text-base flex items-center justify-center border border-[#453654]">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white truncate max-w-[140px]">{c.name}</h3>
                    <span className="text-xs text-[#A78BFA] font-medium block">{c.relationship}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleContactActive(c.id)}
                  title={`Click to ${c.isActive ? 'mute' : 'activate'} this contact`}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    c.isActive 
                      ? 'bg-teal-500/10 text-[#2DD4BF] hover:bg-teal-500/20 border border-teal-500/20' 
                      : 'bg-white/5 text-[#B8B5C9] hover:bg-white/10 border border-[#30263D]'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Muted'}
                </button>
              </div>

              {/* Phone and Badges */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 text-[#B8B5C9]">
                  <Phone className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span className="font-mono text-white">{c.phone}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {c.isEmergency && (
                    <span className="text-[10px] bg-rose-500/15 text-[#FF6B6B] border border-rose-500/30 px-2 py-0.5 rounded-md font-semibold">
                      Primary Responder
                    </span>
                  )}
                  {c.notifyOnSos !== false ? (
                    <span className="text-[10px] bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/20 px-2 py-0.5 rounded-md">
                      SOS Alerts
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/5 text-[#B8B5C9]/60 border border-[#30263D] px-2 py-0.5 rounded-md">
                      No SOS
                    </span>
                  )}
                  {c.notifyOnLocationShare !== false && (
                    <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded-md">
                      Location Links
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#30263D] flex items-center justify-between gap-2">
              <button
                onClick={() => testAlertContact(c.id)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#A78BFA] flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Send simulated test alert"
              >
                <Send className="w-3 h-3" />
                <span>Test Alert</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 rounded-lg text-[#B8B5C9] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Edit contact"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setContactToDelete(c)}
                  className="p-1.5 rounded-lg text-[#B8B5C9] hover:text-[#FF6B6B] hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#30263D]">
              <h3 className="text-lg font-bold text-white">
                {editingContact ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#B8B5C9] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9]">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9]">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                  <option>Family</option>
                  <option>Partner</option>
                  <option>Close Friend</option>
                  <option>Roommate</option>
                  <option>Coworker</option>
                  <option>Neighbor</option>
                  <option>Guardian</option>
                </select>
              </div>

              {/* Preferences */}
              <div className="space-y-2 pt-2 border-t border-[#30263D]">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D] cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Primary Emergency Responder</span>
                    <span className="text-[11px] text-[#B8B5C9]">Designate as main emergency contact</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 rounded text-[#F43F6F] focus:ring-0 bg-[#1A1028] border-[#30263D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D] cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Notify on Emergency SOS</span>
                    <span className="text-[11px] text-[#B8B5C9]">Receive alert notifications when SOS triggers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnSos}
                    onChange={(e) => setNotifyOnSos(e.target.checked)}
                    className="w-4 h-4 rounded text-[#A78BFA] focus:ring-0 bg-[#1A1028] border-[#30263D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D] cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Notify on Location Sharing</span>
                    <span className="text-[11px] text-[#B8B5C9]">Receive tracking links during journeys</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnLocationShare}
                    onChange={(e) => setNotifyOnLocationShare(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2DD4BF] focus:ring-0 bg-[#1A1028] border-[#30263D] cursor-pointer"
                  />
                </label>

                {editingContact && (
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-white block">Active Status</span>
                      <span className="text-[11px] text-[#B8B5C9]">Muted contacts will not receive alerts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-400 focus:ring-0 bg-[#1A1028] border-[#30263D] cursor-pointer"
                    />
                  </label>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#B8B5C9] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-bold text-xs text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : editingContact ? 'Save Changes' : 'Add to Circle'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1A1028] border border-[#30263D] rounded-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#FF6B6B] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove Contact?</h3>
                <p className="text-xs text-[#B8B5C9]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#B8B5C9]">
              Are you sure you want to remove <strong className="text-white">{contactToDelete.name}</strong> from your trusted safety network?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#B8B5C9] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteContact(contactToDelete.id);
                  } catch (err) {
                    console.error('[Contacts] Delete failed:', err);
                  } finally {
                    setContactToDelete(null);
                  }
                }}
                className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950/40 cursor-pointer"
              >
                Remove Contact
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
