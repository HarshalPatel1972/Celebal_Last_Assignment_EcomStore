"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Edit, Plus, Trash2, LogOut, Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout, updateProfile, addAddress, updateAddress, deleteAddress } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [addressData, setAddressData] = useState({
    type: "home" as "home" | "work" | "other",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  })

  const handleProfileUpdate = async () => {
    const success = await updateProfile(profileData)
    if (success) {
      setIsEditingProfile(false)
    }
  }

  const handleAddAddress = async () => {
    const success = await addAddress(addressData)
    if (success) {
      setIsAddingAddress(false)
      setAddressData({
        type: "home",
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      })
    }
  }

  const handleUpdateAddress = async () => {
    if (!editingAddress) return

    const success = await updateAddress(editingAddress.id, addressData)
    if (success) {
      setEditingAddress(null)
      setAddressData({
        type: "home",
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      })
    }
  }

  const handleDeleteAddress = async (id: string) => {
    await deleteAddress(id)
  }

  const startEditingAddress = (address: any) => {
    setEditingAddress(address)
    setAddressData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    })
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">My Account</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      Member since {new Date(user.createdAt).getFullYear()}
                    </Badge>
                  </div>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={handleProfileUpdate} className="bg-orange-500 hover:bg-orange-600">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Saved Addresses</h3>
              <Button onClick={() => setIsAddingAddress(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>

            <div className="grid gap-4">
              {user.addresses.map((address) => (
                <Card key={address.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={address.type === "home" ? "default" : "secondary"}>
                            {address.type.toUpperCase()}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              DEFAULT
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-800">{address.name}</h4>
                        <p className="text-gray-600 text-sm">{address.phone}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          {address.address}, {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditingAddress(address)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {user.addresses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No addresses saved yet</p>
                  <p className="text-sm">Add an address to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No orders yet</p>
              <p className="text-sm">Your order history will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-gray-600">Manage your notification preferences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Control your privacy and data settings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Security</h4>
                    <p className="text-sm text-gray-600">Change password and security settings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Address Dialog */}
        <Dialog
          open={isAddingAddress || !!editingAddress}
          onOpenChange={() => {
            setIsAddingAddress(false)
            setEditingAddress(null)
            setAddressData({
              type: "home",
              name: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              isDefault: false,
            })
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Address Type</Label>
                <Select
                  value={addressData.type}
                  onValueChange={(value: "home" | "work" | "other") =>
                    setAddressData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addressName">Full Name</Label>
                  <Input
                    id="addressName"
                    value={addressData.name}
                    onChange={(e) => setAddressData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="addressPhone">Phone Number</Label>
                  <Input
                    id="addressPhone"
                    value={addressData.phone}
                    onChange={(e) => setAddressData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="addressFull">Address</Label>
                <Input
                  id="addressFull"
                  value={addressData.address}
                  onChange={(e) => setAddressData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="House No, Building, Street, Area"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={addressData.city}
                    onChange={(e) => setAddressData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={addressData.state}
                    onValueChange={(value) => setAddressData((prev) => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={addressData.pincode}
                    onChange={(e) => setAddressData((prev) => ({ ...prev, pincode: e.target.value }))}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingAddress(false)
                    setEditingAddress(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
