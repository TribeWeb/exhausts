export default defineEventHandler(async (event) => {
  const plate = getRouterParam(event, 'plate')

  const data = JSON.stringify({ registrationNumber: plate })

  const response = await $fetch('https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
    method: 'POST',
    body: data,
    headers: {
      'x-api-key': 'AcnarWQtgm6enzwYk4Kis6M9L5vYLL2S6yT778U2',
      'Content-Type': 'application/json'
    }
  })

  return response
})
