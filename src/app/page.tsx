import Image from "next/image";

import React from 'react'
import { HealthySymptomTrackerComponent} from "@/components/healthy-symptom-tracker"

export default function Home() {
  return (
    <main>
      <HealthySymptomTrackerComponent/>
    </main>
  )
}