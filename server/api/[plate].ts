export default defineEventHandler(async (event) => {
  const plate = getRouterParam(event, 'plate')

  const config = useRuntimeConfig()
  const apiKey = config.dvlaApiKeyTest // Use test key for development

  const data = JSON.stringify({ registrationNumber: plate })

  const response = await $fetch('https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
    method: 'POST',
    body: data,
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  })

  return response
})
