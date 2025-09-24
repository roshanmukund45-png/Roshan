import React from 'react';
import { JamEvent, Member } from '../types';

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: JamEvent;
  members: Member[];
  onProcessPayment: (event: JamEvent, member: Member) => void;
  currentBalance: number;
}

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);


const PayrollModal: React.FC<PayrollModalProps> = ({ isOpen, onClose, event, members, onProcessPayment, currentBalance }) => {
    if (!isOpen) return null;

    const attendedMemberDetails = event.checkedInMembers.map(memberId => {
        const member = members.find(m => m.id === memberId);
        const isPaid = event.paidMembers.includes(memberId);
        return { ...member, isPaid };
    }).filter(m => m.id); // Filter out any members not found

    const unpaidMembers = attendedMemberDetails.filter(m => !m.isPaid);
    const totalPayout = unpaidMembers.reduce((sum, member) => sum + (member.payRate ?? 0), 0);
    const canPayAll = currentBalance >= totalPayout;

    const handlePayAll = () => {
        if (!canPayAll) {
            alert("Insufficient funds to pay all remaining members.");
            return;
        }
        unpaidMembers.forEach(member => {
            if (member.id) onProcessPayment(event, member as Member);
        });
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-dark border border-brand-brown rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col" style={{ height: '90vh', maxHeight: '700px' }} onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">Payroll</h2>
                    <p className="text-brand-gold text-lg font-semibold mb-4">{event.title}</p>
                    
                    <div className="flex justify-between items-center mb-4 text-sm bg-brand-dark/40 p-3 rounded-lg">
                        <div className="text-brand-cream/80">
                            <p>Pending Payout: <span className="font-bold text-white">₹{totalPayout.toFixed(2)}</span></p>
                            <p>Current Balance: <span className="font-bold text-white">₹{currentBalance.toFixed(2)}</span></p>
                        </div>
                        <button onClick={handlePayAll} disabled={unpaidMembers.length === 0 || !canPayAll} className="bg-brand-gold text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-brand-brown/50 disabled:cursor-not-allowed">
                            Pay All
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    {attendedMemberDetails.length > 0 ? (
                        <ul className="space-y-2">
                            {attendedMemberDetails.map(member => (
                                <li key={member.id} className="flex items-center justify-between bg-brand-dark/70 p-2 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={member.photo} alt={member.fullName} className="w-8 h-8 rounded-full object-cover"/>
                                        <div>
                                            <span className="font-medium text-brand-cream">{member.fullName}</span>
                                            <p className="text-xs text-brand-cream/70">Pay: ₹{member.payRate?.toFixed(2) ?? '0.00'}</p>
                                        </div>
                                    </div>
                                    {member.isPaid ? (
                                        <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Paid
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => onProcessPayment(event, member as Member)}
                                            disabled={(member.payRate ?? 0) > currentBalance}
                                            className="bg-green-600/70 text-white font-bold text-sm py-1 px-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                        >
                                            Pay
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className="text-center text-brand-cream/70 py-8">No members checked in for this event.</p>
                    )}
                </div>

                <div className="flex-shrink-0 pt-4 mt-2 border-t border-brand-brown/50">
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-brand-brown/70 text-brand-cream font-bold py-2 px-6 rounded-lg hover:bg-brand-brown transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollModal;