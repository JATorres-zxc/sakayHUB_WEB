import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Gift, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for promo types
const promoTypes = [
  { value: "discount", label: "Percentage Discount" },
  { value: "fixed", label: "Fixed Amount" },
  { value: "free_ride", label: "Free Ride" },
  { value: "referral", label: "Referral Bonus" },
]

const userTypes = [
  { value: "all", label: "All Users" },
  { value: "new", label: "New Users Only" },
  { value: "existing", label: "Existing Users" },
  { value: "vip", label: "VIP Users" },
]

interface CreatePromoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePromoModal({ open, onOpenChange }: CreatePromoModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    type: "",
    value: "",
    description: "",
    userType: "",
    maxUsage: "",
    maxUsagePerUser: "",
    minOrderAmount: "",
  })
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [hasExpiry, setHasExpiry] = useState(true)
  const [isActive, setIsActive] = useState(true)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Mock create functionality
    console.log("Creating promo code:", {
      ...formData,
      expiryDate,
      hasExpiry,
      isActive
    })
    
    // Reset form
    setFormData({
      code: "",
      type: "",
      value: "",
      description: "",
      userType: "",
      maxUsage: "",
      maxUsagePerUser: "",
      minOrderAmount: "",
    })
    setExpiryDate(undefined)
    setHasExpiry(true)
    setIsActive(true)
    
    onOpenChange(false)
  }

  const isFormValid = formData.code && formData.type && formData.value

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Create New Promo Code
          </DialogTitle>
          <DialogDescription>
            Create a new promotional code or discount for your users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Basic Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-code">Promo Code *</Label>
                    <Input
                      id="promo-code"
                      placeholder="e.g., WELCOME20"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value)}
                      className="uppercase"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Promo Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {promoTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      Value * {formData.type === "discount" ? "(%)" : "($)"}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder={formData.type === "discount" ? "20" : "10.00"}
                      value={formData.value}
                      onChange={(e) => handleInputChange("value", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>User Type</Label>
                    <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the promo code"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Usage Limits</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-usage">Max Total Usage</Label>
                    <Input
                      id="max-usage"
                      type="number"
                      placeholder="e.g., 1000"
                      value={formData.maxUsage}
                      onChange={(e) => handleInputChange("maxUsage", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-usage-per-user">Max Usage Per User</Label>
                    <Input
                      id="max-usage-per-user"
                      type="number"
                      placeholder="e.g., 1"
                      value={formData.maxUsagePerUser}
                      onChange={(e) => handleInputChange("maxUsagePerUser", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Amount ($)</Label>
                  <Input
                    id="min-order"
                    type="number"
                    placeholder="e.g., 25.00"
                    value={formData.minOrderAmount}
                    onChange={(e) => handleInputChange("minOrderAmount", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expiry & Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Expiry & Status</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Set Expiry Date</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic expiration</p>
                  </div>
                  <Switch checked={hasExpiry} onCheckedChange={setHasExpiry} />
                </div>

                {hasExpiry && (
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !expiryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={expiryDate}
                          onSelect={setExpiryDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Status</Label>
                    <p className="text-sm text-muted-foreground">Enable this promo code immediately</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Promo Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}