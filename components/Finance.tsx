import React, { useState } from 'react';
import { Financials, JamEvent, Member, Transaction } from '../types';
import PayrollModal from './PayrollModal';

interface FinanceProps {
    financials: Financials;
    onAddFunds: (amount: number, description: string) => void;
    onRemoveFunds: (amount: number, description: string) => void;
    events: JamEvent[];
    members: Member[];
    onProcessPayment: (event: JamEvent, member: Member) => void;
}

const RupeeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13h12"/><path d="M6 18h12"/><path d="M8 21V3"/><path d="M12 21V3"/></svg>
);


const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const TrendingDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
);


const Finance: React.FC<FinanceProps> = ({ financials, onAddFunds, onRemoveFunds, events, members, onProcessPayment }) => {
    const [activeTab, setActiveTab] = useState<'treasury' | 'payroll'>('treasury');
    const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
    const [selectedEventForPayroll, setSelectedEventForPayroll] = useState<JamEvent | null>(null);

    const handleOpenPayroll = (event: JamEvent) => {
        setSelectedEventForPayroll(event);
        setIsPayrollModalOpen(true);
    };

    const handleClosePayroll = () => {
        setSelectedEventForPayroll(null);
        setIsPayrollModalOpen(false);
    };

    const AddFundsForm: React.FC = () => {
        const [amount, setAmount] = useState('');
        const [description, setDescription] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0 || !description) {
                alert('Please enter a valid amount and description.');
                return;
            }
            onAddFunds(numericAmount, description);
            setAmount('');
            setDescription('');
        };

        return (
            <form onSubmit={handleSubmit} className="bg-brand-dark/40 p-4 rounded-lg space-y-3">
                <h3 className="font-bold text-lg text-white">Add Funds</h3>
                <div>
                    <label htmlFor="add-amount" className="block text-sm font-medium text-brand-cream/80">Amount (₹)</label>
                    <input type="number" id="add-amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000.00" required min="0.01" step="0.01" className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white"/>
                </div>
                <div>
                    <label htmlFor="add-description" className="block text-sm font-medium text-brand-cream/80">Description</label>
                    <input type="text" id="add-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Fundraiser profit" required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white"/>
                </div>
                <button type="submit" className="w-full bg-brand-gold text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors">Deposit Funds</button>
            </form>
        );
    };

    const WithdrawFundsForm: React.FC = () => {
        const [amount, setAmount] = useState('');
        const [description, setDescription] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0 || !description) {
                alert('Please enter a valid amount and description.');
                return;
            }
            onRemoveFunds(numericAmount, description);
            setAmount('');
            setDescription('');
        };

        return (
            <form onSubmit={handleSubmit} className="bg-brand-dark/40 p-4 rounded-lg space-y-3">
                <h3 className="font-bold text-lg text-white">Withdraw Funds</h3>
                <div>
                    <label htmlFor="remove-amount" className="block text-sm font-medium text-brand-cream/80">Amount (₹)</label>
                    <input type="number" id="remove-amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000.00" required min="0.01" step="0.01" className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white"/>
                </div>
                <div>
                    <label htmlFor="remove-description" className="block text-sm font-medium text-brand-cream/80">Reason for Withdrawal</label>
                    <input type="text" id="remove-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Instrument repair" required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md py-2 px-3 text-white"/>
                </div>
                <button type="submit" className="w-full bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">Withdraw Funds</button>
            </form>
        );
    };


    const TreasuryView = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-brand-gold/20 to-brand-brown/20 p-6 rounded-xl text-center">
                <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest">Current Balance</p>
                <p className="text-5xl font-bold text-white mt-2">₹{financials.balance.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <AddFundsForm />
                    <WithdrawFundsForm />
                </div>
                <div className="bg-brand-dark/40 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-white mb-3">Transaction History</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {financials.transactions.length === 0 ? <p className="text-brand-cream/70 text-center py-4">No transactions yet.</p> :
                        financials.transactions.map(tx => (
                            <li key={tx.id} className="flex justify-between items-center bg-brand-dark/70 p-2 rounded-md">
                                <div>
                                    <p className="font-medium text-brand-cream">{tx.description}</p>
                                    <p className="text-xs text-brand-cream/60">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <p className={`font-bold flex items-center gap-1 ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.amount > 0 ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                                    ₹{Math.abs(tx.amount).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
    
    const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    const PayrollView = () => (
        <div className="space-y-4">
            <h3 className="font-bold text-xl text-white">Process Payroll for Events</h3>
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {sortedEvents.map(event => {
                    const attendeesCount = event.checkedInMembers.length;
                    const paidCount = event.paidMembers.length;
                    const isFullyPaid = attendeesCount > 0 && attendeesCount === paidCount;
                    return (
                        <li key={event.id} className="bg-brand-dark/40 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                                <h4 className="font-bold text-brand-gold text-lg">{event.title}</h4>
                                <p className="text-sm text-brand-cream/80">{new Date(event.date).toLocaleDateString()}</p>
                                <p className={`text-sm font-semibold mt-1 ${isFullyPaid ? 'text-green-400' : 'text-yellow-400'}`}>{paidCount} / {attendeesCount} Members Paid</p>
                            </div>
                            <button onClick={() => handleOpenPayroll(event)} disabled={attendeesCount === 0} className="bg-brand-brown/70 text-brand-cream font-bold py-2 px-4 rounded-lg hover:bg-brand-brown transition-colors disabled:bg-brand-dark/70 disabled:text-brand-cream/50 disabled:cursor-not-allowed">
                                {isFullyPaid ? 'View Payroll' : 'Process Payroll'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <div className="w-full max-w-4xl bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-baseline gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Finance</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setActiveTab('treasury')} className={`pb-1 border-b-2 ${activeTab === 'treasury' ? 'text-brand-gold border-brand-gold' : 'text-brand-cream/70 border-transparent hover:border-brand-cream/50'}`}>Treasury</button>
                        <button onClick={() => setActiveTab('payroll')} className={`pb-1 border-b-2 ${activeTab === 'payroll' ? 'text-brand-gold border-brand-gold' : 'text-brand-cream/70 border-transparent hover:border-brand-cream/50'}`}>Payroll</button>
                    </div>
                </div>
                <RupeeIcon className="w-8 h-8 text-brand-gold" />
            </div>

            {activeTab === 'treasury' ? <TreasuryView /> : <PayrollView />}
            
            {selectedEventForPayroll && (
                 <PayrollModal 
                    isOpen={isPayrollModalOpen}
                    onClose={handleClosePayroll}
                    event={selectedEventForPayroll}
                    members={members}
                    onProcessPayment={onProcessPayment}
                    currentBalance={financials.balance}
                 />
            )}
        </div>
    );
};

export default Finance;