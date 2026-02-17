"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Filter,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Loader2,
  Trash2,
} from "lucide-react"
import AdminTopNav from "../_components/AdminTopNav"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")
  const [loadingUserId, setLoadingUserId] = useState(null)
  const [loadingRoleUserId, setLoadingRoleUserId] = useState(null)
  const [deletingUserId, setDeletingUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true)
      const res = await fetch("/api/admin/customers")
      const data = await res.json()
      setCustomers(data.customers || [])
      setLoading(false)
    }
    fetchCustomers()
  }, [])

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return
    setDeletingUserId(userId)
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) setCustomers((prev) => prev.filter((c) => c.id !== userId))
    } catch (err) {
      console.error(err)
    }
    setDeletingUserId(null)
  }

  const handleToggle = async (userId) => {
    setLoadingUserId(userId)
    try {
      const res = await fetch("/api/admin/toggle-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isActive: data.status === "active", status: data.status } : user
          )
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingUserId(null)
    }
  }

  const handleToggleRole = async (userId) => {
    setLoadingRoleUserId(userId)
    try {
      const res = await fetch("/api/admin/toggle-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, role: data.role } : user))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingRoleUserId(null)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const fields = [
      customer.username,
      customer.email,
      customer.phone,
      customer.firstName,
      customer.lastName,
      customer.country,
      customer.state,
      customer.zipCode,
    ].map((f) => f?.toString().toLowerCase() || "")
    const matchesSearch = fields.some((f) => f.includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesKyc = kycFilter === "all" || customer.kycStatus === kycFilter
    return matchesSearch && matchesStatus && matchesKyc
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getKycStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#1a012b] via-black to-[#001933] text-white overflow-hidden">

      {/* Ambient Glows */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-24 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">

        <AdminTopNav />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold">Customer Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor all customer accounts</p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
            <p className="text-lg text-yellow-200">Loading customers...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 backdrop-blur-md border border-white/20 text-white"
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspended</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Customer Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg mt-4">
                <CardHeader>
                  <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full min-w-[800px] text-white">
                    <thead className="border-b border-white/20">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Username</th>
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Contact</th>
                        <th className="p-4 font-medium">Country</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Balance</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Status Switch</th>
                        <th className="p-4 font-medium">Delete User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-white/20 hover:bg-white/5 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{(customer.username || "NA").split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <span>{customer.username || "No Name"}</span>
                            </div>
                          </td>
                          <td className="p-4">{customer.firstName} {customer.lastName}</td>
                          <td className="p-4 space-y-1 text-sm">
                            <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</div>
                            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</div>
                          </td>
                          <td className="p-4">{customer.country}</td>
                          <td className="p-4"><Badge className={getStatusColor(customer.status)}>{customer.status}</Badge></td>
                          <td className="p-4 font-medium">{customer.balance}</td>
                          <td className="p-4">
                            {loadingRoleUserId === customer.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <Switch checked={customer.role === "admin"} onCheckedChange={() => handleToggleRole(customer.id)} className={`${customer.role === "admin" ? "bg-blue-600" : "bg-gray-400"} border rounded-full`} />
                                <span className="text-sm text-gray-300">{customer.role === "admin" ? "Admin" : "User"}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            {loadingUserId === customer.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                              <Switch checked={customer.isActive} onCheckedChange={() => handleToggle(customer.id)} className={`${customer.isActive ? "bg-green-500" : "bg-gray-300"} border rounded-full`} />
                            )}
                          </td>
                          <td className="p-4">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(customer.id)} disabled={deletingUserId === customer.id} className="flex items-center gap-2">
                              <Trash2 className="w-4 h-4" /> {deletingUserId === customer.id ? "Deleting..." : "Delete"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
