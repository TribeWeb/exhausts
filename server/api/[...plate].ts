import { z } from 'zod'

const schema = z.string().min(2).max(10).regex(/^[A-Z0-9]+$/i, 'Invalid plate format')
const apiKey = useRuntimeConfig().motApiKey

export default defineEventHandler(async (event) => {
  const plate = getRouterParam(event, 'plate')
  const validatedPlate = schema.parse(plate)

  const bearer = await $fetch('/api/bearer')

  const response = await $fetch(`https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${validatedPlate}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`
    }
  })

  return response
})

// const config = useRuntimeConfig()
// const apiKey = config.dvlaApiKeyTest // Use test key for development

// const data = JSON.stringify({ registrationNumber: plate })

// const response = await $fetch('https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
//   method: 'POST',
//   body: data,
//   headers: {
//     'x-api-key': apiKey,
//     'Content-Type': 'application/json'
//   }
// })
