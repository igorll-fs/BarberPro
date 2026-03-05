/* ============================
   BARBERPRO WEB — Agendamento Público
   Página para clientes agendarem pela web
   ============================ */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { ServiceItem, Barbershop, StaffMember } from '../../types';

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [shop, setShop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking form state
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadShopData();
  }, [slug]);

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      // Load shop
      const shopDoc = await getDoc(doc(db, 'barbershops', slug));
      if (!shopDoc.exists()) {
        setError('Barbearia não encontrada');
        return;
      }
      setShop({ ...shopDoc.data(), slug } as Barbershop);

      // Load services
      const servicesSnap = await getDocs(
        query(collection(db, 'barbershops', slug, 'services'), where('active', '==', true))
      );
      setServices(servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem)));

      // Load staff
      const staffSnap = await getDocs(
        query(collection(db, 'barbershops', slug, 'staff'), where('active', '==', true))
      );
      setStaff(staffSnap.docs.map(d => ({ uid: d.id, ...d.data() } as StaffMember)));

    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!slug || !selectedService || !selectedDate) return;

    // Mock available slots - in production, this would check against existing appointments
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    setAvailableSlots(slots);
  };

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedService, selectedStaff]);

  const handleSubmit = async () => {
    if (!slug || !selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      return;
    }

    setSubmitting(true);
    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(dateTime.getTime() + (selectedService.durationMin || 30) * 60000);

      await addDoc(collection(db, 'barbershops', slug, 'appointments'), {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        staffUid: selectedStaff?.uid || null,
        staffName: selectedStaff?.name || null,
        customerName,
        customerPhone,
        start: Timestamp.fromDate(dateTime),
        end: Timestamp.fromDate(endTime),
        durationMin: selectedService.durationMin || 30,
        priceCents: selectedService.priceCents || 0,
        status: 'pending',
        createdAt: Timestamp.now(),
        source: 'web',
      });

      setBookingSuccess(true);
    } catch (err) {
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">😕</h1>
          <p>{error || 'Barbearia não encontrada'}</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-4">
        <div className="bg-[#1C2333] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-white mb-4">Agendamento Confirmado!</h1>
          <p className="text-gray-300 mb-6">
            Seu agendamento para <strong>{selectedService?.name}</strong> foi solicitado.
            A barbearia entrará em contato para confirmar.
          </p>
          <button
            onClick={() => navigate(`/b/${slug}`)}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
          >
            Voltar para a Barbearia
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Header */}
      <div className="bg-[#1C2333] border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate(`/b/${slug}`)}
              className="text-gray-400 hover:text-white"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-white flex-1">Agendar</h1>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Escolha o serviço</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                  className={`w-full bg-[#1C2333] border rounded-xl p-4 text-left transition ${
                    selectedService?.id === service.id
                      ? 'border-emerald-500'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <span className="text-emerald-400 font-semibold">
                      {formatPrice(service.priceCents)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>⏱️ {service.durationMin} min</span>
                    {service.category && <span>📁 {service.category}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Staff */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Escolha o profissional</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedStaff(null);
                  setStep(3);
                }}
                className={`w-full bg-[#1C2333] border rounded-xl p-4 text-left transition ${
                  selectedStaff === null
                    ? 'border-emerald-500'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                    🎲
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Qualquer disponível</h3>
                    <p className="text-gray-400 text-sm">Escolheremos o melhor profissional</p>
                  </div>
                </div>
              </button>

              {staff.map((member) => (
                <button
                  key={member.uid}
                  onClick={() => {
                    setSelectedStaff(member);
                    setStep(3);
                  }}
                  className={`w-full bg-[#1C2333] border rounded-xl p-4 text-left transition ${
                    selectedStaff?.uid === member.uid
                      ? 'border-emerald-500'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{member.name}</h3>
                      <p className="text-gray-400 text-sm">{member.rating ? `⭐ ${member.rating.toFixed(1)}` : 'Profissional'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Escolha data e horário</h2>
            
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-[#1C2333] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-gray-400 mb-2">Horário</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedTime(slot);
                        setStep(4);
                      }}
                      className={`py-3 rounded-xl text-sm font-medium transition ${
                        selectedTime === slot
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#1C2333] text-gray-300 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Customer Info */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Seus dados</h2>
            
            <div className="bg-[#1C2333] rounded-xl p-4 mb-6">
              <h3 className="text-white font-medium mb-2">Resumo do agendamento</h3>
              <div className="text-gray-400 text-sm space-y-1">
                <p>📋 {selectedService?.name}</p>
                <p>👤 {selectedStaff?.name || 'Qualquer disponível'}</p>
                <p>📅 {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                <p>⏰ {selectedTime}</p>
                <p className="text-emerald-400">{formatPrice(selectedService?.priceCents || 0)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Seu nome *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full bg-[#1C2333] border border-gray-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Seu telefone *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#1C2333] border border-gray-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !customerName || !customerPhone}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {submitting ? 'Processando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
