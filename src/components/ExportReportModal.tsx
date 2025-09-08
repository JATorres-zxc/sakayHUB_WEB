import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Download, FileText } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for filters
const mockData = {
  transactionTypes: [
    { value: "ride", label: "Ride" },
    { value: "delivery", label: "Delivery" },
    { value: "refund", label: "Refund" }
  ],
  transactionStatuses: [
    { value: "completed", label: "Completed" },
    { value: "processed", label: "Processed" },
    { value: "pending", label: "Pending" }
  ],
  payoutStatuses: [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ],
  promoTypes: [
    { value: "discount", label: "Discount" },
    { value: "cashback", label: "Cashback" },
    { value: "percentage", label: "Percentage Off" },
    { value: "fixed", label: "Fixed Amount" }
  ],
  promoStatuses: [
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "scheduled", label: "Scheduled" }
  ]
}

interface ExportReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export function ExportReportModal({ open, onOpenChange }: ExportReportModalProps) {
  const [reportType, setReportType] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setSelectedType("")
    setSelectedStatus("")
  }

  const handleReportTypeChange = (value: string) => {
    setReportType(value)
    resetFilters()
  }

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting report:", {
      reportType,
      dateRange,
      type: selectedType,
      status: selectedStatus
    })
    
    // Here you would implement actual export logic
    // For now, just close the modal
    onOpenChange(false)
  }

  const getTypeOptions = () => {
    switch (reportType) {
      case "transactions":
        return mockData.transactionTypes
      case "promo-codes":
        return mockData.promoTypes
      default:
        return []
    }
  }

  const getStatusOptions = () => {
    switch (reportType) {
      case "transactions":
        return mockData.transactionStatuses
      case "driver-payouts":
        return mockData.payoutStatuses
      case "promo-codes":
        return mockData.promoStatuses
      default:
        return []
    }
  }

  const isExportDisabled = !reportType

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Report
          </DialogTitle>
          <DialogDescription>
            Select report type and apply filters to export data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type *</Label>
            <Select value={reportType} onValueChange={handleReportTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactions">Transaction History</SelectItem>
                <SelectItem value="driver-payouts">Driver Payout</SelectItem>
                <SelectItem value="promo-codes">Promo Codes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters Section */}
          {reportType && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Filters</h4>
                  
                  {/* Date Range Filter */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Type Filter (for transactions and promo codes) */}
                  {(reportType === "transactions" || reportType === "promo-codes") && (
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All types</SelectItem>
                          {getTypeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        {getStatusOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExportDisabled}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}