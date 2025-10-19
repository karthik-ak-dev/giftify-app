import { X, Copy, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface Voucher {
    code: string
    pin: string
}

interface VoucherGroup {
    brandName: string
    brandLogo: string
    variantValue: number
    vouchers: Voucher[]
}

interface VoucherModalProps {
    isOpen: boolean
    onClose: () => void
    orderId: string
    voucherGroups: VoucherGroup[]
}

const VoucherModal = ({ isOpen, onClose, orderId, voucherGroups }: VoucherModalProps) => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [copiedPin, setCopiedPin] = useState<string | null>(null)

    const copyToClipboard = async (text: string, type: 'code' | 'pin', identifier: string) => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === 'code') {
                setCopiedCode(identifier)
                setTimeout(() => setCopiedCode(null), 2000)
            } else {
                setCopiedPin(identifier)
                setTimeout(() => setCopiedPin(null), 2000)
            }
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="bg-dark-50 rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative p-6 border-b border-white/10 overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent" />

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/30">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Your Vouchers</h2>
                                    <p className="text-xs text-white/50">Order #{orderId}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {voucherGroups.map((group, groupIndex) => (
                            <div
                                key={`${group.brandName}-${group.variantValue}-${groupIndex}`}
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                            >
                                {/* Brand Header */}
                                <div className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/10">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                                        <img
                                            src={group.brandLogo}
                                            alt={group.brandName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate">{group.brandName}</h3>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-accent-400 font-semibold">₹{group.variantValue}</span>
                                            <span className="text-white/40">•</span>
                                            <span className="text-white/50">{group.vouchers.length} {group.vouchers.length === 1 ? 'voucher' : 'vouchers'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Vouchers List */}
                                <div className="p-4 space-y-3">
                                    {group.vouchers.map((voucher, voucherIndex) => {
                                        const voucherIdentifier = `${groupIndex}-${voucherIndex}`

                                        return (
                                            <div
                                                key={voucherIdentifier}
                                                className="space-y-2.5"
                                            >
                                                {group.vouchers.length > 1 && (
                                                    <div className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                                                        Voucher {voucherIndex + 1}
                                                    </div>
                                                )}

                                                {/* Code & PIN Grid */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    {/* Voucher Code */}
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                                                            Code
                                                        </label>
                                                        <div className="relative group">
                                                            <div className="px-3 py-2.5 bg-dark-100/80 border border-white/10 rounded-lg font-mono text-white text-xs select-all group-hover:border-accent-400/30 transition-colors">
                                                                {voucher.code}
                                                            </div>
                                                            <button
                                                                onClick={() => copyToClipboard(voucher.code, 'code', voucherIdentifier)}
                                                                className="absolute right-1.5 top-1.5 p-1.5 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-400/40 rounded-md transition-all duration-200 hover:scale-105"
                                                            >
                                                                {copiedCode === voucherIdentifier ? (
                                                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                                                ) : (
                                                                    <Copy className="w-3.5 h-3.5 text-accent-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Voucher PIN */}
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                                                            PIN
                                                        </label>
                                                        <div className="relative group">
                                                            <div className="px-3 py-2.5 bg-dark-100/80 border border-white/10 rounded-lg font-mono text-white text-xs select-all group-hover:border-accent-400/30 transition-colors">
                                                                {voucher.pin}
                                                            </div>
                                                            <button
                                                                onClick={() => copyToClipboard(voucher.pin, 'pin', voucherIdentifier)}
                                                                className="absolute right-1.5 top-1.5 p-1.5 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-400/40 rounded-md transition-all duration-200 hover:scale-105"
                                                            >
                                                                {copiedPin === voucherIdentifier ? (
                                                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                                                ) : (
                                                                    <Copy className="w-3.5 h-3.5 text-accent-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {voucherIndex < group.vouchers.length - 1 && (
                                                    <div className="border-t border-white/5 pt-3" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-white/10 bg-dark-100/30">
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoucherModal

