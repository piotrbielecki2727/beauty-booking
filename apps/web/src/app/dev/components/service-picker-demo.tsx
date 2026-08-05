"use client"

import { useState } from "react"

import { ServicePicker } from "@/features/booking/components/ServicePicker"
import { mockBeautyServices } from "@/features/booking/mocks/services"

const ServicePickerDemo = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(mockBeautyServices[0]?.id)

  return (
    <ServicePicker
      onServiceSelect={setSelectedServiceId}
      selectedServiceId={selectedServiceId}
      services={mockBeautyServices}
    />
  )
}

export { ServicePickerDemo }
