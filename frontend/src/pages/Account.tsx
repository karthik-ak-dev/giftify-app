import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { User, Mail, Package, Wallet, LogOut, Ticket, Calendar, Gift, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VoucherModal from '../components/VoucherModal'
import { ordersService } from '../services/ordersService'
import { Order } from '../data/ordersData'
import { fetchUserProfile } from '../services/userService'
import { UserProfile } from '../types/user'

const Account = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const tabParam = searchParams.get('tab') as 'profile' | 'orders' | null
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(tabParam || 'profile')
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [profileData, setProfileData] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    // Update tab based on URL parameter
    useEffect(() => {
        if (tabParam && (tabParam === 'profile' || tabParam === 'orders')) {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    // Fetch profile info when profile tab is active
    useEffect(() => {
        const loadProfile = async () => {
            if (activeTab === 'profile' && isAuthenticated) {
                setProfileLoading(true)
                try {
                    const data = await fetchUserProfile()
                    setProfileData(data)
                } catch (error) {
                    console.error('Failed to fetch profile:', error)
                } finally {
                    setProfileLoading(false)
                }
            }
        }

        loadProfile()
    }, [activeTab, isAuthenticated])

    // Fetch orders when orders tab is active
    useEffect(() => {
        const fetchOrders = async () => {
            if (activeTab === 'orders' && isAuthenticated) {
                setLoading(true)
                try {
                    const userOrders = await ordersService.getAllOrders(user?.email)
                    setOrders(userOrders)
                } catch (error) {
                    console.error('Failed to fetch orders:', error)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchOrders()
    }, [activeTab, isAuthenticated, user?.email])

    if (!user) {
        return null
    }

    const handleLogout = () => {
        // Clear orders cache on logout
        ordersService.clearCache()
        logout()
        navigate('/')
    }

    const selectedOrder = orders.find(order => order.orderId === selectedOrderId)

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Header Section */}
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-white/70 hover:text-accent-300 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Title */}
                    <div>
                        <h1 className="text-5xl font-display font-black text-white mb-3">
                            My Account
                        </h1>
                        <p className="text-white/60 text-lg">
                            Manage your profile, view orders, and track your gift card purchases
                        </p>
                    </div>
                </div>
            </section>

            {/* Account Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                                        ? 'bg-accent-500/20 text-accent-400 border border-accent-400/40'
                                        : 'text-white/70 hover:bg-white/5'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Profile</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                        ? 'bg-accent-500/20 text-accent-400 border border-accent-400/40'
                                        : 'text-white/70 hover:bg-white/5'
                                        }`}
                                >
                                    <Package className="w-5 h-5" />
                                    <span className="font-medium">Orders</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {activeTab === 'profile' ? (
                                <div className="space-y-6">
                                    {profileLoading ? (
                                        <div className="space-y-6">
                                            <div className="bg-white/5 rounded-xl h-64 animate-pulse" />
                                            <div className="bg-white/5 rounded-xl h-32 animate-pulse" />
                                        </div>
                                    ) : (
                                        <>
                                            {/* Profile Info */}
                                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                                                <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-white/60 mb-2">
                                                            First Name
                                                        </label>
                                                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                                            {profileData?.firstName || user.firstName}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-white/60 mb-2">
                                                            Last Name
                                                        </label>
                                                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                                            {profileData?.lastName || user.lastName}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-white/60 mb-2">
                                                            Email Address
                                                        </label>
                                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                                            <Mail className="w-5 h-5 text-white/40" />
                                                            {profileData?.email || user.email}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-white/60 mb-2">
                                                            Member Since
                                                        </label>
                                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                                            <Calendar className="w-5 h-5 text-white/40" />
                                                            {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            }) : 'N/A'}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-white/60 mb-2">
                                                            Account Status
                                                        </label>
                                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                                            <div className={`w-2 h-2 rounded-full ${profileData?.status === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                                            {profileData?.status || 'Unknown'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex gap-3">
                                                    <button className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors">
                                                        Edit Profile
                                                    </button>
                                                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10 transition-colors">
                                                        Change Password
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stats Cards - Coming Soon */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl border border-blue-400/30 p-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white/60 text-sm">Total Orders</p>
                                                            <p className="text-2xl font-bold text-white">0</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm rounded-xl border border-green-400/30 p-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                                                            <Gift className="w-5 h-5 text-green-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white/60 text-sm">Gift Cards Purchased</p>
                                                            <p className="text-2xl font-bold text-white">0</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Wallet */}
                                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-600/10 backdrop-blur-sm rounded-xl border border-accent-400/30 p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-accent-500/30 rounded-xl flex items-center justify-center">
                                                            <Wallet className="w-6 h-6 text-accent-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold">Wallet Balance</h3>
                                                            <p className="text-white/60 text-sm">Available balance</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold text-white">
                                                            ₹{profileData?.walletBalance.toFixed(2) || user.walletBalance.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors">
                                                    Add Money to Wallet
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                                    <h2 className="text-xl font-bold text-white mb-6">Order History</h2>

                                    {loading ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-20 bg-white/5 rounded-xl animate-pulse"
                                                />
                                            ))}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Package className="w-10 h-10 text-white/30" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                                            <p className="text-white/60 mb-6">Start shopping for gift cards!</p>
                                            <button
                                                onClick={() => navigate('/brands')}
                                                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
                                            >
                                                Browse Gift Cards
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.orderId}
                                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-accent-400/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-accent-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-semibold">{order.orderId}</h3>
                                                            <p className="text-white/60 text-sm">
                                                                {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <div className="text-white font-bold">₹{order.total}</div>
                                                            <div className="text-green-400 text-sm font-semibold">{order.status}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedOrderId(order.orderId)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-400/40 text-accent-400 rounded-lg font-medium text-sm transition-colors"
                                                        >
                                                            <Ticket className="w-4 h-4" />
                                                            <span className="hidden sm:inline">View Vouchers</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Voucher Modal */}
            <VoucherModal
                isOpen={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                orderId={selectedOrderId || ''}
                voucherGroups={selectedOrder?.vouchers || []}
            />
        </div>
    )
}

export default Account

