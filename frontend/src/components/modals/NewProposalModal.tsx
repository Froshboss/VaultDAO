import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import TokenSelector from '../TokenSelector';
import type { TokenBalance } from '../TokenBalanceCard';
import type { TokenInfo } from '../../constants/tokens';
import { formatTokenBalance } from '../../constants/tokens';

export interface NewProposalFormData {
  recipient: string;
  token: string;
  amount: string;
  memo: string;
}

interface NewProposalModalProps {
  isOpen: boolean;
  loading: boolean;
  selectedTemplateName: string | null;
  formData: NewProposalFormData;
  tokenBalances: TokenBalance[];
  selectedToken: TokenInfo | null;
  amountError: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onFieldChange: (field: keyof NewProposalFormData, value: string) => void;
  onTokenSelect: (token: TokenInfo) => void;
  onOpenTemplateSelector: () => void;
  onSaveAsTemplate: () => void;
  onAddCustomToken?: (address: string) => Promise<TokenInfo | null>;
}

const NewProposalModal: React.FC<NewProposalModalProps> = ({
  isOpen,
  loading,
  selectedTemplateName,
  formData,
  tokenBalances,
  selectedToken,
  amountError,
  onClose,
  onSubmit,
  onFieldChange,
  onTokenSelect,
  onOpenTemplateSelector,
  onSaveAsTemplate,
  onAddCustomToken,
}) => {
  // Find the selected token from balances
  const selectedTokenBalance = React.useMemo(() => {
    if (!selectedToken) return null;
    return tokenBalances.find(tb => tb.token.address === selectedToken.address);
  }, [tokenBalances, selectedToken]);

  const handleTokenSelect = (token: TokenInfo) => {
    onFieldChange('token', token.address);
    onTokenSelect(token);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    const formatted = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : sanitized;
    
    onFieldChange('amount', formatted);
  };

  // Set max amount
  const handleSetMax = () => {
    if (selectedTokenBalance) {
      onFieldChange('amount', selectedTokenBalance.balance);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6 my-4">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-semibold text-white">Create New Proposal</h3>
          <div className="flex items-center gap-2">
            {selectedTemplateName ? (
              <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                Template: {selectedTemplateName}
              </span>
            ) : null}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 sm:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Recipient Address */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Recipient Address</label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(event) => onFieldChange('recipient', event.target.value)}
              placeholder="G... or C... (Stellar address)"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Token Selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Select Token</label>
            <TokenSelector
              tokens={tokenBalances}
              selectedToken={selectedToken}
              onSelect={handleTokenSelect}
              onAddCustomToken={onAddCustomToken}
              showBalance={true}
              placeholder="Select a token"
            />
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-gray-400">Amount</label>
              {selectedTokenBalance && (
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Max: {formatTokenBalance(selectedTokenBalance.balance, selectedTokenBalance.token.decimals)} {selectedTokenBalance.token.symbol}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.amount}
                onChange={(event) => handleAmountChange(event.target.value)}
                placeholder="0.00"
                className={`w-full rounded-lg border bg-gray-800 px-4 py-3 pr-16 text-sm text-white placeholder-gray-500 focus:outline-none ${
                  amountError ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-purple-500'
                }`}
              />
              {selectedToken && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {selectedToken.symbol}
                </span>
              )}
            </div>
            {amountError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                <AlertCircle size={14} />
                <span>{amountError}</span>
              </div>
            )}
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Memo (Optional)</label>
            <textarea
              value={formData.memo}
              onChange={(event) => onFieldChange('memo', event.target.value)}
              placeholder="Add a description or note for this proposal..."
              rows={3}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Selected Token Info */}
          {selectedTokenBalance && formData.amount && !amountError && (
            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You're sending</span>
                <span className="text-white font-medium">
                  {formatTokenBalance(formData.amount, selectedTokenBalance.token.decimals)} {selectedTokenBalance.token.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Remaining balance after transfer</span>
                <span className="text-gray-400">
                  {formatTokenBalance(
                    Math.max(0, parseFloat(selectedTokenBalance.balance) - parseFloat(formData.amount)).toString(),
                    selectedTokenBalance.token.decimals
                  )} {selectedTokenBalance.token.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between pt-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onOpenTemplateSelector}
                className="min-h-[44px] rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              >
                Use Template
              </button>
              <button
                type="button"
                onClick={onSaveAsTemplate}
                className="min-h-[44px] rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              >
                Save as Template
              </button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!amountError || !formData.recipient || !formData.amount}
                className="min-h-[44px] rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Proposal'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProposalModal;
