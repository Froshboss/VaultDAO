import React from 'react';
import { X } from 'lucide-react';

export interface ProposalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: {
    id: number;
    proposer: string;
    recipient: string;
    amount: string;
    token: string;
    memo: string;
    status: string;
    approvals: number;
    threshold: number;
    createdAt: string;
  } | null;
}

const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({ isOpen, onClose, proposal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {proposal ? `Proposal #${proposal.id}` : 'Proposal details'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          {proposal ? (
            <>
              <p><span className="text-gray-400">Memo:</span> <span className="text-white">{proposal.memo}</span></p>
              <p><span className="text-gray-400">Amount:</span> <span className="text-white">{proposal.amount} {proposal.token}</span></p>
              <p><span className="text-gray-400">Status:</span> <span className="text-white">{proposal.status}</span></p>
              <p><span className="text-gray-400">Approvals:</span> <span className="text-white">{proposal.approvals}/{proposal.threshold}</span></p>
              <p><span className="text-gray-400">Recipient:</span> <span className="text-white font-mono text-xs">{proposal.recipient}</span></p>
              <p><span className="text-gray-400">Proposer:</span> <span className="text-white font-mono text-xs">{proposal.proposer}</span></p>
              <p><span className="text-gray-400">Created:</span> <span className="text-white">{proposal.createdAt}</span></p>
            </>
          ) : (
            <p className="text-gray-400">No proposal selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;
